/* @jsxImportSource react */

import { useEffect, useState } from "react";
import CopyButton from "@/tools/jwt-encode/copy-button"
import type { JwtHistory } from "@/tools/jwt-encode/types";
import * as jose from "jose";
import StorageUtils from "@/utils/storage-utils";
import SwitchButton from "@/tools/jwt-encode/switch-button";
import C from "@/utils/constants";
import AlgorithmSelect from "@/tools/jwt-encode/algorithm-select";
import Utils from "@/tools/jwt-encode/utils";
import ResourceUtils from "@/utils/resource-utils";


const JwtEncodeTool = () => {

	const [payload, setPayload] = useState<string>(() => Utils.getDefaults().payload);
	const [alg, setAlg] = useState<string>(() => Utils.getDefaults().alg);
	const [secret, setSecret] = useState<string>(() => Utils.getDefaults().secret);
	const [issuedAt, setIssuedAt] = useState<boolean>(() => Utils.getDefaults().issuedAt);
	const [audience, setAudience] = useState<string>(() => Utils.getDefaults().audience);
	const [issuer, setIssuer] = useState<string>(() => Utils.getDefaults().issuer);
	const [jti, setJti] = useState<string>(() => Utils.getDefaults().jti);
	const [subject, setSubject] = useState<string>(() => Utils.getDefaults().subject);
	const [notBefore, setNotBefore] = useState<string>(() => Utils.getDefaults().notBefore);
	const [expirationTime, setExpirationTime] = useState<string>(() => Utils.getDefaults().expirationTime);

	const [decodeError, setDecodeError] = useState("");
	const [encoded, setEncoded] = useState("");

	const [history, setHistory] = useState<JwtHistory[]>([]);

	const [isExpanded, setIsExpanded] = useState(false);

	const toggleExpand = () => {
		setIsExpanded(!isExpanded);
		StorageUtils.toggleJsonArrayItem(C.ToolLayout.ExpandedKey, C.ToolId.JwtEncode, !isExpanded);
	};

	useEffect(() => {
		const expandedTools = StorageUtils.loadJsonArray<string>(C.ToolLayout.ExpandedKey);
		const existingHistory = StorageUtils.loadJsonArray<JwtHistory>(C.ToolId.JwtEncode);

		setIsExpanded(expandedTools.includes(C.ToolId.JwtEncode));
		setHistory(existingHistory);
	}, []);

	const saveToLocalStorage = (newItem: JwtHistory) => {
		const storageHistory = StorageUtils.loadJsonArray<JwtHistory>(C.ToolId.JwtEncode);
		const newHistory = [newItem, ...storageHistory].slice(0, C.History.Max);

		setHistory(newHistory);
		StorageUtils.saveJsonArray(C.ToolId.JwtEncode, newHistory);
	};

	const clearHistory = () => {
		setHistory([]);
		StorageUtils.removeJsonArray(C.ToolId.JwtEncode);
	};

	const onSwitch = (item: JwtHistory) => {
		setEncoded(item.encoded);
		setPayload(item.payload);
		setAlg(item.alg);
		setSecret(item.secret);
		setIssuedAt(item.issuedAt);
		setAudience(item.audience);
		setIssuer(item.issuer);
		setJti(item.jti);
		setSubject(item.subject);
		setNotBefore(item.notBefore);
		setExpirationTime(item.expirationTime);
		setDecodeError("");
	};

	const onPayload = async (value: string) => {

		setPayload(Utils.safeJsonFormat(value));

		if (!value || value.trim() === "") {
			return;
		}
	};

	const onEncode = async () => {
		try {
			const jsonPayload = JSON.parse(payload);

			const encodedSecret = new TextEncoder().encode(secret)

			const j = new jose.SignJWT(jsonPayload)
				.setProtectedHeader({ alg, typ: "JWT" });

			if (issuedAt) j.setIssuedAt();
			if (audience) j.setAudience(audience);
			if (issuer) j.setIssuer(issuer);
			if (jti) j.setJti(jti);
			if (subject) j.setSubject(subject);
			if (notBefore) j.setNotBefore(new Date(notBefore));
			if (expirationTime) j.setExpirationTime(new Date(expirationTime));

			const jwt = await j.sign(encodedSecret);

			setEncoded(jwt);

			setDecodeError("");

			saveToLocalStorage({
				encoded: jwt,
				payload, alg, secret,
				issuedAt, audience, issuer, jti,
				subject, notBefore, expirationTime,
				date: new Date().toISOString()
			});
		}
		catch (err) {
			setDecodeError("Invalid JWT")
		}
	};

	return (
		<div
			className={
				`card card-border w-full h-fit transition-all duration-500 ease-out overflow-hidden bg-inherit 
				 bg-gradient-to-br from-sky-500/20 via-sky-900/20 to-transparent border-sky-900/70 
				${isExpanded ? 'md:w-2xl h-[1300px]' : 'md:w-sm h-[140px]'}`
			}
		>
			<div className="card-body">
				<div className="flex justify-between items-center">
					<h2 className="card-title lg:text-2xl sm:text-xl text-lg">
						Jwt encode
					</h2>
					<button onClick={toggleExpand} className="btn btn-ghost btn-info btn-xs px-1 py-2">
						{
							isExpanded &&
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
								stroke="currentColor" className="size-4">
								<path strokeLinecap="round" strokeLinejoin="round"
									d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25" />
							</svg>
						}
						{
							!isExpanded &&
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
								stroke="currentColor" className="size-4">
								<path strokeLinecap="round" strokeLinejoin="round"
									d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
							</svg>
						}
					</button>
				</div>

				<div
					className={
						`transition-all duration-500 ease-out
						${isExpanded ? 'opacity-100 max-h-[1200px]' : 'opacity-0 max-h-0 overflow-hidden'}`
					}
				>
					<div className="flex justify-between flex-col gap-2">
						<fieldset className="fieldset">
							<legend className="fieldset-legend">
								Encoded
								<CopyButton text={encoded} />
							</legend>
							<textarea disabled value={encoded}
								placeholder="Enter JWT to decode"
								style={{ color: "white", cursor: "text" }}
								className="textarea textarea-lg textarea-primary w-full h-20"></textarea>
							<div className="fieldset-label text-error">{decodeError}</div>
						</fieldset>

						<div className="flex justify-between gap-2 h-full flex-wrap sm:flex-nowrap">
							<div className="flex flex-col gap-1 w-1/2 flex-grow">
								<AlgorithmSelect
									alg={alg}
									onChange={setAlg}
								/>

								<fieldset className="fieldset">
									<legend className="fieldset-label">
										Secret
										<CopyButton text={secret} size="sm" />
									</legend>
									<input
										value={secret}
										onInput={e => setSecret(e.currentTarget.value)}
										placeholder="Secret"
										className="input input-primary w-full border-sky-900 focus:outline-2 focus:outline-sky-700"
									/>
								</fieldset>

								<fieldset className="fieldset flex-grow flex">
									<legend className="fieldset-label">
										Payload
										<CopyButton text={payload} size="sm" />
									</legend>
									<textarea
										value={payload}
										onInput={e => onPayload(e.currentTarget.value)}
										placeholder="Body (JSON)"
										className="textarea textarea-lg textarea-primary w-full min-h-[100px] h-full border-sky-900 focus:outline-2 focus:outline-sky-700"></textarea>
								</fieldset>
							</div>

							<div className="flex flex-col gap-1 w-1/2 flex-grow">
								<fieldset className="fieldset">
									<legend className="fieldset-label">
										Audience (aud)
										<CopyButton text={audience} size="sm" />
									</legend>
									<input
										value={audience}
										onInput={e => setAudience(e.currentTarget.value)}
										placeholder="Audience"
										className="input input-primary w-full border-sky-900 focus:outline-2 focus:outline-sky-700"
									/>
								</fieldset>

								<fieldset className="fieldset">
									<legend className="fieldset-label">
										Issuer (iss)
										<CopyButton text={issuer} size="sm" />
									</legend>
									<input
										value={issuer}
										onInput={e => setIssuer(e.currentTarget.value)}
										placeholder="Issuer"
										className="input input-primary w-full border-sky-900 focus:outline-2 focus:outline-sky-700"
									/>
								</fieldset>

								<fieldset className="fieldset">
									<legend className="fieldset-label">
										Subject (sub)
										<CopyButton text={subject} size="sm" />
									</legend>
									<input
										value={subject}
										onInput={e => setSubject(e.currentTarget.value)}
										placeholder="Subject"
										className="input input-primary w-full border-sky-900 focus:outline-2 focus:outline-sky-700"
									/>
								</fieldset>

								<fieldset className="fieldset">
									<legend className="fieldset-label">
										Jti
										<CopyButton text={jti} size="sm" />
									</legend>
									<input
										value={jti}
										onInput={e => setJti(e.currentTarget.value)}
										placeholder="Jti"
										className="input input-primary w-full border-sky-900 focus:outline-2 focus:outline-sky-700"
									/>
								</fieldset>

								<fieldset className="fieldset">
									<legend className="fieldset-label">
										Expiration time (exp)
										<CopyButton text={expirationTime} size="sm" />
									</legend>
									<input
										value={expirationTime}
										onInput={e => setExpirationTime(e.currentTarget.value)}
										type="datetime-local"
										className="input input-primary w-full border-sky-900 focus:outline-2 focus:outline-sky-700"
									/>
								</fieldset>

								<fieldset className="fieldset">
									<legend className="fieldset-label">
										Not before (nbf)
										<CopyButton text={notBefore} size="sm" />
									</legend>
									<input
										value={notBefore}
										onInput={e => setNotBefore(e.currentTarget.value)}
										type="datetime-local"
										className="input input-primary w-full border-sky-900 focus:outline-2 focus:outline-sky-700"
									/>
								</fieldset>

								<div className="flex justify-between w-full">
									<label className="fieldset">
										<legend className="fieldset-label">Issued at (iat)</legend>
										<input
											type="checkbox"
											className="checkbox"
											checked={issuedAt}
											onChange={e => setIssuedAt(e.currentTarget.checked)}
										/>
									</label>

									<label className="fieldset">
										<legend className="fieldset-label">Generate</legend>
										<button
											onClick={onEncode}
											className="btn btn-soft btn-info btn-sm"
										>
											<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
												<path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
											</svg>
										</button>
									</label>
								</div>
							</div>
						</div>
					</div>

					<div className="flex justify-between items-center mt-4">
						<h3 className="text-lg">History ({history.length}/{C.History.Max})</h3>
						<button onClick={clearHistory} className="btn btn-ghost btn-error btn-sm px-1 py-2">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
								stroke="currentColor" className="size-4">
								<path strokeLinecap="round" strokeLinejoin="round"
									d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
							</svg>
						</button>
					</div>

					<div className="overflow-auto max-h-[200px]">
						<table className="table table-pin-rows table-zebra">
							<thead>
								<tr>
									<th className="p-2">#</th>
									<th className="p-2">Swc</th>
									<th className="p-2">Copy</th>
									<th className="p-2">Token</th>
								</tr>
							</thead>
							<tbody>
								{
									history.length === 0 &&
									<tr>
										<td colSpan={4} className="text-center">
											No history items
										</td>
									</tr>
								}
								{
									history.map((item, index) =>
										<tr key={index}>
											<td className="text-left p-2">
												<div className="tooltip tooltip-right" data-tip={new Date(item.date).toLocaleString()}>
													<kbd className="kbd">{index + 1}</kbd>
												</div>
											</td>
											<td className="text-left p-2">
												<SwitchButton onSwitch={() => onSwitch(item)} />
											</td>
											<td className="text-left p-2">
												<CopyButton text={item.encoded} />
											</td>
											<td className="p-2 break-keep text-nowrap">
												<p>{item.encoded}</p>
											</td>
										</tr>
									)
								}
							</tbody>
						</table>
					</div>
				</div>

				<div
					className={
						`transition-all duration-500 ease-out 
						${isExpanded ? 'opacity-0 max-h-0 overflow-hidden' : 'opacity-100 max-h-[80px]'}`
					}
				>
					<div className="text-center">
						<p className="mb-2 text-sm opacity-70">Jwt encoding tool</p>

						<div className="flex items-end justify-center rounded-lg p-2">
							<span className="text-xs opacity-70 mr-2">Built with</span>
							<div className="tooltip tooltip-top" data-tip="React">
								<a href="https://react.dev" target="_blank" rel="noopener noreferrer">
									<img src={ResourceUtils.getLogo("react")} alt="React" loading="lazy" decoding="async" width="20" height="20" className="inline" />
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div >
	)
}

export default JwtEncodeTool;
