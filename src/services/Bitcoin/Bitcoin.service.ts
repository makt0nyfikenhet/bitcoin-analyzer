// Decorators
import { sendErrorHandler } from "@/decorators";
// Types
import { IBitcoinPriceResponse, IFearAndGreedDataResponse } from "@/types";
// Models
import {
  BitcoinPrice,
  BitcoinFearAndGreedData,
  BitcoinFearAndGreedIndex,
} from "@/models";

const BASE = {
  BLOCKCHAIN_API: "https://api.blockchain.com/v3",
  ALTERNATIVES: "https://api.alternative.me",
};

const ENDPOINTS = {
  BITCOIN_PRICE: `${BASE.BLOCKCHAIN_API}/exchange/tickers/BTC-USD`,
  FEAR_AND_GREED_INDEX: `${BASE.ALTERNATIVES}/fng/`,
};

class BitcoinService {
  @sendErrorHandler()
  async getCurrentPrice(): Promise<BitcoinPrice> {
    return fetch(ENDPOINTS.BITCOIN_PRICE)
      .then((res) => res.json())
      .then((res: IBitcoinPriceResponse) => new BitcoinPrice(res));
  }

  @sendErrorHandler()
  async getFearAndGreedIndex(): Promise<BitcoinFearAndGreedIndex> {
    return fetch(ENDPOINTS.FEAR_AND_GREED_INDEX)
      .then((res) => res.json())
      .then((res) => ({
        ...res,
        data: res.data.map(
          (item: IFearAndGreedDataResponse) => new BitcoinFearAndGreedData(item)
        ),
      }));
  }
}

export default BitcoinService;
