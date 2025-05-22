import { buyTicket, awardStamp } from "./transactionService";

class TivoliApiService {
  static isDevelopment =
    process.env.NODE_ENV === "development" ||
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "http://tivoli.yrgobanken.vip" ||
    window.location.hostname === "http://yrgobanken.vip";

  /**
   * Check if we're in test mode
   */
  static isTestMode(): boolean {
    const token = localStorage.getItem("token");
    return this.isDevelopment && token === "test-token-for-development";
  }

  /**
   * Get the token from localStorage
   */
  static getToken(): string | null {
    return localStorage.getItem("token");
  }

  /**
   * Report a spin (charge the user for playing)
   */
  static async reportSpin(): Promise<void> {
    if (this.isDevelopment || this.isTestMode()) {
      console.log(
        "Development/Test mode: Simulating successful spin transaction"
      );
      return Promise.resolve();
    }

    const token = this.getToken();
    if (!token) {
      throw new Error(
        "Authentication required. Please launch this game from Tivoli."
      );
    }

    return buyTicket(token);
  }

  /**
   * Report winnings (pay the user)
   */
  static async reportWinnings(): Promise<void> {
    if (this.isDevelopment || this.isTestMode()) {
      console.log(
        "Development/Test mode: Simulating successful winnings transaction"
      );
      return Promise.resolve();
    }

    const token = this.getToken();
    if (!token) {
      throw new Error(
        "Authentication required. Please launch this game from Tivoli."
      );
    }

    return awardStamp(token);
  }

  static async getUserBalance(): Promise<number> {
    return 100;
  }
}

export default TivoliApiService;
