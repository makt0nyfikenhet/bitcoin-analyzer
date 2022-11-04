// Libs
import { useState, FC, BaseSyntheticEvent, ReactNode } from "react";
// Types
import { Product } from "@/types";
// Styles
// import styles from "./FormInputs.module.css";

interface FormInputs {
  setProductList: (currentProduct: Product) => void;
  placeHolderName?: string;
  placeHolderPrice?: string;
  children?: ReactNode;
}

const FormInputs: FC<FormInputs> = ({
  setProductList,
  placeHolderName,
  placeHolderPrice,
  children,
}) => {
  const initialValue = {
    name: "",
    price: "",
    id: null,
  };
  const [currentProduct, setCurrentProduct] = useState<Product>(initialValue);
  // const [currentProduct, setCurrentProduct] = useState<Product>({
  // 	name: "",
  // 	price: "",
  // 	id: null,
  // });

  const handleOnChange = (e: BaseSyntheticEvent) => {
    setCurrentProduct((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleOnAddToList = () => {
    setProductList(currentProduct);
  };

  return (
    <>
      <input
        type="text"
        value={currentProduct.name}
        name="name"
        placeholder={placeHolderName || "nombre del producto"}
        onChange={handleOnChange}
      />
      <input
        type="text"
        value={currentProduct.price}
        name="price"
        placeholder={placeHolderPrice || "precio del producto"}
        onChange={handleOnChange}
      />
      <button type="submit" onClick={handleOnAddToList}>
        Agregar
      </button>
      {children}
    </>
  );
};

export default FormInputs;
