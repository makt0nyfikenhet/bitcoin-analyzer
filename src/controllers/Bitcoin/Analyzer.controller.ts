// Types
import {
  IBitcoinSample,
  Observable,
  Observer,
  TAnalyzerStrategy,
  TBitcoinAction,
} from "@/types";
// Services
import { BitcoinService } from "@/services";
// Models
import { BitcoinReview } from "@/models";
// Strategies
import { BitcoinAnalyzerStrategy } from "@/strategies";
import { BitcoinCallToActionController } from ".";

/**
 * Singleton Pattern
 * Reason: It is configured as a singleton so that there is only one instance of the controller modifying the local storage, in this way we avoid unwanted data replacements
 */
class BitcoinAnalyzerController implements Observable {
  private static instance: BitcoinAnalyzerController;
  private ANALYZE_INTERVAL = 2000; // 2000 for a quick simulation, but it should be 86 400 000 = 24h
  private observers: Observer[] = [];
  private _payload: IBitcoinSample[] = [];
  private _strategy: TAnalyzerStrategy = "S8020_FEAR_GREED_INDEX";
  private _maxSampleHistoryLength = 31;

  get payload() {
    return this._payload;
  }

  set strategy(strategy: TAnalyzerStrategy) {
    this._strategy = strategy;
  }

  set maxSampleHistoryLength(maxSampleHistoryLength: number) {
    this._maxSampleHistoryLength = maxSampleHistoryLength;
  }

  static getInstance() {
    if (!this.instance) this.instance = new BitcoinAnalyzerController();
    return this.instance;
  }

  attach(o: Observer) {
    this.observers[0] = o; // Allow one only observer
  }
  detach(o: Observer) {
    this.observers = this.observers.filter((sub) => sub !== o);
  }
  notify() {
    for (let observer of this.observers) {
      observer.update();
    }
  }

  private async getCurrentBitcoinState(review: BitcoinReview) {
    const [price, fearAndGreedIndex, sampleHistory = []] = await Promise.all([
      new BitcoinService().getCurrentPrice(),
      new BitcoinService().getFearAndGreedIndex(),
      review.getSampleHistory(),
    ]);
    return { review, price, fearAndGreedIndex, sampleHistory };
  }

  private deleteOldSample(
    review: BitcoinReview,
    sampleHistory: IBitcoinSample[]
  ) {
    if (sampleHistory.length > this._maxSampleHistoryLength) {
      const lastIndex = sampleHistory.length - this._maxSampleHistoryLength;
      const toDeleteSamples = sampleHistory.slice(0, lastIndex);
      for (let sample of toDeleteSamples) {
        review.deleteSample(sample);
      }
    }
  }

  private async analyze() {
    const review = new BitcoinReview();

    const { price, fearAndGreedIndex, sampleHistory } =
      await this.getCurrentBitcoinState(review);

    const action: TBitcoinAction | null = new BitcoinAnalyzerStrategy({
      strategy: this._strategy,
      price,
      fearAndGreedIndex,
      sampleHistory,
    }).run();

    new BitcoinCallToActionController(action).run();

    const currentDoc: IBitcoinSample = await review.setCurrentSample({
      price,
      fearAndGreedIndex,
      action,
    });

    const currentSampleHistory = [...sampleHistory, currentDoc];

    this.deleteOldSample(review, currentSampleHistory);

    this._payload = currentSampleHistory;

    this.notify();
  }

  run() {
    const execute = async () => {
      setInterval(() => {
        this.analyze();
      }, this.ANALYZE_INTERVAL);
    };

    execute().catch(console.log);
  }
}

export default BitcoinAnalyzerController;
