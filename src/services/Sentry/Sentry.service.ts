//Libs
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
//NPM Package
import npmPackage from "../../../package.json";
//Check production env
const env_check = true; // process.env.NODE_ENV === "production";

export default class SentryService {
  static run() {
    if (env_check) {
      Sentry.init({
        dsn: "https://5c6035d3b827442e847e1b949397ab9a@o199337.ingest.sentry.io/4504046023999488", // TODO: Put on .env
        integrations: [new BrowserTracing()],
        // Alternatively, use `process.env.npm_package_version` for a dynamic release version
        // if your build tool supports it.
        release: npmPackage.version,
        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for performance monitoring.
        // We recommend adjusting this value in production
        tracesSampleRate: 1.0,
      });
    }
  }
  //Send error to sentry
  static sendError(err: Error, props?: any) {
    if (env_check) {
      console.log("Sending Error");
      try {
        Sentry.captureException(err, props);
      } catch (err) {
        console.error("Error not sent", err);
      }
    }
  }
}
