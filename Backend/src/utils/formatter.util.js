export const formatDate = (date) =>
	new Date(date).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});

export const formatCompactNumber = (number) => {
	return Intl.NumberFormat("en-US", { notation: "compact" }).format(number);
};
