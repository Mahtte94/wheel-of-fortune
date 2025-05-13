import { useState } from "react";

interface ApiResponse {
  readonly status: string;
  readonly message: string;
  readonly data?: unknown;
  readonly timestamp?: string;
}

enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

type GetApiProps = {
  // Add props here if needed in the future
};

const GetApi = ({}: GetApiProps = {}) => {
  const [result, setResult] = useState<string>("Click the button to test");
  const [loading, setLoading] = useState<boolean>(false);

  //  const apiUrl: string = "/api/test";
   const apiUrl: string = "https://yrgobanken.vip/api/test";

  const testApi = async (): Promise<void> => {
    setLoading(true);
    setResult("Loading...");

    try {
      const response: Response = await fetch(apiUrl, {
        method: HttpMethod.GET,
        headers: {
          "Content-Type": "application/json",
        } as const,
      });

      if (!response.ok) {
        throw new Error(
          `HTTP Error: ${response.status} ${response.statusText}`
        );
      }

      const data: ApiResponse = (await response.json()) as ApiResponse;

      const resultText: string = `Success! Status: ${
        response.status
      }\nData: ${JSON.stringify(data, null, 2)}`;

      setResult(resultText);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setResult(`Error: ${error.message}`);
      } else if (error instanceof TypeError) {
        setResult(`Network Error: ${error.message}`);
      } else if (typeof error === "string") {
        setResult(`Error: ${error}`);
      } else {
        setResult(`Unknown error occurred: ${String(error)}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const buttonText: string = loading ? "Testing..." : "Test API";
  const buttonClasses: string =
    "bg-amber-700 rounded w-full text-white px-4 py-2 disabled:opacity-50";
  const preClasses: string =
    "mt-4 p-4 bg-gray-100 rounded overflow-auto text-black";

  return (
    <div>
      <h2>API Test</h2>
      <button onClick={testApi} disabled={loading} className={buttonClasses}>
        {buttonText}
      </button>
      <pre className={preClasses}>{result}</pre>
    </div>
  );
};

export default GetApi;
