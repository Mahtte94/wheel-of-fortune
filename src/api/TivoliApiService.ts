import { buyTicket, awardStamp } from './transactionService';

// Simple class that uses transactionService for all operations
class TivoliApiService {
  /**
   * Report a spin (charge the user for playing)
   */
  static async reportSpin(): Promise<void> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No auth token available');
    
    // Use buyTicket from transactionService
    return buyTicket(token);
  }
  
  /**
   * Report winnings (pay the user)
   */
  static async reportWinnings(): Promise<void> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No auth token available');
    
    // Use awardStamp from transactionService
    return awardStamp(token);
  }

  /**
   * Fetch the user's current balance
   * This is a simplified implementation since you mentioned
   * you don't need to show the actual balance
   */
  static async getUserBalance(): Promise<number> {
    return 100; // Placeholder value
  }
}

export default TivoliApiService;