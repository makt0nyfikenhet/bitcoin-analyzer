// Types
import { TFearAndGreedMetadata } from "@/types";
// Models
import FearAndGreedData from "./FearAndGreedData.model";

class FearAndGreedIndex {
  name: string;
  data: FearAndGreedData[];
  metadata: TFearAndGreedMetadata;

  constructor({ name, data, metadata }: FearAndGreedIndex) {
    this.name = name;
    this.data = data;
    this.metadata = metadata;
  }
}

export default FearAndGreedIndex;
