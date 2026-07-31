import type { MessageInitShape } from "@bufbuild/protobuf";
import type { EmptySchema } from "@bufbuild/protobuf/wkt";

import type {
  BotCategoryInfo,
  BotChannelDetails,
  BotChannelInfo,
  BotGroupDetails,
  BotRole,
  GetGroupRolesResponse,
  GetGroupUsersResponse,
  MessageInfo,
} from "../gen/bots_pb";
import {
  BotCategoryInfoSchema,
  BotChannelInfoSchema,
  BotTypingRequestSchema,
  CreateCategoryRequestSchema,
  CreateChannelRequestSchema,
  CreateRoleRequestSchema,
  DeleteCategoryRequestSchema,
  DeleteCategoryResponseSchema,
  DeleteChannelRequestSchema,
  DeleteChannelResponseSchema,
  DeleteMessageRequestSchema,
  DeleteMessageResponseSchema,
  DeleteRoleRequestSchema,
  GetCategoryRequestSchema,
  GetChannelMessagesRequestSchema,
  GetChannelMessagesResponseSchema,
  GetChannelRequestSchema,
  GetGroupCategoriesResponseSchema,
  GetGroupChannelsResponseSchema,
  GetGroupRequestSchema,
  GetGroupRolesRequestSchema,
  GetGroupUsersRequestSchema,
  GetMyGroupsResponseSchema,
  GetUserRequestSchema,
  JoinVoiceChannelRequestSchema,
  JoinVoiceChannelResponseSchema,
  KickUserRequestSchema,
  KickUserResponseSchema,
  LeaveVoiceChannelRequestSchema,
  ReactionRequestSchema,
  RoleAssignmentRequestSchema,
  SendMessageRequestSchema,
  SetStatusRequestSchema,
  TypingRequestSchema,
  UpdateCategoryRequestSchema,
  UpdateChannelRequestSchema,
  UpdateMessageRequestSchema,
  UpdateRoleRequestSchema,
} from "../gen/bots_pb";
import type { BotSchema, UserSchema } from "../gen/common_pb.ts";

// Профиль и статус
export type GetMeParams = MessageInitShape<typeof EmptySchema>;
export type GetMeResult = MessageInitShape<typeof BotSchema>;
export type SetStatusParams = MessageInitShape<typeof SetStatusRequestSchema>;
export type SetStatusResult = MessageInitShape<typeof EmptySchema>;
export type KickUserParams = MessageInitShape<typeof KickUserRequestSchema>;
export type KickUserResult = MessageInitShape<typeof KickUserResponseSchema>;
export type GetUserParams = MessageInitShape<typeof GetUserRequestSchema>;
export type GetUserResult = MessageInitShape<typeof UserSchema>;

export type ProfileTransport = {
  getMe(params: GetMeParams): Promise<GetMeResult>;
  getUser(params: GetUserParams): Promise<GetUserResult>;
  setStatus(params: SetStatusParams): Promise<SetStatusResult>;
  kickUser(params: KickUserParams): Promise<KickUserResult>;
};

// Сообщения
export type SendMessageParams = MessageInitShape<typeof SendMessageRequestSchema>;
export type SendMessageResult = MessageInfo;
export type UpdateMessageParams = MessageInitShape<typeof UpdateMessageRequestSchema>;
export type UpdateMessageResult = MessageInfo;
export type DeleteMessageParams = MessageInitShape<typeof DeleteMessageRequestSchema>;
export type DeleteMessageResult = MessageInitShape<typeof DeleteMessageResponseSchema>;
export type TypingParams = MessageInitShape<typeof TypingRequestSchema>;
export type TypingResult = MessageInitShape<typeof EmptySchema>;
export type SetTypingParams = MessageInitShape<typeof BotTypingRequestSchema>;
export type SetTypingResult = MessageInitShape<typeof EmptySchema>;
export type ReactionParams = MessageInitShape<typeof ReactionRequestSchema>;
export type ReactionResult = MessageInfo;

export type MessageTransport = {
  sendMessage(params: SendMessageParams): Promise<SendMessageResult>;
  updateMessage(params: UpdateMessageParams): Promise<UpdateMessageResult>;
  deleteMessage(params: DeleteMessageParams): Promise<DeleteMessageResult>;
  typing(params: TypingParams): Promise<TypingResult>;
  setTyping(params: SetTypingParams): Promise<SetTypingResult>;
  addReaction(params: ReactionParams): Promise<ReactionResult>;
  removeReaction(params: ReactionParams): Promise<ReactionResult>;
};

// Голос
export type JoinVoiceChannelParams = MessageInitShape<typeof JoinVoiceChannelRequestSchema>;
export type JoinVoiceChannelResult = MessageInitShape<typeof JoinVoiceChannelResponseSchema>;
export type LeaveVoiceChannelParams = MessageInitShape<typeof LeaveVoiceChannelRequestSchema>;
export type LeaveVoiceChannelResult = MessageInitShape<typeof EmptySchema>;
export type VoiceTransport = {
  joinVoiceChannel(params: JoinVoiceChannelParams): Promise<JoinVoiceChannelResult>;
  leaveVoiceChannel(params: LeaveVoiceChannelParams): Promise<LeaveVoiceChannelResult>;
};

// Группы, каналы и роли (intent Guilds)
export type GetMyGroupsResult = MessageInitShape<typeof GetMyGroupsResponseSchema>;
export type GetGroupParams = MessageInitShape<typeof GetGroupRequestSchema>;
export type GetGroupResult = BotGroupDetails;
export type GetGroupUsersParams = MessageInitShape<typeof GetGroupUsersRequestSchema>;
export type GetGroupUsersResult = GetGroupUsersResponse;
export type GetGroupRolesParams = MessageInitShape<typeof GetGroupRolesRequestSchema>;
export type GetGroupRolesResult = GetGroupRolesResponse;
export type GetGroupCategoriesParams = MessageInitShape<typeof GetGroupRequestSchema>;
export type GetGroupCategoriesResult = MessageInitShape<typeof GetGroupCategoriesResponseSchema>;
export type GetGroupChannelParams = MessageInitShape<typeof GetChannelRequestSchema>;
export type GetGroupChannelResult = BotChannelDetails;
export type GetGroupCategoryParams = MessageInitShape<typeof GetCategoryRequestSchema>;
export type GetGroupCategoryResult = MessageInitShape<typeof BotCategoryInfoSchema>;
export type CreateGroupCategoryParams = MessageInitShape<typeof CreateCategoryRequestSchema>;
export type CreateGroupCategoryResult = BotCategoryInfo;
export type CreateGroupChannelParams = MessageInitShape<typeof CreateChannelRequestSchema>;
export type CreateGroupChannelResult = BotChannelInfo;
export type CreateGroupRoleParams = MessageInitShape<typeof CreateRoleRequestSchema>;
export type CreateGroupRoleResult = BotRole;
export type UpdateGroupRoleParams = MessageInitShape<typeof UpdateRoleRequestSchema>;
export type UpdateGroupRoleResult = BotRole;
export type UpdateGroupCategoryParams = MessageInitShape<typeof UpdateCategoryRequestSchema>;
export type UpdateGroupCategoryResult = MessageInitShape<typeof BotCategoryInfoSchema>;
export type UpdateGroupChannelParams = MessageInitShape<typeof UpdateChannelRequestSchema>;
export type UpdateGroupChannelResult = MessageInitShape<typeof BotChannelInfoSchema>;
export type DeleteGroupRoleParams = MessageInitShape<typeof DeleteRoleRequestSchema>;
export type DeleteGroupRoleResult = MessageInitShape<typeof EmptySchema>;
export type DeleteGroupChannelParams = MessageInitShape<typeof DeleteChannelRequestSchema>;
export type DeleteGroupChannelResult = MessageInitShape<typeof DeleteChannelResponseSchema>;
export type DeleteGroupCategoryParams = MessageInitShape<typeof DeleteCategoryRequestSchema>;
export type DeleteGroupCategoryResult = MessageInitShape<typeof DeleteCategoryResponseSchema>;
export type RoleAssignmentParams = MessageInitShape<typeof RoleAssignmentRequestSchema>;
export type RoleAssignmentResult = MessageInitShape<typeof EmptySchema>;
export type GetChannelMessagesParams = MessageInitShape<typeof GetChannelMessagesRequestSchema>;
export type GetChannelMessagesResult = MessageInitShape<typeof GetChannelMessagesResponseSchema>;
export type GetGroupChannelsParams = MessageInitShape<typeof GetGroupRequestSchema>;
export type GetGroupChannelsResult = MessageInitShape<typeof GetGroupChannelsResponseSchema>;

export type GroupOrChannelOrRolesTransport = {
  getMyGroups(): Promise<GetMyGroupsResult>;
  getGroup(params: GetGroupParams): Promise<GetGroupResult>;
  getGroupCategories(params: GetGroupCategoriesParams): Promise<GetGroupCategoriesResult>;
  getGroupUsers(params: GetGroupUsersParams): Promise<GetGroupUsersResult>;
  getGroupRoles(params: GetGroupRolesParams): Promise<GetGroupRolesResult>;

  getCategory(params: GetGroupCategoryParams): Promise<GetGroupCategoryResult>;
  createCategory(params: CreateGroupCategoryParams): Promise<CreateGroupCategoryResult>;
  updateCategory(params: UpdateGroupCategoryParams): Promise<UpdateGroupCategoryResult>;
  deleteCategory(params: DeleteGroupCategoryParams): Promise<DeleteGroupCategoryResult>;

  getChannel(params: GetGroupChannelParams): Promise<GetGroupChannelResult>;
  createChannel(params: CreateGroupChannelParams): Promise<CreateGroupChannelResult>;
  updateChannel(params: UpdateGroupChannelParams): Promise<UpdateGroupChannelResult>;
  deleteChannel(params: DeleteGroupChannelParams): Promise<DeleteGroupChannelResult>;
  getGroupChannels(params: GetGroupChannelsParams): Promise<GetGroupChannelsResult>;
  getChannelMessages(params: GetChannelMessagesParams): Promise<GetChannelMessagesResult>;

  createRole(params: CreateGroupRoleParams): Promise<CreateGroupRoleResult>;
  updateRole(params: UpdateGroupRoleParams): Promise<UpdateGroupRoleResult>;
  deleteRole(params: DeleteGroupRoleParams): Promise<DeleteGroupRoleResult>;
  assignRole(params: RoleAssignmentParams): Promise<RoleAssignmentResult>;
  removeRole(params: RoleAssignmentParams): Promise<RoleAssignmentResult>;
};

export type Transport = ProfileTransport &
  MessageTransport &
  VoiceTransport &
  GroupOrChannelOrRolesTransport;

export type { MessageInfo };
