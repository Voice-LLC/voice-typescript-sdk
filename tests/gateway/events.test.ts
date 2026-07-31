import { describe, expect, it } from "vitest";

import { GatewayTopics, createUpdateContext } from "../../src/gateway";

function envelope(type: string, payload: unknown) {
  return {
    type,
    payloadJson: JSON.stringify(payload),
    timestamp: 0,
    groupId: "g1",
    chatId: "c1",
    userId: "u1",
    messageId: "m1",
  };
}

const messagePayload = {
  Id: "m1",
  ChannelId: "chan-1",
  Content: "hello",
};

describe("createUpdateContext", () => {
  it("returns an update context for a MessageCreated chat event", () => {
    const ctx = createUpdateContext(
      GatewayTopics.chatEvents,
      envelope("MessageCreated", messagePayload),
    );

    expect(ctx).not.toBeNull();
    expect(ctx?.message.channelId).toBe("chan-1");
    expect(ctx?.message.content).toBe("hello");
    expect(ctx?.message.id).toBe("m1");
  });

  it("returns null for non-chat topics", () => {
    expect(
      createUpdateContext(GatewayTopics.groupEvents, envelope("MessageCreated", messagePayload)),
    ).toBeNull();
  });

  it("returns null for a non-MessageCreated event type", () => {
    expect(
      createUpdateContext(GatewayTopics.chatEvents, envelope("MessageUpdated", messagePayload)),
    ).toBeNull();
  });

  it("returns null when the payload has no channelId", () => {
    expect(
      createUpdateContext(
        GatewayTopics.chatEvents,
        envelope("MessageCreated", { Id: "m1", Content: "hi" }),
      ),
    ).toBeNull();
  });

  it("returns null when the payload JSON is malformed", () => {
    expect(
      createUpdateContext(GatewayTopics.chatEvents, {
        type: "MessageCreated",
        payloadJson: "{not json",
      }),
    ).toBeNull();
  });

  it("returns null when the envelope carries no payloadJson", () => {
    expect(createUpdateContext(GatewayTopics.chatEvents, { type: "MessageCreated" })).toBeNull();
  });

  it("returns null for a null envelope", () => {
    expect(createUpdateContext(GatewayTopics.chatEvents, null)).toBeNull();
  });
});
