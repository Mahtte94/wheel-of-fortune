// TivoliApiService.ts
enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

interface ApiResponse {
  readonly status: string;
  readonly message: string;
  readonly data?: unknown;
  readonly timestamp?: string;
}

// Updated to match the Tivoli API format
interface TransactionRequest {
  amusement_id: number;
  group_id: number;
  stake_amount?: number | null;
  payout_amount?: number | null;
  stamp_id?: number | null;
}

interface BalanceResponse {
  status: string;
  message: string;
  data: {
    balance: number;
    userId: number;
    [key: string]: any;
  };
}

class TivoliApiService {
  private readonly apiUrl: string;
  private readonly apiKey: string;
  private readonly isDevelopment: boolean;
  private readonly amusementId: number;
  private readonly groupId: number;

  constructor() {
    // Detect if we're in development or production
    this.isDevelopment = 
      window.location.hostname === "localhost" || 
      window.location.hostname === "127.0.0.1";
    
    // Use the same API URL for both environments, since CORS is configured for localhost:5173
    this.apiUrl = "";
    this.apiKey = "ba3810c3a695389235b63bb3a3c8eb1adbdd3197e09c4539b58e365f12bb4ca6"; 
    
    // Your amusement and group IDs - replace with your actual values
    this.amusementId = 7; // Replace with your actual amusement ID
    this.groupId = 6;     // Replace with your actual group ID
    
    // Log the environment for debugging
    if (this.isDevelopment) {
      console.log("TivoliApiService initialized in DEVELOPMENT mode (localhost:5173)");
    } else {
      console.log("TivoliApiService initialized in PRODUCTION mode");
    }
    console.log("Using API URL:", this.apiUrl);
  }

  /**
   * Report a spin (charge the user for playing)
   * @param amount The cost of the spin
   * @returns API response
   */
  async reportSpin(amount: number): Promise<ApiResponse> {
    return this.sendTransaction({
      amusement_id: this.amusementId,
      group_id: this.groupId,
      stake_amount: amount,
      payout_amount: null
    });
  }

  /**
   * Report winnings (pay the user)
   * @param amount The amount the user won
   * @returns API response
   */
  async reportWinnings(amount: number): Promise<ApiResponse> {
    return this.sendTransaction({
      amusement_id: this.amusementId,
      group_id: this.groupId,
      stake_amount: null,
      payout_amount: amount
    });
  }

  /**
   * Send a transaction to the Tivoli API
   * @param transaction The transaction data
   * @returns API response
   */
  private async sendTransaction(transaction: TransactionRequest): Promise<ApiResponse> {
    const token = localStorage.getItem("token");
    
    if (!token) {
      throw new Error("No authentication token found. User must be logged in via Tivoli.");
    }

    try {
      console.log("Sending transaction:", transaction);
      
      const response = await fetch(`${this.apiUrl}/api/transactions`, {
        method: HttpMethod.POST,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "X-API-Key": this.apiKey
        },
        body: JSON.stringify(transaction)
      });

      console.log("Transaction API response status:", response.status);
      
      if (!response.ok) {
        // Try to get error details
        let errorMessage = `HTTP Error: ${response.status} ${response.statusText}`;
        
        try {
          const errorData = await response.json();
          console.error("API error details:", errorData);
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch {
          // If we can't parse the error response, just use the status
        }
        
        throw new Error(errorMessage);
      }

      const responseData = await response.json() as ApiResponse;
      console.log("Transaction successful:", responseData);
      return responseData;
    } catch (error) {
      console.error("Error sending transaction:", error);
      throw error;
    }
  }

  /**
   * Fetch the user's current balance from Tivoli API
   * @returns Promise with the user's balance or null if error
   */
  async getUserBalance(): Promise<number | null> {
    const token = localStorage.getItem("token");
    
    if (!token) {
      console.error("No JWT token found");
      return null;
    }
  
    try {
      console.log("Fetching user balance");
      
      const response = await fetch(`${this.apiUrl}/api/users`, {
        method: HttpMethod.GET,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "X-API-Key": this.apiKey
        }
      });
  
      console.log("Balance API response status:", response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }
  
      // The response is an array of users
      const users = await response.json() as Array<{
        id: number | string;
        name: string;
        email: string;
        balance: number;
        [key: string]: any;
      }>;
      
      console.log("Users response:", users);
      
      // Find the current user - we might need to decode the JWT to get the user ID
      let userId: number | string | undefined;
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        userId = decodedToken.sub;
        console.log("Current user ID from token:", userId);
      } catch (e) {
        console.error("Error decoding token:", e);
      }
      
      // Try to find the user by ID if we have it
      let userBalance: number | null = null;
      if (userId !== undefined) {
        const currentUser = users.find(user => String(user.id) === String(userId));
        if (currentUser) {
          userBalance = currentUser.balance;
          console.log("Found user by ID, balance:", userBalance);
        }
      }
      
      // If we couldn't find by ID or couldn't get ID, just use the first user
      // This is a fallback and not ideal
      if (userBalance === null && users.length > 0) {
        userBalance = users[0].balance;
        console.log("Using first user's balance:", userBalance);
      }
      
      if (userBalance === null) {
        console.error("Could not find user balance in response");
        return null;
      }
      
      console.log("Balance fetched successfully:", userBalance);
      return userBalance;
    } catch (error) {
      console.error("Error fetching user balance:", error);
      return null;
    }
  }
  /**
   * Test the API connection
   * @returns API response
   */
  async testApiConnection(): Promise<ApiResponse> {
    try {
      const testUrl = `${this.apiUrl}/api/test`;
      console.log("Testing API connection to:", testUrl);
      
      const response = await fetch(testUrl, {
        method: HttpMethod.GET,
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": this.apiKey
        }
      });

      console.log("API test response status:", response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      return await response.json() as ApiResponse;
    } catch (error) {
      console.error("Error testing API connection:", error);
      
      // More detailed error logging
      if (error instanceof TypeError) {
        console.error("This is likely a CORS or network connectivity issue");
        console.error("Make sure your API URL is correct and accessible");
        
        if (this.isDevelopment) {
          console.error("For local development, make sure you're running on port 5173 (Vite default)");
          console.error("Current origin:", window.location.origin);
        } else {
          console.error("For production, ensure your domain is allowed by the API's CORS policy");
        }
      }
      
      throw error;
    }
  }
  
  /**
   * Debug method to test a direct transaction
   * This is just for testing and debugging
   */
  async testTransaction(isSpin: boolean, amount: number): Promise<ApiResponse> {
    if (isSpin) {
      return this.reportSpin(amount);
    } else {
      return this.reportWinnings(amount);
    }
  }
}

export default new TivoliApiService();