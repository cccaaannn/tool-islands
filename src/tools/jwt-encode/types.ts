export interface JwtHistory {
	encoded: string;
	payload: string;
	alg: string;
	secret: string;
	issuedAt: boolean;
	audience: string;
	issuer: string;
	jti: string;
	subject: string;
	notBefore: string;
	expirationTime: string;
	date: string;
}
