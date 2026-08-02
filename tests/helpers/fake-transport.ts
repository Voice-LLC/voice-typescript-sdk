import { vi } from "vitest";

import type { UpdateContext } from "../../src/context";
import type { BotInteractionEvent, GatewayMessage, InteractionData } from "../../src/events";
import { InteractionType } from "../../src/events";
import type { Transport } from "../../src/transport";

export function createFakeTransport(): Transport {
  const echo = () => vi.fn(async (params?: unknown) => params ?? {});
  return {
    // Profile & status
    getMe: echo(),
    getUser: echo(),
    setStatus: echo(),
    kickUser: echo(),
    // Messages
    sendMessage: echo(),
    updateMessage: echo(),
    deleteMessage: echo(),
    typing: echo(),
    setTyping: echo(),
    addReaction: echo(),
    removeReaction: echo(),
    // Voice
    joinVoiceChannel: echo(),
    leaveVoiceChannel: echo(),
    // Interactions & commands
    respondToInteraction: echo(),
    sendInteractionFollowup: echo(),
    registerCommand: echo(),
    updateCommand: echo(),
    deleteCommand: echo(),
    getBotCommands: echo(),
    // Groups
    getMyGroups: echo(),
    getGroup: echo(),
    getGroupUsers: echo(),
    getGroupRoles: echo(),
    getGroupCategories: echo(),
    // Categories
    getCategory: echo(),
    createCategory: echo(),
    updateCategory: echo(),
    deleteCategory: echo(),
    // Channels
    getChannel: echo(),
    createChannel: echo(),
    updateChannel: echo(),
    deleteChannel: echo(),
    getGroupChannels: echo(),
    getChannelMessages: echo(),
    // Roles
    createRole: echo(),
    updateRole: echo(),
    deleteRole: echo(),
    assignRole: echo(),
    removeRole: echo(),
  } as unknown as Transport;
}

export function createMessage(overrides: Partial<GatewayMessage> = {}): GatewayMessage {
  return {
    id: "msg-1",
    channelId: "chan-1",
    content: "hello world",
    createdAt: "",
    updatedAt: "",
    isEdited: false,
    isDeleted: false,
    attachments: [],
    reactions: {},
    author: {
      id: "author-1",
      username: "bob",
      email: "bob@example.com",
      createdAt: "",
      updatedAt: "",
      lastActivity: "",
      presenceStatus: 0,
      isConfirmed: true,
      isBot: false,
      subscriptionType: "free",
    } as GatewayMessage["author"],
    authorId: "author-1",
    replyTo: "reply",
    componentsJson: null,
    interactionCommandName: null,
    interactionId: null,
    interactionUserId: null,
    ...overrides,
  };
}

export function createUpdate(
  message: Partial<GatewayMessage> = {},
  group: UpdateContext["group"] = {},
): UpdateContext {
  return { message: createMessage(message), group };
}

export function createInteractionEvent(
  overrides: Partial<Omit<BotInteractionEvent, "data">> & { data?: Partial<InteractionData> } = {},
): BotInteractionEvent {
  const { data, ...rest } = overrides;
  return {
    interactionId: "int-1",
    invokingUserId: "user-1",
    channelId: "chan-1",
    groupId: "group-1",
    type: InteractionType.ApplicationCommand,
    ...rest,
    data: {
      commandName: null,
      options: null,
      customId: null,
      values: null,
      focusedOption: null,
      modalFields: null,
      ...data,
    },
  };
}

export function createInteractionUpdate(
  interaction: Parameters<typeof createInteractionEvent>[0] = {},
  group: UpdateContext["group"] = {},
): UpdateContext {
  return { interaction: createInteractionEvent(interaction), group };
}
