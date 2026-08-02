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
    expect(ctx?.message?.channelId).toBe("chan-1");
    expect(ctx?.message?.content).toBe("hello");
    expect(ctx?.message?.id).toBe("m1");
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

  it("returns null for a non-object envelope", () => {
    expect(createUpdateContext(GatewayTopics.chatEvents, "not-an-object")).toBeNull();
  });

  it("returns null for an unknown topic", () => {
    expect(
      createUpdateContext("unknown/topic" as never, envelope("MessageCreated", messagePayload)),
    ).toBeNull();
  });

  describe("interaction events", () => {
    const interactionPayload = {
      InteractionId: "int-1",
      InvokingUserId: "user-1",
      ChannelId: "chan-1",
      Type: 0,
    };

    it("returns an update context for an InteractionCreated event", () => {
      const ctx = createUpdateContext(
        GatewayTopics.interactionEvents,
        envelope("InteractionCreated", interactionPayload),
      );

      expect(ctx).not.toBeNull();
      expect(ctx?.interaction?.interactionId).toBe("int-1");
      expect(ctx?.interaction?.invokingUserId).toBe("user-1");
    });

    it("returns null for a non-InteractionCreated event type", () => {
      expect(
        createUpdateContext(
          GatewayTopics.interactionEvents,
          envelope("InteractionUpdated", interactionPayload),
        ),
      ).toBeNull();
    });

    it("returns null when the payload has no interactionId", () => {
      expect(
        createUpdateContext(
          GatewayTopics.interactionEvents,
          envelope("InteractionCreated", { Type: 0 }),
        ),
      ).toBeNull();
    });

    it("returns null when the interaction envelope carries no payloadJson", () => {
      expect(
        createUpdateContext(GatewayTopics.interactionEvents, { type: "InteractionCreated" }),
      ).toBeNull();
    });
  });
});
