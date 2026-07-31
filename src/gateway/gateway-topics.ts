export const GatewayTopics = {
  chatEvents: "chat-events",
  channelEvents: "channel-events",
  groupEvents: "group-events",
  interactionEvents: "interaction-events",
} as const;

export type GatewayTopic = ValueOf<typeof GatewayTopics>;

export const ALL_GATEWAY_TOPICS: readonly GatewayTopic[] = Object.values(GatewayTopics);
