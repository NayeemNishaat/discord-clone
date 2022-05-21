export const validMail = (email: string) => {
	if (
		email === "" ||
		!new RegExp(
			/^[^\W][a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
		).test(email.toLowerCase())
	)
		return false;

	return true;
};
