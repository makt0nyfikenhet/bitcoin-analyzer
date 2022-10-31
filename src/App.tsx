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
  // console.log(props, "hola")
  const _data = Object.values(props)
  console.log(_data, "hola")
  return(
    <>
      {
        _data.map((li, index)=>{  
        {console.log(li + " " + "prueba")}
        <ol key={index}>    
          <li>
            {li}
          </li>
       </ol>
    })
      }
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
  const [productList, setProductList] = useState<Product[]>([]);
  const [currentProduct, setCurrentProduct] = useState<Product>({
    name: "",
    price: 0,
  });
  
  console.log(currentProduct);
  console.log(productList);
  
  const handleOnChange = (e: BaseSyntheticEvent) => //to can write in the input field
  setCurrentProduct((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  
  const handleOnAddToList = () =>
  setProductList((prev) => [...prev, currentProduct]); //add new product and save it in a new array 

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
        <button onClick={handleOnAddToList} value="submit">Add to cart</button>
        <ul>
          <ListItem 
            name={currentProduct.name}
            price={currentProduct.price}
          />
        </ul>
        
        
      </ContainerOverlay>
    </Container>
  );
}

export default App; 
































{/*    setCurrentProduct((prev) => ({ ...prev, [e.target.name]: e.target.value }));

Esto es para actualizar dinámicamente la propiedad del objeto (cuando el nombre de la propiedad es desconocido por adelantado pero en tiempo de ejecución). De esta manera, podría tener múltiples entradas de React con una propiedad de nombre diferente y usando el mismo controlador onChange para actualizar parte del estado.*/}