import Link from "next/link";
import { Button } from "@mui/material";

function Footer({
	disabled,
	click,
	link,
	text,
	children
}: {
	disabled: boolean;
	click: React.MouseEventHandler<HTMLButtonElement>;
	link: string;
	text: string;
	children: React.ReactNode;
}) {
	return (
		<>
			<Button
				variant="outlined"
				disabled={disabled}
				onClick={click}
				sx={{
					fontWeight: "bold",
					marginTop: "20px"
				}}
			>
				Submit
			</Button>
			<p className="mt-5 text-white">
				{text}{" "}
				<Link href={link}>
					<a className="text-blue-500 underline">{children}</a>
				</Link>
			</p>
		</>
	);
}

export default Footer;
