import { useState } from "react";
import { CreateForm } from "./components/CreateForm";
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
			<CreateForm 
				setProductList={setProductList}
				placeHolder1={"hola"}
				placeHolder2={"ke ace"}
			>
				<ProductList
					productList={productList}
					dataToEdit={dataToEdit}
					setDataToEdit={setDataToEdit}
				/>
			</CreateForm>
		</>
	);
};

export default ProductForm;
