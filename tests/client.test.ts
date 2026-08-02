import { beforeEach, describe, expect, it, vi } from "vitest";

import { FakeGateway } from "./helpers/fake-gateway";
import {
  createFakeTransport,
  createInteractionUpdate,
  createUpdate,
} from "./helpers/fake-transport";

import { Client, createClient } from "../src";
import type { UpdateContext } from "../src/context";
import { Context } from "../src/context";
import { InteractionType } from "../src/events";
import type { Transport } from "../src/transport";

const options = { token: "tok", baseUrl: "https://api.voice.dev" };

function update(content: string): UpdateContext {
  return createUpdate({ content });
}

describe("Client", () => {
  let transport: Transport;
  let gateway: FakeGateway;
  let client: Client;

  beforeEach(() => {
    transport = createFakeTransport();
    gateway = new FakeGateway();
    client = new Client(options, transport, gateway);
  });

  describe("constructor", () => {
    it("normalizes the config into options", () => {
      expect(new Client("just-a-token", transport, gateway).options).toEqual({
        token: "just-a-token",
      });
    });

    it("throws when the config has no token", () => {
      // @ts-expect-error missing token
      expect(() => new Client({}, transport, gateway)).toThrow(/token` is required/);
    });
  });

  describe("match / onError chaining", () => {
    it("returns the client instance for fluent chaining", () => {
      expect(client.match("x", () => {})).toBe(client);
      expect(client.onError(() => {})).toBe(client);
    });
  });

  describe("init", () => {
    it("registers handlers and starts the gateway", async () => {
      await client.init();
      expect(gateway.start).toHaveBeenCalledOnce();
      expect(gateway.updateHandler).toBeTypeOf("function");
      expect(gateway.errorHandler).toBeTypeOf("function");
    });
  });

  describe("stop", () => {
    it("stops the gateway", async () => {
      await client.init();
      await client.stop();
      expect(gateway.stop).toHaveBeenCalledOnce();
    });

    it("is a no-op when never initialized (no gateway)", async () => {
      const bare = new Client(options, transport);
      await expect(bare.stop()).resolves.toBeUndefined();
    });
  });

  describe("dispatch / matching", () => {
    beforeEach(async () => {
      await client.init();
    });

    it("invokes a handler with a Context on an exact string match", async () => {
      const handler = vi.fn();
      client.match("ping", handler);

      await gateway.updateHandler!(update("ping"));

      expect(handler).toHaveBeenCalledOnce();
      expect(handler.mock.calls[0][0]).toBeInstanceOf(Context);
      expect(handler.mock.calls[0][0].text).toBe("ping");
    });

    it("does not invoke a handler when the string does not match", async () => {
      const handler = vi.fn();
      client.match("ping", handler);

      await gateway.updateHandler!(update("pong"));

      expect(handler).not.toHaveBeenCalled();
    });

    it("matches when the text is included in an array matcher", async () => {
      const handler = vi.fn();
      client.match(["hi", "hello"], handler);

      await gateway.updateHandler!(update("hello"));

      expect(handler).toHaveBeenCalledOnce();
    });

    it("matches against a RegExp", async () => {
      const handler = vi.fn();
      client.match(/^!cmd/, handler);

      await gateway.updateHandler!(update("!cmd run"));

      expect(handler).toHaveBeenCalledOnce();
    });

    it("matches via a predicate function", async () => {
      const handler = vi.fn();
      client.match((ctx) => ctx.text.length > 3, handler);

      await gateway.updateHandler!(update("long enough"));

      expect(handler).toHaveBeenCalledOnce();
    });

    it("invokes every matching handler", async () => {
      const a = vi.fn();
      const b = vi.fn();
      client.match(/e/, a).match("hello", b);

      await gateway.updateHandler!(update("hello"));

      expect(a).toHaveBeenCalledOnce();
      expect(b).toHaveBeenCalledOnce();
    });
  });

  describe("interaction matchers", () => {
    beforeEach(async () => {
      await client.init();
    });

    it("command matches on interaction type and command name", async () => {
      const handler = vi.fn();
      const other = vi.fn();
      client.command("ping", handler);

      await gateway.updateHandler!(
        createInteractionUpdate({
          type: InteractionType.ApplicationCommand,
          data: { commandName: "ping" },
        }),
      );
      await gateway.updateHandler!(
        createInteractionUpdate({
          type: InteractionType.ApplicationCommand,
          data: { commandName: "pong" },
        }),
      );

      expect(handler).toHaveBeenCalledOnce();
      expect(other).not.toHaveBeenCalled();
    });

    it("component matches on interaction type and customId pattern", async () => {
      const handler = vi.fn();
      client.component("pick-*", handler);

      await gateway.updateHandler!(
        createInteractionUpdate({
          type: InteractionType.MessageComponent,
          data: { customId: "pick-apple" },
        }),
      );
      await gateway.updateHandler!(
        createInteractionUpdate({
          type: InteractionType.MessageComponent,
          data: { customId: "drop-apple" },
        }),
      );

      expect(handler).toHaveBeenCalledOnce();
    });

    it("modal matches on interaction type and customId pattern", async () => {
      const handler = vi.fn();
      client.modal("form-*", handler);

      await gateway.updateHandler!(
        createInteractionUpdate({
          type: InteractionType.ModalSubmit,
          data: { customId: "form-signup" },
        }),
      );
      await gateway.updateHandler!(
        createInteractionUpdate({
          type: InteractionType.MessageComponent,
          data: { customId: "form-signup" },
        }),
      );

      expect(handler).toHaveBeenCalledOnce();
    });

    it("autocomplete matches on interaction type and command name", async () => {
      const handler = vi.fn();
      client.autocomplete("search", handler);

      await gateway.updateHandler!(
        createInteractionUpdate({
          type: InteractionType.ApplicationCommandAutocomplete,
          data: { commandName: "search" },
        }),
      );
      await gateway.updateHandler!(
        createInteractionUpdate({
          type: InteractionType.ApplicationCommandAutocomplete,
          data: { commandName: "other" },
        }),
      );

      expect(handler).toHaveBeenCalledOnce();
    });

    it("returns the client instance for fluent chaining", () => {
      expect(client.command("x", () => {})).toBe(client);
      expect(client.component("x", () => {})).toBe(client);
      expect(client.modal("x", () => {})).toBe(client);
      expect(client.autocomplete("x", () => {})).toBe(client);
    });
  });

  describe("error handling", () => {
    beforeEach(async () => {
      await client.init();
    });

    it("routes a handler error to the registered onError handler", async () => {
      const onError = vi.fn();
      const boom = new Error("boom");
      client.onError(onError);
      client.match("x", () => {
        throw boom;
      });

      await gateway.updateHandler!(update("x"));
      // dispatch runs detached via `void ... .catch()`; let the microtask settle.
      await new Promise((r) => setTimeout(r, 0));

      expect(onError).toHaveBeenCalledWith(boom);
    });

    it("wraps a non-Error thrown by a handler into an Error", async () => {
      const onError = vi.fn();
      client.onError(onError);
      client.match("x", () => {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw "string failure";
      });

      await gateway.updateHandler!(update("x"));
      await new Promise((r) => setTimeout(r, 0));

      expect(onError).toHaveBeenCalledOnce();
      const err = onError.mock.calls[0][0] as Error;
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe("string failure");
    });

    it("forwards gateway errors to the onError handler", async () => {
      const onError = vi.fn();
      client.onError(onError);
      const err = new Error("gateway down");

      gateway.errorHandler!(err);

      expect(onError).toHaveBeenCalledWith(err);
    });

    it("falls back to console.error when no handler is registered", async () => {
      const spy = vi.spyOn(console, "error").mockImplementation(() => {});
      gateway.errorHandler!(new Error("unhandled"));

      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });
  });
});

describe("createClient", () => {
  it("returns a Client instance", () => {
    expect(createClient(options)).toBeInstanceOf(Client);
  });
});
