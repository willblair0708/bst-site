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
        <div className="flex-1 flex flex-col">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col justify-center items-center p-6 max-w-3xl mx-auto w-full">
              <motion.h1 
                className="text-4xl font-semibold text-center mb-8 text-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                What's on your mind today?
              </motion.h1>
            </div>
          ) : (
            <ScrollArea className="flex-1">
              <div className="max-w-3xl mx-auto w-full px-4 py-6">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="mb-6"
                    >
                      <div className="flex items-start gap-4">
                        <Avatar className="w-6 h-6 shrink-0">
                          <AvatarFallback className={cn(
                            "text-xs font-semibold",
                            message.author === "User" 
                              ? "bg-primary text-primary-foreground" 
                              : "bg-muted text-muted-foreground"
                          )}>
                            {message.author === "User" ? "WB" : "AI"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-semibold text-foreground">
                            {message.author === "User" ? "You" : "ChatGPT"}
                          </p>
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
                      className="mb-6"
                    >
                      <div className="flex items-start gap-4">
                        <Avatar className="w-6 h-6 shrink-0">
                          <AvatarFallback className="bg-muted text-muted-foreground text-xs font-semibold">
                            AI
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-semibold text-foreground">ChatGPT</p>
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
            </ScrollArea>
          )}
          
          {/* Input */}
          <div className="p-4">
            <div className="max-w-3xl mx-auto">
              <div className="relative bg-muted/50 rounded-3xl border border-border/50 focus-within:border-border transition-colors">
                <div className="flex items-end p-2">
                  <Button variant="ghost" size="icon" className="shrink-0 rounded-xl h-8 w-8 text-muted-foreground">
                    <Plus className="w-4 h-4" />
                  </Button>
                  <textarea
                    placeholder="Ask anything"
                    className="flex-1 bg-transparent border-0 px-2 py-2 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none min-h-[32px] max-h-[200px]"
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
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="rounded-xl h-8 w-8 text-muted-foreground">
                      <Search className="w-4 h-4" />
                    </Button>
                    {inputValue.trim() ? (
                      <Button
                        size="icon"
                        onClick={handleSendMessage}
                        className="rounded-xl h-8 w-8 bg-foreground text-background hover:bg-foreground/90"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button variant="ghost" size="icon" className="rounded-xl h-8 w-8 text-muted-foreground">
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2">
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
