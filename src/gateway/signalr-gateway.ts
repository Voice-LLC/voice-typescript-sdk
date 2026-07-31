import type { HubConnection } from "@microsoft/signalr";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

import { createUpdateContext } from "./events";
import type { Gateway, GatewayErrorHandler, GatewayUpdateHandler } from "./gateway";
import type { GatewayTopic } from "./gateway-topics";
import { ALL_GATEWAY_TOPICS } from "./gateway-topics";

import type { ClientOptions } from "../types";
import { createGatewayUrl } from "../utils";

export class SignalRGateway implements Gateway {
  private readonly connection: HubConnection;

  private onGatewayUpdateHandler?: GatewayUpdateHandler;
  private onGatewayErrorHandler?: GatewayErrorHandler;

  constructor(options: ClientOptions) {
    this.connection = new HubConnectionBuilder()
      .withUrl(createGatewayUrl(options), { accessTokenFactory: () => options.token })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Warning)
      .build();

    for (const topic of ALL_GATEWAY_TOPICS) {
      this.connection.on(topic, (envelope: unknown) => this.handleEvent(topic, envelope));
    }

    this.connection.onclose((error) => {
      if (error) this.emitError(error);
    });
    this.connection.onreconnecting((error) => {
      if (error) this.emitError(error);
    });
  }

  onError(handler: GatewayErrorHandler): void {
    this.onGatewayErrorHandler = handler;
  }

  onUpdate(handler: GatewayUpdateHandler): void {
    this.onGatewayUpdateHandler = handler;
  }

  start(): Promise<void> {
    return this.connection.start();
  }

  stop(): Promise<void> {
    return this.connection.stop();
  }

  private emitError(error: unknown): void {
    this.onGatewayErrorHandler?.(error instanceof Error ? error : new Error(String(error)));
  }

  private handleEvent(topic: GatewayTopic, payload: unknown): void {
    try {
      const context = createUpdateContext(topic, payload);
      if (context) void this.onGatewayUpdateHandler?.(context);
    } catch (error) {
      this.emitError(error);
    }
  }
}
