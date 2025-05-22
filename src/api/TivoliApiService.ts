import { buyTicket, awardStamp } from "./transactionService";

class TivoliApiService {
  // Definierar om vi kör i utvecklingsläge (localhost eller liknande)
  static isDevelopment =
    process.env.NODE_ENV === "development" ||
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  /**
   * Hämtar token från localStorage
   */
  static getToken(): string | null {
    return localStorage.getItem("token");
  }

  /**
   * Rapportera att spelaren har snurrat (drar en "biljett")
   */
  static async reportSpin(): Promise<void> {
    const token = this.getToken();

    if (!token) {
      if (this.isDevelopment) {
        console.warn(
          "[TivoliApiService] No token found – simulating spin transaction (development mode)"
        );
        return Promise.resolve();
      } else {
        throw new Error(
          "Authentication required. Please launch this game from Tivoli."
        );
      }
    }

    console.log("[TivoliApiService] Reporting spin with real token");
    return buyTicket(token);
  }

  /**
   * Rapportera att spelaren har vunnit (ger stämpel)
   */
  static async reportWinnings(): Promise<void> {
    const token = this.getToken();

    if (!token) {
      if (this.isDevelopment) {
        console.warn(
          "[TivoliApiService] No token found – simulating winnings transaction (development mode)"
        );
        return Promise.resolve();
      } else {
        throw new Error(
          "Authentication required. Please launch this game from Tivoli."
        );
      }
    }

    console.log("[TivoliApiService] Reporting winnings with real token");
    return awardStamp(token);
  }

  /**
   * (Valfritt) Hämta användarens saldo – placeholder just nu
   */
  static async getUserBalance(): Promise<number> {
    return 100; // Placeholder tills du integrerar riktig API-funktion
  }
}

export default TivoliApiService;
