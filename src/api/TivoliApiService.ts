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

interface GameResult {
  amount: number;
  outcomeType: string;
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

  constructor() {
    // For development, you'd want to make these configurable or environment variables
    this.apiUrl = "https://yrgobanken.vip";
    // Remove the semicolon at the end of your API key
    this.apiKey = "ba3810c3a695389235b63bb3a3c8eb1adbdd3197e09c4539b58e365f12bb4ca6" 
  }

  /**
   * Send a game result to the Tivoli API
   * @param result The game result to report
   * @returns API response
   */
  async reportGameResult(result: GameResult): Promise<ApiResponse> {
    const token = localStorage.getItem("token");
    
    if (!token) {
      throw new Error("No authentication token found. User must be logged in via Tivoli.");
    }

    try {
      const response = await fetch(`${this.apiUrl}/api/transactions`, {
        method: HttpMethod.POST,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "X-API-Key": this.apiKey
        },
        body: JSON.stringify({
          amount: result.amount,
          type: result.outcomeType
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      return await response.json() as ApiResponse;
    } catch (error) {
      console.error("Error reporting game result:", error);
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
      const response = await fetch(`${this.apiUrl}/api/users/balance`, {
        method: HttpMethod.GET,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "X-API-Key": this.apiKey
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as BalanceResponse;
      return data.data.balance;
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
      console.log("Testing API connection to:", `${this.apiUrl}/api/test`);
      
      const response = await fetch(`${this.apiUrl}/api/test`, {
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
        console.error("If deployed, ensure your domain is allowed by the API's CORS policy");
      }
      
      throw error;
    }
  }
}

export default new TivoliApiService();