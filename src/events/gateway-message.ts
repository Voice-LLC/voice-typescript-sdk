import type { UserStatus } from "../gen/common_pb";

export interface MessageAuthor {
  id: string;
  username: string;
  email: string;
  displayName: string | null;
  description: string | null;
  status: string | null;
  preferredLanguage: string | null;
  createdAt: string;
  updatedAt: string;
  lastActivity: string;
  presenceStatus: UserStatus;
  isConfirmed: boolean;
  isBot: boolean;
  subscriptionType: string;
  avatarId: string | null;
  bannerId: string | null;
}

export interface MessageAttachment {
  id: string;
  uploaderId: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
  status: string;
  downloadUrl: string;
  expiresAt: string;
}

export interface GatewayMessage {
  id: string;
  channelId: string;
  content: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  isEdited: boolean;
  isDeleted: boolean;
  replyTo: string | null;
  reactions: Record<string, string[]>;
  interactionId: string | null;
  interactionCommandName: string | null;
  interactionUserId: string | null;
  componentsJson: string | null;
  author: MessageAuthor;
  attachments: MessageAttachment[];
}


export interface GatewayGroupPayload {
  messageId?: string | undefined;
  chatId?: string | undefined;
  userId?: string | undefined;
  groupId?: string | undefined;
  type?: string | undefined;
  payloadJson: string;
  timestamp?: number | undefined;
}
