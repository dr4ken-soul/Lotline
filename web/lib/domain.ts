export type Unit = "C" | "F";
export type Disposition = "hold" | "escalate" | "simulated_release";

export interface ReadingInput {
  readingId: string;
  observedAt: string;
  value: number;
  unit: Unit;
}

export interface ProductPolicy {
  policyId: string;
  version: string;
  effectiveFrom: string;
  effectiveTo: string;
  lowerBound: number;
  upperBound: number;
  unit: Unit;
  maxSampleGapMinutes: number;
  sourceRef: string;
}

export interface InventoryLink {
  lotId: string;
  shipmentId?: string;
  containerId?: string;
  locationId: string;
  from: string;
  to: string;
  sourceRef: string;
}

export interface ColdChainEvent {
  schemaVersion: string;
  syntheticFixtureId?: string;
  eventId: string;
  sourceAdapter: "webhook" | "file";
  receivedAt: string;
  sensorId: string;
  shipmentId?: string;
  containerId?: string;
  locationId?: string;
  readings: ReadingInput[];
  productPolicy: ProductPolicy;
  inventorySnapshot: InventoryLink[];
  calibrationReference?: { sourceRef: string; checkedAt?: string; status?: string } | null;
  provenance: string[];
}

export interface NormalizedReading extends ReadingInput {
  normalizedCelsius: number;
  outOfRange: boolean;
  policyApplicable: boolean;
  band: "LOW" | "IN" | "HIGH" | "OUTSIDE_POLICY_PERIOD";
}

export interface CandidateLot extends InventoryLink {
  scope: "CANDIDATE" | "EXCLUDED";
  reasonCode: string;
  reason: string;
}

export interface Evaluation {
  state: "REVIEW_REQUIRED" | "SCOPE_INCOMPLETE" | "REVIEW_READY";
  assessment: "EXCURSION_OBSERVED" | "NO_EXCURSION_OBSERVED" | "POLICY_COVERAGE_INCOMPLETE";
  eventId: string;
  sourceAdapter: "webhook" | "file";
  receivedAt: string;
  policy: ProductPolicy;
  readings: NormalizedReading[];
  excursions: Array<{
    kind: "LOW" | "HIGH";
    startAt: string;
    endAt: string;
    peakCelsius: number;
    endIsObservedOnly: boolean;
    evidenceIds: string[];
  }>;
  candidateLots: CandidateLot[];
  evidence: Array<{
    id: string;
    label: string;
    status: "PRESENT" | "MISSING";
    sourceRef?: string;
    detail: string;
  }>;
  unknowns: string[];
  warnings: string[];
  coverage: "COMPLETE" | "INCOMPLETE";
  maxObservedGapMinutes: number;
  evidenceIds: string[];
  draft: {
    mode: "template";
    text: string;
    citations: string[];
  };
}

export const syntheticFixtureId = "excursion-01";

const hasTimezone = (value: string) => /(?:Z|[+-]\d{2}:\d{2})$/i.test(value);

function toTimestamp(value: string, field: string): number {
  if (!hasTimezone(value)) {
    throw new Error(`${field} must include a UTC offset or Z timezone.`);
  }
  const time = Date.parse(value);
  if (!Number.isFinite(time)) throw new Error(`${field} is not a valid timestamp.`);
  return time;
}

function toCelsius(value: number, unit: Unit): number {
  if (!Number.isFinite(value)) throw new Error("Every reading must be numeric.");
  if (unit === "C") return value;
  if (unit === "F") return (value - 32) * (5 / 9);
  throw new Error(`Unsupported reading unit: ${String(unit)}.`);
}

function normalizePolicy(policy: ProductPolicy): ProductPolicy {
  if (!policy?.policyId || !policy.version || !policy.sourceRef) {
    throw new Error("A policy ID, version, and source reference are required.");
  }
  if (!Number.isFinite(policy.lowerBound) || !Number.isFinite(policy.upperBound)) {
    throw new Error("Policy bounds must be numeric.");
  }
  if (policy.lowerBound >= policy.upperBound) {
    throw new Error("The policy lower bound must be below its upper bound.");
  }
  if (!Number.isFinite(policy.maxSampleGapMinutes) || policy.maxSampleGapMinutes <= 0) {
    throw new Error("The policy must define a positive maximum sample gap.");
  }
  if (policy.unit !== "C" && policy.unit !== "F") {
    throw new Error(`Unsupported policy unit: ${String(policy.unit)}.`);
  }
  toTimestamp(policy.effectiveFrom, "Policy effectiveFrom");
  toTimestamp(policy.effectiveTo, "Policy effectiveTo");
  if (Date.parse(policy.effectiveFrom) >= Date.parse(policy.effectiveTo)) {
    throw new Error("The policy effective period is invalid.");
  }
  const factor = policy.unit === "F" ? 5 / 9 : 1;
  const offset = policy.unit === "F" ? 32 : 0;
  return {
    ...policy,
    lowerBound: (policy.lowerBound - offset) * factor,
    upperBound: (policy.upperBound - offset) * factor,
    unit: "C",
  };
}

function buildExcursions(readings: NormalizedReading[], maxSampleGapMinutes: number) {
  const ordered = [...readings].sort(
    (a, b) => Date.parse(a.observedAt) - Date.parse(b.observedAt),
  );
  const intervals: Evaluation["excursions"] = [];
  let current: Evaluation["excursions"][number] | null = null;

  for (const [index, reading] of ordered.entries()) {
    const prior = ordered[index - 1];
    const gapMinutes = prior
      ? (Date.parse(reading.observedAt) - Date.parse(prior.observedAt)) / 60_000
      : 0;
    if (current && gapMinutes > maxSampleGapMinutes) {
      current.endIsObservedOnly = true;
      intervals.push(current);
      current = null;
    }
    if (!reading.policyApplicable) {
      if (current) {
        current.endIsObservedOnly = true;
        intervals.push(current);
        current = null;
      }
      continue;
    }
    if (!reading.outOfRange) {
      if (current) {
        current.endAt = reading.observedAt;
        current.endIsObservedOnly = false;
        intervals.push(current);
        current = null;
      }
      continue;
    }

    if (!current || current.kind !== reading.band) {
      if (current) {
        current.endAt = reading.observedAt;
        current.endIsObservedOnly = true;
        intervals.push(current);
      }
      current = {
        kind: reading.band as "LOW" | "HIGH",
        startAt: reading.observedAt,
        endAt: reading.observedAt,
        peakCelsius: reading.normalizedCelsius,
        endIsObservedOnly: true,
        evidenceIds: [reading.readingId],
      };
      continue;
    }

    current.endAt = reading.observedAt;
    current.endIsObservedOnly = true;
    current.evidenceIds.push(reading.readingId);
    current.peakCelsius =
      current.kind === "HIGH"
        ? Math.max(current.peakCelsius, reading.normalizedCelsius)
        : Math.min(current.peakCelsius, reading.normalizedCelsius);
  }

  if (current) intervals.push(current);
  return intervals;
}

function scopeLots(
  event: ColdChainEvent,
  inventory: InventoryLink[],
  intervalStart: string,
  intervalEnd: string,
): CandidateLot[] {
  return inventory.map((lot) => {
    const shipmentMatches = Boolean(event.shipmentId && lot.shipmentId === event.shipmentId);
    const containerMatches = Boolean(event.containerId && lot.containerId === event.containerId);
    const locationMatches = Boolean(event.locationId && lot.locationId === event.locationId);
    const lotStart = toTimestamp(lot.from, `Inventory ${lot.lotId} from`);
    const lotEnd = toTimestamp(lot.to, `Inventory ${lot.lotId} to`);
    if (lotStart > lotEnd) throw new Error(`Inventory time range is invalid for ${lot.lotId}.`);
    const overlaps = lotStart <= Date.parse(intervalEnd) && lotEnd >= Date.parse(intervalStart);

    if (!(shipmentMatches || containerMatches)) {
      return { ...lot, scope: "EXCLUDED", reasonCode: "NO_LINK_MATCH", reason: "No shipment or container key matches the event." };
    }
    if (!locationMatches) {
      return { ...lot, scope: "EXCLUDED", reasonCode: "LOCATION_MISMATCH", reason: "The recorded location does not match the event." };
    }
    if (!overlaps) {
      return { ...lot, scope: "EXCLUDED", reasonCode: "OUTSIDE_EVENT_WINDOW", reason: "The recorded lot window does not overlap the observed event window." };
    }
    return {
      ...lot,
      scope: "CANDIDATE",
      reasonCode: shipmentMatches ? "SHIPMENT_LOCATION_TIME_MATCH" : "CONTAINER_LOCATION_TIME_MATCH",
      reason: "Shipment or container, location, and time window match the supplied records.",
    };
  });
}

function templateDraft(
  event: ColdChainEvent,
  readings: NormalizedReading[],
  excursions: Evaluation["excursions"],
  candidates: CandidateLot[],
  calibrationMissing: boolean,
): Evaluation["draft"] {
  const citations = [event.eventId, event.productPolicy.sourceRef];
  for (const lot of candidates) {
    if (lot.scope === "CANDIDATE" && lot.sourceRef) citations.push(lot.sourceRef);
  }
  if (!calibrationMissing && event.calibrationReference?.sourceRef) {
    citations.push(event.calibrationReference.sourceRef);
  }
  const applicableReadings = readings.filter((reading) => reading.policyApplicable);
  const peak = applicableReadings.length
    ? applicableReadings.reduce((highest, reading) => Math.max(highest, reading.normalizedCelsius), -Infinity)
    : null;
  const candidateNames = candidates.filter((lot) => lot.scope === "CANDIDATE").map((lot) => lot.lotId);
  const intervalText = excursions.length
    ? excursions.map((item) => `${item.kind} ${new Date(item.startAt).toISOString().slice(11, 16)}–${new Date(item.endAt).toISOString().slice(11, 16)} UTC`).join("; ")
    : readings.some((reading) => !reading.policyApplicable)
      ? "policy coverage incomplete; readings fall outside the effective period"
      : "no out-of-range readings observed";
  const lotText = candidateNames.length ? candidateNames.join(" and ") : "no candidate lots matched the supplied records";
  const calibrationText = calibrationMissing ? "The calibration record was not supplied." : "A calibration reference was supplied.";
  return {
    mode: "template",
    citations,
    text: `${event.eventId} records ${intervalText}${peak === null ? ". No policy-applicable reading was available for a peak comparison." : `, with an observed policy-applicable peak of ${peak.toFixed(1)}°C.`} The supplied shipment, location, and time records identify ${lotText} as candidate lots. ${calibrationText} This is a source-linked template for human review, not a disposition decision.`,
  };
}

export function evaluateEvent(input: ColdChainEvent): Evaluation {
  if (!input || typeof input !== "object") throw new Error("Event payload must be a JSON object.");
  if (input.schemaVersion !== "1.0") throw new Error("Unsupported schemaVersion. Lotline currently accepts 1.0.");
  if (!input.eventId || !input.sensorId || !input.receivedAt) {
    throw new Error("eventId, sensorId, and receivedAt are required.");
  }
  if (input.sourceAdapter !== "webhook" && input.sourceAdapter !== "file") {
    throw new Error("sourceAdapter must be webhook or file.");
  }
  if (!input.shipmentId && !input.containerId) {
    throw new Error("At least one shipmentId or containerId is required to scope lots.");
  }
  if (!Array.isArray(input.readings) || input.readings.length === 0) {
    throw new Error("At least one reading is required; no event can be assessed without readings.");
  }
  if (input.inventorySnapshot != null && !Array.isArray(input.inventorySnapshot)) {
    throw new Error("inventorySnapshot must be an array of supplied lot records.");
  }
  for (const lot of input.inventorySnapshot ?? []) {
    if (!lot || typeof lot !== "object" || !lot.lotId || !lot.locationId || !lot.sourceRef) {
      throw new Error("Each inventory record requires lotId, locationId, and sourceRef.");
    }
  }
  toTimestamp(input.receivedAt, "receivedAt");

  const policy = normalizePolicy(input.productPolicy);
  const warnings: string[] = [];
  const seenIds = new Set<string>();
  const seenTimes = new Set<number>();
  let priorTime = -Infinity;
  let outOfOrderCount = 0;
  let duplicateCount = 0;

  const readings = input.readings.map((reading) => {
    if (!reading || typeof reading !== "object") throw new Error("Every reading must be an object.");
    if (!reading.readingId) throw new Error("Every reading requires a source readingId.");
    const time = toTimestamp(reading.observedAt, `Reading ${reading.readingId} observedAt`);
    if (seenIds.has(reading.readingId) || seenTimes.has(time)) duplicateCount += 1;
    if (time < priorTime) outOfOrderCount += 1;
    seenIds.add(reading.readingId);
    seenTimes.add(time);
    priorTime = time;
    const normalizedCelsius = toCelsius(reading.value, reading.unit);
    const inPolicyPeriod = time >= Date.parse(policy.effectiveFrom) && time <= Date.parse(policy.effectiveTo);
    if (!inPolicyPeriod) warnings.push(`Reading ${reading.readingId} falls outside policy ${policy.policyId}'s effective period.`);
    const policyApplicable = inPolicyPeriod;
    const band: NormalizedReading["band"] = !policyApplicable
      ? "OUTSIDE_POLICY_PERIOD"
      : normalizedCelsius < policy.lowerBound
        ? "LOW"
        : normalizedCelsius > policy.upperBound
          ? "HIGH"
          : "IN";
    return {
      ...reading,
      normalizedCelsius,
      policyApplicable,
      band,
      outOfRange: band === "LOW" || band === "HIGH",
    };
  });

  if (duplicateCount) warnings.push(`${duplicateCount} duplicate reading ID or timestamp(s) remain visible.`);
  if (outOfOrderCount) warnings.push(`${outOfOrderCount} out-of-order reading(s) remain visible.`);

  const orderedReadings = [...readings].sort((a, b) => Date.parse(a.observedAt) - Date.parse(b.observedAt));
  const gaps = orderedReadings.slice(1).map((reading, index) =>
    (Date.parse(reading.observedAt) - Date.parse(orderedReadings[index].observedAt)) / 60_000,
  );
  const maxObservedGapMinutes = gaps.length ? Math.max(...gaps) : 0;
  if (maxObservedGapMinutes > policy.maxSampleGapMinutes) {
    warnings.push(`An observed sampling gap of ${maxObservedGapMinutes.toFixed(0)} minutes exceeds the configured ${policy.maxSampleGapMinutes}-minute limit; no values were interpolated.`);
  }

  const excursions = buildExcursions(readings, policy.maxSampleGapMinutes);
  const firstReading = orderedReadings[0].observedAt;
  const lastReading = orderedReadings.at(-1)!.observedAt;
  const candidates = scopeLots(input, input.inventorySnapshot ?? [], firstReading, lastReading);
  const calibrationMissing = !input.calibrationReference?.sourceRef;
  const unknowns = [...warnings];
  if (calibrationMissing) unknowns.push("Calibration reference was not supplied.");
  if (!input.locationId) unknowns.push("Location link is missing; candidate scope cannot be complete.");
  if (!input.inventorySnapshot?.length) unknowns.push("Inventory snapshot is missing; candidate scope cannot be complete.");
  if (!candidates.some((lot) => lot.scope === "CANDIDATE")) unknowns.push("No lot matched all required shipment/container, location, and time checks.");
  if (excursions.some((interval) => interval.endIsObservedOnly)) unknowns.push("At least one excursion has no observed in-range recovery reading.");

  const scopeIncomplete =
    !input.locationId ||
    !input.inventorySnapshot?.length ||
    !candidates.some((lot) => lot.scope === "CANDIDATE");
  const coverageIncomplete = warnings.length > 0 || readings.length < 2;
  const reviewRequired = calibrationMissing || unknowns.length > 0 || coverageIncomplete || scopeIncomplete;
  const state: Evaluation["state"] = scopeIncomplete
    ? "SCOPE_INCOMPLETE"
    : reviewRequired
      ? "REVIEW_REQUIRED"
      : "REVIEW_READY";
  const evidenceIds = [input.eventId, policy.sourceRef];
  const inventorySnapshot = input.inventorySnapshot ?? [];
  for (const lot of inventorySnapshot) {
    if (lot.sourceRef) evidenceIds.push(lot.sourceRef);
  }
  if (input.calibrationReference?.sourceRef) evidenceIds.push(input.calibrationReference.sourceRef);
  const inventoryEvidence = inventorySnapshot.length
    ? [...new Set(inventorySnapshot.map((lot) => lot.sourceRef))].map((sourceRef) => {
        const lotIds = inventorySnapshot.filter((lot) => lot.sourceRef === sourceRef).map((lot) => lot.lotId);
        return {
          id: sourceRef,
          label: "Inventory record",
          status: "PRESENT" as const,
          sourceRef,
          detail: `${lotIds.join(", ")} supplied from this source record.`,
        };
      })
    : [{ id: "INVENTORY-SNAPSHOT-MISSING", label: "Inventory snapshot", status: "MISSING" as const, detail: "No synthetic lot records were supplied." }];
  const evidence: Evaluation["evidence"] = [
    { id: input.eventId, label: "Event window and readings", status: "PRESENT", sourceRef: input.eventId, detail: `${readings.length} source readings retained for ${input.sensorId}.` },
    { id: policy.sourceRef, label: "Product policy", status: "PRESENT", sourceRef: policy.sourceRef, detail: `Policy ${policy.policyId} v${policy.version}; ${policy.lowerBound.toFixed(1)}–${policy.upperBound.toFixed(1)}°C.` },
    ...inventoryEvidence,
    { id: input.calibrationReference?.sourceRef ?? "CALIBRATION-REFERENCE-MISSING", label: "Calibration reference", status: calibrationMissing ? "MISSING" : "PRESENT", sourceRef: input.calibrationReference?.sourceRef, detail: calibrationMissing ? "No calibration record supplied in this fixture." : "Calibration reference supplied; validity still requires human review." },
  ];

  return {
    state,
    assessment: excursions.length
      ? "EXCURSION_OBSERVED"
      : readings.some((reading) => !reading.policyApplicable)
        ? "POLICY_COVERAGE_INCOMPLETE"
        : "NO_EXCURSION_OBSERVED",
    eventId: input.eventId,
    sourceAdapter: input.sourceAdapter,
    receivedAt: input.receivedAt,
    policy,
    readings,
    excursions,
    candidateLots: candidates,
    evidence,
    unknowns,
    warnings,
    coverage: coverageIncomplete ? "INCOMPLETE" : "COMPLETE",
    maxObservedGapMinutes,
    evidenceIds: [...new Set(evidenceIds)],
    draft: templateDraft(input, readings, excursions, candidates, calibrationMissing),
  };
}

export function describeDisposition(disposition: Disposition): string {
  const labels: Record<Disposition, string> = {
    hold: "Maintain hold",
    escalate: "Escalate for quality review",
    simulated_release: "Record simulated release",
  };
  return labels[disposition];
}
