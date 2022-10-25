// Types
import { IAnalyzerStrategy, TBitcoinAction } from "@/types";
// Utils
import { ArrayUtils } from "@/utils";

const SAMPLE_HISTORY_MAX_LENGTH = 31;
const BITCOIN_BUY_INDICATOR = 20;
const BITCOIN_SELL_INDICATOR = 80;

class Analyze8020Strategy {
  private price;
  private fearAndGreedIndex;
  private sampleHistory;

  constructor({ price, fearAndGreedIndex, sampleHistory }: IAnalyzerStrategy) {
    this.price = price;
    this.fearAndGreedIndex = fearAndGreedIndex;
    this.sampleHistory = sampleHistory;
  }

  private checkSampleHistoryLength() {
    return this.sampleHistory.length >= SAMPLE_HISTORY_MAX_LENGTH;
  }

  private getLastMonthMedianPrice() {
    const prices = this.sampleHistory.map((sample) => sample.price.price24h);
    const sortedPrices = new ArrayUtils().sortBy({
      arr: prices,
      sortType: "number",
    });
    const mid = Math.floor(sortedPrices.length / 2);
    return sortedPrices.length % 2 !== 0
      ? sortedPrices[mid]
      : (sortedPrices[mid - 1] + sortedPrices[mid]) / 2;
  }

  private getCurrentFearAndGreedIndex() {
    return Number(this.fearAndGreedIndex.data[0].value);
  }

  private buy() {
    return (
      this.price < this.getLastMonthMedianPrice() &&
      this.getCurrentFearAndGreedIndex() < BITCOIN_BUY_INDICATOR
    );
  }

  private sell() {
    return (
      this.price > this.getLastMonthMedianPrice() &&
      this.getCurrentFearAndGreedIndex() > BITCOIN_SELL_INDICATOR
    );
  }

  run(): TBitcoinAction {
    if (!this.checkSampleHistoryLength()) return;
    return this.buy() ? "buy" : this.sell() ? "sell" : "hold";
  }
}

export default Analyze8020Strategy;
