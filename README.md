# Healthify 🏥✨

Healthify is a modern, AI-powered healthcare application built with React and Tailwind CSS. It features a completely dynamic **Doctor Portal** and a **Real-Time Generative AI Assistant** (powered by Google Gemini) to provide an intelligent, context-aware medical companion.

## 🚀 Live Demo
**[Insert Netlify Live Link Here]**

## 🌟 Features
- **Intelligent AI Chatbot:** Uses Gemini 2.5 Flash to act as a medical follow-up assistant. It understands symptom context, asks clarifying questions, and provides safe, actionable advice.
- **Dynamic Doctor Portal:** A robust system allowing doctors to easily register their profiles, consultation modes, and fees.
- **Symptom Checker:** Interactive UI to check health metrics and symptoms.
- **Responsive & Modern UI:** Built with Tailwind CSS and Framer Motion for a sleek, glassmorphism aesthetic.

## 🛠️ Technology Stack
- **Frontend:** React (Vite), TypeScript
- **Styling:** Tailwind CSS, Framer Motion
- **Icons:** Lucide React
- **AI Integration:** Google Gemini SDK (`@google/generative-ai`)

## ⚙️ Running Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/neelimalakshmisetti/Healtify.git
   cd Healtify
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add your Google Gemini API key:
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 📝 Note on AI Usage
*Healthify AI can make mistakes. Always consider verifying important medical information and consult a certified healthcare professional for severe conditions.*