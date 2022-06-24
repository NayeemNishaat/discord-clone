function Form(props: { children: React.ReactNode }) {
	return (
		<section className="flex h-screen w-full items-center justify-center bg-[#5866f2]">
			<form className="flex h-[25rem] w-[45rem] flex-col items-center justify-center rounded bg-[#f8f8ff] p-6 shadow-[0_2px_10px_0_#000000af]">
				{props.children}
			</form>
		</section>
	);
}

export default Form;
