function Body({ name }: { name: string | null }) {
	return (
		<div className="mt-[4.5rem] flex-1 bg-[#36393f]">Welcome {name}</div>
	);
}

export default Body;
