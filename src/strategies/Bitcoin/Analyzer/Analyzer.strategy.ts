// Types
import { ANALYZER_STRATEGIES, IAnalyzerStrategy } from "@/types";
// Strategies
import S8020FearGreedIndex from "./S8020FearGreedIndex.strategy";

class AnalyzerStrategy {
  private props;

  constructor(props: IAnalyzerStrategy) {
    this.props = props;
  }

  private getStrategy() {
    return {
      [ANALYZER_STRATEGIES.S8020_FEAR_GREED_INDEX]: () =>
        new S8020FearGreedIndex(this.props),
      //<-- Add your new strategy match
    }[this.props.strategy];
  }

  run() {
    const strategy = this.getStrategy();
    if (!strategy) return;

    return strategy().run();
  }
}

export default AnalyzerStrategy;
