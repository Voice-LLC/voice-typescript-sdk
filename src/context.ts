import type { MessageInfo } from "./gen/bots_pb";
import type { BotTypingState } from "./gen/common_pb";
import type { GatewayMessage, MessageAttachment, MessageAuthor, GatewayGroupPayload } from "./events";
import type {
  DeleteMessageResult,
  TypingResult,
  SetTypingResult,
  ReactionResult,
  JoinVoiceChannelResult,
  LeaveVoiceChannelResult,
  GetGroupResult,
  GetMyGroupsResult,
  DeleteGroupCategoryResult,
  DeleteGroupChannelResult,
  GetChannelMessagesResult,
  GetGroupCategoriesResult,
  GetGroupChannelsResult,
  GetMeParams,
  GetMeResult,
  GetUserResult,
  KickUserResult,
  UpdateGroupCategoryResult,
  UpdateGroupChannelResult,
  CreateGroupCategoryResult,
  CreateGroupChannelResult,
  CreateGroupRoleResult,
  DeleteGroupRoleResult,
  GetGroupChannelResult,
  GetGroupRolesResult,
  GetGroupUsersResult,
  RoleAssignmentResult,
  Transport,
  UpdateGroupRoleResult
} from "./transport";

export interface UpdateContext {
  message: GatewayMessage;
  group: Omit<GatewayGroupPayload, 'payloadJson'>;
}

export class Context {
  readonly update: UpdateContext;
  private readonly transport: Transport;

  constructor(update: UpdateContext, transport: Transport) {
    this.update = update;
    this.transport = transport;
  }

  get message(): UpdateContext['message'] {
    return this.update.message;
  }

  get group(): UpdateContext['group'] {
    return this.update.group;
  }

  get messageId(): string {
    return this.update.message.id;
  }

  get channelId(): string {
    return this.update.message.channelId;
  }

  get text(): string {
    return this.update.message.content;
  }

  get author(): MessageAuthor {
    return this.update.message.author;
  }

  get authorId(): string {
    return this.update.message.authorId;
  }

  get attachments(): MessageAttachment[] {
    return this.update.message.attachments;
  }

  get reactions(): Record<string, string[]> {
    return this.update.message.reactions;
  }

  get replyTo(): string | null {
    return this.update.message.replyTo;
  }

  get interactionId(): string | null {
    return this.update.message.interactionId;
  }

  get interactionCommandName(): string | null {
    return this.update.message.interactionCommandName;
  }

  get interactionUserId(): string | null {
    return this.update.message.interactionUserId;
  }

  get componentsJson(): string | null {
    return this.update.message.componentsJson;
  }

  get isInteraction(): boolean {
    return this.update.message.interactionId !== null;
  }

  sendMessage(content: string): Promise<MessageInfo> {
    return this.transport.sendMessage({
      content,
      channelId: this.channelId,
      replyTo: this.update.message.id,
    });
  }

  updateMessage(messageId: string, content: string): Promise<MessageInfo> {
    return this.transport.updateMessage({ content, messageId });
  }

  deleteMessage(messageId: string): Promise<DeleteMessageResult> {
    return this.transport.deleteMessage({ messageId });
  }

  typing(isTyping: boolean): Promise<TypingResult> {
    return this.transport.typing({ channelId: this.channelId, isTyping });
  }

  setTyping(state: BotTypingState): Promise<SetTypingResult> {
    return this.transport.setTyping({ channelId: this.channelId, state });
  }

  addReaction(emoji: string, messageId: string = this.message.id): Promise<ReactionResult> {
    return this.transport.addReaction({ messageId, emoji });
  }

  removeReaction(emoji: string, messageId: string = this.message.id): Promise<ReactionResult> {
    return this.transport.removeReaction({ messageId, emoji });
  }

  joinVoiceChannel(): Promise<JoinVoiceChannelResult> {
    return this.transport.joinVoiceChannel({
      channelId: this.channelId,
    });
  }

  leaveVoiceChannel(): Promise<LeaveVoiceChannelResult> {
    return this.transport.leaveVoiceChannel({
      channelId: this.channelId,
    });
  }

  getMe(params: GetMeParams = {}): Promise<GetMeResult> {
    return this.transport.getMe(params);
  }

  getUser(userId: string): Promise<GetUserResult> {
    return this.transport.getUser({ userId });
  }

  kickUser(groupId: string, userId: string): Promise<KickUserResult> {
    return this.transport.kickUser({ groupId, userId });
  }

  getMyGroups(): Promise<GetMyGroupsResult> {
    return this.transport.getMyGroups();
  }

  getGroup(groupId: string): Promise<GetGroupResult> {
    return this.transport.getGroup({ groupId });
  }

  getGroupUsers(groupId: string): Promise<GetGroupUsersResult> {
    return this.transport.getGroupUsers({ groupId });
  }

  getGroupRoles(groupId: string): Promise<GetGroupRolesResult> {
    return this.transport.getGroupRoles({ groupId });
  }


  getGroupCategories(groupId: string): Promise<GetGroupCategoriesResult> {
    return this.transport.getGroupCategories({ groupId });
  }

  getChannel(channelId: string): Promise<GetGroupChannelResult> {
    return this.transport.getChannel({ channelId });
  }

  createCategory(groupId: string, name: string): Promise<CreateGroupCategoryResult> {
    return this.transport.createCategory({ groupId, name });
  }

  updateCategory(categoryId: string, name: string): Promise<UpdateGroupCategoryResult> {
    return this.transport.updateCategory({ categoryId, name });
  }

  deleteCategory(categoryId: string): Promise<DeleteGroupCategoryResult> {
    return this.transport.deleteCategory({ categoryId });
  }

  createChannel(categoryId: string, type: number, name: string): Promise<CreateGroupChannelResult> {
    return this.transport.createChannel({ categoryId, type, name });
  }

  updateChannel(channelId: string, name: string): Promise<UpdateGroupChannelResult> {
    return this.transport.updateChannel({ channelId, name });
  }

  deleteChannel(channelId: string): Promise<DeleteGroupChannelResult> {
    return this.transport.deleteChannel({ channelId });
  }

  createRole(groupId: string, name: string, permissions: bigint, color?: string): Promise<CreateGroupRoleResult> {
    return this.transport.createRole({ name, groupId, permissions, color });
  }

  updateRole(roleId: string, name: string, permissions: bigint, color?: string): Promise<UpdateGroupRoleResult> {
    return this.transport.updateRole({ roleId, name, permissions, color });
  }

  deleteRole(roleId: string): Promise<DeleteGroupRoleResult> {
    return this.transport.deleteRole({ roleId });
  }

  assignRole(groupId: string, roleId: string, targetUserId: string): Promise<RoleAssignmentResult> {
    return this.transport.assignRole({ groupId, roleId, targetUserId });
  }

  removeRole(groupId: string, roleId: string, targetUserId: string): Promise<RoleAssignmentResult> {
    return this.transport.removeRole({ groupId, roleId, targetUserId });
  }

  getChannelMessages(channelId: string, beforeId?: string, limit?: number): Promise<GetChannelMessagesResult> {
    return this.transport.getChannelMessages({ channelId, beforeId, limit });
  }

  getGroupChannels(groupId: string): Promise<GetGroupChannelsResult> {
    return this.transport.getGroupChannels({ groupId });
  }
}
