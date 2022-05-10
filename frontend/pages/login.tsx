import Form from "../components/Form/Form";
import Input from "../components/Form/Input";
import Header from "../components/Form/Header";

function login() {
	return (
		<Form>
			<Header />
			<Input label="Email" placeholder="Enter Your Email" type="email" />
			<Input
				label="Password"
				placeholder="Enter Your Password"
				type="password"
			/>
		</Form>
	);
}

export default login;
