import type {
  GatewayGroupPayload,
  GatewayMessage,
  MessageAttachment,
  MessageAuthor,
} from "./events";
import type { MessageInfo } from "./gen/bots_pb";
import type { BotTypingState } from "./gen/common_pb";
import type {
  CreateGroupCategoryResult,
  CreateGroupChannelResult,
  CreateGroupRoleResult,
  DeleteGroupCategoryResult,
  DeleteGroupChannelResult,
  DeleteGroupRoleResult,
  DeleteMessageResult,
  GetChannelMessagesResult,
  GetGroupCategoriesResult,
  GetGroupChannelResult,
  GetGroupChannelsResult,
  GetGroupResult,
  GetGroupRolesResult,
  GetGroupUsersResult,
  GetMeParams,
  GetMeResult,
  GetMyGroupsResult,
  GetUserResult,
  JoinVoiceChannelResult,
  KickUserResult,
  LeaveVoiceChannelResult,
  ReactionResult,
  RoleAssignmentResult,
  SetTypingResult,
  Transport,
  TypingResult,
  UpdateGroupCategoryResult,
  UpdateGroupChannelResult,
  UpdateGroupRoleResult,
} from "./transport";

export interface UpdateContext {
  message: GatewayMessage;
  group: Omit<GatewayGroupPayload, "payloadJson">;
}

export class Context {
  readonly update: UpdateContext;
  private readonly transport: Transport;

  constructor(update: UpdateContext, transport: Transport) {
    this.update = update;
    this.transport = transport;
  }

  get attachments(): MessageAttachment[] {
    return this.update.message.attachments;
  }

  get author(): MessageAuthor {
    return this.update.message.author;
  }

  get authorId(): string {
    return this.update.message.authorId;
  }

  get channelId(): string {
    return this.update.message.channelId;
  }

  get componentsJson(): string | null {
    return this.update.message.componentsJson;
  }

  get group(): UpdateContext["group"] {
    return this.update.group;
  }

  get interactionCommandName(): string | null {
    return this.update.message.interactionCommandName;
  }

  get interactionId(): string | null {
    return this.update.message.interactionId;
  }

  get interactionUserId(): string | null {
    return this.update.message.interactionUserId;
  }

  get isInteraction(): boolean {
    return this.update.message.interactionId !== null;
  }

  get message(): UpdateContext["message"] {
    return this.update.message;
  }

  get messageId(): string {
    return this.update.message.id;
  }

  get reactions(): Record<string, string[]> {
    return this.update.message.reactions;
  }

  get replyTo(): string | null {
    return this.update.message.replyTo;
  }

  get text(): string {
    return this.update.message.content;
  }

  addReaction(emoji: string, messageId: string = this.message.id): Promise<ReactionResult> {
    return this.transport.addReaction({ messageId, emoji });
  }

  assignRole(groupId: string, roleId: string, targetUserId: string): Promise<RoleAssignmentResult> {
    return this.transport.assignRole({ groupId, roleId, targetUserId });
  }

  createCategory(groupId: string, name: string): Promise<CreateGroupCategoryResult> {
    return this.transport.createCategory({ groupId, name });
  }

  createChannel(categoryId: string, type: number, name: string): Promise<CreateGroupChannelResult> {
    return this.transport.createChannel({ categoryId, type, name });
  }

  createRole(
    groupId: string,
    name: string,
    permissions: bigint,
    color?: string,
  ): Promise<CreateGroupRoleResult> {
    return this.transport.createRole({ name, groupId, permissions, color });
  }

  deleteCategory(categoryId: string): Promise<DeleteGroupCategoryResult> {
    return this.transport.deleteCategory({ categoryId });
  }

  deleteChannel(channelId: string): Promise<DeleteGroupChannelResult> {
    return this.transport.deleteChannel({ channelId });
  }

  deleteMessage(messageId: string): Promise<DeleteMessageResult> {
    return this.transport.deleteMessage({ messageId });
  }

  deleteRole(roleId: string): Promise<DeleteGroupRoleResult> {
    return this.transport.deleteRole({ roleId });
  }

  getChannel(channelId: string): Promise<GetGroupChannelResult> {
    return this.transport.getChannel({ channelId });
  }

  getChannelMessages(
    channelId: string,
    beforeId?: string,
    limit?: number,
  ): Promise<GetChannelMessagesResult> {
    return this.transport.getChannelMessages({ channelId, beforeId, limit });
  }

  getGroup(groupId: string): Promise<GetGroupResult> {
    return this.transport.getGroup({ groupId });
  }

  getGroupCategories(groupId: string): Promise<GetGroupCategoriesResult> {
    return this.transport.getGroupCategories({ groupId });
  }

  getGroupChannels(groupId: string): Promise<GetGroupChannelsResult> {
    return this.transport.getGroupChannels({ groupId });
  }

  getGroupRoles(groupId: string): Promise<GetGroupRolesResult> {
    return this.transport.getGroupRoles({ groupId });
  }

  getGroupUsers(groupId: string): Promise<GetGroupUsersResult> {
    return this.transport.getGroupUsers({ groupId });
  }

  getMe(params: GetMeParams = {}): Promise<GetMeResult> {
    return this.transport.getMe(params);
  }

  getMyGroups(): Promise<GetMyGroupsResult> {
    return this.transport.getMyGroups();
  }

  getUser(userId: string): Promise<GetUserResult> {
    return this.transport.getUser({ userId });
  }

  joinVoiceChannel(): Promise<JoinVoiceChannelResult> {
    return this.transport.joinVoiceChannel({
      channelId: this.channelId,
    });
  }

  kickUser(groupId: string, userId: string): Promise<KickUserResult> {
    return this.transport.kickUser({ groupId, userId });
  }

  leaveVoiceChannel(): Promise<LeaveVoiceChannelResult> {
    return this.transport.leaveVoiceChannel({ channelId: this.channelId });
  }

  removeReaction(emoji: string, messageId: string = this.message.id): Promise<ReactionResult> {
    return this.transport.removeReaction({ messageId, emoji });
  }

  removeRole(groupId: string, roleId: string, targetUserId: string): Promise<RoleAssignmentResult> {
    return this.transport.removeRole({ groupId, roleId, targetUserId });
  }

  sendMessage(content: string): Promise<MessageInfo> {
    return this.transport.sendMessage({
      content,
      channelId: this.channelId,
      replyTo: this.update.message.id,
    });
  }

  setTyping(state: BotTypingState): Promise<SetTypingResult> {
    return this.transport.setTyping({ channelId: this.channelId, state });
  }

  typing(isTyping: boolean): Promise<TypingResult> {
    return this.transport.typing({ channelId: this.channelId, isTyping });
  }

  updateCategory(categoryId: string, name: string): Promise<UpdateGroupCategoryResult> {
    return this.transport.updateCategory({ categoryId, name });
  }

  updateChannel(channelId: string, name: string): Promise<UpdateGroupChannelResult> {
    return this.transport.updateChannel({ channelId, name });
  }

  updateMessage(messageId: string, content: string): Promise<MessageInfo> {
    return this.transport.updateMessage({ content, messageId });
  }

  updateRole(
    roleId: string,
    name: string,
    permissions: bigint,
    color?: string,
  ): Promise<UpdateGroupRoleResult> {
    return this.transport.updateRole({ roleId, name, permissions, color });
  }
}
