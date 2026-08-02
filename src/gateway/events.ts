import type { GatewayTopic } from "./gateway-topics";
import { GatewayTopics } from "./gateway-topics";

import type { UpdateContext } from "../context";
import type { BotInteractionEvent, GatewayGroupPayload, GatewayMessage } from "../events";
import { camelizeKeys, parseJson } from "../utils";

export function createUpdateContext(
  topic: GatewayTopic,
  payloadRaw: unknown,
): UpdateContext | null {
  if (payloadRaw === null || typeof payloadRaw !== "object") {
    return null;
  }

  const { payloadJson, ...payloadRest } = payloadRaw as Partial<GatewayGroupPayload>;

  switch (topic) {
    case GatewayTopics.chatEvents:
      return createMessageContext(payloadJson, payloadRest);
    case GatewayTopics.interactionEvents:
      return createInteractionContext(payloadJson, payloadRest);
    default:
      return null;
  }
}

function createMessageContext(
  payloadJson: string | undefined,
  group: Omit<GatewayGroupPayload, "payloadJson">,
): UpdateContext | null {
  if (group.type !== "MessageCreated") {
    return null;
  }

  const message = camelizeKeys(parseJson(payloadJson ?? "")) as GatewayMessage | undefined;
  if (!message?.channelId) return null;

  return { message, group };
}

function createInteractionContext(
  payloadJson: string | undefined,
  group: Omit<GatewayGroupPayload, "payloadJson">,
): UpdateContext | null {
  if (group.type !== "InteractionCreated") {
    return null;
  }

  const interaction = camelizeKeys(parseJson(payloadJson ?? "")) as BotInteractionEvent | undefined;
  if (!interaction?.interactionId) return null;

  return { interaction, group };
}
