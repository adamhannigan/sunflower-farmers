import { metamask } from "lib/blockchain/metamask";
import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";

const API_URL = CONFIG.API_URL;

type Request = {
  farmId: number;
  token: string;
};

type Payload = {
  farmId: number;
  resourceIds: number[];
  resourceAmounts: string[];
  sender: string;
  sessionId: string;
  sfl: string;
  nonce: string;
  metadata: string;
  deadline: number;
  nextSessionId: string;
};

type Response = {
  signature: string;
  payload: Payload;
};

export async function listRequest(request: Request): Promise<Response> {
  // Call backend list-trade
  const response = await window.fetch(
    `${API_URL}/expand-land/${request.farmId}`,
    {
      method: "POST",
      //mode: "no-cors",
      headers: {
        "content-type": "application/json;charset=UTF-8",
        Authorization: `Bearer ${request.token}`,
        accept: "application/json",
      },
      body: JSON.stringify({}),
    }
  );

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status !== 200 || !response.ok) {
    throw new Error("Could not expand land");
  }

  const data = await response.json();

  return data;
}

export async function expand(request: Request) {
  const response = await listRequest(request);

  return await metamask
    .getSessionManager()
    .expandLand({ ...response.payload, signature: response.signature });
}
