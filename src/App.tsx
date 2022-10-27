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

interface Product {
  name: string;
  price: number;
}

function App() {
  const [productList, setProductList] = useState<Product[]>([]);
  const [currentProduct, setCurrentProduct] = useState<Product>({
    name: "",
    price: 0,
  });

  console.log(currentProduct);
  console.log(productList);

  const handleOnChange = (e: any) =>
    setCurrentProduct((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleOnAddToList = () =>
    setProductList((prev) => [
      ...prev,
      {
        name: currentProduct.name,
        price: currentProduct.price,
      },
    ]);

  return (
    <Container>
      <ContainerOverlay>
        <input
          name="name"
          type="text"
          value={currentProduct.name}
          placeholder="Nombre del producto"
          onChange={handleOnChange}
        />
        <input
          name="price"
          type="text"
          value={currentProduct.price}
          placeholder="Precio del producto"
          onChange={handleOnChange}
        />
        <button onClick={handleOnAddToList}>Add to cart</button>
      </ContainerOverlay>
    </Container>
  );
}

export default App;
