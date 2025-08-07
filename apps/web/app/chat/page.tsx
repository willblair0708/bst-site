"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
  Send, 
  Bot, 
  User, 
  Plus, 
  Settings, 
  Menu,
  MessageSquare,
  MoreHorizontal,
  ArrowUp,
  Search,
  Sparkles,
  Hash
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

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
    <aside className="w-64 flex-col bg-primary-100/30 border-r border-primary-500/10 p-4 hidden lg:flex">
      {/* Header with Runix branding */}
      <div className="flex items-center justify-between mb-6">
        <Link href="/" className="flex items-center gap-3 group">
          <motion.div 
            className="w-8 h-8 rounded-2xl bg-primary-500 text-white flex items-center justify-center shadow-elevation-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.07, ease: "easeOut" }}
          >
            <Hash className="w-4 h-4" />
          </motion.div>
          <div>
            <span className="font-semibold text-sm text-foreground">Runix</span>
            <div className="text-xs text-muted-foreground">AI Agent</div>
          </div>
        </Link>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-xl hover:bg-accent-100/60 transition-colors"
          >
            <Plus className="w-4 h-4 text-accent-500" />
          </Button>
        </motion.div>
      </div>
      
      {/* Chat History */}
      <ScrollArea className="flex-1 -mx-2">
        <div className="space-y-2 px-2">
          <motion.div
            whileHover={{ x: 2, scale: 1.01 }}
            transition={{ duration: 0.07, ease: "easeOut" }}
          >
            <Button variant="ghost" className="w-full justify-start text-sm font-normal h-10 px-3 text-muted-foreground hover:bg-accent-100/40 rounded-2xl border border-transparent hover:border-accent-500/20">
              <MessageSquare className="w-4 h-4 mr-3 shrink-0 text-accent-500" />
              <span className="truncate">Recent conversation</span>
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ x: 2, scale: 1.01 }}
            transition={{ duration: 0.07, ease: "easeOut" }}
          >
            <Button variant="ghost" className="w-full justify-start text-sm font-normal h-10 px-3 text-muted-foreground hover:bg-accent-100/40 rounded-2xl border border-transparent hover:border-accent-500/20">
              <MessageSquare className="w-4 h-4 mr-3 shrink-0 text-accent-500" />
              <span className="truncate">Another chat</span>
            </Button>
          </motion.div>
        </div>
      </ScrollArea>

      {/* Theme Toggle */}
      <div className="pt-4 border-t border-primary-500/10">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-medium">Appearance</span>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen w-full bg-background text-foreground">
      <Sidebar />
      
      <main className="flex-1 flex flex-col">
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-b from-accent-100/20 via-transparent to-transparent">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col justify-center items-center px-6">
              <div className="w-full max-w-2xl text-center">
                {/* Hero Pastel Tile */}
                <motion.div 
                  className="bg-primary-100/50 shadow-elevation-2 rounded-2xl p-8 mb-8 border border-primary-500/10"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <motion.div 
                    className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-accent-500 text-white flex items-center justify-center shadow-elevation-4"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: 0.2,
                      type: "spring", 
                      stiffness: 150 
                    }}
                  >
                    <Sparkles className="w-8 h-8" />
                  </motion.div>
                  <motion.h1 
                    className="text-2xl font-semibold mb-3 text-foreground"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    What can I help you build today?
                  </motion.h1>
                  <motion.p 
                    className="text-muted-foreground"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    🤝 Human–AI Collaboration · Ask me anything about code, research, or ideas
                  </motion.p>
                </motion.div>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-3xl mx-auto px-4 py-6">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="mb-8"
                    >
                      <div className="flex items-start gap-4">
                        <motion.div 
                          className={cn(
                            "w-8 h-8 rounded-2xl flex items-center justify-center shrink-0 shadow-elevation-1",
                            message.author === "User" 
                              ? "bg-collaboration-100 text-viz-purple-500" 
                              : "bg-accent-100 text-accent-500"
                          )}
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.07 }}
                        >
                          {message.author === "User" ? (
                            <User className="w-4 h-4" />
                          ) : (
                            <Bot className="w-4 h-4" />
                          )}
                        </motion.div>
                        <div className="flex-1 pt-1">
                          <div className="text-xs font-semibold text-muted-foreground mb-2">
                            {message.author === "User" ? "You" : "Runix Agent"}
                          </div>
                          <div className="text-foreground leading-relaxed">
                            {message.content}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {isAiTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-8"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-2xl bg-accent-100 text-accent-500 flex items-center justify-center shrink-0 shadow-elevation-1">
                          <Bot className="w-4 h-4" />
                        </div>
                        <div className="flex-1 pt-1">
                          <div className="text-xs font-semibold text-muted-foreground mb-2">Runix Agent</div>
                          <div className="flex items-center gap-1.5">
                            <motion.div 
                              className="w-2 h-2 bg-accent-500/60 rounded-full" 
                              animate={{ scale: [1, 1.2, 1] }} 
                              transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }} 
                            />
                            <motion.div 
                              className="w-2 h-2 bg-accent-500/60 rounded-full" 
                              animate={{ scale: [1, 1.2, 1] }} 
                              transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }} 
                            />
                            <motion.div 
                              className="w-2 h-2 bg-accent-500/60 rounded-full" 
                              animate={{ scale: [1, 1.2, 1] }} 
                              transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }} 
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}
          
          {/* Input - Soft-UI Design */}
          <div className="p-6 bg-background/95 backdrop-blur-sm border-t border-primary-500/10">
            <div className="max-w-3xl mx-auto">
              <motion.div 
                className="relative bg-accent-100/40 rounded-2xl border border-accent-500/20 shadow-elevation-1 focus-within:border-accent-500/40 focus-within:shadow-elevation-2 transition-all duration-200"
                whileFocus={{ scale: 1.01 }}
                transition={{ duration: 0.07 }}
              >
                <div className="flex items-end p-4">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="shrink-0 rounded-xl h-9 w-9 text-accent-500 hover:bg-accent-100/60 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </motion.div>
                  <textarea
                    placeholder="Ask me to build, fix, or explore..."
                    className="flex-1 bg-transparent border-0 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 resize-none focus:outline-none min-h-[36px] max-h-[120px] leading-relaxed"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    rows={1}
                  />
                  <div className="flex items-center gap-2 shrink-0">
                    {inputValue.trim() ? (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.07 }}
                      >
                        <Button
                          size="icon"
                          onClick={handleSendMessage}
                          className="rounded-xl h-9 w-9 bg-primary-500 text-white hover:bg-primary-600 shadow-elevation-2 transition-all duration-200"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-xl h-9 w-9 text-muted-foreground hover:bg-accent-100/60 transition-colors"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
              <p className="text-xs text-muted-foreground/70 text-center mt-3">
                Runix AI can make mistakes. Verify important information.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatPage;
