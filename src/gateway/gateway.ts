import type { UpdateContext } from "../context";

export type GatewayUpdateHandler = (context: UpdateContext) => void | Promise<void>;
export type GatewayErrorHandler = (error: Error) => void;

export interface Gateway {
  start(): Promise<void>;
  stop(): Promise<void>;
  onUpdate(handler: GatewayUpdateHandler): void;
  onError(handler: GatewayErrorHandler): void;
}
