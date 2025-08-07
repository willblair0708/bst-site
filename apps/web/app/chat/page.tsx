"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { 
  Plus, 
  ArrowUp,
  Hash,
  MessageSquare,
  Users,
  Brain,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import Textarea from "react-textarea-autosize";

// Three Pillars System - Following Astra-Soft Design
const PILLARS = {
  VERSIONED_KNOWLEDGE: { 
    icon: Hash, 
    color: "primary", 
    bg: "primary-100",
    motion: "snap",
    description: "Every claim becomes verifiable, forkable knowledge"
  },
  COMPOSABLE_MODELS: { 
    icon: Brain, 
    color: "accent", 
    bg: "accent-100",
    motion: "spark-glow",
    description: "Models and simulations that compose and scale"
  },
  HUMAN_AI_COLLAB: { 
    icon: Users, 
    color: "collaboration", 
    bg: "collaboration-100",
    motion: "pulse-success",
    description: "Human expertise amplified by AI agents"
  },
};

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
};

const ChatPage = () => {
  const [messages, setMessages] = useState<Array<{id: number, author: string, content: string}>>([]);
  const [inputValue, setInputValue] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAiTyping]);

  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      const newUserMessage = {
        id: Date.now(),
        author: "User",
        content: inputValue,
      };
      
      const updatedMessages = [...messages, newUserMessage];
      setMessages(updatedMessages);
      setInputValue("");
      setIsAiTyping(true);
      
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: updatedMessages,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to get response');
        }

        const data = await response.json();
        
        if (data.message) {
          setMessages(prev => [...prev, data.message]);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Chat error:', error);
        const errorMessage = {
          id: Date.now() + 1,
          author: "AI",
          content: "I apologize, but I'm having trouble responding right now. Please try again in a moment.",
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsAiTyping(false);
      }
    }
  };

  const Sidebar = () => (
    <aside className="w-64 flex-col bg-gray-100 p-4 hidden lg:flex">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center">
          <Hash className="w-4 h-4 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900 text-sm">Runix</span>
          <span className="text-xs text-gray-500">Research Chat</span>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="mb-6">
        <Button className="w-full h-11 rounded-full bg-white text-gray-900 hover:bg-gray-200 transition-colors font-medium shadow-sm border border-gray-200">
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>
      
      {/* Recent Sessions */}
      <div className="flex-1">
        <h3 className="text-xs font-medium text-gray-500 mb-4 px-2 tracking-wider uppercase">Recent Sessions</h3>
        <ScrollArea className="h-full">
          <div className="space-y-1">
            {[
              "Polymer glass transition",
              "HTRA1 mutations",
              "Protein dynamics",
              "Electron transfer",
              "Eye wavelengths"
            ].map((title, index) => (
              <div key={index} className="group py-2 px-3 rounded-lg text-sm text-gray-600 hover:bg-gray-200 cursor-pointer transition-colors">
                <span className="truncate">{title}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* User Profile & Theme Toggle */}
      <div className="mt-auto">
        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center">
              <span className="text-sm font-semibold text-white">N</span>
            </div>
            <span className="font-semibold text-gray-900 text-sm">Profile</span>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen w-full bg-white">
      <Sidebar />
      
      <main className="flex-1 flex flex-col bg-white">

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col justify-center items-center p-8">
              <div className="max-w-2xl w-full">
                <div className="text-center mb-12">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                    <Hash className="w-8 h-8 text-gray-400" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4 text-gray-900">
                    Unlock Your Next Breakthrough
                  </h2>
                  <p className="text-gray-600 max-w-lg mx-auto">
                    I'm an AI research assistant, ready to help you analyze data, generate hypotheses, and accelerate your scientific discovery.
                  </p>
                </div>
                
                {/* Example Prompts */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    "Analyze the impact of HTRA1 mutations on macular degeneration.",
                    "Simulate electron transfer dynamics in protein complexes.",
                    "Evaluate the therapeutic potential of targeting PTHR in small cell lung cancer.",
                    "What are the physical limits of light detection in mammalian eyes?"
                  ].map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => setInputValue(prompt)}
                      className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 text-sm text-gray-700 h-full"
                    >
                      <Sparkles className="w-4 h-4 mb-3 text-gray-400" />
                      <p className="font-medium leading-relaxed">{prompt}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
                {messages.map((message, index) => (
                  <motion.div 
                    key={message.id} 
                    className="flex items-start gap-4"
                    variants={fadeInUp}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0",
                      message.author === "User" 
                        ? "bg-gray-900 text-white" 
                        : "bg-gray-200 text-gray-900"
                    )}>
                      {message.author === "User" ? "U" : "R"}
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                      <div className="text-sm font-medium mb-2 text-gray-900">
                        {message.author === "User" ? "You" : "Runix"}
                      </div>
                      <div className={cn(
                        "rounded-lg px-4 py-3 text-sm leading-relaxed max-w-none",
                        message.author === "User" 
                          ? "bg-gray-100 text-gray-900" 
                          : "bg-white text-gray-900"
                      )}>
                        {message.content}
                      </div>
                    </div>
                  </motion.div>
                ))}
                {isAiTyping && (
                  <motion.div 
                    className="flex items-start gap-4"
                    variants={fadeInUp}
                    initial="initial"
                    animate="animate"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-900 flex items-center justify-center text-sm font-semibold shrink-0">
                      R
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                      <div className="text-sm font-medium mb-2 text-gray-900">Runix</div>
                      <div className="rounded-lg px-4 py-3 bg-white">
                        <motion.div 
                          className="flex items-center gap-1"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <div className="w-2 h-2 bg-gray-400 rounded-full" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full" />
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}
          
          {/* Input Area */}
          <div className="p-6 bg-white border-t border-gray-200">
            <div className="max-w-3xl mx-auto">
              <motion.div 
                className="relative bg-white rounded-lg border border-gray-200 focus-within:border-gray-400 transition-all duration-200"
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <div className="flex items-center p-2">
                  <Textarea
                    placeholder="Ask me about research, analysis, or any scientific concept..."
                    className="flex-1 bg-transparent border-0 px-4 py-2 text-sm text-gray-900 placeholder:text-gray-500 resize-none focus:outline-none min-h-[40px] max-h-[120px] leading-relaxed"
                    value={inputValue}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInputValue(e.target.value)}
                    onKeyPress={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    rows={1}
                  />
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="icon"
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim()}
                      className="rounded-lg h-8 w-8 bg-gray-900 text-white hover:bg-gray-700 disabled:opacity-30 disabled:pointer-events-none transition-all duration-200"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatPage;
