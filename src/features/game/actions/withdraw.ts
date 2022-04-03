import { metamask } from "lib/blockchain/metamask";
import { CONFIG } from "lib/config";

const API_URL = CONFIG.API_URL;

type Options = {
  farmId: number;
  sessionId: string;
  sfl: number;
  ids: number[];
  amounts: string[];
  token: string;
  captcha?: string;
};
export async function withdraw({
  farmId,
  sessionId,
  sfl,
  ids,
  amounts,
  token,
  captcha,
}: Options) {
  const response = await window.fetch(`${API_URL}/withdraw`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      sessionId: sessionId,
      farmId: farmId,
      sfl: sfl,
      ids: ids,
      amounts: amounts,
      captcha,
    }),
  });

  if (response.status === 429) {
    return { verified: false };
  }

  const transaction = await response.json();

  const newSessionId = await metamask.getSessionManager().withdraw(transaction);

  return { sessionId: newSessionId, verified: true };
}
