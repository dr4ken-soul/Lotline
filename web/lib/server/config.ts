export interface DemoServerConfig {
  demoSigningKey: string;
  kestraBaseUrl: string;
  kestraTenant: string;
  kestraNamespace: string;
  kestraFlowId: string;
  kestraWebhookKey: string;
  kestraApiToken: string;
}

export function getDemoServerConfig(): DemoServerConfig {
  return {
    demoSigningKey: process.env.LOTLINE_DEMO_SIGNING_KEY ?? "",
    kestraBaseUrl: (process.env.LOTLINE_KESTRA_BASE_URL ?? "").replace(/\/+$/, ""),
    kestraTenant: process.env.LOTLINE_KESTRA_TENANT ?? "main",
    kestraNamespace: process.env.LOTLINE_KESTRA_NAMESPACE ?? "lotline.demo",
    kestraFlowId: process.env.LOTLINE_KESTRA_FLOW_ID ?? "cold-chain-excursion-lot-review",
    kestraWebhookKey: process.env.LOTLINE_KESTRA_WEBHOOK_KEY ?? "",
    kestraApiToken: process.env.LOTLINE_KESTRA_API_TOKEN ?? "",
  };
}

export function hasSafeKestraConfig(config = getDemoServerConfig()): boolean {
  if (!config.kestraBaseUrl || !config.kestraApiToken || !config.kestraWebhookKey || !config.demoSigningKey) return false;
  try {
    const url = new URL(config.kestraBaseUrl);
    return url.protocol === "https:" || ["localhost", "127.0.0.1", "::1"].includes(url.hostname);
  } catch {
    return false;
  }
}

export function apiUrl(path: string, config = getDemoServerConfig()): URL {
  if (!hasSafeKestraConfig(config)) throw new Error("Kestra is not configured for a connected demo.");
  return new URL(path.replace(/^\/+/, ""), `${config.kestraBaseUrl}/`);
}

export function kestraHeaders(config = getDemoServerConfig()): HeadersInit {
  return {
    Authorization: `Bearer ${config.kestraApiToken}`,
    Accept: "application/json",
  };
}
