// src/components/JwtListener.tsx
import { useEffect } from "react";

// Define the props interface with proper typing
interface JwtListenerProps {
  onTokenReceived?: (token: string) => void;
}

export default function JwtListener({ onTokenReceived }: JwtListenerProps) {
  useEffect(() => {
    // Clear token in production on initial load
    if (process.env.NODE_ENV !== "development") {
      localStorage.removeItem("token");
    }

    // Check if we're in an iframe (launched from Tivoli)
    const isInIframe = window.parent !== window;
    
    // Send GAME_READY message to parent if we're in an iframe
    if (isInIframe) {
      try {
        console.log("Game is in iframe - sending GAME_READY message to parent window");
        window.parent.postMessage({ type: "GAME_READY" }, "*");
      } catch (err) {
        console.error("[JwtListener] Failed to send GAME_READY:", err);
      }
    } else {
      console.log("Game is not in iframe - direct access detected");
    }

    // Listen for messages from parent window
    const handleMessage = (event: MessageEvent) => {
      // Get current origin
      const currentOrigin = window.location.origin;
      
      // Validate the origin for security
      const allowedOrigins = [
        'https://tivoli.yrgobanken.vip',
        'http://localhost:3000', // For local development
        'http://127.0.0.1:3000',
        'http://localhost:5173', // Vite dev server
        currentOrigin, // Allow messages from same origin
        'https://wheel-of-fortune-lilac.vercel.app' // Your Vercel domain
      ];
      
      if (!allowedOrigins.includes(event.origin)) {
        console.log('Message from unauthorized origin:', event.origin);
        return;
      }
      
      const data = event.data;
      
      // Filter out React DevTools and other unwanted messages
      if (data && typeof data === "object") {
        if (data.source === "react-devtools-content-script" || 
            data.source === "react-devtools-bridge" ||
            data.source === "react-devtools-detector") {
          return; // Ignore React DevTools messages
        }
      }
      
      console.log("Received relevant message from", event.origin, ":", data);
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
        
        // Call callback if provided - THIS IS THE KEY FIX
        if (onTokenReceived) {
          onTokenReceived(jwt);
        }
      }
    };

    window.addEventListener("message", handleMessage);

    // If no token received after 5 seconds and we're in iframe, resend GAME_READY
    const timeout = setTimeout(() => {
      if (!localStorage.getItem("token") && isInIframe) {
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
  }, [onTokenReceived]); // Add onTokenReceived to dependency array

  return null;
}