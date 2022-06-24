function Header({ title, subtitle }: { title: string; subtitle: string }) {
	return (
		<div>
			<h3 className="text-center">{title}</h3>
			<p>{subtitle}</p>
		</div>
	);
}

export default Header;
