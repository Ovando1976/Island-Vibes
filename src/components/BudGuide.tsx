import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, Bot, User, X, Info, ExternalLink } from 'lucide-react';
import { getBudGuideResponse } from '../services/gemini';

interface Message {
  role: 'user' | 'bot';
  text: string;
  sources?: { title: string; url: string }[];
}

export const BudGuide: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: "Hafa Adai! I'm your USVI Bud Guide. Looking for something relaxing for a beach sunset, or maybe something to keep you focused while exploring St. John? Ask me anything!" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    const { text, sources } = await getBudGuideResponse(userMsg, "User is browsing Island Vibes in the USVI.");
    
    setIsTyping(false);
    setMessages(prev => [...prev, { 
      role: 'bot', 
      text: text || "I'm sorry, I couldn't process that.",
      sources: sources
    }]);
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 md:bottom-8 right-6 md:right-8 z-40 w-16 h-16 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-2xl shadow-emerald-500/20 flex items-center justify-center transition-all active:scale-90"
      >
        <Sparkles className="w-8 h-8" />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 md:bottom-28 right-6 md:right-8 z-50 w-[calc(100vw-3rem)] md:w-[400px] h-[500px] glass rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-bottom border-white/10 flex items-center justify-between bg-emerald-500/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold">AI Bud Guide</h3>
                  <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Online & Ready</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
              {messages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-emerald-500 text-white rounded-tr-none' 
                      : 'bg-white/5 text-white/90 rounded-tl-none border border-white/10'
                  }`}>
                    {msg.text}
                    
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Sources</p>
                        <div className="flex flex-wrap gap-2">
                          {msg.sources.map((source, si) => (
                            <a 
                              key={si} 
                              href={source.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-2 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] text-emerald-400 transition-all"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span className="truncate max-w-[100px]">{source.title}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/10 flex gap-1">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-6 bg-black/20">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about strains, effects, or shops..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-sm focus:outline-none focus:border-emerald-500/50 transition-all"
                />
                <button
                  onClick={handleSend}
                  className="absolute right-2 top-2 w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center hover:bg-emerald-600 transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[9px] text-white/30 mt-3 flex items-center gap-1">
                <Info className="w-3 h-3" />
                AI can make mistakes. Verify product info with dispensaries.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
