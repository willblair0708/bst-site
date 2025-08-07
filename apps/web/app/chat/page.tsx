"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  Sparkles
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

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newUserMessage = {
        id: Date.now(),
        author: "User",
        content: inputValue,
      };
      setMessages(prev => [...prev, newUserMessage]);
      setInputValue("");
      setIsAiTyping(true);
      
      setTimeout(() => {
        const aiResponse = {
          id: Date.now() + 1,
          author: "AI",
          content: "I'd be happy to help you with that. Let me break this down and provide you with a comprehensive approach to solve this problem.",
        };
        setMessages((prevMessages) => [...prevMessages, aiResponse]);
        setIsAiTyping(false);
      }, 2000);
    }
  };

  const Sidebar = () => (
    <aside className="w-64 flex-col bg-muted/30 p-3 hidden lg:flex">
      <div className="flex items-center justify-between mb-4 px-2">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-6 h-6 rounded-md bg-foreground text-background flex items-center justify-center text-xs font-bold">
            C
          </div>
          <span className="font-semibold text-sm">ChatGPT</span>
        </Link>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="space-y-1">
          <Button variant="ghost" className="w-full justify-start text-sm font-normal h-8 px-2 text-muted-foreground hover:bg-muted">
            <MessageSquare className="w-4 h-4 mr-2" />
            Previous conversation
          </Button>
          <Button variant="ghost" className="w-full justify-start text-sm font-normal h-8 px-2 text-muted-foreground hover:bg-muted">
            <MessageSquare className="w-4 h-4 mr-2" />
            Another chat
          </Button>
        </div>
      </ScrollArea>
    </aside>
  );

  return (
    <div className="flex h-screen w-full bg-background text-foreground">
      <Sidebar />
      
      <main className="flex-1 flex flex-col">
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col justify-center items-center p-4">
              <div className="w-full text-center">
                <motion.h1 
                  className="text-2xl font-semibold mb-4 text-foreground"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  What's on your mind today?
                </motion.h1>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-2xl mx-auto px-3 py-3">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mb-4"
                    >
                      <div className="flex items-start gap-2">
                        <Avatar className="w-5 h-5 shrink-0">
                          <AvatarFallback className={cn(
                            "text-xs font-semibold",
                            message.author === "User" 
                              ? "bg-primary text-primary-foreground" 
                              : "bg-muted text-muted-foreground"
                          )}>
                            {message.author === "User" ? "W" : "C"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-0.5">
                          <p className="text-xs font-semibold text-foreground">
                            {message.author === "User" ? "You" : "ChatGPT"}
                          </p>
                          <div className="text-sm text-foreground leading-relaxed">
                            {message.content}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {isAiTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4"
                    >
                      <div className="flex items-start gap-2">
                        <Avatar className="w-5 h-5 shrink-0">
                          <AvatarFallback className="bg-muted text-muted-foreground text-xs font-semibold">
                            C
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-0.5">
                          <p className="text-xs font-semibold text-foreground">ChatGPT</p>
                          <div className="flex items-center gap-1">
                            <motion.div className="w-1 h-1 bg-muted-foreground rounded-full" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }} />
                            <motion.div className="w-1 h-1 bg-muted-foreground rounded-full" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }} />
                            <motion.div className="w-1 h-1 bg-muted-foreground rounded-full" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }} />
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
          
          {/* Input */}
          <div className="border-t border-border/20 p-3">
            <div className="max-w-2xl mx-auto">
              <div className="relative bg-muted/50 rounded-2xl border border-border/50 focus-within:border-border transition-colors">
                <div className="flex items-end p-1.5">
                  <Button variant="ghost" size="icon" className="shrink-0 rounded-lg h-7 w-7 text-muted-foreground">
                    <Plus className="w-3.5 h-3.5" />
                  </Button>
                  <textarea
                    placeholder="Ask anything"
                    className="flex-1 bg-transparent border-0 px-2 py-1.5 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none min-h-[28px] max-h-[100px]"
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
                  <div className="flex items-center gap-0.5 shrink-0">
                    <Button variant="ghost" size="icon" className="rounded-lg h-7 w-7 text-muted-foreground">
                      <Search className="w-3.5 h-3.5" />
                    </Button>
                    {inputValue.trim() ? (
                      <Button
                        size="icon"
                        onClick={handleSendMessage}
                        className="rounded-lg h-7 w-7 bg-foreground text-background hover:bg-foreground/90"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </Button>
                    ) : (
                      <Button variant="ghost" size="icon" className="rounded-lg h-7 w-7 text-muted-foreground">
                        <ArrowUp className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-1.5">
                ChatGPT can make mistakes. Check important info.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatPage;
