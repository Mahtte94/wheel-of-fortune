import { useState } from "react";
import TivoliApiService from "./TivoliApiService";

type GetApiProps = {
  // Add props here if needed in the future
};

const GetApi = ({}: GetApiProps = {}) => {
  const [result, setResult] = useState<string>("Click the button to test Tivoli API connection");
  const [loading, setLoading] = useState<boolean>(false);

  const testApi = async (): Promise<void> => {
    setLoading(true);
    setResult("Testing connection to Tivoli API...");

    try {
      const data = await TivoliApiService.testApiConnection();
      
      const resultText: string = `Success! Connected to Tivoli API\nData: ${JSON.stringify(data, null, 2)}`;
      setResult(resultText);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setResult(`Error connecting to Tivoli API: ${error.message}`);
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

  const buttonText: string = loading ? "Testing..." : "Test Tivoli API";
  const buttonClasses: string =
    "bg-amber-700 rounded w-full text-white px-4 py-2 disabled:opacity-50";
  const preClasses: string =
    "mt-4 p-4 bg-gray-100 rounded overflow-auto text-black";

  return (
    <div>
      <h2>Tivoli API Connection Test</h2>
      <button onClick={testApi} disabled={loading} className={buttonClasses}>
        {buttonText}
      </button>
      <pre className={preClasses}>{result}</pre>
    </div>
  );
};

export default GetApi;