import Link from "next/link";
import CustomButton from "../UI/Button";

function Footer({
	valid,
	click,
	link,
	text
}: {
	valid: boolean;
	click: React.MouseEventHandler<HTMLButtonElement>;
	link: string;
	text: string;
}) {
	return (
		<>
			<CustomButton
				styles="mt-10 font-bold"
				label="Submit"
				click={click}
				disabled={!valid}
			/>
			<p className="mt-5 text-white">
				{text}{" "}
				<Link href={link}>
					<a className="text-blue-500 underline">Create one!</a>
				</Link>
			</p>
		</>
	);
}

export default Footer;
