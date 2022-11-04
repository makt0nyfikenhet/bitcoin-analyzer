// Libs
import React, { useState, FC, BaseSyntheticEvent, ReactNode } from "react";
import {Product}  from "@/types";

// Styles
import styles from "./Form1.module.css";

interface CreateForm {
	setProductList: FC<(prev: Product[]) => Product[]>;
	placeHolder1?: string;
	placeHolder2?: string;
	children?: ReactNode;
}

const CreateForm: FC<CreateForm> = ({
	setProductList,
	placeHolder1,
	placeHolder2,
	children,
}) => {
	const inicialValue = {
		name: "",
		price: "",
		id: null,
	};

	const [currentProduct, setCurrentProduct] = useState<Product>(inicialValue);
	// const [currentProduct, setCurrentProduct] = useState<Product>({
	// 	name: "",
	// 	price: "",
	// 	id: null,
	// });

	const handleOnChange = (e: BaseSyntheticEvent) => {
		setCurrentProduct((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};
	const handleOnAddToList = () => {
		setProductList((prev) => [...prev, currentProduct]);
	};

	return (
		<>
			<input
				type="text"
				value={currentProduct.name}
				name="name"
				placeholder={placeHolder1 ? placeHolder1 : "nombre del producto"}
				onChange={handleOnChange}
			/>
			<input
				type="text"
				value={currentProduct.price}
				name="price"
				placeholder={placeHolder2 ? placeHolder2 : "precio del producto"}
				onChange={handleOnChange}
			/>
			<button type="submit" onClick={handleOnAddToList}>
				Agregar
			</button>
			{children}
		</>
	);
};

export default CreateForm;
