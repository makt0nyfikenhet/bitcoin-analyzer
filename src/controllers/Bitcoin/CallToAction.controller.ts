// Types
import { TBitcoinAction } from "@/types";

class BitcoinCallToActionController {
  private action;
  private notificationMethod = "email";
  private message: string | undefined = undefined;

  constructor(action: TBitcoinAction) {
    this.action = action;
  }

  private getActionMessage() {
    if (!this.action) return;
    return {
      buy: "Buy bitcoin",
      sell: "Sell bitcoin",
      hold: "Hold",
    }[this.action];
  }

  private sendByEmail() {
    console.log("Sending Email...", this.message);
  }

  private sendNotify() {
    const method = {
      email: () => this.sendByEmail(),
      //<-- Add your new notification method
    }[this.notificationMethod];
    if (!method) return;

    method();
  }

  run() {
    this.message = this.getActionMessage();
    if (!this.message) return;

    this.sendNotify();
  }
}

export default BitcoinCallToActionController;
