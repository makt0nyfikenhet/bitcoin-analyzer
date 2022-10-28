// Libs
import { BaseSyntheticEvent, FC, ReactNode, useState } from "react";
// Styles
import styles from "./App.module.css"; 
interface Props {
  children?: ReactNode;
}
interface Product{
  name: string;
  price: number;
}

const ListItem: FC<Product> = (props) =>{
  return(  
    <>
      <li>
        {props.name}
      </li>
      <li>
        {props.price}
      </li>
    </> 
  )
}

const Container: FC<Props> = ({ children }) => (
  <div className={styles.container}>{children}</div>
);
const ContainerOverlay: FC<Props> = ({ children }) => (
  <div className={styles.containerOverlay}>{children}</div>
);

function App() {
  const [productList, setProductList] = useState<Props[]>([]);
  const [currentProduct, setCurrentProduct] = useState<Product>({
    name: "",
    price: 0,
  });
  
  console.log(currentProduct);
  console.log(productList);
  
  const handleOnChange = (e: BaseSyntheticEvent) =>
  setCurrentProduct((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  
  const handleOnAddToList = () =>
  setProductList((prev) => [...prev, currentProduct]);

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
        <ListItem name={currentProduct.name} price={currentProduct.price}/>
      </ContainerOverlay>
    </Container>
  );
}

export default App; 
































{/*    setCurrentProduct((prev) => ({ ...prev, [e.target.name]: e.target.value }));

Esto es para actualizar dinámicamente la propiedad del objeto (cuando el nombre de la propiedad es desconocido por adelantado pero en tiempo de ejecución). De esta manera, podría tener múltiples entradas de React con una propiedad de nombre diferente y usando el mismo controlador onChange para actualizar parte del estado.*/}