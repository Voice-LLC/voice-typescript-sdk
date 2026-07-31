import { vi } from "vitest";

import type { Gateway, GatewayUpdateHandler, GatewayErrorHandler } from "../../src/gateway";

export class FakeGateway implements Gateway {
  start = vi.fn(async () => {});
  stop = vi.fn(async () => {});

  updateHandler?: GatewayUpdateHandler;
  errorHandler?: GatewayErrorHandler;

  onUpdate(handler: GatewayUpdateHandler): void {
    this.updateHandler = handler;
  }

  onError(handler: GatewayErrorHandler): void {
    this.errorHandler = handler;
  }
}
