import type { GatewayTopic } from "./gateway-topics";
import { GatewayTopics } from "./gateway-topics";

import type { UpdateContext } from "../context";
import type { GatewayGroupPayload, GatewayMessage } from "../events";
import { camelizeKeys, parseJson } from "../utils";

export function createUpdateContext(
  topic: GatewayTopic,
  payloadRaw: unknown,
): UpdateContext | null {
  if (topic !== GatewayTopics.chatEvents) {
    return null;
  }

  if (payloadRaw === null || typeof payloadRaw !== "object") {
    return null;
  }

  const { payloadJson, ...payloadRest } = payloadRaw as Partial<GatewayGroupPayload>;

  if (payloadRest.type !== "MessageCreated") {
    return null;
  }

  const payload = camelizeKeys(parseJson(payloadJson ?? "")) as GatewayMessage | undefined;
  if (!payload?.channelId) return null;

  return { message: payload, group: payloadRest };
}
