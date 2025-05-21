// client/src/utils/jwtHandler.ts
export function initJwtListener(): () => void {
  if (window.parent !== window) {
    try {
      window.parent.postMessage({ type: "GAME_READY" }, "*");
    } catch (err) {
      console.error("[JwtListener] Failed to send GAME_READY:", err);
    }
  }

  const handleMessage = (event: MessageEvent) => {
    const data = event.data;
    let jwt: string | null = null;

    if (typeof data === "object") {
      if (data.jwt) jwt = data.jwt;
      else if (data.token) jwt = data.token;
      else if (data.type === "JWT_TOKEN" && data.token) jwt = data.token;
    } else if (typeof data === "string" && data.startsWith("eyJ")) {
      jwt = data;
    }

    if (jwt && typeof jwt === "string" && jwt.startsWith("eyJ")) {
      localStorage.setItem("token", jwt); // Changed from jwt to token to match your App.tsx
      window.dispatchEvent(new CustomEvent("jwt_received", { detail: jwt }));
      console.log("[JwtListener] JWT token received and stored");
    }
  };

  window.addEventListener("message", handleMessage);

  const timeout = setTimeout(() => {
    if (!localStorage.getItem("token") && window.parent !== window) {
      try {
        window.parent.postMessage({ type: "GAME_READY" }, "*");
      } catch (err) {
        console.error("[JwtListener] Failed to resend GAME_READY:", err);
      }
    }
  }, 5000);

  // Return cleanup function
  return () => {
    window.removeEventListener("message", handleMessage);
    clearTimeout(timeout);
  };
}