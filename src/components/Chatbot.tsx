import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, X, MessageCircle, User as UserIcon, Loader2 } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface DiagnosisData {
  condition: string;
  severity: string;
  isSerious: boolean;
  confidence: number;
  recommendations: string[];
  medications: string[];
  matchedSymptoms: string[];
  urgencyLevel: string;
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatbotProps {
  diagnosisData?: DiagnosisData;
}

export const Chatbot: React.FC<ChatbotProps> = ({ diagnosisData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your Healthify AI assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Ref to hold the Gemini Chat Session
  const chatSessionRef = useRef<any>(null);

  // Initialize Gemini API
  useEffect(() => {
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash',
        systemInstruction: "You are Healthify AI, a Medical Follow-up Assistant. Your job is to be empathetic and intelligent. When a user states symptoms (e.g. headache), ask follow-up questions (e.g. Do you have a history of migraines? How severe is the pain?). You can suggest safe over-the-counter tablets or home remedies, but you must always advise the user to consult a doctor if the condition is serious. Do not provide definitive medical diagnoses. Keep your responses concise and readable."
      });
      
      chatSessionRef.current = model.startChat({ history: [] });
    } catch (e) {
      console.error("Failed to initialize Gemini:", e);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Context-aware logic when diagnosisData changes
  useEffect(() => {
    if (diagnosisData) {
      setIsOpen(true);
      setIsTyping(true);
      
      const initialBotMessage = `I notice you recently checked symptoms indicating potential ${diagnosisData.condition}. To assist you better, could you tell me how long you've been experiencing these symptoms?`;
      
      // Update Gemini Chat Session history so it knows the context!
      try {
        if (chatSessionRef.current) {
          const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
          const genAI = new GoogleGenerativeAI(apiKey);
          const model = genAI.getGenerativeModel({ 
            model: 'gemini-2.5-flash',
            systemInstruction: "You are Healthify AI, a Medical Follow-up Assistant. Your job is to be empathetic and intelligent. When a user states symptoms (e.g. headache), ask follow-up questions (e.g. Do you have a history of migraines? How severe is the pain?). You can suggest safe over-the-counter tablets or home remedies, but you must always advise the user to consult a doctor if the condition is serious. Do not provide definitive medical diagnoses. Keep your responses concise and readable."
          });
          
          chatSessionRef.current = model.startChat({
            history: [
              { role: 'user', parts: [{ text: `I have symptoms of ${diagnosisData.condition}. The severity is ${diagnosisData.severity}.` }] },
              { role: 'model', parts: [{ text: initialBotMessage }] }
            ]
          });
        }
      } catch (e) {
        console.error("Failed to update chat session context:", e);
      }

      setTimeout(() => {
        setMessages(prev => [
          ...prev, 
          {
            id: Date.now(),
            text: initialBotMessage,
            sender: 'bot',
            timestamp: new Date()
          }
        ]);
        setIsTyping(false);
      }, 1500);
    }
  }, [diagnosisData]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        throw new Error('API_KEY_MISSING');
      }

      if (!chatSessionRef.current) {
        throw new Error('CHAT_UNINITIALIZED');
      }

      // Fetch response from Gemini API
      const result = await chatSessionRef.current.sendMessage(currentInput);
      const responseText = result.response.text();
      
      const botResponse: Message = {
        id: Date.now() + 1,
        text: responseText,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error: any) {
      console.error('Error generating response:', error);
      
      let errorMsg = `Sorry, I am having trouble connecting right now. Error details: ${error.message || 'Unknown error'}`;
      if (error.message === 'API_KEY_MISSING') {
        errorMsg = '⚠️ Gemini API Key is missing! Please open the `.env` file and add your VITE_GEMINI_API_KEY to enable real-time AI.';
      } else if (error.message && error.message.includes('404')) {
        errorMsg = '⚠️ Error 404: The Gemini model could not be found. Please ensure your API key is valid and has the Generative Language API enabled.';
      } else if (error.message && error.message.includes('API key not valid')) {
        errorMsg = '⚠️ Invalid API Key. Please double check the key in your .env file.';
      }
      
      setMessages((prev) => [...prev, {
        id: Date.now() + 1,
        text: errorMsg,
        sender: 'bot',
        timestamp: new Date(),
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleChat = () => setIsOpen(!isOpen);

  if (!isOpen) {
    return (
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-teal-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 z-50 flex items-center justify-center"
        aria-label="Open AI Assistant"
      >
        <MessageCircle size={28} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[380px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-gray-100 font-sans" style={{ height: '650px', maxHeight: '85vh' }}>
      {/* Header */}
      <div className="bg-gray-900 text-white p-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-teal-400 p-2 rounded-lg">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-[15px] leading-tight">Healthify AI</h3>
            <p className="text-xs text-gray-400">Powered by Gemini</p>
          </div>
        </div>
        <button 
          onClick={toggleChat}
          className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800"
          aria-label="Close chat"
        >
          <X size={20} />
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4 scroll-smooth">
        <div className="space-y-6">
          {messages.map((message) => {
            const isUser = message.sender === 'user';
            return (
              <div key={message.id} className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${isUser ? 'bg-blue-100' : 'bg-teal-100'}`}>
                  {isUser ? <UserIcon size={16} className="text-blue-600" /> : <Bot size={16} className="text-teal-600" />}
                </div>
                
                {/* Bubble */}
                <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-[14px] leading-relaxed ${
                  isUser 
                    ? 'bg-blue-600 text-white rounded-tr-sm shadow-sm' 
                    : 'bg-white text-gray-800 rounded-tl-sm shadow-sm border border-gray-100'
                }`}>
                  <p className="whitespace-pre-wrap">{message.text}</p>
                </div>
              </div>
            );
          })}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 flex-row">
              <div className="shrink-0 h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center">
                <Bot size={16} className="text-teal-600" />
              </div>
              <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5 h-[46px]">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} className="h-2" />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-100 p-4 shrink-0">
        <form onSubmit={handleSendMessage} className="relative flex items-end gap-2">
          <div className="relative flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              placeholder="Message Healthify AI..."
              className="w-full bg-gray-100 border-transparent rounded-xl py-3 pl-4 pr-4 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-[14px] block max-h-[120px] min-h-[50px]"
              rows={1}
              disabled={isTyping}
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className={`shrink-0 h-[50px] w-[50px] rounded-xl flex items-center justify-center transition-all duration-200 ${
              !input.trim() || isTyping 
                ? 'bg-gray-100 text-gray-400' 
                : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
            }`}
          >
            {isTyping ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} className="ml-1" />}
          </button>
        </form>
        <p className="text-center text-[10px] text-gray-400 mt-3">
          Healthify AI can make mistakes. Consider verifying important medical information.
        </p>
      </div>
    </div>
  );
};
