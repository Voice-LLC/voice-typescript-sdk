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
      expect(createGrpcTransport).toHaveBeenCalledOnce();
      expect(createGrpcTransport.mock.calls[0][0]).toMatchObject({
        baseUrl: "https://api.voice.dev",
      });
    });

    it("wires the connect client to the BotsApi service", () => {
      new GrpcBotsTransport(options);
      expect(createClient).toHaveBeenCalledOnce();
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
      // interceptor(next)(req)
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

    it("getMe calls the client with an empty request", async () => {
      await transport.getMe({});
      expect(clientStub.getMe).toHaveBeenCalledOnce();
    });

    it("getUser delegates to the connect client", async () => {
      await transport.getUser({ userId: "u" });
      expect(clientStub.getUser).toHaveBeenCalledOnce();
      expect(clientStub.getUser.mock.calls[0][0]).toMatchObject({ userId: "u" });
    });

    it("kickUser delegates to the connect client", async () => {
      await transport.kickUser({ groupId: "g", userId: "u" });
      expect(clientStub.kickUser).toHaveBeenCalledOnce();
      expect(clientStub.kickUser.mock.calls[0][0]).toMatchObject({
        groupId: "g",
        userId: "u",
      });
    });

    it("setStatus delegates to the connect client", async () => {
      await transport.setStatus({ status: 1 } as never);
      expect(clientStub.setStatus).toHaveBeenCalledOnce();
    });

    it("sendMessage delegates to the connect client", async () => {
      await transport.sendMessage({ channelId: "c", content: "hi" });
      expect(clientStub.sendMessage).toHaveBeenCalledOnce();
      expect(clientStub.sendMessage.mock.calls[0][0]).toMatchObject({
        channelId: "c",
        content: "hi",
      });
    });

    it("updateMessage delegates to the connect client", async () => {
      await transport.updateMessage({ messageId: "m", content: "edit" });
      expect(clientStub.updateMessage).toHaveBeenCalledOnce();
    });

    it("deleteMessage delegates to the connect client", async () => {
      await transport.deleteMessage({ messageId: "m" });
      expect(clientStub.deleteMessage).toHaveBeenCalledOnce();
    });

    it("typing delegates to the connect client", async () => {
      await transport.typing({ channelId: "c", isTyping: true });
      expect(clientStub.typing).toHaveBeenCalledOnce();
    });

    it("setTyping delegates to the connect client", async () => {
      await transport.setTyping({ channelId: "c", state: 1 });
      expect(clientStub.setTyping).toHaveBeenCalledOnce();
    });

    it("addReaction delegates to the connect client", async () => {
      await transport.addReaction({ messageId: "m", emoji: "👍" });
      expect(clientStub.addReaction).toHaveBeenCalledOnce();
    });

    it("removeReaction delegates to the connect client", async () => {
      await transport.removeReaction({ messageId: "m", emoji: "👍" });
      expect(clientStub.removeReaction).toHaveBeenCalledOnce();
    });

    it("joinVoiceChannel delegates to the connect client", async () => {
      await transport.joinVoiceChannel({ channelId: "c" });
      expect(clientStub.joinVoiceChannel).toHaveBeenCalledOnce();
    });

    it("leaveVoiceChannel delegates to the connect client", async () => {
      await transport.leaveVoiceChannel({ channelId: "c" });
      expect(clientStub.leaveVoiceChannel).toHaveBeenCalledOnce();
    });

    it("getMyGroups calls the client with an empty request", async () => {
      await transport.getMyGroups();
      expect(clientStub.getMyGroups).toHaveBeenCalledWith({});
    });

    it("getGroup delegates to the connect client", async () => {
      await transport.getGroup({ groupId: "g" });
      expect(clientStub.getGroup).toHaveBeenCalledOnce();
    });

    it("getGroupUsers delegates to the connect client", async () => {
      await transport.getGroupUsers({ groupId: "g" });
      expect(clientStub.getGroupUsers).toHaveBeenCalledOnce();
    });

    it("getGroupRoles delegates to the connect client", async () => {
      await transport.getGroupRoles({ groupId: "g" });
      expect(clientStub.getGroupRoles).toHaveBeenCalledOnce();
    });

    it("getGroupCategories maps to a GetGroupRequest and delegates", async () => {
      await transport.getGroupCategories({ groupId: "g" });
      expect(clientStub.getGroupCategories).toHaveBeenCalledOnce();
      expect(clientStub.getGroupCategories.mock.calls[0][0]).toMatchObject({
        groupId: "g",
      });
    });

    it("getCategory delegates to the connect client", async () => {
      await transport.getCategory({ categoryId: "cat" });
      expect(clientStub.getCategory).toHaveBeenCalledOnce();
    });

    it("getChannel delegates to the connect client", async () => {
      await transport.getChannel({ channelId: "c" });
      expect(clientStub.getChannel).toHaveBeenCalledOnce();
    });

    it("getGroupChannels maps to a GetGroupRequest and delegates", async () => {
      await transport.getGroupChannels({ groupId: "g" });
      expect(clientStub.getGroupChannels).toHaveBeenCalledOnce();
      expect(clientStub.getGroupChannels.mock.calls[0][0]).toMatchObject({
        groupId: "g",
      });
    });

    it("getChannelMessages delegates to the connect client", async () => {
      await transport.getChannelMessages({ channelId: "c", limit: 20 });
      expect(clientStub.getChannelMessages).toHaveBeenCalledOnce();
      expect(clientStub.getChannelMessages.mock.calls[0][0]).toMatchObject({
        channelId: "c",
        limit: 20,
      });
    });

    it("createCategory delegates to the connect client", async () => {
      await transport.createCategory({ groupId: "g", name: "cat" });
      expect(clientStub.createCategory).toHaveBeenCalledOnce();
    });

    it("updateCategory delegates to the connect client", async () => {
      await transport.updateCategory({ categoryId: "cat", name: "renamed" });
      expect(clientStub.updateCategory).toHaveBeenCalledOnce();
    });

    it("deleteCategory delegates to the connect client", async () => {
      await transport.deleteCategory({ categoryId: "cat" });
      expect(clientStub.deleteCategory).toHaveBeenCalledOnce();
    });

    it("createChannel delegates to the connect client", async () => {
      await transport.createChannel({ categoryId: "g", name: "chan" });
      expect(clientStub.createChannel).toHaveBeenCalledOnce();
    });

    it("updateChannel delegates to the connect client", async () => {
      await transport.updateChannel({ channelId: "c", name: "renamed" });
      expect(clientStub.updateChannel).toHaveBeenCalledOnce();
    });

    it("deleteChannel delegates to the connect client", async () => {
      await transport.deleteChannel({ channelId: "c" });
      expect(clientStub.deleteChannel).toHaveBeenCalledOnce();
    });

    it("createRole delegates to the connect client", async () => {
      await transport.createRole({ groupId: "g", name: "role" });
      expect(clientStub.createRole).toHaveBeenCalledOnce();
    });

    it("updateRole delegates to the connect client", async () => {
      await transport.updateRole({ roleId: "r" });
      expect(clientStub.updateRole).toHaveBeenCalledOnce();
    });

    it("deleteRole delegates to the connect client", async () => {
      await transport.deleteRole({ roleId: "r" });
      expect(clientStub.deleteRole).toHaveBeenCalledOnce();
    });

    it("assignRole delegates to the connect client", async () => {
      await transport.assignRole({ roleId: "r", targetUserId: "u" });
      expect(clientStub.assignRole).toHaveBeenCalledOnce();
    });

    it("removeRole delegates to the connect client", async () => {
      await transport.removeRole({ roleId: "r", targetUserId: "u" });
      expect(clientStub.removeRole).toHaveBeenCalledOnce();
    });
  });
});
