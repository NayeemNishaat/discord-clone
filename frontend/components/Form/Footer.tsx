import CustomButton from "../UI/Button";

function Footer({
	valid,
	click
}: {
	valid: boolean;
	click: React.MouseEventHandler<HTMLButtonElement>;
}) {
	return (
		<>
			<CustomButton
				styles="mt-10 font-bold"
				label="Submit"
				click={click}
				disabled={!valid}
			/>
		</>
	);
}

export default Footer;
