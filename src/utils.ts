import type { ClientConfig, ClientOptions } from "./types";

export function createClientConfigOptions(config: ClientConfig): ClientOptions {
  const options = typeof config === "string" ? { token: config } : config;

  if (!options?.token) {
    throw new Error("Voice Client: a bot `token` is required.");
  }

  return { ...options };
}

export function createGatewayUrl(options: ClientOptions): string {
  if (!options.baseUrl) {
    throw new Error("Voice Client: `baseUrl` is required for the gateway.");
  }

  return `${options.baseUrl.replace(/\/+$/, "")}/hubs/bots`;
}

export function camelizeKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(camelizeKeys);
  if (value !== null && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      out[key.charAt(0).toLowerCase() + key.slice(1)] = camelizeKeys(val);
    }
    return out;
  }
  return value;
}

export function matchesCustomId(pattern: string, customId: string | null): boolean {
  if (!customId) return false;

  const starIndex = pattern.indexOf("*");
  if (starIndex < 0) return pattern === customId;

  return customId.startsWith(pattern.slice(0, starIndex));
}

export function parseJson(json: string): unknown {
  if (!json) return undefined;
  try {
    return JSON.parse(json);
  } catch {
    return undefined;
  }
}
