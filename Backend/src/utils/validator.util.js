export const validateEmail = (email) => {
	return String(email)
		.toLowerCase()
		.match(/^\S+@\S+\.\S+$/);
};

export const isStrongPassword = (password) => {
	return (
		password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)
	);
};
