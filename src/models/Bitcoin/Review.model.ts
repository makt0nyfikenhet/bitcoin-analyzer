// Types
import { IBitcoinSample } from "@/types";
// Controllers
import IndexedDB from "@/controllers/IndexedDB/indexedDB.controller";

class BitcoinReview {
  private db: IndexedDB;

  constructor() {
    this.db = new IndexedDB("BITCOIN_ANALYZE");
  }

  async getSampleHistory(): Promise<IBitcoinSample[]> {
    return this.db
      .getAll()
      .then((doc: any) => doc?.rows)
      .then((rows) => rows?.map((r: any) => r.doc));
  }

  async setCurrentSample(sample: IBitcoinSample): Promise<any> {
    return this.db.add(sample).then((doc) => doc && this.db.get(doc.id));
  }

  async deleteSample(sample: IBitcoinSample) {
    return this.db.delete(sample);
  }
}

export default BitcoinReview;
