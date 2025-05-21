import { buyTicket, awardStamp } from './transactionService';

class TivoliApiService {
  // Development detection
  static isDevelopment = 
    process.env.NODE_ENV === 'development' || 
    window.location.hostname === "localhost" || 
    window.location.hostname === "127.0.0.1";
  
  /**
   * Check if user is authenticated with a valid token
   */
  static isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token; // Returns true if token exists
  }
  
  /**
   * Get the Tivoli login URL
   */
  static getTivoliLoginUrl(): string {
    const redirectUrl = encodeURIComponent(window.location.href);
    return `https://tivoli.yrgobanken.vip/?redirect=${redirectUrl}`;
  }
  
  /**
   * Report a spin (charge the user for playing)
   */
  static async reportSpin(): Promise<void> {
    // Allow gameplay in development mode without a token
    if (this.isDevelopment) {
      console.log("Development mode: Simulating successful spin transaction");
      return Promise.resolve();
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No authentication token found when reporting spin");
      
      // Provide a helpful error message
      const errorMessage = 
        "Authentication required to play. Please log in through Tivoli and return to this site.";
      
      // This will be caught and displayed to the user
      throw new Error(errorMessage);
    }
    
    try {
      // Use buyTicket from transactionService
      return await buyTicket(token);
    } catch (error) {
      console.error("Error in reportSpin:", error);
      
      // Improve the error message if it's from the transactionService
      if (error instanceof Error) {
        // If the error mentions transaction failed, provide a more user-friendly message
        if (error.message.includes("Transaction failed")) {
          throw new Error("Unable to process your spin. Please try again or check your account.");
        }
        throw error;
      }
      throw new Error("Unknown error occurred when reporting spin");
    }
  }
  
  /**
   * Report winnings (pay the user)
   */
  static async reportWinnings(): Promise<void> {
    // Allow gameplay in development mode without a token
    if (this.isDevelopment) {
      console.log("Development mode: Simulating successful winnings transaction");
      return Promise.resolve();
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No authentication token found when reporting winnings");
      throw new Error('Authentication required to collect winnings. Please log in through Tivoli.');
    }
    
    try {
      // Use awardStamp from transactionService
      return await awardStamp(token);
    } catch (error) {
      console.error("Error in reportWinnings:", error);
      
      // Improve the error message if it's from the transactionService
      if (error instanceof Error) {
        // If the error mentions transaction failed, provide a more user-friendly message
        if (error.message.includes("Transaction failed")) {
          throw new Error("Unable to process your winnings. Please try again or contact support.");
        }
        throw error;
      }
      throw new Error("Unknown error occurred when reporting winnings");
    }
  }

  /**
   * Fetch the user's current balance
   */
  static async getUserBalance(): Promise<number> {
    // In development or when balance isn't needed, return a placeholder
    return 100;
  }
}

export default TivoliApiService;