import { EmptySchema } from "@bufbuild/protobuf/wkt";
import { create } from "@bufbuild/protobuf";
import type { Client as ConnectClient, Interceptor } from "@connectrpc/connect";
import { createClient } from "@connectrpc/connect";
import { createGrpcTransport } from "@connectrpc/connect-node";

import type { MessageInfo } from "../gen/bots_pb";
import {
  BotsApi,
  SendMessageRequestSchema,
  UpdateMessageRequestSchema,
  DeleteMessageRequestSchema,
  TypingRequestSchema,
  BotTypingRequestSchema,
  ReactionRequestSchema,
  JoinVoiceChannelRequestSchema,
  LeaveVoiceChannelRequestSchema,
  GetGroupRequestSchema,
  GetGroupUsersRequestSchema,
  GetGroupRolesRequestSchema,
  GetChannelRequestSchema,
  CreateCategoryRequestSchema,
  CreateChannelRequestSchema,
  CreateRoleRequestSchema,
  UpdateRoleRequestSchema,
  DeleteRoleRequestSchema,
  RoleAssignmentRequestSchema,
  UpdateChannelRequestSchema,
  UpdateCategoryRequestSchema,
  DeleteCategoryRequestSchema,
  DeleteChannelRequestSchema,
  GetCategoryRequestSchema,
  SetStatusRequestSchema,
  GetChannelMessagesRequestSchema,
  GetUserRequestSchema,
  KickUserRequestSchema,
} from "../gen/bots_pb";
import type {
  DeleteMessageParams,
  DeleteMessageResult,
  SendMessageParams,
  Transport,
  UpdateMessageParams,
  UpdateMessageResult,
  TypingParams,
  TypingResult,
  SetTypingParams,
  SetTypingResult,
  ReactionParams,
  ReactionResult,
  JoinVoiceChannelParams,
  JoinVoiceChannelResult,
  LeaveVoiceChannelParams,
  LeaveVoiceChannelResult,
  GetMyGroupsResult,
  GetGroupParams,
  GetGroupResult,
  GetGroupUsersParams,
  GetGroupUsersResult,
  GetGroupRolesParams,
  GetGroupRolesResult,
  GetGroupChannelParams,
  GetGroupChannelResult,
  CreateGroupCategoryParams,
  CreateGroupCategoryResult,
  CreateGroupChannelParams,
  CreateGroupChannelResult,
  CreateGroupRoleParams,
  CreateGroupRoleResult,
  UpdateGroupRoleParams,
  UpdateGroupRoleResult,
  DeleteGroupRoleParams,
  DeleteGroupRoleResult,
  RoleAssignmentParams,
  RoleAssignmentResult,
  GetGroupCategoriesResult,
  GetGroupCategoriesParams,
  UpdateGroupCategoryParams,
  UpdateGroupCategoryResult,
  UpdateGroupChannelParams,
  UpdateGroupChannelResult,
  GetGroupCategoryParams,
  GetGroupCategoryResult,
  DeleteGroupChannelParams,
  DeleteGroupChannelResult,
  DeleteGroupCategoryResult,
  DeleteGroupCategoryParams,
  SetStatusResult,
  GetMeParams,
  GetMeResult,
  SetStatusParams,
  GetChannelMessagesParams,
  GetChannelMessagesResult,
  GetGroupChannelsParams,
  GetGroupChannelsResult,
  GetUserParams,
  GetUserResult,
  KickUserParams,
  KickUserResult,
} from "./transport";
import type { ClientOptions } from "../types";

export class GrpcBotsTransport implements Transport {
  private readonly client: ConnectClient<typeof BotsApi>;

  constructor(options: ClientOptions) {
    if (!options.baseUrl) {
      throw new Error("Voice Client: `baseUrl` is required for the gRPC transport.");
    }

    this.client = createClient(BotsApi, createGrpcTransport({
      baseUrl: options.baseUrl,
      interceptors: [createTokenInterceptor(options.token)],
    }));
  }

  async getMe(params: GetMeParams): Promise<GetMeResult> {
    return await this.client.getMe(create(EmptySchema, params));
  };

  async getUser(params: GetUserParams): Promise<GetUserResult> {
    return await this.client.getUser(create(GetUserRequestSchema, params));
  }

  async kickUser(params: KickUserParams): Promise<KickUserResult> {
    return await this.client.kickUser(create(KickUserRequestSchema, params));
  }

  async setStatus(params: SetStatusParams): Promise<SetStatusResult> {
    return await this.client.setStatus(create(SetStatusRequestSchema, params));
  };

  async sendMessage(params: SendMessageParams): Promise<MessageInfo> {
    return await this.client.sendMessage(create(SendMessageRequestSchema, params));
  }

  async updateMessage(params: UpdateMessageParams): Promise<UpdateMessageResult> {
    return await this.client.updateMessage(create(UpdateMessageRequestSchema, params));
  }

  async deleteMessage(params: DeleteMessageParams): Promise<DeleteMessageResult> {
    return await this.client.deleteMessage(create(DeleteMessageRequestSchema, params));
  }

  async typing(params: TypingParams): Promise<TypingResult> {
    return await this.client.typing(create(TypingRequestSchema, params));
  }

  async setTyping(params: SetTypingParams): Promise<SetTypingResult> {
    return await this.client.setTyping(create(BotTypingRequestSchema, params));
  }

  async addReaction(params: ReactionParams): Promise<ReactionResult> {
    return await this.client.addReaction(create(ReactionRequestSchema, params));
  }

  async removeReaction(params: ReactionParams): Promise<ReactionResult> {
    return await this.client.removeReaction(create(ReactionRequestSchema, params));
  }

  async joinVoiceChannel(params: JoinVoiceChannelParams): Promise<JoinVoiceChannelResult> {
    return await this.client.joinVoiceChannel(create(JoinVoiceChannelRequestSchema, params));
  }

  async leaveVoiceChannel(params: LeaveVoiceChannelParams): Promise<LeaveVoiceChannelResult> {
    return await this.client.leaveVoiceChannel(create(LeaveVoiceChannelRequestSchema, params));
  }

  async getMyGroups(): Promise<GetMyGroupsResult> {
    return await this.client.getMyGroups({});
  }

  async getGroup(params: GetGroupParams): Promise<GetGroupResult> {
    return await this.client.getGroup(create(GetGroupRequestSchema, params));
  }

  async getGroupUsers(params: GetGroupUsersParams): Promise<GetGroupUsersResult> {
    return await this.client.getGroupUsers(create(GetGroupUsersRequestSchema, params));
  }

  async getGroupRoles(params: GetGroupRolesParams): Promise<GetGroupRolesResult> {
    return await this.client.getGroupRoles(create(GetGroupRolesRequestSchema, params));
  }

  async getGroupCategories(params: GetGroupCategoriesParams): Promise<GetGroupCategoriesResult> {
    return await this.client.getGroupCategories(create(GetGroupRequestSchema, params));
  }

  async getCategory(params: GetGroupCategoryParams): Promise<GetGroupCategoryResult> {
    return await this.client.getCategory(create(GetCategoryRequestSchema, params));
  }

  async createCategory(params: CreateGroupCategoryParams): Promise<CreateGroupCategoryResult> {
    return await this.client.createCategory(create(CreateCategoryRequestSchema, params));
  }

  async updateCategory(params: UpdateGroupCategoryParams): Promise<UpdateGroupCategoryResult> {
    return await this.client.updateCategory(create(UpdateCategoryRequestSchema, params));
  }

  async deleteCategory(params: DeleteGroupCategoryParams): Promise<DeleteGroupCategoryResult> {
    return await this.client.deleteCategory(create(DeleteCategoryRequestSchema, params));
  }

  async getChannel(params: GetGroupChannelParams): Promise<GetGroupChannelResult> {
    return await this.client.getChannel(create(GetChannelRequestSchema, params));
  }

  async createChannel(params: CreateGroupChannelParams): Promise<CreateGroupChannelResult> {
    return await this.client.createChannel(create(CreateChannelRequestSchema, params));
  }

  async updateChannel(params: UpdateGroupChannelParams): Promise<UpdateGroupChannelResult> {
    return await this.client.updateChannel(create(UpdateChannelRequestSchema, params));
  }

  async deleteChannel(params: DeleteGroupChannelParams): Promise<DeleteGroupChannelResult> {
    return await this.client.deleteChannel(create(DeleteChannelRequestSchema, params));
  }

  async createRole(params: CreateGroupRoleParams): Promise<CreateGroupRoleResult> {
    return await this.client.createRole(create(CreateRoleRequestSchema, params));
  }

  async updateRole(params: UpdateGroupRoleParams): Promise<UpdateGroupRoleResult> {
    return await this.client.updateRole(create(UpdateRoleRequestSchema, params));
  }

  async deleteRole(params: DeleteGroupRoleParams): Promise<DeleteGroupRoleResult> {
    return await this.client.deleteRole(create(DeleteRoleRequestSchema, params));
  }

  async assignRole(params: RoleAssignmentParams): Promise<RoleAssignmentResult> {
    return await this.client.assignRole(create(RoleAssignmentRequestSchema, params));
  }

  async removeRole(params: RoleAssignmentParams): Promise<RoleAssignmentResult> {
    return await this.client.removeRole(create(RoleAssignmentRequestSchema, params));
  }

  async getChannelMessages(params: GetChannelMessagesParams): Promise<GetChannelMessagesResult> {
    return await this.client.getChannelMessages(create(GetChannelMessagesRequestSchema, params));
  }

  async getGroupChannels(params: GetGroupChannelsParams): Promise<GetGroupChannelsResult> {
    return await this.client.getGroupChannels(create(GetGroupRequestSchema, params));
  }
}

function createTokenInterceptor(token: string): Interceptor {
  return (next) => (req) => {
    req.header.set("Authorization", `Bearer ${token}`);
    return next(req);
  };
}
