import CustomButton from "../UI/Button";

function Footer() {
	const clickHandler = () => {
		console.log("clicked");
	};

	return (
		<>
			<CustomButton styles="mt-10" label="Submit" click={clickHandler} />
		</>
	);
}

export default Footer;
