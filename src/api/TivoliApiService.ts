import { buyTicket, awardStamp } from './transactionService';

class TivoliApiService {
  // Development detection
  static isDevelopment = 
    process.env.NODE_ENV === 'development' || 
    window.location.hostname === "localhost" || 
    window.location.hostname === "127.0.0.1";
  
  /**
   * Debug method to check the token
   */
  static debugToken(): void {
    console.log("==== TOKEN DEBUG ====");
    try {
      const token = localStorage.getItem('token');
      console.log("Token exists in localStorage:", !!token);
      if (token) {
        console.log("Token length:", token.length);
        console.log("Token first 10 chars:", token.substring(0, 10) + "...");
      }
      
      // Check URL parameter
      const urlParams = new URLSearchParams(window.location.search);
      const tokenFromUrl = urlParams.get("token");
      console.log("Token exists in URL:", !!tokenFromUrl);
      
      if (tokenFromUrl && !token) {
        console.log("Token found in URL but not in localStorage - will save it");
        localStorage.setItem('token', tokenFromUrl);
        console.log("Token saved to localStorage");
      }
    } catch (e) {
      console.error("Error in debugToken:", e);
    }
    console.log("==== END TOKEN DEBUG ====");
  }
  
  /**
   * Report a spin (charge the user for playing)
   */
  static async reportSpin(): Promise<void> {
    this.debugToken(); // Run debug logging
    
    // Allow gameplay in development mode
    if (this.isDevelopment) {
      console.log("Development mode: Simulating successful spin transaction");
      return Promise.resolve();
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
      // Check if token is in URL but not saved yet
      const urlParams = new URLSearchParams(window.location.search);
      const tokenFromUrl = urlParams.get("token");
      
      if (tokenFromUrl) {
        console.log("Found token in URL, saving to localStorage");
        localStorage.setItem('token', tokenFromUrl);
        // Use the token from URL
        return buyTicket(tokenFromUrl);
      }
      
      console.error("No authentication token found when reporting spin");
      throw new Error('Authentication required to play. Please log in through Tivoli and return to this site.');
    }
    
    console.log("Using token from localStorage for spin transaction");
    return buyTicket(token);
  }
  
  /**
   * Report winnings (pay the user)
   */
  static async reportWinnings(): Promise<void> {
    // Allow gameplay in development mode
    if (this.isDevelopment) {
      console.log("Development mode: Simulating successful winnings transaction");
      return Promise.resolve();
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
      // Check if token is in URL but not saved yet
      const urlParams = new URLSearchParams(window.location.search);
      const tokenFromUrl = urlParams.get("token");
      
      if (tokenFromUrl) {
        console.log("Found token in URL, saving to localStorage");
        localStorage.setItem('token', tokenFromUrl);
        // Use the token from URL
        return awardStamp(tokenFromUrl);
      }
      
      console.error("No authentication token found when reporting winnings");
      throw new Error('Authentication required to collect winnings. Please log in through Tivoli.');
    }
    
    console.log("Using token from localStorage for winnings transaction");
    return awardStamp(token);
  }

  /**
   * Fetch the user's current balance
   */
  static async getUserBalance(): Promise<number> {
    // For simplicity, return a placeholder value
    return 100;
  }
}

export default TivoliApiService;