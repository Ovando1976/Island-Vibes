import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, Bot, User, X, Info, ArrowRight, MessageSquare, ShieldCheck, ExternalLink } from 'lucide-react';
import { getBudGuideResponse } from '../services/gemini';

interface Message {
  role: 'user' | 'bot';
  text: string;
  sources?: { title: string; url: string }[];
}

const Guide: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: "Hafa Adai! I'm your USVI Bud Guide. I'm here to help you find the perfect cannabis experience in the islands. Are you looking for something to help you relax on the beach, or maybe something to energize your hike through the National Park?" }
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

    const { text, sources } = await getBudGuideResponse(userMsg, "User is on the dedicated Guide page of Island Vibes in the USVI.");
    
    setIsTyping(false);
    setMessages(prev => [...prev, { 
      role: 'bot', 
      text: text || "I'm sorry, I couldn't process that.",
      sources: sources
    }]);
  };

  const suggestions = [
    "What's a good strain for a sunset beach vibe?",
    "Where can I find premium flower in St. Thomas?",
    "Recommend some low-THC edibles for beginners.",
    "What are the legal requirements for tourists?"
  ];

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col gap-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
            <Sparkles className="text-emerald-400 w-10 h-10" />
            AI Bud Guide
          </h1>
          <p className="text-white/60">Your personalized island cannabis concierge, powered by Gemini.</p>
        </div>
        <div className="flex items-center gap-2 glass px-4 py-2 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          <span>Verified USVI Data</span>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row gap-8 min-h-0">
        {/* Chat Area */}
        <div className="flex-1 glass rounded-[3rem] flex flex-col overflow-hidden border border-white/5">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
            {messages.map((msg, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={i} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'user' ? 'bg-white/10' : 'bg-emerald-500'
                  }`}>
                    {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5 text-white" />}
                  </div>
                  <div className={`p-5 rounded-[2rem] text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-emerald-500 text-white rounded-tr-none' 
                      : 'bg-white/5 text-white/90 rounded-tl-none border border-white/10'
                  }`}>
                    {msg.text}

                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Sources & Grounding</p>
                        <div className="flex flex-wrap gap-2">
                          {msg.sources.map((source, si) => (
                            <a 
                              key={si} 
                              href={source.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] text-emerald-400 transition-all border border-white/5"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span className="truncate max-w-[150px]">{source.title}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex gap-4 max-w-[85%]">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-white/5 p-5 rounded-[2rem] rounded-tl-none border border-white/10 flex gap-1.5 items-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-8 bg-black/20 border-t border-white/5">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask anything about USVI cannabis..."
                className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl pl-8 pr-20 text-lg focus:outline-none focus:border-emerald-500/50 transition-all"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="absolute right-3 top-3 w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center hover:bg-emerald-600 transition-all disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 flex items-center gap-2 text-[10px] text-white/30 uppercase tracking-widest font-bold">
              <Info className="w-3.5 h-3.5" />
              <span>AI recommendations should be verified with licensed professionals.</span>
            </div>
          </div>
        </div>

        {/* Sidebar Suggestions */}
        <aside className="hidden lg:block w-72 space-y-6">
          <div className="glass p-8 rounded-[2.5rem] space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-400" />
              Try Asking
            </h3>
            <div className="space-y-3">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setInput(s)}
                  className="w-full text-left p-4 glass rounded-2xl text-xs text-white/60 hover:text-white hover:bg-white/10 transition-all group flex items-center justify-between"
                >
                  <span>{s}</span>
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
                </button>
              ))}
            </div>
          </div>

          <div className="glass p-8 rounded-[2.5rem] space-y-4">
            <h3 className="text-lg font-bold">Island Tips</h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-xs font-bold text-emerald-400">Legal Age</p>
                <p className="text-[10px] text-white/60">Must be 21+ with valid ID to purchase.</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-emerald-400">Consumption</p>
                <p className="text-[10px] text-white/60">Private property only. No public use.</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-emerald-400">Transport</p>
                <p className="text-[10px] text-white/60">Do not travel between islands with product.</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Guide;
