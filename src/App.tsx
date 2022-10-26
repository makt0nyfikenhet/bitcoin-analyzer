// Libs
import { FC, ReactNode, useState } from "react";
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

function App() {
  const [currentProduct, setCurrentProduct] = useState("");
  const [currentProductPrice, setCurrentProductPrice] = useState(0);
  const [productList, setProductList] = useState([]);

  console.log(productList);

  return (
    <Container>
      <ContainerOverlay>
        <input
          type="text"
          value={currentProduct}
          placeholder="Nombre del producto"
          onChange={(event) => {
            console.log(event.target.value);
            setCurrentProduct(event.target.value);
          }}
        />
        <input
          type="text"
          value={currentProductPrice}
          placeholder="Precio del producto"
          onChange={(event: any) => {
            console.log(event.target.value);
            setCurrentProductPrice(event.target.value);
          }}
        />

        <button
          onClick={() => {
            const newProductList = [...productList];
            newProductList.push({
              name: currentProduct,
              price: currentProductPrice,
            });

            setProductList(newProductList);
          }}
        >
          Add to cart
        </button>
      </ContainerOverlay>
    </Container>
  );
}

export default App;
