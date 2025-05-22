import { GAME_CONFIG } from "../context/gameConfig";

// Dynamiskt API-base-URL beroende på miljö
const API_BASE_URL = import.meta.env.DEV
  ? "/api"
  : import.meta.env.VITE_API_URL || "/api";

// Den här funktionen skickar transaktionen till API:t
async function postTransaction(
  jwt: string,
  payload: Record<string, unknown>
): Promise<void> {
  console.log("API_BASE_URL is:", API_BASE_URL);

  try {
    console.log("Sending transaction with payload:", payload);
    console.log(
      "Using JWT token (first 10 chars):",
      jwt.substring(0, 10) + "..."
    );

    const res = await fetch(`${API_BASE_URL}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
        "X-API-Key": GAME_CONFIG.API_KEY, // Kontrollera att detta är satt
      },
      body: JSON.stringify(payload),
    });

    console.log("Transaction response status:", res.status);

    if (!res.ok) {
      const text = await res.text();
      console.error("Transaction failed with response:", text);

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

    console.log("Transaction successful");
  } catch (err: unknown) {
    console.error("Transaction error:", err);
    const message =
      err instanceof Error ? err.message : "Unknown error during transaction";
    throw new Error(message);
  }
}

// Används för att rapportera ett spel (drar pengar)
export async function buyTicket(jwt: string): Promise<void> {
  console.log("Buying ticket with amusement ID:", GAME_CONFIG.AMUSEMENT_ID);
  return postTransaction(jwt, {
    amusement_id: GAME_CONFIG.AMUSEMENT_ID,
    stake_amount: GAME_CONFIG.COST,
  });
}

// Används för att rapportera vinst (ger stämpel)
export async function awardStamp(jwt: string): Promise<void> {
  console.log("Awarding stamp with stamp ID:", GAME_CONFIG.STAMP_ID);
  return postTransaction(jwt, {
    amusement_id: GAME_CONFIG.AMUSEMENT_ID,
    stamp_id: GAME_CONFIG.STAMP_ID,
  });
}
