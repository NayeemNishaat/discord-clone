import type { NextPage } from "next";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useState, useEffect } from "react";
import Button from "../components/UI/Button";
import Link from "next/link";

const Index: NextPage = () => {
	// const [loginInfo, setLoginInfo] = useState<RootState["auth"]>();
	const loginInfo = useSelector((state: RootState) => state.auth);

	useEffect(() => {
		// const storedLoginInfo = JSON.parse(
		// 	localStorage.getItem("loginInfo") || "null"
		// );
		// if (!storedLoginInfo) return;
		// setLoginInfo(useSelector((state: RootState) => state.auth));
		// console.log(loginInfo);
	}, []);

	// const loginInfo = useSelector((state: RootState) => state.auth);

	return (
		<section className="w-full bg-[#5866f2]">
			{loginInfo.username}
			<div className="flex h-screen flex-col items-center justify-center ">
				<p className="text-5xl font-bold">Welcome to Discord Clone</p>
				<div className="mt-5 flex gap-5">
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
		</section>
	);
};

export default Index;
