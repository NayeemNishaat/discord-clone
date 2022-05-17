import type { NextPage } from "next";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Button } from "@mui/material";
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
										<Button className="bg-black text-lg text-white hover:bg-[#ff0038]">
											Log In
										</Button>
									</a>
								</Link>

								<Link href="/register">
									<a>
										<Button className="bg-white text-lg text-black hover:bg-[#ff7b00]">
											Register
										</Button>
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
