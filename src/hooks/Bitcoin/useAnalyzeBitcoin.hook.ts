// Libs
import { useEffect, useState } from "react";
// Types
import { ACTIONS, IBitcoinSample, OBSERVABLES } from "@/types";
// Utils
import { ArrayUtils } from "@/utils";

const useAnalyzeBitcoin = () => {
  const [analyzeSampleHistory, setAnalyzeSampleHistory] = useState<
    IBitcoinSample[]
  >([]);

  useEffect(() => {
    let isMounted = true;

    const messageChannel = new MessageChannel();

    // Subscribe to Bitcoin Analyzer
    navigator.serviceWorker.controller?.postMessage(
      {
        action: ACTIONS.SUBSCRIBE,
        observable: OBSERVABLES.BITCOIN_ANALYZER,
      },
      [messageChannel.port2]
    );

    // Listen to Bitcoin Analyzer updates
    messageChannel.port1.onmessage = ({ data }) =>
      isMounted && setAnalyzeSampleHistory(new ArrayUtils().checkArray(data));

    return () => {
      isMounted = false;
    };
  }, [analyzeSampleHistory]);

  return {
    analyzeSampleHistory,
  };
};

export default useAnalyzeBitcoin;
