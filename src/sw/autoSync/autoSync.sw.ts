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

// Controllers
import { MessageController, BitcoinAnalyzerController } from "@/controllers";

const sw = self as unknown as ServiceWorkerGlobalScope & typeof globalThis;

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
  const deleteOldCachePromise = caches.keys().then((keys) =>
    keys.forEach((key) => {
      if (
        key !== CACHE_NAMES.IMMUTABLE &&
        key.includes(CACHE_NAMES.IMMUTABLE.split("@")[0])
      )
        return caches.delete(key);
    })
  );
  const initBitcoinAnalyzer = Promise.resolve(
    BitcoinAnalyzerController.getInstance().run()
  );

  const promises = Promise.all([deleteOldCachePromise, initBitcoinAnalyzer]);
  event.waitUntil(promises);
});

sw.addEventListener("message", (event: MessageEvent) => {
  new MessageController({
    data: event.data,
    port: event.ports[0],
  }).run();
});

export {};
