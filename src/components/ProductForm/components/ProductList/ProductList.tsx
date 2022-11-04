// Libs
import { BaseSyntheticEvent, FC, useState } from "react";
// Types
import { Product } from "@/types";
import { EditForm } from "../EditForm";

interface ProductList {
  productList: Product[];
  dataToEdit: any;
  setDataToEdit: Function;
}

interface ProductItem {
  product: Product;
}
const inicialValue = {
  handdleOnClickEdit: false,
  otraVariable2: "false",
};

const ProductItem: FC<ProductItem> = ({ product }) => {
  const [stateHanddle, setStateHanddle] = useState(inicialValue);

  const handdleOnClickEdit = (
    e: BaseSyntheticEvent,
    otrosParametros: string
  ) => {
    setStateHanddle((current) => ({
      ...current,
      handdleOnClickEdit: !current.handdleOnClickEdit,
    }));
  };

  const otrosParametros = "Ejemplo de param";

  return (
    <>
      <li style={{ color: "white" }}>
        <b>Product name: </b>
        {product.name + " "}
        <b>Product price: </b>
        {product.price + " "}
        <button onClick={(e) => handdleOnClickEdit(e, otrosParametros)}>
          {stateHanddle.handdleOnClickEdit === false ? "Editar" : "No Editar"}
        </button>
      </li>
      {stateHanddle.handdleOnClickEdit && <EditForm />}
      {console.log(stateHanddle)}
    </>
  );
};

const ProductList: FC<ProductList> = (props) => {
  return (
    <>
      <ul>
        {props.productList.map((product, index) => (
          <ProductItem key={index.toString()} product={product} />
        ))}
      </ul>
      <div>Formulario</div>
    </> 
  );
};

export default ProductList;
