// Libs
import { useState } from "react";
// Types
import { Product } from "@/types";
// Components
import { FormInputs } from "./components/FormInputs";
import { ProductList } from "./components/ProductList";

const initialValue: Product[] = [
  {
    name: "string",
    price: "string",
    id: 5,
  },
];
const ProductForm = () => {
  const [dataToEdit, setDataToEdit] = useState(null);
  const [productList, setProductList] = useState(initialValue);

  const onSetProductList = (currentProduct: Product) =>
    setProductList((prev) => [...prev, currentProduct]);

  return (
    <>
      <FormInputs
        setProductList={onSetProductList}
        placeHolderName={"hola"}
        placeHolderPrice={"ke ace"}
      >
        <ProductList
          productList={productList}
          dataToEdit={dataToEdit}
          setDataToEdit={setDataToEdit}
        />
      </FormInputs>
    </>
  );
};

export default ProductForm;
