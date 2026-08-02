import { beforeEach, describe, expect, it } from "vitest";

import {
  createFakeTransport,
  createInteractionUpdate,
  createUpdate,
} from "./helpers/fake-transport";

import { Context } from "../src/context";
import { InteractionType } from "../src/events";
import type { Transport } from "../src/transport";

describe("Context", () => {
  let transport: Transport;
  let ctx: Context;

  beforeEach(() => {
    transport = createFakeTransport();
    ctx = new Context(createUpdate(), transport);
  });

  describe("text", () => {
    it("returns the message content", () => {
      expect(ctx.text).toBe("hello world");
    });

    it("returns an empty string when there is no message", () => {
      const interaction = new Context(createInteractionUpdate(), transport);
      expect(interaction.text).toBe("");
    });
  });

  describe("channelId", () => {
    it("falls back to the message channel id when there is no interaction", () => {
      expect(ctx.channelId).toBe("chan-1");
    });

    it("prefers the interaction channel id when present", () => {
      const interaction = new Context(
        createInteractionUpdate({ channelId: "int-chan" }),
        transport,
      );
      expect(interaction.channelId).toBe("int-chan");
    });
  });

  describe("componentsJson", () => {
    it("exposes the raw components JSON when present", () => {
      const withComponents = new Context(createUpdate({ componentsJson: '{"type":1}' }), transport);
      expect(withComponents.componentsJson).toBe('{"type":1}');
    });

    it("returns null when the message has no components", () => {
      expect(ctx.componentsJson).toBeNull();
    });

    it("returns null for an interaction update with no message", () => {
      const interaction = new Context(createInteractionUpdate(), transport);
      expect(interaction.componentsJson).toBeNull();
    });
  });

  describe("interaction accessors", () => {
    it("exposes application-command fields when present", () => {
      const interaction = new Context(
        createInteractionUpdate({
          interactionId: "int-1",
          invokingUserId: "user-1",
          type: InteractionType.ApplicationCommand,
          data: { commandName: "ping" },
        }),
        transport,
      );

      expect(interaction.interactionId).toBe("int-1");
      expect(interaction.interactionCommandName).toBe("ping");
      expect(interaction.interactionUserId).toBe("user-1");
      expect(interaction.interactionType).toBe(InteractionType.ApplicationCommand);
      expect(interaction.isInteraction).toBe(true);
    });

    it("exposes component customId and selected values", () => {
      const component = new Context(
        createInteractionUpdate({
          type: InteractionType.MessageComponent,
          data: { customId: "pick-fruit", values: ["apple"] },
        }),
        transport,
      );

      expect(component.interactionCustomId).toBe("pick-fruit");
      expect(component.interactionValues).toEqual(["apple"]);
    });

    it("exposes the raw interaction data payload", () => {
      const interaction = new Context(
        createInteractionUpdate({ data: { commandName: "ping" } }),
        transport,
      );
      expect(interaction.interaction?.commandName).toBe("ping");
    });

    it("returns null/empty defaults for every interaction getter on a plain message", () => {
      expect(ctx.isInteraction).toBe(false);
      expect(ctx.interaction).toBeNull();
      expect(ctx.interactionId).toBeNull();
      expect(ctx.interactionCommandName).toBeNull();
      expect(ctx.interactionCustomId).toBeNull();
      expect(ctx.interactionType).toBeNull();
      expect(ctx.interactionUserId).toBeNull();
      expect(ctx.interactionValues).toEqual([]);
    });
  });

  describe("message-only accessors on an interaction update", () => {
    it("throw because the message is unavailable", () => {
      const interaction = new Context(createInteractionUpdate(), transport);
      expect(() => interaction.messageId).toThrow(/message.*недоступно/);
      expect(() => interaction.author).toThrow(/message.*недоступно/);
    });
  });

  describe("sendMessage", () => {
    it("injects the current channel and replies to the current message", async () => {
      await ctx.sendMessage("hi there");
      expect(transport.sendMessage).toHaveBeenCalledWith({
        content: "hi there",
        channelId: "chan-1",
        replyTo: "msg-1",
      });
    });
  });

  describe("respondToInteraction", () => {
    it("injects the current interaction id and forwards params", async () => {
      const interaction = new Context(
        createInteractionUpdate({ interactionId: "int-9" }),
        transport,
      );
      await interaction.respondToInteraction({ content: "pong" } as never);
      expect(transport.respondToInteraction).toHaveBeenCalledWith({
        interactionId: "int-9",
        content: "pong",
      });
    });

    it("defaults the interaction id to an empty string for a plain message", async () => {
      await ctx.respondToInteraction({ content: "pong" } as never);
      expect(transport.respondToInteraction).toHaveBeenCalledWith({
        interactionId: "",
        content: "pong",
      });
    });
  });

  describe("sendInteractionFollowup", () => {
    it("injects the current interaction id and forwards params", async () => {
      const interaction = new Context(
        createInteractionUpdate({ interactionId: "int-9" }),
        transport,
      );
      await interaction.sendInteractionFollowup({ content: "more" } as never);
      expect(transport.sendInteractionFollowup).toHaveBeenCalledWith({
        interactionId: "int-9",
        content: "more",
      });
    });

    it("defaults the interaction id to an empty string for a plain message", async () => {
      await ctx.sendInteractionFollowup({ content: "more" } as never);
      expect(transport.sendInteractionFollowup).toHaveBeenCalledWith({
        interactionId: "",
        content: "more",
      });
    });
  });

  describe("reactions", () => {
    it.each(["addReaction", "removeReaction"] as const)(
      "%s defaults the message id to the current message",
      async (method) => {
        await (ctx as any)[method]("👍");
        expect((transport as any)[method]).toHaveBeenCalledWith({
          messageId: "msg-1",
          emoji: "👍",
        });
      },
    );

    it.each(["addReaction", "removeReaction"] as const)(
      "%s uses an explicit message id when provided",
      async (method) => {
        await (ctx as any)[method]("👍", "other-msg");
        expect((transport as any)[method]).toHaveBeenCalledWith({
          messageId: "other-msg",
          emoji: "👍",
        });
      },
    );
  });

  describe("channel-scoped actions", () => {
    it.each([
      ["typing", [true], { channelId: "chan-1", isTyping: true }],
      ["setTyping", [1], { channelId: "chan-1", state: 1 }],
      ["joinVoiceChannel", [], { channelId: "chan-1" }],
      ["leaveVoiceChannel", [], { channelId: "chan-1" }],
    ] as const)("%s injects the current channel id", async (method, args, expected) => {
      await (ctx as any)[method](...args);
      expect((transport as any)[method]).toHaveBeenCalledWith(expected);
    });
  });

  describe("getMe", () => {
    it("delegates with an empty params object by default", async () => {
      await ctx.getMe();
      expect(transport.getMe).toHaveBeenCalledWith({});
    });

    it("forwards explicit params", async () => {
      await ctx.getMe({ foo: "bar" } as never);
      expect(transport.getMe).toHaveBeenCalledWith({ foo: "bar" });
    });
  });

  describe("getMyGroups", () => {
    it("delegates to the transport with no args", async () => {
      await ctx.getMyGroups();
      expect(transport.getMyGroups).toHaveBeenCalledWith();
    });
  });

  describe("getChannelMessages", () => {
    it("forwards only the channel id when no paging args are given", async () => {
      await ctx.getChannelMessages("chan-9");
      expect(transport.getChannelMessages).toHaveBeenCalledWith({
        channelId: "chan-9",
        beforeId: undefined,
        limit: undefined,
      });
    });

    it("forwards the paging args when provided", async () => {
      await ctx.getChannelMessages("chan-9", "msg-0", 50);
      expect(transport.getChannelMessages).toHaveBeenCalledWith({
        channelId: "chan-9",
        beforeId: "msg-0",
        limit: 50,
      });
    });
  });

  describe("createRole", () => {
    it("forwards name, group, permissions and color", async () => {
      await ctx.createRole("group-1", "Admin", 8n, "#ff0000");
      expect(transport.createRole).toHaveBeenCalledWith({
        name: "Admin",
        groupId: "group-1",
        permissions: 8n,
        color: "#ff0000",
      });
    });

    it("passes an undefined color when none is provided", async () => {
      await ctx.createRole("group-1", "Member", 1n);
      expect(transport.createRole).toHaveBeenCalledWith({
        name: "Member",
        groupId: "group-1",
        permissions: 1n,
        color: undefined,
      });
    });
  });

  describe("pass-through actions", () => {
    // These wrappers only repackage their positional args into the transport's
    // named-params object — one row per method guards that mapping.
    it.each([
      ["updateMessage", ["m", "edit"], { content: "edit", messageId: "m" }],
      ["deleteMessage", ["m"], { messageId: "m" }],
      ["getGroup", ["g"], { groupId: "g" }],
      ["getUser", ["u"], { userId: "u" }],
      ["kickUser", ["g", "u"], { groupId: "g", userId: "u" }],
      ["getGroupUsers", ["g"], { groupId: "g" }],
      ["getGroupRoles", ["g"], { groupId: "g" }],
      ["getGroupCategories", ["g"], { groupId: "g" }],
      ["getGroupChannels", ["g"], { groupId: "g" }],
      ["getChannel", ["c"], { channelId: "c" }],
      ["createCategory", ["g", "General"], { groupId: "g", name: "General" }],
      ["updateCategory", ["cat", "Renamed"], { categoryId: "cat", name: "Renamed" }],
      ["deleteCategory", ["cat"], { categoryId: "cat" }],
      ["createChannel", ["cat", 0, "general"], { categoryId: "cat", type: 0, name: "general" }],
      ["updateChannel", ["c", "renamed"], { channelId: "c", name: "renamed" }],
      ["deleteChannel", ["c"], { channelId: "c" }],
      ["deleteRole", ["r"], { roleId: "r" }],
      [
        "updateRole",
        ["r", "Admin", 8n, "#00ff00"],
        { roleId: "r", name: "Admin", permissions: 8n, color: "#00ff00" },
      ],
      ["assignRole", ["g", "r", "u"], { groupId: "g", roleId: "r", targetUserId: "u" }],
      ["removeRole", ["g", "r", "u"], { groupId: "g", roleId: "r", targetUserId: "u" }],
    ] as const)("%s repackages its args and delegates", async (method, args, expected) => {
      await (ctx as any)[method](...args);
      expect((transport as any)[method]).toHaveBeenCalledWith(expected);
    });
  });
});
