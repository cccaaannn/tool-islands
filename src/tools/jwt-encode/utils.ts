import { SignAlgorithms } from "@/tools/jwt-encode/algorithm-select";


const safeJsonFormat = (value: string) => {
	try {
		return JSON.stringify(JSON.parse(value), null, 2);
	}
	catch (err) {
		return value;
	}
};

const getDefaults = () => {
	return {
		payload: JSON.stringify({ test: "test" }, null, 2),
		alg: SignAlgorithms[0],
		secret: crypto.randomUUID().toString(),
		issuedAt: true,
		audience: "test",
		issuer: "test",
		jti: "",
		subject: "",
		notBefore: "",
		expirationTime: new Date(Date.now() + (1000 * 60 * 60)).toISOString().slice(0, 19),
	} as const;
}

const Utils = {
	safeJsonFormat,
	getDefaults
};

export default Utils;
