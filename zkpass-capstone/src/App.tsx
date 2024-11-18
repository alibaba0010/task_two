import { type FormEvent, useEffect, useState } from "react";
import "./App.css";
import TransgateConnect from "@zkpass/transgate-js-sdk";
import type { Result } from "@zkpass/transgate-js-sdk/lib/types";
import { ethers } from "ethers";

const App = () => {
	const [appId, setAppId] = useState<string>("xxxxxxxxxxx");
	const [schemaId, setSchemaId] = useState<string>("xxxxxxxxx");
	const [result, setResult] = useState<Result | undefined>(undefined);

  const requestVerifyMessage = async (
		e: FormEvent,
		appId: string,
		schemaId: string,
	) => {
		e.preventDefault();
		try {
			const connector = new TransgateConnect(appId);
			const isAvailable = await connector.isTransgateAvailable();

			if (isAvailable) {
				const provider = window.ethereum ? new ethers.BrowserProvider(window.ethereum) : null;
				const signer = await provider?.getSigner()
				const recipient = await signer?.getAddress()
				const res = (await connector.launch(schemaId, recipient)) as Result;
				console.log("Result", res);

				const verifiedResult = connector.verifyProofMessageSignature(
					"evm",
					schemaId,
					res
				);

				if (verifiedResult) {
					alert("Verified Result");
					setResult(res);
				}

} else {
				console.log(
					"Please install zkPass Transgate from https://chromewebstore.google.com/detail/zkpass-transgate/afkoofjocpbclhnldmmaphappihehpma",
				);
			}
		} catch (error) {
			const transgateError = error as TransgateError;
			alert(`Transgate Error: ${transgateError.message}`);
			console.log(transgateError);
		}
	};

	return (
		<div className="app">
			<form
				className="form"
				onSubmit={(e) => requestVerifyMessage(e, appId, schemaId)}
			>
				<label htmlFor="app-id">
					AppId:
					<input
						id="app-id"
						type="text"
						placeholder="Your App ID"
						value={appId}
						onChange={(e) => setAppId(e.target.value)}
					/>
				</label>
				<label htmlFor="schema-id">
					SchemaId:
					<input
						id="schema-id"
						type="text"
						placeholder="Your App ID"
						value={schemaId}
						onChange={(e) => setSchemaId(e.target.value)}
					/>
				</label>
				<button type="submit">Start Verification</button>
				{result !== undefined ? (
					<pre>Result: {JSON.stringify(result, null, 2)}</pre>
				) : (
					""
				)}
			</form>
		</div>
	);
}

export default App;
export type TransgateError = {
	message: string,
	code: number
}