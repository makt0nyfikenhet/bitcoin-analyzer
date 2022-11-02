import { useState } from "react";
import { Form1 } from "./components/Form1";
import { ProductList } from "./components/ProductList";

export interface Product {
	name: string;
	price?: string;
	id?: number | null;
}
const inicialValue: Product[] = [
	{
		name: "string",
		price: "string",
		id: 5,
	},
];
const ProductForm = () => {
	const [dataToEdit, setDataToEdit] = useState(null);
	const [productList, setProductList] = useState(inicialValue);
	return (
		<>
			<Form1
				setProductList={setProductList}
				placeHolder1={"hola"}
				placeHolder2={"ke ace"}
			>
				<ProductList
					productList={productList}
					dataToEdit={dataToEdit}
					setDataToEdit={setDataToEdit}
				/>
			</Form1>
		</>
	);
};

export default ProductForm;
