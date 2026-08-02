import { describe, expect, it } from "vitest";

import { ALL_GATEWAY_TOPICS, GatewayTopics } from "../../src/gateway";

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
});
