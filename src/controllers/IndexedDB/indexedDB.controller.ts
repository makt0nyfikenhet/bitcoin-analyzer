// Services
import SentryService from "@/services/Sentry/Sentry.service";

const DATABASE_NAMES = {
  BITCOIN_ANALYZE: "bitcoinAnalyze",
};

type TDatabaseNames = keyof typeof DATABASE_NAMES;

class IndexedDB {
  private db;

  constructor(dbName: TDatabaseNames) {
    this.db = new PouchDB(DATABASE_NAMES[dbName]);
  }

  async get(id: string) {
    return this.db.get(id).catch(SentryService.sendError);
  }
  async getAll() {
    return this.db
      .allDocs({ include_docs: true })
      .catch(SentryService.sendError);
  }
  async add(item: any) {
    item._id = item._id || new Date().toISOString();
    return this.db.put(item).catch(SentryService.sendError);
  }
  async delete(item: any) {
    return this.db.remove(item).catch(SentryService.sendError);
  }
  async onChange(callback: any) {
    this.db
      .changes({
        since: "now",
        live: true,
      })
      .on("change", callback);
  }
}

export default IndexedDB;
