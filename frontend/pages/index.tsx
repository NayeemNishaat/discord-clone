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

	const router = useRouter();
	const loginInfo = useSelector((state: RootState) => state.auth);

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
											variant="contained"
											color="success"
										>
											Log In
										</Button>
									</a>
								</Link>

								<Link href="/register">
									<a>
										<Button
											variant="contained"
											color="secondary"
										>
											Register
										</Button>
									</a>
								</Link>
							</div>
						</div>
					),
				2000
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
