import { GAME_CONFIG } from "../context/gameConfig";

async function postTransaction(
  jwt: string,
  payload: Record<string, unknown>
): Promise<void> {
  if (process.env.NODE_ENV === "development") {
    return;
  }

  try {
    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();

      let errorData: { error?: string; message?: string } = {};
      try {
        errorData = JSON.parse(text);
      } catch {
        errorData = { error: "Invalid error format from API" };
      }

      throw new Error(
        errorData.error || errorData.message || "Transaction failed"
      );
    }
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unknown error during transaction";
    throw new Error(message);
  }
}

export async function buyTicket(jwt: string): Promise<void> {
  return postTransaction(jwt, {
    amusement_id: GAME_CONFIG.AMUSEMENT_ID,
    stake_amount: GAME_CONFIG.COST,
  });
}

export async function awardStamp(jwt: string): Promise<void> {
  return postTransaction(jwt, {
    amusement_id: GAME_CONFIG.AMUSEMENT_ID,
    stamp_id: GAME_CONFIG.STAMP_ID,
  });
}