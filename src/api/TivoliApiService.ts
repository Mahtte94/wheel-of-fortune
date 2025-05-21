import { buyTicket, awardStamp } from './transactionService';

class TivoliApiService {
  // Development detection
  static isDevelopment = 
    process.env.NODE_ENV === 'development' || 
    window.location.hostname === "localhost" || 
    window.location.hostname === "127.0.0.1";
  
  /**
   * Get the token from localStorage
   */
  static getToken(): string | null {
    if (this.isDevelopment) {
      return "dev-token"; // Fake token for development
    }
    return localStorage.getItem('token');
  }
  
  /**
   * Report a spin (charge the user for playing)
   */
  static async reportSpin(): Promise<void> {
    if (this.isDevelopment) {
      console.log("Development mode: Simulating successful spin transaction");
      return Promise.resolve();
    }
    
    const token = this.getToken();
    if (!token) {
      throw new Error('Authentication required. Please launch this game from Tivoli.');
    }
    
    return buyTicket(token);
  }
  
  /**
   * Report winnings (pay the user)
   */
  static async reportWinnings(): Promise<void> {
    if (this.isDevelopment) {
      console.log("Development mode: Simulating successful winnings transaction");
      return Promise.resolve();
    }
    
    const token = this.getToken();
    if (!token) {
      throw new Error('Authentication required. Please launch this game from Tivoli.');
    }
    
    return awardStamp(token);
  }

  /**
   * Fetch the user's current balance
   */
  static async getUserBalance(): Promise<number> {
    return 100; // Placeholder value
  }
}

export default TivoliApiService;