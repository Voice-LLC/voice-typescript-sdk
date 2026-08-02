import { beforeEach, describe, expect, it, vi } from "vitest";

const clientStub = {
  getMe: vi.fn(async (m: unknown) => m),
  getUser: vi.fn(async (m: unknown) => m),
  kickUser: vi.fn(async (m: unknown) => m),
  setStatus: vi.fn(async (m: unknown) => m),
  sendMessage: vi.fn(async (m: unknown) => m),
  updateMessage: vi.fn(async (m: unknown) => m),
  deleteMessage: vi.fn(async (m: unknown) => m),
  typing: vi.fn(async (m: unknown) => m),
  setTyping: vi.fn(async (m: unknown) => m),
  addReaction: vi.fn(async (m: unknown) => m),
  removeReaction: vi.fn(async (m: unknown) => m),
  joinVoiceChannel: vi.fn(async (m: unknown) => m),
  leaveVoiceChannel: vi.fn(async (m: unknown) => m),
  getMyGroups: vi.fn(async (m: unknown) => m),
  getGroup: vi.fn(async (m: unknown) => m),
  getGroupUsers: vi.fn(async (m: unknown) => m),
  getGroupRoles: vi.fn(async (m: unknown) => m),
  getGroupCategories: vi.fn(async (m: unknown) => m),
  getCategory: vi.fn(async (m: unknown) => m),
  createCategory: vi.fn(async (m: unknown) => m),
  updateCategory: vi.fn(async (m: unknown) => m),
  deleteCategory: vi.fn(async (m: unknown) => m),
  getChannel: vi.fn(async (m: unknown) => m),
  createChannel: vi.fn(async (m: unknown) => m),
  updateChannel: vi.fn(async (m: unknown) => m),
  deleteChannel: vi.fn(async (m: unknown) => m),
  getGroupChannels: vi.fn(async (m: unknown) => m),
  getChannelMessages: vi.fn(async (m: unknown) => m),
  createRole: vi.fn(async (m: unknown) => m),
  updateRole: vi.fn(async (m: unknown) => m),
  deleteRole: vi.fn(async (m: unknown) => m),
  assignRole: vi.fn(async (m: unknown) => m),
  removeRole: vi.fn(async (m: unknown) => m),
  respondToInteraction: vi.fn(async (m: unknown) => m),
  sendInteractionFollowup: vi.fn(async (m: unknown) => m),
  registerCommand: vi.fn(async (m: unknown) => m),
  updateCommand: vi.fn(async (m: unknown) => m),
  deleteCommand: vi.fn(async (m: unknown) => m),
  getBotCommands: vi.fn(async (m: unknown) => m),
};

const createGrpcTransport = vi.fn((opts: unknown) => opts);

vi.mock("@connectrpc/connect", () => ({
  createClient: vi.fn(() => clientStub),
}));

vi.mock("@connectrpc/connect-node", () => ({
  createGrpcTransport: (opts: unknown) => createGrpcTransport(opts),
}));

import { createClient } from "@connectrpc/connect";

import { GrpcBotsTransport } from "../../src/transport/grpc-transport";

const options = { token: "secret-token", baseUrl: "https://api.voice.dev" };

describe("GrpcBotsTransport", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("constructor", () => {
    it("throws when baseUrl is missing", () => {
      expect(() => new GrpcBotsTransport({ token: "t" })).toThrow(/baseUrl` is required/);
    });

    it("builds the grpc transport with the provided baseUrl", () => {
      new GrpcBotsTransport(options);
      expect(createGrpcTransport.mock.calls[0][0]).toMatchObject({
        baseUrl: "https://api.voice.dev",
      });
    });

    it("wires connect clients for the BotsApi and InteractionsApi services", () => {
      new GrpcBotsTransport(options);
      expect(createClient).toHaveBeenCalledTimes(2);
    });
  });

  describe("auth interceptor", () => {
    it("adds a Bearer Authorization header to outgoing requests", async () => {
      new GrpcBotsTransport(options);
      const { interceptors } = createGrpcTransport.mock.calls[0][0] as {
        interceptors: Array<(next: unknown) => unknown>;
      };

      const next = vi.fn((req: unknown) => req);
      const req = { header: new Map<string, string>() };
      await (interceptors[0] as any)(next)(req);

      expect(req.header.get("Authorization")).toBe("Bearer secret-token");
      expect(next).toHaveBeenCalledWith(req);
    });
  });

  describe("method delegation", () => {
    let transport: GrpcBotsTransport;

    beforeEach(() => {
      transport = new GrpcBotsTransport(options);
    });

    // Each action maps its params through a generated request schema and forwards
    // them to the matching connect client. One row per method verifies the payload
    // survives that mapping.
    it.each([
      ["getUser", { userId: "u" }, { userId: "u" }],
      ["kickUser", { groupId: "g", userId: "u" }, { groupId: "g", userId: "u" }],
      ["setStatus", { status: 1 }, { status: 1 }],
      ["sendMessage", { channelId: "c", content: "hi" }, { channelId: "c", content: "hi" }],
      ["updateMessage", { messageId: "m", content: "edit" }, { messageId: "m", content: "edit" }],
      ["deleteMessage", { messageId: "m" }, { messageId: "m" }],
      ["typing", { channelId: "c", isTyping: true }, { channelId: "c", isTyping: true }],
      ["setTyping", { channelId: "c", state: 1 }, { channelId: "c", state: 1 }],
      ["addReaction", { messageId: "m", emoji: "👍" }, { messageId: "m", emoji: "👍" }],
      ["removeReaction", { messageId: "m", emoji: "👍" }, { messageId: "m", emoji: "👍" }],
      ["joinVoiceChannel", { channelId: "c" }, { channelId: "c" }],
      ["leaveVoiceChannel", { channelId: "c" }, { channelId: "c" }],
      ["getGroup", { groupId: "g" }, { groupId: "g" }],
      ["getGroupUsers", { groupId: "g" }, { groupId: "g" }],
      ["getGroupRoles", { groupId: "g" }, { groupId: "g" }],
      ["getGroupCategories", { groupId: "g" }, { groupId: "g" }],
      ["getCategory", { categoryId: "cat" }, { categoryId: "cat" }],
      ["createCategory", { groupId: "g", name: "cat" }, { groupId: "g", name: "cat" }],
      ["updateCategory", { categoryId: "cat", name: "x" }, { categoryId: "cat", name: "x" }],
      ["deleteCategory", { categoryId: "cat" }, { categoryId: "cat" }],
      ["getChannel", { channelId: "c" }, { channelId: "c" }],
      ["createChannel", { categoryId: "g", name: "chan" }, { categoryId: "g", name: "chan" }],
      ["updateChannel", { channelId: "c", name: "x" }, { channelId: "c", name: "x" }],
      ["deleteChannel", { channelId: "c" }, { channelId: "c" }],
      ["getGroupChannels", { groupId: "g" }, { groupId: "g" }],
      ["getChannelMessages", { channelId: "c", limit: 20 }, { channelId: "c", limit: 20 }],
      ["createRole", { groupId: "g", name: "role" }, { groupId: "g", name: "role" }],
      ["updateRole", { roleId: "r" }, { roleId: "r" }],
      ["deleteRole", { roleId: "r" }, { roleId: "r" }],
      ["assignRole", { roleId: "r", targetUserId: "u" }, { roleId: "r", targetUserId: "u" }],
      ["removeRole", { roleId: "r", targetUserId: "u" }, { roleId: "r", targetUserId: "u" }],
      ["respondToInteraction", { interactionId: "i" }, { interactionId: "i" }],
      ["sendInteractionFollowup", { interactionId: "i" }, { interactionId: "i" }],
      ["registerCommand", { name: "ping" }, { name: "ping" }],
      ["updateCommand", { commandId: "c" }, { commandId: "c" }],
      ["deleteCommand", { commandId: "c" }, { commandId: "c" }],
      ["getBotCommands", { botId: "b" }, { botId: "b" }],
    ] as const)("%s forwards its params to the connect client", async (method, args, expected) => {
      await (transport as any)[method](args);
      const spy = clientStub[method as keyof typeof clientStub];
      expect(spy).toHaveBeenCalledOnce();
      expect(spy.mock.calls[0][0]).toMatchObject(expected);
    });

    it("getMe maps to an Empty request", async () => {
      await transport.getMe({});
      expect(clientStub.getMe).toHaveBeenCalledOnce();
    });

    it("getMyGroups calls the client with an empty request", async () => {
      await transport.getMyGroups();
      expect(clientStub.getMyGroups).toHaveBeenCalledWith({});
    });
  });
});
