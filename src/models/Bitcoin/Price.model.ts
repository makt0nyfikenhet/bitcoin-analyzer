// Types
import { IBitcoinPriceResponse } from "@/types";

class BitcoinPrice {
  symbol: string;
  price24h: number;
  volume24h: number;
  lastTradePrice: number;

  constructor({
    symbol,
    price_24h,
    volume_24h,
    last_trade_price,
  }: IBitcoinPriceResponse) {
    this.symbol = symbol;
    this.price24h = price_24h;
    this.volume24h = volume_24h;
    this.lastTradePrice = last_trade_price;
  }
}

export default BitcoinPrice;
