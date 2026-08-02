export const InteractionType = {
  ApplicationCommand: 0,
  MessageComponent: 1,
  ModalSubmit: 2,
  ApplicationCommandAutocomplete: 3,
} as const;

export type InteractionType = ValueOf<typeof InteractionType>;

export interface InteractionData {
  commandName: string | null;
  options: Record<string, string> | null;
  customId: string | null;
  values: string[] | null;
  focusedOption: string | null;
  modalFields: Record<string, string> | null;
}

export interface BotInteractionEvent {
  interactionId: string;
  invokingUserId: string;
  channelId: string;
  groupId: string;
  type: InteractionType;
  data: InteractionData;
}
