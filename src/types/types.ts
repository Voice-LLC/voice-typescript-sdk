/**
 * Options for constructing a {@link Client}.
 *
 * Kept minimal on purpose — only the bot token is required today. New fields
 * (base URL, intents, timeouts…) can be added here without breaking callers.
 */
export interface ClientOptions {
  /** Bot token used to authenticate every request against the Voice backend. */
  token: string;
  /**
   * Base URL of the Voice BotsApi gRPC endpoint, e.g. `https://api.voice.dev`.
   * Required by the default gRPC transport; may be omitted when injecting a
   * custom {@link Transport}. The gateway SignalR hub URL is derived from it.
   */
  baseUrl?: string;
}

/**
 * Anything accepted by `new Client(...)`: either the bare token, or a full
 * {@link ClientOptions} object. Normalized via `normalizeOptions` (see utils).
 */
export type ClientConfig = string | ClientOptions;
