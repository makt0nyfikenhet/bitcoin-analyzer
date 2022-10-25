/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

// Services
/**
 * target = class
 * memberName = method
 * reference: https://www.digitalocean.com/community/tutorials/how-to-use-decorators-in-typescript
 * @returns Decorated method
 */
const sendErrorHandler = () => {
    return (target, memberName) => {
        target[memberName]().catch(SentryService.sendError);
    };
};

class SentryService {
    static sendError(err) {
        console.log(err, "Error sent");
    }
}

// Services
const DATABASE_NAMES = {
    BITCOIN_ANALYZE: "bitcoinAnalyze",
};
class IndexedDB {
    db;
    constructor(dbName) {
        this.db = new PouchDB(DATABASE_NAMES[dbName]);
    }
    async get(id) {
        return this.db.get(id).catch(SentryService.sendError);
    }
    async getAll() {
        return this.db
            .allDocs({ include_docs: true })
            .catch(SentryService.sendError);
    }
    async add(item) {
        item._id = item._id || new Date().toISOString();
        return this.db.put(item).catch(SentryService.sendError);
    }
    async delete(item) {
        return this.db.remove(item).catch(SentryService.sendError);
    }
    async onChange(callback) {
        this.db
            .changes({
            since: "now",
            live: true,
        })
            .on("change", callback);
    }
}

// Controllers
class BitcoinAnalyze {
    db;
    constructor() {
        this.db = new IndexedDB("BITCOIN_ANALYZE");
    }
    async getSampleHistory() {
        return this.db
            .getAll()
            .then((doc) => doc?.rows)
            .then((rows) => rows?.map((r) => r.doc));
    }
    async setCurrentSample(sample) {
        return this.db.add(sample).then((doc) => doc && this.db.get(doc.id));
    }
    async deleteSample(sample) {
        return this.db.delete(sample);
    }
}

class BitcoinPrice {
    symbol;
    price24h;
    volume24h;
    lastTradePrice;
    constructor({ symbol, price_24h, volume_24h, last_trade_price, }) {
        this.symbol = symbol;
        this.price24h = price_24h;
        this.volume24h = volume_24h;
        this.lastTradePrice = last_trade_price;
    }
}

class FearAndGreedData {
    value;
    valueClassification;
    timestamp;
    timeUntilUpdate;
    constructor({ value, value_classification, timestamp, time_until_update, }) {
        this.value = value;
        this.valueClassification = value_classification;
        this.timestamp = timestamp;
        this.timeUntilUpdate = time_until_update;
    }
}

const BASE = {
    BLOCKCHAIN_API: "https://api.blockchain.com/v3",
    ALTERNATIVES: "https://api.alternative.me",
};
const ENDPOINTS = {
    BITCOIN_PRICE: `${BASE.BLOCKCHAIN_API}/exchange/tickers/BTC-USD`,
    FEAR_AND_GREED_INDEX: `${BASE.ALTERNATIVES}/fng/`,
};
class BitcoinService {
    async getCurrentPrice() {
        return fetch(ENDPOINTS.BITCOIN_PRICE)
            .then((res) => res.json())
            .then((res) => new BitcoinPrice(res));
    }
    async getFearAndGreedIndex() {
        return fetch(ENDPOINTS.FEAR_AND_GREED_INDEX)
            .then((res) => res.json())
            .then((res) => ({
            ...res,
            data: res.data.map((item) => new FearAndGreedData(item)),
        }));
    }
}
__decorate([
    sendErrorHandler()
], BitcoinService.prototype, "getCurrentPrice", null);
__decorate([
    sendErrorHandler()
], BitcoinService.prototype, "getFearAndGreedIndex", null);

// Constants
const ANALYZER_STRATEGIES = {
    S8020_FEAR_GREED_INDEX: "S8020_FEAR_GREED_INDEX",
};

// Constants
const ACTIONS = {
    UNSUBSCRIBE: "UNSUBSCRIBE",
    SUBSCRIBE: "SUBSCRIBE",
};
const OBSERVABLES = {
    BITCOIN_ANALYZER: "BITCOIN_ANALYZER",
};

class ArrayUtils {
    checkArray(arr) {
        return Array.isArray(arr) ? arr : [];
    }
    sortBy({ arr, objectKey, sortType }) {
        return {
            number: arr.sort((a, b) => a - b),
            object: !objectKey
                ? arr
                : arr.sort((a, b) => {
                    if (a[objectKey] > b[objectKey])
                        return 1;
                    if (a[objectKey] < b[objectKey])
                        return -1;
                    return 0; // a must be equal to b
                }),
        }[sortType];
    }
}

// Utils
const SAMPLE_HISTORY_MAX_LENGTH = 31;
const BITCOIN_BUY_INDICATOR = 20;
const BITCOIN_SELL_INDICATOR = 80;
class Analyze8020Strategy {
    price;
    fearAndGreedIndex;
    sampleHistory;
    constructor({ price, fearAndGreedIndex, sampleHistory }) {
        this.price = price;
        this.fearAndGreedIndex = fearAndGreedIndex;
        this.sampleHistory = sampleHistory;
    }
    checkSampleHistoryLength() {
        return this.sampleHistory.length >= SAMPLE_HISTORY_MAX_LENGTH;
    }
    getLastMonthMedianPrice() {
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
    getCurrentFearAndGreedIndex() {
        return Number(this.fearAndGreedIndex.data[0].value);
    }
    buy() {
        return (this.price < this.getLastMonthMedianPrice() &&
            this.getCurrentFearAndGreedIndex() < BITCOIN_BUY_INDICATOR);
    }
    sell() {
        return (this.price > this.getLastMonthMedianPrice() &&
            this.getCurrentFearAndGreedIndex() > BITCOIN_SELL_INDICATOR);
    }
    run() {
        if (!this.checkSampleHistoryLength())
            return;
        return this.buy() ? "buy" : this.sell() ? "sell" : "hold";
    }
}

// Types
class AnalyzerStrategy {
    props;
    constructor(props) {
        this.props = props;
    }
    getStrategy() {
        return {
            [ANALYZER_STRATEGIES.S8020_FEAR_GREED_INDEX]: () => new Analyze8020Strategy(this.props),
            //<-- Add your new strategy match
        }[this.props.strategy];
    }
    run() {
        const strategy = this.getStrategy();
        if (!strategy)
            return;
        return strategy().run();
    }
}

// Services
/**
 * Singleton Pattern
 * Reason: It is configured as a singleton so that there is only one instance of the controller modifying the local storage, in this way we avoid unwanted data replacements
 */
class BitcoinAnalyzerController {
    static instance;
    running = false;
    database;
    ANALYZE_INTERVAL = 2000; // 2000 for a quick simulation, but it should be 86 400 000 = 24h
    observers = [];
    _payload = [];
    _strategy = "S8020_FEAR_GREED_INDEX";
    _maxSampleHistoryLength = 31;
    constructor() {
        this.database = new BitcoinAnalyze();
    }
    get payload() {
        return this._payload;
    }
    set strategy(strategy) {
        this._strategy = strategy;
    }
    set maxSampleHistoryLength(maxSampleHistoryLength) {
        this._maxSampleHistoryLength = maxSampleHistoryLength;
    }
    static getInstance() {
        if (!this.instance)
            this.instance = new BitcoinAnalyzerController();
        return this.instance;
    }
    attach(o) {
        this.observers[0] = o; // Allow one only observer
    }
    detach(o) {
        this.observers = this.observers.filter((sub) => sub !== o);
    }
    notify() {
        for (let observer of this.observers) {
            observer.update();
        }
    }
    async getCurrentBitcoinState() {
        const [price, fearAndGreedIndex, sampleHistory = []] = await Promise.all([
            new BitcoinService().getCurrentPrice(),
            new BitcoinService().getFearAndGreedIndex(),
            this.database.getSampleHistory(),
        ]);
        return { price, fearAndGreedIndex, sampleHistory };
    }
    async deleteOldSample(sampleHistory) {
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
    async analyze() {
        const { price, fearAndGreedIndex, sampleHistory } = await this.getCurrentBitcoinState();
        const action = new AnalyzerStrategy({
            strategy: this._strategy,
            price,
            fearAndGreedIndex,
            sampleHistory,
        }).run();
        new BitcoinCallToActionController(action).run();
        const currentDoc = await this.database.setCurrentSample({
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

class BitcoinCallToActionController {
    action;
    notificationMethod = "email";
    message = undefined;
    constructor(action) {
        this.action = action;
    }
    getActionMessage() {
        if (!this.action)
            return;
        return {
            buy: "Buy bitcoin",
            sell: "Sell bitcoin",
            hold: "Hold",
        }[this.action];
    }
    sendByEmail() {
        console.log("Sending Email...", this.message);
    }
    sendNotify() {
        const method = {
            email: () => this.sendByEmail(),
            //<-- Add your new notification method
        }[this.notificationMethod];
        if (!method)
            return;
        method();
    }
    run() {
        this.message = this.getActionMessage();
        if (!this.message)
            return;
        this.sendNotify();
    }
}

// Types
class MessageController {
    observable = null;
    data;
    port;
    constructor({ data, port }) {
        this.data = data;
        this.port = port;
    }
    update() {
        if (this.observable) {
            this.port.postMessage(this.observable.payload);
            this.port.close();
        }
    }
    getObservable() {
        return {
            [OBSERVABLES.BITCOIN_ANALYZER]: BitcoinAnalyzerController.getInstance(),
            // <-- Add your new observable match
        }[this.data.observable];
    }
    unsubscribe() {
        this.observable = this.getObservable();
        if (!this.observable)
            return;
        this.observable.detach(this);
        this.port.close();
    }
    subscribe() {
        this.observable = this.getObservable();
        if (!this.observable)
            return;
        this.observable.run();
        this.observable.attach(this);
    }
    getAction() {
        const { UNSUBSCRIBE, SUBSCRIBE } = ACTIONS;
        return {
            [UNSUBSCRIBE]: () => this.unsubscribe(),
            [SUBSCRIBE]: () => this.subscribe(),
        }[this.data.action];
    }
    run() {
        try {
            const action = this.getAction();
            if (!action)
                return;
            return action();
        }
        catch (err) {
            console.log(err);
        }
    }
}

/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />
/// <reference lib="DOM" />
/// <reference lib="DOM.Iterable" />
const CACHE_NAMES = {
    IMMUTABLE: "immutable@v1",
};
const LIBS = [
    "https://cdnjs.cloudflare.com/ajax/libs/pouchdb/7.3.0/pouchdb.min.js",
];
const URLS = [
    ...LIBS,
    // <-- Add your new url segments
];
importScripts(LIBS[0]);
const sw = self;
sw.addEventListener("install", (event) => {
    console.log("Installing new AutoSync Service Worker");
    const setCachePromise = caches.open(CACHE_NAMES.IMMUTABLE).then((cache) => {
        cache.addAll(URLS);
        sw.skipWaiting(); //Important: Not recommended in production, however depending on desired behavior it, may be fine});
    });
    event.waitUntil(setCachePromise);
});
sw.addEventListener("activate", (event) => {
    console.log("new AutoSync Service Worker Activated");
    const deleteOldCachePromise = caches.keys().then((keys) => keys.forEach((key) => {
        if (key !== CACHE_NAMES.IMMUTABLE &&
            key.includes(CACHE_NAMES.IMMUTABLE.split("@")[0]))
            return caches.delete(key);
    }));
    const initBitcoinAnalyzer = Promise.resolve(BitcoinAnalyzerController.getInstance().run());
    const promises = Promise.all([deleteOldCachePromise, initBitcoinAnalyzer]);
    event.waitUntil(promises);
});
sw.addEventListener("message", (event) => {
    new MessageController({
        data: event.data,
        port: event.ports[0],
    }).run();
});
