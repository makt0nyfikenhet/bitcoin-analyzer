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
// Controllers
import { BitcoinCallToActionController } from ".";
// Models
import { BitcoinAnalyze } from "@/models";
// Strategies
import { BitcoinAnalyzerStrategy } from "@/strategies";

/**
 * Singleton Pattern
 * Reason: It is configured as a singleton so that there is only one instance of the controller modifying the local storage, in this way we avoid unwanted data replacements
 */
class BitcoinAnalyzerController implements Observable {
  private static instance: BitcoinAnalyzerController;
  private database;
  private running = false;
  private ANALYZE_INTERVAL = 2000; // 2000 for a quick simulation, but it should be 86 400 000 = 24h
  private observers: Observer[] = [];
  private _payload: IBitcoinSample[] = [];
  private _strategy: TAnalyzerStrategy = "S8020_FEAR_GREED_INDEX";
  private _maxSampleHistoryLength = 31;

  private constructor() {
    this.database = new BitcoinAnalyze();
  }

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

  private async getCurrentBitcoinState() {
    const [price, fearAndGreedIndex, sampleHistory = []] = await Promise.all([
      new BitcoinService().getCurrentPrice(),
      new BitcoinService().getFearAndGreedIndex(),
      this.database.getSampleHistory(),
    ]);
    return { price, fearAndGreedIndex, sampleHistory };
  }

  private async deleteOldSample(sampleHistory: IBitcoinSample[]) {
    const deletePromises = [];
    if (sampleHistory.length > this._maxSampleHistoryLength) {
      const lastIndex = sampleHistory.length - this._maxSampleHistoryLength;
      const samplesToDelete = sampleHistory.slice(0, lastIndex);
      for (let sample of samplesToDelete) {
        deletePromises.push(this.database.deleteSample(sample));
      }
    }
    return Promise.all(deletePromises);
  }

  private async analyze() {
    const { price, fearAndGreedIndex, sampleHistory } =
      await this.getCurrentBitcoinState();

    const action: TBitcoinAction | null = new BitcoinAnalyzerStrategy({
      strategy: this._strategy,
      price,
      fearAndGreedIndex,
      sampleHistory,
    }).run();

    new BitcoinCallToActionController(action).run();

    const currentDoc: IBitcoinSample = await this.database.setCurrentSample({
      price,
      fearAndGreedIndex,
      action,
    });

    const currentSampleHistory = [...sampleHistory, currentDoc];

    this._payload = currentSampleHistory;

    this.notify();

    await this.deleteOldSample(currentSampleHistory);
  }

  run() {
    if (!this.running)
      setInterval(async () => {
        await this.analyze().catch(console.log);
      }, this.ANALYZE_INTERVAL);

    this.running = true;
  }
}

export default BitcoinAnalyzerController;
