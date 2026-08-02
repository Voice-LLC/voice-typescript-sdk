import { beforeEach, describe, expect, it } from "vitest";

import {
  createFakeTransport,
  createInteractionUpdate,
  createUpdate,
} from "./helpers/fake-transport";

import { Context } from "../src/context";
import type { GatewayMessage } from "../src/events";
import { InteractionType } from "../src/events";
import type { Transport } from "../src/transport";

describe("Context", () => {
  let transport: Transport;
  let ctx: Context;

  beforeEach(() => {
    transport = createFakeTransport();
    ctx = new Context(createUpdate(), transport);
  });

  describe("accessors", () => {
    it("exposes the underlying message", () => {
      expect(ctx.message?.id).toBe("msg-1");
    });

    it("exposes the channel id", () => {
      expect(ctx.channelId).toBe("chan-1");
    });

    it("exposes the message text via `text`", () => {
      expect(ctx.text).toBe("hello world");
    });

    it("exposes the message id", () => {
      expect(ctx.messageId).toBe("msg-1");
    });

    it("exposes the message author", () => {
      expect(ctx.author.id).toBe("author-1");
      expect(ctx.author.username).toBe("bob");
    });

    it("exposes the author id", () => {
      const withAuthorId = new Context(createUpdate({ authorId: "author-1" }), transport);
      expect(withAuthorId.authorId).toBe("author-1");
    });

    it("exposes attachments", () => {
      const attachment = { id: "att-1" } as GatewayMessage["attachments"][number];
      const withAttachment = new Context(createUpdate({ attachments: [attachment] }), transport);
      expect(withAttachment.attachments).toEqual([attachment]);
    });

    it("exposes reactions", () => {
      const withReactions = new Context(
        createUpdate({ reactions: { "👍": ["author-1"] } }),
        transport,
      );
      expect(withReactions.reactions).toEqual({ "👍": ["author-1"] });
    });

    it("exposes the reply target", () => {
      const reply = new Context(createUpdate({ replyTo: "msg-0" }), transport);
      expect(reply.replyTo).toBe("msg-0");
    });

    it("exposes the group payload", () => {
      const group = { groupId: "group-1", type: "MessageCreated" };
      const withGroup = new Context(createUpdate({}, group), transport);
      expect(withGroup.group).toBe(group);
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

      expect(component.interactionType).toBe(InteractionType.MessageComponent);
      expect(component.interactionCustomId).toBe("pick-fruit");
      expect(component.interactionValues).toEqual(["apple"]);
    });

    it("reports not-an-interaction for a plain message", () => {
      const plain = new Context(createUpdate(), transport);
      expect(plain.isInteraction).toBe(false);
      expect(plain.interactionId).toBeNull();
    });
  });

  describe("sendMessage", () => {
    it("forwards content, channel and reply target", async () => {
      await ctx.sendMessage("hi there");
      expect(transport.sendMessage).toHaveBeenCalledWith({
        content: "hi there",
        channelId: "chan-1",
        replyTo: "msg-1",
      });
    });
  });

  describe("updateMessage", () => {
    it("forwards the message id and new content", async () => {
      await ctx.updateMessage("other-msg", "edited");
      expect(transport.updateMessage).toHaveBeenCalledWith({
        content: "edited",
        messageId: "other-msg",
      });
    });
  });

  describe("deleteMessage", () => {
    it("forwards the message id", async () => {
      await ctx.deleteMessage("other-msg");
      expect(transport.deleteMessage).toHaveBeenCalledWith({ messageId: "other-msg" });
    });
  });

  describe("typing", () => {
    it("forwards the typing flag and channel", async () => {
      await ctx.typing(true);
      expect(transport.typing).toHaveBeenCalledWith({ channelId: "chan-1", isTyping: true });
    });
  });

  describe("setTyping", () => {
    it("forwards the typing state and channel", async () => {
      await ctx.setTyping(1);
      expect(transport.setTyping).toHaveBeenCalledWith({ channelId: "chan-1", state: 1 });
    });
  });

  describe("addReaction", () => {
    it("defaults the message id to the current message", async () => {
      await ctx.addReaction("👍");
      expect(transport.addReaction).toHaveBeenCalledWith({ messageId: "msg-1", emoji: "👍" });
    });

    it("uses an explicit message id when provided", async () => {
      await ctx.addReaction("👍", "other-msg");
      expect(transport.addReaction).toHaveBeenCalledWith({ messageId: "other-msg", emoji: "👍" });
    });
  });

  describe("removeReaction", () => {
    it("defaults the message id to the current message", async () => {
      await ctx.removeReaction("👍");
      expect(transport.removeReaction).toHaveBeenCalledWith({ messageId: "msg-1", emoji: "👍" });
    });

    it("uses an explicit message id when provided", async () => {
      await ctx.removeReaction("👍", "other-msg");
      expect(transport.removeReaction).toHaveBeenCalledWith({
        messageId: "other-msg",
        emoji: "👍",
      });
    });
  });

  describe("joinVoiceChannel", () => {
    it("forwards the current channel", async () => {
      await ctx.joinVoiceChannel();
      expect(transport.joinVoiceChannel).toHaveBeenCalledWith({ channelId: "chan-1" });
    });
  });

  describe("leaveVoiceChannel", () => {
    it("forwards the current channel", async () => {
      await ctx.leaveVoiceChannel();
      expect(transport.leaveVoiceChannel).toHaveBeenCalledWith({ channelId: "chan-1" });
    });
  });

  describe("getMyGroups", () => {
    it("delegates to the transport with no args", async () => {
      await ctx.getMyGroups();
      expect(transport.getMyGroups).toHaveBeenCalledWith();
    });
  });

  describe("getGroup", () => {
    it("forwards the group id", async () => {
      await ctx.getGroup("group-9");
      expect(transport.getGroup).toHaveBeenCalledWith({ groupId: "group-9" });
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

  describe("getUser", () => {
    it("forwards the user id", async () => {
      await ctx.getUser("user-7");
      expect(transport.getUser).toHaveBeenCalledWith({ userId: "user-7" });
    });
  });

  describe("kickUser", () => {
    it("forwards the group and user ids", async () => {
      await ctx.kickUser("group-1", "user-7");
      expect(transport.kickUser).toHaveBeenCalledWith({
        groupId: "group-1",
        userId: "user-7",
      });
    });
  });

  describe("getGroupUsers", () => {
    it("forwards the group id", async () => {
      await ctx.getGroupUsers("group-1");
      expect(transport.getGroupUsers).toHaveBeenCalledWith({ groupId: "group-1" });
    });
  });

  describe("getGroupRoles", () => {
    it("forwards the group id", async () => {
      await ctx.getGroupRoles("group-1");
      expect(transport.getGroupRoles).toHaveBeenCalledWith({ groupId: "group-1" });
    });
  });

  describe("getGroupCategories", () => {
    it("forwards the group id", async () => {
      await ctx.getGroupCategories("group-1");
      expect(transport.getGroupCategories).toHaveBeenCalledWith({ groupId: "group-1" });
    });
  });

  describe("getGroupChannels", () => {
    it("forwards the group id", async () => {
      await ctx.getGroupChannels("group-1");
      expect(transport.getGroupChannels).toHaveBeenCalledWith({ groupId: "group-1" });
    });
  });

  describe("getChannel", () => {
    it("forwards the channel id", async () => {
      await ctx.getChannel("chan-9");
      expect(transport.getChannel).toHaveBeenCalledWith({ channelId: "chan-9" });
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

  describe("createCategory", () => {
    it("forwards the group id and name", async () => {
      await ctx.createCategory("group-1", "General");
      expect(transport.createCategory).toHaveBeenCalledWith({
        groupId: "group-1",
        name: "General",
      });
    });
  });

  describe("updateCategory", () => {
    it("forwards the category id and name", async () => {
      await ctx.updateCategory("cat-1", "Renamed");
      expect(transport.updateCategory).toHaveBeenCalledWith({
        categoryId: "cat-1",
        name: "Renamed",
      });
    });
  });

  describe("deleteCategory", () => {
    it("forwards the category id", async () => {
      await ctx.deleteCategory("cat-1");
      expect(transport.deleteCategory).toHaveBeenCalledWith({ categoryId: "cat-1" });
    });
  });

  describe("createChannel", () => {
    it("forwards the category id, type and name", async () => {
      await ctx.createChannel("cat-1", 0, "general");
      expect(transport.createChannel).toHaveBeenCalledWith({
        categoryId: "cat-1",
        type: 0,
        name: "general",
      });
    });
  });

  describe("updateChannel", () => {
    it("forwards the channel id and name", async () => {
      await ctx.updateChannel("chan-1", "renamed");
      expect(transport.updateChannel).toHaveBeenCalledWith({
        channelId: "chan-1",
        name: "renamed",
      });
    });
  });

  describe("deleteChannel", () => {
    it("forwards the channel id", async () => {
      await ctx.deleteChannel("chan-1");
      expect(transport.deleteChannel).toHaveBeenCalledWith({ channelId: "chan-1" });
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

    it("omits color when not provided", async () => {
      await ctx.createRole("group-1", "Member", 1n);
      expect(transport.createRole).toHaveBeenCalledWith({
        name: "Member",
        groupId: "group-1",
        permissions: 1n,
        color: undefined,
      });
    });
  });

  describe("updateRole", () => {
    it("forwards role id, name, permissions and color", async () => {
      await ctx.updateRole("role-1", "Admin", 8n, "#00ff00");
      expect(transport.updateRole).toHaveBeenCalledWith({
        roleId: "role-1",
        name: "Admin",
        permissions: 8n,
        color: "#00ff00",
      });
    });
  });

  describe("deleteRole", () => {
    it("forwards the role id", async () => {
      await ctx.deleteRole("role-1");
      expect(transport.deleteRole).toHaveBeenCalledWith({ roleId: "role-1" });
    });
  });

  describe("assignRole", () => {
    it("forwards group, role and target user ids", async () => {
      await ctx.assignRole("group-1", "role-1", "user-7");
      expect(transport.assignRole).toHaveBeenCalledWith({
        groupId: "group-1",
        roleId: "role-1",
        targetUserId: "user-7",
      });
    });
  });

  describe("removeRole", () => {
    it("forwards group, role and target user ids", async () => {
      await ctx.removeRole("group-1", "role-1", "user-7");
      expect(transport.removeRole).toHaveBeenCalledWith({
        groupId: "group-1",
        roleId: "role-1",
        targetUserId: "user-7",
      });
    });
  });
});
