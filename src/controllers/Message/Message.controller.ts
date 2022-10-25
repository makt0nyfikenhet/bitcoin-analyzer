// Types
import {
  Observer,
  Observable,
  TMessageData,
  IMessageProps,
  ACTIONS,
  OBSERVABLES,
} from "@/types";
// Observables
import BitcoinAnalyzerController from "../Bitcoin/Analyzer.controller";

class MessageController implements Observer {
  private observable: Observable | null = null;
  private data: TMessageData;
  private port: MessagePort;

  constructor({ data, port }: IMessageProps) {
    this.data = data;
    this.port = port;
  }

  update() {
    if (this.observable) {
      this.port.postMessage(this.observable.payload);
      this.port.close();
    }
  }

  private getObservable() {
    return {
      [OBSERVABLES.BITCOIN_ANALYZER]: BitcoinAnalyzerController.getInstance(),
      // <-- Add your new observable match
    }[this.data.observable];
  }

  private unsubscribe() {
    this.observable = this.getObservable();
    if (!this.observable) return;

    this.observable.detach(this);
    this.port.close();
  }

  private subscribe() {
    this.observable = this.getObservable();
    if (!this.observable) return;

    this.observable.attach(this);
  }

  private getAction() {
    const { UNSUBSCRIBE, SUBSCRIBE } = ACTIONS;

    return {
      [UNSUBSCRIBE]: () => this.unsubscribe(),
      [SUBSCRIBE]: () => this.subscribe(),
    }[this.data.action];
  }

  run() {
    try {
      const action = this.getAction();
      if (!action) return;

      return action();
    } catch (err) {
      console.log(err);
    }
  }
}

export default MessageController;
