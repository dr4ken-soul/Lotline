import { DemoApp } from "@/components/demo/demo-app";
import { evaluateEvent } from "@/lib/domain";
import { syntheticFixture } from "@/lib/demo-fixture";

export const metadata = {
  title: "Lotline demo — Synthetic event review",
  description: "Run a synthetic cold-chain event through deterministic scope and an explicit human review step.",
};

export default function DemoPage() {
  const evaluation = evaluateEvent(syntheticFixture);
  return <DemoApp evaluation={evaluation} />;
}
