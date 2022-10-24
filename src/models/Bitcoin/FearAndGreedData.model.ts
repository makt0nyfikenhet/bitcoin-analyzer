// Types
import { IFearAndGreedDataResponse } from "@/types";

class FearAndGreedData {
  value: string;
  valueClassification: string;
  timestamp: string;
  timeUntilUpdate: string;

  constructor({
    value,
    value_classification,
    timestamp,
    time_until_update,
  }: IFearAndGreedDataResponse) {
    this.value = value;
    this.valueClassification = value_classification;
    this.timestamp = timestamp;
    this.timeUntilUpdate = time_until_update;
  }
}

export default FearAndGreedData;
