"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, Sparkles } from "lucide-react";

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  isTyping?: boolean;
}

export function GlobalChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasAskedAdmin, setHasAskedAdmin] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "init", sender: 'bot', text: "Hello! I am the SDG AI Assistant. How can I help you today?" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const generateAIResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    // Super Admin Logic
    if (lowerInput.includes("super admin") || lowerInput.includes("superadmin")) {
      if (hasAskedAdmin) {
        return "Access Granted. Click here to enter the <a href='/admin/data-center' class='underline font-bold text-blue-600 hover:text-blue-800 dark:text-blue-400'>Super Admin Data Center</a>.";
      } else {
        return "Access Denied. You must inquire about the standard 'admin' before you can access super admin privileges.";
      }
    }

    if (lowerInput.includes("admin")) {
      setHasAskedAdmin(true);
      return "The admin handles standard operations and user management. There is, however, a higher level of clearance (super admin) that manages the entire institutional data center.";
    }

    // Fixed Rules Engine
    if (lowerInput.includes("sdg 6") || lowerInput.includes("water")) {
      return "SDG 6 is 'Clean Water and Sanitation'. When submitting a project for SDG 6, focus your abstract on water purification, waste management, or sustainable sanitation technologies.";
    }
    if (lowerInput.includes("deadline")) {
      return "Final submissions for the Campus Sustainability Drive close on Oct 22, 2026. Make sure to get faculty approval before the deadline!";
    }
    if (lowerInput.includes("format") || lowerInput.includes("report")) {
      return "Reports should be submitted in PDF format. Include your Project Title, Abstract, Engineering Keywords, and a detailed impact assessment chart.";
    }
    if (lowerInput.includes("how to submit") || lowerInput.includes("new project")) {
      return "To submit a new project, navigate to the 'Projects' tab in your sidebar, then click the blue '[+ NEW PROJECT]' button in the top right header.";
    }
    if (lowerInput.includes("hello") || lowerInput.includes("hi")) {
      return "Hi there! I can help you with SDG guidelines, project formatting, or navigating the Novelleyx platform. What do you need?";
    }

    return "That's a great question. I am currently running on a fixed mock dataset for this demonstration, so I don't have the full context to answer that yet. Try asking me about 'SDG 6', 'format', or 'deadlines'!";
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    setInputValue("");
    
    // Add User Message
    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: userText };
    setMessages(prev => [...prev, userMsg]);

    // Show Typing Indicator
    const typingId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: typingId, sender: 'bot', text: "", isTyping: true }]);

    // Simulate Network Delay & AI Processing
    setTimeout(() => {
      const botResponseText = generateAIResponse(userText);
      setMessages(prev => 
        prev.map(msg => msg.id === typingId ? { ...msg, text: botResponseText, isTyping: false } : msg)
      );
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-white dark:bg-[#111827] border border-gray-100 dark:border-white/10 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-0">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex items-center justify-between shadow-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                <Sparkles size={16} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">SDG AI Assistant</h3>
                <p className="text-blue-100 text-[10px] font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Online
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors relative z-10"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-[#0B1120]/50 scroll-smooth">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  
                  {/* Avatar */}
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                    msg.sender === 'user' 
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400' 
                      : 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                  }`}>
                    {msg.sender === 'user' ? <User size={12} /> : <Bot size={12} />}
                  </div>

                  {/* Message Bubble */}
                  <div className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-sm'
                      : 'bg-white dark:bg-[#1F2937] text-gray-700 dark:text-gray-200 border border-gray-100 dark:border-gray-800 rounded-tl-sm'
                  }`}>
                    {msg.isTyping ? (
                      <div className="flex items-center gap-1 h-5 px-1">
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    ) : (
                      <p dangerouslySetInnerHTML={{ __html: msg.text }}></p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white dark:bg-[#111827] border-t border-gray-100 dark:border-gray-800">
            <div className="relative flex items-center">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about SDGs, formats, or deadlines..."
                className="w-full pl-4 pr-12 py-3 bg-gray-50 dark:bg-[#1F2937] border-transparent focus:bg-white dark:focus:bg-[#1F2937] focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 rounded-xl text-sm transition-all text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
              />
              <button 
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="absolute right-2 p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:dark:bg-gray-700 text-white rounded-lg transition-colors flex items-center justify-center"
              >
                <Send size={14} className={!inputValue.trim() ? "translate-x-0" : "translate-x-0.5 -translate-y-0.5 transition-transform"} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white dark:bg-[#1F2937] border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-full h-12 px-3.5 hover:px-5 flex items-center justify-center gap-3 group text-gray-800 dark:text-gray-200 font-bold text-sm overflow-hidden"
      >
        <div className="relative shrink-0">
          <MessageSquare size={20} className="text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
          {!isOpen && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-[#1F2937] rounded-full animate-pulse"></span>}
        </div>
        <span className="max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 transition-all duration-300 ease-in-out whitespace-nowrap">
          {isOpen ? "Close AI" : "Need help? Ask SDG AI"}
        </span>
      </button>
    </div>
  );
}
