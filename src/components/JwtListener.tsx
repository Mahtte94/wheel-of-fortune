// src/components/JwtListener.tsx
import { useEffect } from "react";

interface JwtListenerProps {
  onTokenReceived?: (token: string) => void;
}

export default function JwtListener({ onTokenReceived }: JwtListenerProps) {
  useEffect(() => {
    // Clear token in production on initial load
    if (process.env.NODE_ENV !== "development") {
      localStorage.removeItem("token");
    }

    // Send GAME_READY message to parent if we're in an iframe
    if (window.parent !== window) {
      try {
        console.log("Sending GAME_READY message to parent window");
        window.parent.postMessage({ type: "GAME_READY" }, "*");
      } catch (err) {
        console.error("[JwtListener] Failed to send GAME_READY:", err);
      }
    }

    // Listen for messages from parent window
    const handleMessage = (event: MessageEvent) => {
      console.log("Received message:", event.data);
      const data = event.data;
      let jwt: string | null = null;

      // Check different formats the token might come in
      if (typeof data === "object") {
        if (data.jwt) jwt = data.jwt;
        else if (data.token) jwt = data.token;
        else if (data.type === "JWT_TOKEN" && data.token) jwt = data.token;
      } else if (typeof data === "string" && data.startsWith("eyJ")) {
        jwt = data;
      }

      if (jwt && typeof jwt === "string" && jwt.startsWith("eyJ")) {
        console.log("JWT token received, saving to localStorage");
        localStorage.setItem("token", jwt);
        
        // Dispatch event for other components
        window.dispatchEvent(new CustomEvent("token_received", { detail: jwt }));
        
        // Call callback if provided
        if (onTokenReceived) {
          onTokenReceived(jwt);
        }
      }
    };

    window.addEventListener("message", handleMessage);

    // If no token received after 5 seconds, resend GAME_READY
    const timeout = setTimeout(() => {
      if (!localStorage.getItem("token") && window.parent !== window) {
        try {
          console.log("No token received yet, resending GAME_READY");
          window.parent.postMessage({ type: "GAME_READY" }, "*");
        } catch (err) {
          console.error("[JwtListener] Failed to resend GAME_READY:", err);
        }
      }
    }, 5000);

    return () => {
      window.removeEventListener("message", handleMessage);
      clearTimeout(timeout);
    };
  }, [onTokenReceived]);

  return null; // This component doesn't render anything
}