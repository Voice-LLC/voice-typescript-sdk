import { Context } from "./context";
import type{ UpdateContext } from "./context";
import type { Gateway } from "./gateway";
import { SignalRGateway } from "./gateway";
import { GrpcBotsTransport } from "./transport";
import type { Transport } from "./transport";
import type { ClientConfig, ClientOptions } from "./types";
import { createClientConfigOptions } from "./utils";

export type Matcher = string | string[] | RegExp | ((ctx: Context) => boolean);
export type MatchHandler = (ctx: Context) => void | Promise<unknown>;

export type ClientErrorHandler = (error: Error) => void;

export class Client {
  readonly options: ClientOptions;
  private readonly transport: Transport;
  private gateway?: Gateway;
  private readonly matches = new Map<Matcher, MatchHandler>();
  private onClientErrorHandler?: ClientErrorHandler;

  constructor(config: ClientConfig, transport?: Transport, gateway?: Gateway) {
    this.options = createClientConfigOptions(config);
    this.transport = transport ?? new GrpcBotsTransport(this.options);
    this.gateway = gateway;
  }

  match(matcher: Matcher, handler: MatchHandler): this {
    this.matches.set(matcher, handler);
    return this;
  }

  onError(handler: (error: Error) => void): this {
    this.onClientErrorHandler = handler;
    return this;
  }

  async init(): Promise<void> {
    const gateway = (this.gateway ??= new SignalRGateway(this.options));
    gateway.onUpdate((update) => {
      void this.dispatch(update).catch((error) => this.emitError(error));
    });
    gateway.onError((error) => this.emitError(error));
    await gateway.start();
  }

  async stop(): Promise<void> {
    await this.gateway?.stop();
  }

  private async dispatch(update: UpdateContext): Promise<void> {
    const ctx = new Context(update, this.transport);

    await this.dispatchMatches(ctx);
  }

  private async dispatchMatches(ctx: Context): Promise<void> {
    for (const [matcher, handler] of this.matches) {
      if (this.isMatch(matcher, ctx)) {
        await handler(ctx);
      }
    }
  }

  private emitError(error: unknown): void {
    const err = error instanceof Error ? error : new Error(String(error));
    if (this.onClientErrorHandler) this.onClientErrorHandler(err);
    else console.error("[voice] unhandled error:", err);
  }

  private isMatch(matcher: Matcher, ctx: Context): boolean {
    const text = ctx.update.message.content;

    switch (true) {
      case typeof matcher === "string":
        return text === matcher;
      case Array.isArray(matcher):
        return matcher.includes(text);
      case matcher instanceof RegExp:
        return matcher.test(text);
      default:
        return matcher(ctx);
    }
  }
}

export function createClient(options: ClientOptions): Client {
  return new Client(options);
}
