// Models
import { BitcoinFearAndGreedIndex, BitcoinPrice } from "@/models";
// Constants
export const ANALYZER_STRATEGIES = {
  S8020_FEAR_GREED_INDEX: "S8020_FEAR_GREED_INDEX",
};
// Types
export type TAnalyzerStrategy = keyof typeof ANALYZER_STRATEGIES;
export type TBitcoinAction = "buy" | "sell" | "hold" | undefined;
export type TFearAndGreedMetadata = {
  error: Error | null;
};
// Interfaces
export interface IBitcoinPriceResponse {
  symbol: string;
  price_24h: number;
  volume_24h: number;
  last_trade_price: number;
}
export interface IFearAndGreedDataResponse {
  value: string;
  value_classification: string;
  timestamp: string;
  time_until_update: string;
}
export interface IBitcoinSample {
  _id?: string;
  _rev?: string;
  price: BitcoinPrice;
  fearAndGreedIndex: BitcoinFearAndGreedIndex;
  action: TBitcoinAction;
}
export interface IAnalyzerStrategy {
  strategy: TAnalyzerStrategy;
  price: BitcoinPrice;
  fearAndGreedIndex: BitcoinFearAndGreedIndex;
  sampleHistory: IBitcoinSample[];
}
