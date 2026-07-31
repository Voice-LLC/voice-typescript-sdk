import { describe, it, expect } from "vitest";

import {
  createClientConfigOptions,
  createGatewayUrl,
  camelizeKeys,
  parseJson,
} from "../src/utils";

describe("createClientConfigOptions", () => {
  it("normalizes a bare token string into an options object", () => {
    expect(createClientConfigOptions("abc")).toEqual({ token: "abc" });
  });

  it("returns a shallow copy of a provided options object", () => {
    const input = { token: "abc", baseUrl: "https://api.voice.dev" };
    const result = createClientConfigOptions(input);

    expect(result).toEqual(input);
    expect(result).not.toBe(input);
  });

  it("throws when the token is missing on an options object", () => {
    // @ts-expect-error deliberately missing token
    expect(() => createClientConfigOptions({})).toThrow(/token` is required/);
  });

  it("throws when given an empty string", () => {
    expect(() => createClientConfigOptions("")).toThrow(/token` is required/);
  });
});

describe("createGatewayUrl", () => {
  it("appends the hub path to the base url", () => {
    expect(createGatewayUrl({ token: "t", baseUrl: "https://api.voice.dev" })).toBe(
      "https://api.voice.dev/hubs/bots",
    );
  });

  it("strips trailing slashes from the base url", () => {
    expect(createGatewayUrl({ token: "t", baseUrl: "https://api.voice.dev///" })).toBe(
      "https://api.voice.dev/hubs/bots",
    );
  });

  it("throws when baseUrl is missing", () => {
    expect(() => createGatewayUrl({ token: "t" })).toThrow(/baseUrl` is required/);
  });
});

describe("camelizeKeys", () => {
  it("lowercases the first letter of top-level keys", () => {
    expect(camelizeKeys({ ChannelId: "1", Content: "hi" })).toEqual({
      channelId: "1",
      content: "hi",
    });
  });

  it("recurses into nested objects", () => {
    expect(camelizeKeys({ Author: { DisplayName: "Bob" } })).toEqual({
      author: { displayName: "Bob" },
    });
  });

  it("recurses into arrays", () => {
    expect(camelizeKeys([{ Foo: 1 }, { Bar: 2 }])).toEqual([{ foo: 1 }, { bar: 2 }]);
  });

  it("returns primitives unchanged", () => {
    expect(camelizeKeys("plain")).toBe("plain");
    expect(camelizeKeys(42)).toBe(42);
    expect(camelizeKeys(null)).toBeNull();
  });

  it("leaves already-camelCased keys intact", () => {
    expect(camelizeKeys({ channelId: "1" })).toEqual({ channelId: "1" });
  });
});

describe("parseJson", () => {
  it("parses a valid JSON string", () => {
    expect(parseJson('{"a":1}')).toEqual({ a: 1 });
  });

  it("returns undefined for an empty string", () => {
    expect(parseJson("")).toBeUndefined();
  });

  it("returns undefined for malformed JSON", () => {
    expect(parseJson("{not json")).toBeUndefined();
  });
});
