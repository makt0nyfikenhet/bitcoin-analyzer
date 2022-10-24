// Constants
export const ACTIONS = {
  UNSUBSCRIBE: "UNSUBSCRIBE",
  SUBSCRIBE: "SUBSCRIBE",
};
export const OBSERVABLES = {
  BITCOIN_ANALYZER: "BITCOIN_ANALYZER",
};
// Types
type TActionType = keyof typeof ACTIONS;
type TObservableType = keyof typeof OBSERVABLES;
export type TMessageData = {
  action: TActionType;
  observable: TObservableType;
  // payload: Object;
};
// Interfaces
export interface IMessageProps {
  data: TMessageData;
  port: MessagePort;
}
