import { create } from "@bufbuild/protobuf";
import { EmptySchema } from "@bufbuild/protobuf/wkt";
import type { Client as ConnectClient, Interceptor } from "@connectrpc/connect";
import { createClient } from "@connectrpc/connect";
import { createGrpcTransport } from "@connectrpc/connect-node";

import type {
  CreateGroupCategoryParams,
  CreateGroupCategoryResult,
  CreateGroupChannelParams,
  CreateGroupChannelResult,
  CreateGroupRoleParams,
  CreateGroupRoleResult,
  DeleteCommandParams,
  DeleteCommandResult,
  DeleteGroupCategoryParams,
  DeleteGroupCategoryResult,
  DeleteGroupChannelParams,
  DeleteGroupChannelResult,
  DeleteGroupRoleParams,
  DeleteGroupRoleResult,
  DeleteMessageParams,
  DeleteMessageResult,
  GetBotCommandsParams,
  GetBotCommandsResult,
  GetChannelMessagesParams,
  GetChannelMessagesResult,
  GetGroupCategoriesParams,
  GetGroupCategoriesResult,
  GetGroupCategoryParams,
  GetGroupCategoryResult,
  GetGroupChannelParams,
  GetGroupChannelResult,
  GetGroupChannelsParams,
  GetGroupChannelsResult,
  GetGroupParams,
  GetGroupResult,
  GetGroupRolesParams,
  GetGroupRolesResult,
  GetGroupUsersParams,
  GetGroupUsersResult,
  GetMeParams,
  GetMeResult,
  GetMyGroupsResult,
  GetUserParams,
  GetUserResult,
  JoinVoiceChannelParams,
  JoinVoiceChannelResult,
  KickUserParams,
  KickUserResult,
  LeaveVoiceChannelParams,
  LeaveVoiceChannelResult,
  ReactionParams,
  ReactionResult,
  RegisterCommandParams,
  RegisterCommandResult,
  RespondToInteractionParams,
  RespondToInteractionResult,
  RoleAssignmentParams,
  RoleAssignmentResult,
  SendInteractionFollowupParams,
  SendInteractionFollowupResult,
  SendMessageParams,
  SetStatusParams,
  SetStatusResult,
  SetTypingParams,
  SetTypingResult,
  Transport,
  TypingParams,
  TypingResult,
  UpdateCommandParams,
  UpdateCommandResult,
  UpdateGroupCategoryParams,
  UpdateGroupCategoryResult,
  UpdateGroupChannelParams,
  UpdateGroupChannelResult,
  UpdateGroupRoleParams,
  UpdateGroupRoleResult,
  UpdateMessageParams,
  UpdateMessageResult,
} from "./transport";

import type { MessageInfo } from "../gen/bots_pb";
import {
  BotTypingRequestSchema,
  BotsApi,
  CreateCategoryRequestSchema,
  CreateChannelRequestSchema,
  CreateRoleRequestSchema,
  DeleteCategoryRequestSchema,
  DeleteChannelRequestSchema,
  DeleteMessageRequestSchema,
  DeleteRoleRequestSchema,
  GetCategoryRequestSchema,
  GetChannelMessagesRequestSchema,
  GetChannelRequestSchema,
  GetGroupRequestSchema,
  GetGroupRolesRequestSchema,
  GetGroupUsersRequestSchema,
  GetUserRequestSchema,
  JoinVoiceChannelRequestSchema,
  KickUserRequestSchema,
  LeaveVoiceChannelRequestSchema,
  ReactionRequestSchema,
  RespondToInteractionRequestSchema,
  RoleAssignmentRequestSchema,
  SendInteractionFollowupRequestSchema,
  SendMessageRequestSchema,
  SetStatusRequestSchema,
  TypingRequestSchema,
  UpdateCategoryRequestSchema,
  UpdateChannelRequestSchema,
  UpdateMessageRequestSchema,
  UpdateRoleRequestSchema,
} from "../gen/bots_pb";
import {
  DeleteCommandRequestSchema,
  GetBotCommandsRequestSchema,
  InteractionsApi,
  RegisterCommandRequestSchema,
  UpdateCommandRequestSchema,
} from "../gen/interactions_pb";
import type { ClientOptions } from "../types";

export class GrpcBotsTransport implements Transport {
  private readonly botsClient: ConnectClient<typeof BotsApi>;
  private readonly interactionsClient: ConnectClient<typeof InteractionsApi>;

  constructor(options: ClientOptions) {
    if (!options.baseUrl) {
      throw new Error("Voice Client: `baseUrl` is required for the gRPC transport.");
    }

    const transport = createGrpcTransport({
      baseUrl: options.baseUrl,
      interceptors: [createTokenInterceptor(options.token)],
    });

    this.botsClient = createClient(BotsApi, transport);
    this.interactionsClient = createClient(InteractionsApi, transport);
  }

  async addReaction(params: ReactionParams): Promise<ReactionResult> {
    return await this.botsClient.addReaction(create(ReactionRequestSchema, params));
  }

  async assignRole(params: RoleAssignmentParams): Promise<RoleAssignmentResult> {
    return await this.botsClient.assignRole(create(RoleAssignmentRequestSchema, params));
  }

  async createCategory(params: CreateGroupCategoryParams): Promise<CreateGroupCategoryResult> {
    return await this.botsClient.createCategory(create(CreateCategoryRequestSchema, params));
  }

  async createChannel(params: CreateGroupChannelParams): Promise<CreateGroupChannelResult> {
    return await this.botsClient.createChannel(create(CreateChannelRequestSchema, params));
  }

  async createRole(params: CreateGroupRoleParams): Promise<CreateGroupRoleResult> {
    return await this.botsClient.createRole(create(CreateRoleRequestSchema, params));
  }

  async deleteCategory(params: DeleteGroupCategoryParams): Promise<DeleteGroupCategoryResult> {
    return await this.botsClient.deleteCategory(create(DeleteCategoryRequestSchema, params));
  }

  async deleteChannel(params: DeleteGroupChannelParams): Promise<DeleteGroupChannelResult> {
    return await this.botsClient.deleteChannel(create(DeleteChannelRequestSchema, params));
  }

  async deleteMessage(params: DeleteMessageParams): Promise<DeleteMessageResult> {
    return await this.botsClient.deleteMessage(create(DeleteMessageRequestSchema, params));
  }

  async deleteRole(params: DeleteGroupRoleParams): Promise<DeleteGroupRoleResult> {
    return await this.botsClient.deleteRole(create(DeleteRoleRequestSchema, params));
  }

  async getCategory(params: GetGroupCategoryParams): Promise<GetGroupCategoryResult> {
    return await this.botsClient.getCategory(create(GetCategoryRequestSchema, params));
  }

  async getChannel(params: GetGroupChannelParams): Promise<GetGroupChannelResult> {
    return await this.botsClient.getChannel(create(GetChannelRequestSchema, params));
  }

  async getChannelMessages(params: GetChannelMessagesParams): Promise<GetChannelMessagesResult> {
    return await this.botsClient.getChannelMessages(
      create(GetChannelMessagesRequestSchema, params),
    );
  }

  async getGroup(params: GetGroupParams): Promise<GetGroupResult> {
    return await this.botsClient.getGroup(create(GetGroupRequestSchema, params));
  }

  async getGroupCategories(params: GetGroupCategoriesParams): Promise<GetGroupCategoriesResult> {
    return await this.botsClient.getGroupCategories(create(GetGroupRequestSchema, params));
  }

  async getGroupChannels(params: GetGroupChannelsParams): Promise<GetGroupChannelsResult> {
    return await this.botsClient.getGroupChannels(create(GetGroupRequestSchema, params));
  }

  async getGroupRoles(params: GetGroupRolesParams): Promise<GetGroupRolesResult> {
    return await this.botsClient.getGroupRoles(create(GetGroupRolesRequestSchema, params));
  }

  async getGroupUsers(params: GetGroupUsersParams): Promise<GetGroupUsersResult> {
    return await this.botsClient.getGroupUsers(create(GetGroupUsersRequestSchema, params));
  }

  async getMe(params: GetMeParams): Promise<GetMeResult> {
    return await this.botsClient.getMe(create(EmptySchema, params));
  }

  async getMyGroups(): Promise<GetMyGroupsResult> {
    return await this.botsClient.getMyGroups({});
  }

  async getUser(params: GetUserParams): Promise<GetUserResult> {
    return await this.botsClient.getUser(create(GetUserRequestSchema, params));
  }

  async joinVoiceChannel(params: JoinVoiceChannelParams): Promise<JoinVoiceChannelResult> {
    return await this.botsClient.joinVoiceChannel(create(JoinVoiceChannelRequestSchema, params));
  }

  async kickUser(params: KickUserParams): Promise<KickUserResult> {
    return await this.botsClient.kickUser(create(KickUserRequestSchema, params));
  }

  async leaveVoiceChannel(params: LeaveVoiceChannelParams): Promise<LeaveVoiceChannelResult> {
    return await this.botsClient.leaveVoiceChannel(create(LeaveVoiceChannelRequestSchema, params));
  }

  async removeReaction(params: ReactionParams): Promise<ReactionResult> {
    return await this.botsClient.removeReaction(create(ReactionRequestSchema, params));
  }

  async removeRole(params: RoleAssignmentParams): Promise<RoleAssignmentResult> {
    return await this.botsClient.removeRole(create(RoleAssignmentRequestSchema, params));
  }

  async respondToInteraction(
    params: RespondToInteractionParams,
  ): Promise<RespondToInteractionResult> {
    return await this.botsClient.respondToInteraction(
      create(RespondToInteractionRequestSchema, params),
    );
  }

  async sendInteractionFollowup(
    params: SendInteractionFollowupParams,
  ): Promise<SendInteractionFollowupResult> {
    return await this.botsClient.sendInteractionFollowup(
      create(SendInteractionFollowupRequestSchema, params),
    );
  }

  async registerCommand(params: RegisterCommandParams): Promise<RegisterCommandResult> {
    return await this.interactionsClient.registerCommand(
      create(RegisterCommandRequestSchema, params),
    );
  }

  async updateCommand(params: UpdateCommandParams): Promise<UpdateCommandResult> {
    return await this.interactionsClient.updateCommand(create(UpdateCommandRequestSchema, params));
  }

  async deleteCommand(params: DeleteCommandParams): Promise<DeleteCommandResult> {
    return await this.interactionsClient.deleteCommand(create(DeleteCommandRequestSchema, params));
  }

  async getBotCommands(params: GetBotCommandsParams): Promise<GetBotCommandsResult> {
    return await this.interactionsClient.getBotCommands(
      create(GetBotCommandsRequestSchema, params),
    );
  }

  async sendMessage(params: SendMessageParams): Promise<MessageInfo> {
    return await this.botsClient.sendMessage(create(SendMessageRequestSchema, params));
  }

  async setStatus(params: SetStatusParams): Promise<SetStatusResult> {
    return await this.botsClient.setStatus(create(SetStatusRequestSchema, params));
  }

  async setTyping(params: SetTypingParams): Promise<SetTypingResult> {
    return await this.botsClient.setTyping(create(BotTypingRequestSchema, params));
  }

  async typing(params: TypingParams): Promise<TypingResult> {
    return await this.botsClient.typing(create(TypingRequestSchema, params));
  }

  async updateCategory(params: UpdateGroupCategoryParams): Promise<UpdateGroupCategoryResult> {
    return await this.botsClient.updateCategory(create(UpdateCategoryRequestSchema, params));
  }

  async updateChannel(params: UpdateGroupChannelParams): Promise<UpdateGroupChannelResult> {
    return await this.botsClient.updateChannel(create(UpdateChannelRequestSchema, params));
  }

  async updateMessage(params: UpdateMessageParams): Promise<UpdateMessageResult> {
    return await this.botsClient.updateMessage(create(UpdateMessageRequestSchema, params));
  }

  async updateRole(params: UpdateGroupRoleParams): Promise<UpdateGroupRoleResult> {
    return await this.botsClient.updateRole(create(UpdateRoleRequestSchema, params));
  }
}

function createTokenInterceptor(token: string): Interceptor {
  return (next) => (req) => {
    req.header.set("Authorization", `Bearer ${token}`);
    return next(req);
  };
}
