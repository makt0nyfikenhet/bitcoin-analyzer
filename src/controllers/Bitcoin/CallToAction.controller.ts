// Types
import { TBitcoinAction } from "@/types";

class BitcoinCallToActionController {
  private action;
  private notifyMedium = "email";
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
    return {
      email: () => this.sendByEmail(),
    }[this.notifyMedium];
  }

  run() {
    this.message = this.getActionMessage();
    if (!this.message) return;

    this.sendNotify();
  }
}

export default BitcoinCallToActionController;
