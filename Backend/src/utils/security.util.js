import xss from "xss";

export const sanitizeInput = (data) => {
	return xss(data);
};
