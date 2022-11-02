// Libs
import React, { FC, ReactNode } from "react";
// Styles
import styles from "./App.module.css";
import { ProductForm } from "./components";

interface Props {
	children: ReactNode;
}

const Container: FC<Props> = ({ children }) => {
	return <div className={styles.container}>{children}</div>;
};

const ContainerOverlay: FC<Props> = ({ children }) => (
	<div className={styles.containerOverlay}>{children}</div>
);

function App() {
	return (
		<Container>
			<ContainerOverlay>
				<ProductForm />
			</ContainerOverlay>
		</Container>
	);
}

export default App;
