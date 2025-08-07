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
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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
    <aside className="w-64 flex-col bg-muted/20 p-4 hidden lg:flex border-r">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center">
          <Hash className="w-4 h-4 text-background" />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-foreground text-sm">Runix</span>
          <span className="text-xs text-muted-foreground">Research Chat</span>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="mb-6">
        <Button className="w-full h-11 rounded-full bg-background text-foreground hover:bg-muted transition-colors font-medium shadow-sm border">
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>
      
      {/* Recent Sessions */}
      <div className="flex-1">
        <h3 className="text-xs font-medium text-muted-foreground mb-4 px-2 tracking-wider uppercase">Recent Sessions</h3>
        <ScrollArea className="h-full">
          <div className="space-y-1">
            {[
              "Polymer glass transition",
              "HTRA1 mutations",
              "Protein dynamics",
              "Electron transfer",
              "Eye wavelengths"
            ].map((title, index) => (
              <div key={index} className="group py-2 px-3 rounded-lg text-sm text-muted-foreground hover:bg-muted cursor-pointer transition-colors">
                <span className="truncate">{title}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* User Profile & Theme Toggle */}
      <div className="mt-auto">
        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center">
              <span className="text-sm font-semibold text-background">N</span>
            </div>
            <span className="font-semibold text-foreground text-sm">Profile</span>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen w-full bg-background text-foreground">
      <Sidebar />
      
      <main className="flex-1 flex flex-col bg-background">

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col justify-center items-center p-8">
              <div className="max-w-2xl w-full">
                <div className="text-center mb-12">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                    <Hash className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4 text-foreground">
                    Unlock Your Next Breakthrough
                  </h2>
                  <p className="text-muted-foreground max-w-lg mx-auto">
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
                      className="p-4 text-left border rounded-lg hover:bg-muted transition-all duration-200 text-sm text-foreground h-full"
                    >
                      <Sparkles className="w-4 h-4 mb-3 text-muted-foreground" />
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
                        ? "bg-foreground text-background" 
                        : "bg-muted text-foreground"
                    )}>
                      {message.author === "User" ? "U" : "R"}
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                      <div className="text-sm font-medium mb-2 text-foreground">
                        {message.author === "User" ? "You" : "Runix"}
                      </div>
                      <div className={cn(
                        "prose prose-sm dark:prose-invert max-w-none",
                        message.author === "User" 
                          ? "bg-muted rounded-lg px-4 py-3" 
                          : "bg-background"
                      )}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {message.content}
                        </ReactMarkdown>
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
                    <div className="w-8 h-8 rounded-full bg-muted text-foreground flex items-center justify-center text-sm font-semibold shrink-0">
                      R
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                      <div className="text-sm font-medium mb-2 text-foreground">Runix</div>
                      <div className="rounded-lg px-4 py-3 bg-background">
                        <motion.div 
                          className="flex items-center gap-1"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <div className="w-2 h-2 bg-muted-foreground rounded-full" />
                          <div className="w-2 h-2 bg-muted-foreground rounded-full" />
                          <div className="w-2 h-2 bg-muted-foreground rounded-full" />
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
          <div className="p-6 bg-background border-t">
            <div className="max-w-3xl mx-auto">
              <motion.div 
                className="relative bg-background rounded-lg border focus-within:border-ring transition-all duration-200"
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <div className="flex items-center p-2">
                  <Textarea
                    placeholder="Ask me about research, analysis, or any scientific concept..."
                    className="flex-1 bg-transparent border-0 px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none min-h-[40px] max-h-[120px] leading-relaxed"
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
                      className="rounded-lg h-8 w-8 bg-foreground text-background hover:bg-foreground/80 disabled:opacity-30 disabled:pointer-events-none transition-all duration-200"
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
