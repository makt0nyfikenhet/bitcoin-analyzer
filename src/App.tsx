// Libs
import { FC, ReactNode } from "react";
// Types
import { IBitcoinSample } from "@/types";
// Hooks
import { useAnalyzeBitcoin } from "@/hooks";
// Components
import { Span, Title } from "@/components";
// Styles
import styles from "./App.module.css";

interface Props {
  children?: ReactNode;
}

const Container: FC<Props> = ({ children }) => (
  <div className={styles.container}>{children}</div>
);
const ContainerOverlay: FC<Props> = ({ children }) => (
  <div className={styles.containerOverlay}>{children}</div>
);
const List: FC<Props> = ({ children }) => (
  <div className={styles.list}>{children}</div>
);
const HorizontalItem: FC<Props> = ({ children }) => (
  <div className={styles.sample}>{children}</div>
);
const getCurrentRecommendedAction = (analyzeSampleHistory: IBitcoinSample[]) =>
  analyzeSampleHistory[analyzeSampleHistory.length - 1]?.action ||
  "Gathering information";

function App() {
  const { analyzeSampleHistory } = useAnalyzeBitcoin();
  const currentRecommendedAction =
    getCurrentRecommendedAction(analyzeSampleHistory).toUpperCase();

  console.log(analyzeSampleHistory); //TODO: Delete [debugging]

  return (
    <Container>
      <ContainerOverlay>
        <Title>Bitcoin Analyzer</Title>
        <List>
          {analyzeSampleHistory.map((sample: IBitcoinSample, idx) => (
            <HorizontalItem key={idx}>
              <Span className={styles.margin_righ}>
                {idx + 1 === 32 ? "Hoy" : `Día ${idx + 1}`}
              </Span>
              <Span>{sample.price?.price24h}</Span>
            </HorizontalItem>
          ))}
        </List>
        <Title>{currentRecommendedAction}</Title>
      </ContainerOverlay>
    </Container>
  );
}

export default App;
