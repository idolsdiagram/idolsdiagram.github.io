export const decode = (str: string): string =>
	Buffer.from(str.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString();
