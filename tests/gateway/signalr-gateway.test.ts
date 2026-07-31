import { describe, it, expect, beforeEach, vi } from "vitest";

const connection = {
  handlers: new Map<string, (envelope: unknown) => void>(),
  closeHandler: undefined as ((error?: Error) => void) | undefined,
  reconnectingHandler: undefined as ((error?: Error) => void) | undefined,
  on: vi.fn((topic: string, cb: (envelope: unknown) => void) => {
    connection.handlers.set(topic, cb);
  }),
  onclose: vi.fn((cb: (error?: Error) => void) => {
    connection.closeHandler = cb;
  }),
  onreconnecting: vi.fn((cb: (error?: Error) => void) => {
    connection.reconnectingHandler = cb;
  }),
  start: vi.fn(async () => {}),
  stop: vi.fn(async () => {}),
};

const withUrlArgs: unknown[] = [];

vi.mock("@microsoft/signalr", () => {
  class HubConnectionBuilder {
    withUrl(...args: unknown[]) {
      withUrlArgs.push(args);
      return this;
    }
    withAutomaticReconnect() {
      return this;
    }
    configureLogging() {
      return this;
    }
    build() {
      return connection;
    }
  }
  return { HubConnectionBuilder, LogLevel: { Warning: 3 } };
});

import { SignalRGateway, GatewayTopics } from "../../src/gateway";

const options = { token: "tok", baseUrl: "https://api.voice.dev" };

const chatEnvelope = {
  type: "MessageCreated",
  payloadJson: JSON.stringify({ Id: "m1", ChannelId: "chan-1", Content: "hi" }),
};

describe("SignalRGateway", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    connection.handlers.clear();
    connection.closeHandler = undefined;
    connection.reconnectingHandler = undefined;
    withUrlArgs.length = 0;
  });

  describe("constructor", () => {
    it("subscribes to every gateway topic", () => {
      new SignalRGateway(options);
      for (const topic of Object.values(GatewayTopics)) {
        expect(connection.handlers.has(topic)).toBe(true);
      }
    });

    it("configures an accessTokenFactory returning the token", () => {
      new SignalRGateway(options);
      const [, config] = withUrlArgs[0] as [string, { accessTokenFactory: () => string }];
      expect(config.accessTokenFactory()).toBe("tok");
    });

    it("registers close and reconnecting handlers", () => {
      new SignalRGateway(options);
      expect(connection.closeHandler).toBeTypeOf("function");
      expect(connection.reconnectingHandler).toBeTypeOf("function");
    });
  });

  describe("start / stop", () => {
    it("delegates start to the connection", async () => {
      await new SignalRGateway(options).start();
      expect(connection.start).toHaveBeenCalledOnce();
    });

    it("delegates stop to the connection", async () => {
      await new SignalRGateway(options).stop();
      expect(connection.stop).toHaveBeenCalledOnce();
    });
  });

  describe("event handling", () => {
    it("emits an update for a MessageCreated chat event", async () => {
      const gateway = new SignalRGateway(options);
      const onUpdate = vi.fn();
      gateway.onUpdate(onUpdate);

      connection.handlers.get(GatewayTopics.chatEvents)!(chatEnvelope);
      await new Promise((r) => setTimeout(r, 0));

      expect(onUpdate).toHaveBeenCalledOnce();
      expect(onUpdate.mock.calls[0][0].message.channelId).toBe("chan-1");
    });

    it("does not emit for unrelated topics", () => {
      const gateway = new SignalRGateway(options);
      const onUpdate = vi.fn();
      gateway.onUpdate(onUpdate);

      connection.handlers.get(GatewayTopics.groupEvents)!(chatEnvelope);

      expect(onUpdate).not.toHaveBeenCalled();
    });

    it("routes an error thrown by the update handler to onError", () => {
      const gateway = new SignalRGateway(options);
      const boom = new Error("handler boom");
      gateway.onUpdate(() => {
        throw boom;
      });
      const onError = vi.fn();
      gateway.onError(onError);

      // The synchronous throw inside handleEvent must be caught and re-emitted,
      // never allowed to escape the topic callback.
      expect(() =>
        connection.handlers.get(GatewayTopics.chatEvents)!(chatEnvelope),
      ).not.toThrow();
      expect(onError).toHaveBeenCalledWith(boom);
    });

    it("wraps a non-Error thrown by the update handler into an Error", () => {
      const gateway = new SignalRGateway(options);
      gateway.onUpdate(() => {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw "string boom";
      });
      const onError = vi.fn();
      gateway.onError(onError);

      connection.handlers.get(GatewayTopics.chatEvents)!(chatEnvelope);

      expect(onError).toHaveBeenCalledOnce();
      const err = onError.mock.calls[0][0] as Error;
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe("string boom");
    });
  });

  describe("connection lifecycle errors", () => {
    it("emits close errors to the error handler", () => {
      const gateway = new SignalRGateway(options);
      const onError = vi.fn();
      gateway.onError(onError);
      const err = new Error("closed");

      connection.closeHandler!(err);

      expect(onError).toHaveBeenCalledWith(err);
    });

    it("ignores a clean close with no error", () => {
      const gateway = new SignalRGateway(options);
      const onError = vi.fn();
      gateway.onError(onError);

      connection.closeHandler!(undefined);

      expect(onError).not.toHaveBeenCalled();
    });

    it("emits reconnecting errors to the error handler", () => {
      const gateway = new SignalRGateway(options);
      const onError = vi.fn();
      gateway.onError(onError);
      const err = new Error("reconnecting");

      connection.reconnectingHandler!(err);

      expect(onError).toHaveBeenCalledWith(err);
    });

    it("ignores a clean reconnecting event with no error", () => {
      const gateway = new SignalRGateway(options);
      const onError = vi.fn();
      gateway.onError(onError);

      connection.reconnectingHandler!(undefined);

      expect(onError).not.toHaveBeenCalled();
    });
  });
});
