function Header({ title, subtitle }: { title: string; subtitle: string }) {
	return (
		<div>
			<h3 className="text-center text-white">{title}</h3>
			<p className="text-[#b9bbbe]">{subtitle}</p>
		</div>
	);
}

export default Header;
