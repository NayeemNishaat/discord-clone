import type { NextPage } from "next";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import Button from "../components/UI/Button";
import Link from "next/link";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/router";

const Index: NextPage = () => {
	const [component, setComponent] = useState(
		<CircularProgress color="secondary" />
	);

	const loginInfo = useSelector((state: RootState) => state.auth);
	const router = useRouter();

	useEffect(() => {
		let timeout: NodeJS.Timeout;
		if (loginInfo._id) router.push("/dashboard");
		else {
			timeout = setTimeout(
				() =>
					setComponent(
						<div>
							<p className="text-5xl font-bold">
								Welcome to Discord Clone
							</p>
							<div className="mt-5 flex justify-center gap-5">
								<Link href="/login">
									<a>
										<Button
											label="Log In"
											styles="text-white text-lg bg-black hover:bg-[#ff0038]"
										/>
									</a>
								</Link>

								<Link href="/register">
									<a>
										<Button
											label="Register"
											styles="text-black text-lg bg-white hover:bg-[#ff7b00]"
										/>
									</a>
								</Link>
							</div>
						</div>
					),
				2500
			);
		}

		() => clearTimeout(timeout);
	}, [loginInfo]);

	return (
		<section className="w-full bg-[#5866f2]">
			<div className="flex h-screen flex-col items-center justify-center ">
				{component}
			</div>
		</section>
	);
};

export default Index;
