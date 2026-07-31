import { describe, it, expect } from "vitest";

import { GatewayTopics, ALL_GATEWAY_TOPICS } from "../../src/gateway";

describe("GatewayTopics", () => {
  it("exposes the expected topic names", () => {
    expect(GatewayTopics).toEqual({
      chatEvents: "chat-events",
      channelEvents: "channel-events",
      groupEvents: "group-events",
      interactionEvents: "interaction-events",
    });
  });
});

describe("ALL_GATEWAY_TOPICS", () => {
  it("contains every topic value", () => {
    expect(ALL_GATEWAY_TOPICS).toEqual([
      "chat-events",
      "channel-events",
      "group-events",
      "interaction-events",
    ]);
  });

  it("has the same length as the topic map", () => {
    expect(ALL_GATEWAY_TOPICS).toHaveLength(Object.keys(GatewayTopics).length);
  });
});
