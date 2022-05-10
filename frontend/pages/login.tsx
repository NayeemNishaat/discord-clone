import Form from "../components/Form/Form";
import Input from "../components/Form/Input";

function login() {
	return (
		<Form>
			<Input
				label="username"
				id="user"
				placeholder="Username"
				type="text"
			/>
		</Form>
	);
}

export default login;
