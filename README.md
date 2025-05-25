# 🎡 Wheel of Fortune

A spinning wheel game built with React, TypeScript, and Vite — designed to integrate with the Yrgo Web Development Class of 2024's Tivoli API, but also playable as a standalone experience.

<img width="1443" alt="Screenshot 2025-05-25 at 15 31 26" src="https://github.com/user-attachments/assets/a210c9db-8f6c-46aa-a38a-2a60a9824b38" />

## 🚀 Features
* 🎯 Spin-to-win gameplay with dynamic results

* 💸 Money and free spin management

* 🔐 JWT-based Tivoli authentication (via URL, postMessage, or localStorage)

* 🧪 Development mode for standalone use

* 📱 Responsive design with separate mobile and desktop layouts

* 🎨 Built using Tailwind CSS for clean UI

* 🔁 Keyboard accessibility (press Space to spin)

## 🛠 Tech Stack
* Frontend: React, TypeScript

* Build Tool: Vite

* Styling: Tailwind CSS

* Authentication & API: Tivoli platform (JWT tokens, transactions, and payouts)

## 📦 Installation
```
git clone https://github.com/yourusername/wheel-of-fortune.git
cd wheel-of-fortune
npm install
npm run dev
```
> ✅ Make sure you have Node.js and npm installed.

## 🔗 Tivoli API Integration
This game is built to integrate with the Tivoli API, used in Yrgo’s web dev curriculum.

### Token Handling
* Accepts JWT token via ?token=... in URL

* Accepts token via postMessage (for iframe use)

* Falls back to localStorage (token) or test mode in development

### API Calls
When connected to the Tivoli platform:

* Deducts spin cost

* Reports winnings

* Awards free spins (stamps)

> When not authenticated, the app gracefully degrades into test mode, simulating API behavior.

## 🧪 Development Mode
To simulate the game without authentication:

1. Run the app locally (`npm run dev`)

2. Open in a regular browser tab (not in iframe)

3. The app will enter test mode and allow unlimited spins

## 💻 Folder Structure Overview
```
src/
│
├── components/
│   ├── Wheel.tsx
│   ├── MoneyDisplay.tsx
│   ├── ResultDisplay.tsx
│   ├── JwtListener.tsx
│   └── useSpin.ts / useMoney.ts / useGameLogic.ts
│
├── gameConstants.ts
├── App.tsx
└── main.tsx
```

🎮 Controls
* Click the Spin button or press Spacebar to play

* Use free spins when available

* View results and current balance in real-time

## 📄 License

MIT License

## 🙌 Acknowledgements
Made by Mahtias Jebrand, Filip Lyrheden and Jack Svensson.
Special thanks to the creators of the Tivoli API.
