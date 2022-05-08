import type { NextPage } from "next";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { test } from "../redux/slices/authSlice";

const Index: NextPage = () => {
	const id = useSelector((state: RootState) => state.auth.id);

	const dispatch = useDispatch();

	return (
		<section className="text-5xl font-bold">
			<p>{id}</p>
			<button
				aria-label="Increment value"
				onClick={() => dispatch(test("Nayeem"))}
			>
				Set ID
			</button>
		</section>
	);
};

export default Index;
