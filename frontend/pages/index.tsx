import type { NextPage } from "next";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
// import { useState, useEffect } from "react";

const Index: NextPage = () => {
	// const [loginInfo, setLoginInfo] = useState<RootState["auth"]>();

	// useEffect(() => {
	// 	setLoginInfo(useSelector((state: RootState) => state.auth));
	// });

	const loginInfo = useSelector((state: RootState) => state.auth);

	return (
		<section className="text-5xl font-bold">{loginInfo.username}</section>
	);
};

export default Index;
