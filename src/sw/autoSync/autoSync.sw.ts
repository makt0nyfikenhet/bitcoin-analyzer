/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />
/// <reference lib="DOM" />
/// <reference lib="DOM.Iterable" />

importScripts(
  "https://cdnjs.cloudflare.com/ajax/libs/pouchdb/7.3.0/pouchdb.min.js"
);

// Controllers
import { MessageController, BitcoinAnalyzerController } from "@/controllers";

const sw = self as unknown as ServiceWorkerGlobalScope & typeof globalThis;

sw.addEventListener("install", (_) =>
  console.log("Installing new AutoSync Service Worker")
);

sw.addEventListener("activate", (_) =>
  BitcoinAnalyzerController.getInstance().run()
);

self.addEventListener("message", (event: MessageEvent) => {
  new MessageController({
    data: event.data,
    port: event.ports[0],
  }).run();
});

export {};
