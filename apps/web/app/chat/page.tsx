"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Paperclip, 
  Send, 
  Bot, 
  User, 
  MessageSquare, 
  Plus, 
  Settings, 
  Menu,
  MoreHorizontal
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const ChatPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      author: "AI",
      content:
        "Hello! I'm your science discovery assistant. How can I help you design your next experiment?",
      avatar: "/bst-logo-light.svg",
    },
    {
      id: 2,
      author: "User",
      content: "I want to design a clinical trial for a new cancer drug.",
      avatar: "https://github.com/shadcn.png",
    },
    {
      id: 3,
      author: "AI",
      content:
        "Great! Let's start by defining the primary endpoints. What are the key outcomes you want to measure?",
      avatar: "/bst-logo-light.svg",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newUserMessage = {
        id: messages.length + 1,
        author: "User",
        content: inputValue,
        avatar: "https://github.com/shadcn.png",
      };
      setMessages(prev => [...prev, newUserMessage]);
      setInputValue("");
      
      // Simulate AI response
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: prevMessages.length + 1,
            author: "AI",
            content: "That's a great starting point. Let's refine the patient population criteria.",
            avatar: "/bst-logo-light.svg",
          },
        ]);
      }, 1000);
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages]);

  const Sidebar = () => (
    <aside className="w-64 flex-col border-r border-border/50 bg-background/60 backdrop-blur-sm p-4 hidden md:flex">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary/10 rounded-lg">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-lg font-semibold text-foreground">
            AI Chats
          </h1>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <ScrollArea className="flex-1 -mx-2">
        <div className="px-2 space-y-1">
          <Button variant="secondary" className="w-full justify-start gap-2 h-10 rounded-lg">
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
            <span className="truncate">Clinical Trial Design</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2 h-10 rounded-lg">
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
            <span className="truncate">Protein Folding Analysis</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2 h-10 rounded-lg">
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
            <span className="truncate">Gene Sequence Annotation</span>
          </Button>
        </div>
      </ScrollArea>
      <div className="mt-auto">
        <Button variant="ghost" className="w-full justify-start gap-2 rounded-lg">
          <Settings className="w-4 h-4" />
          Settings
        </Button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex items-center justify-between p-3 border-b border-border/50 bg-background/80 backdrop-blur-sm z-10">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden rounded-lg">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72">
                <Sidebar />
              </SheetContent>
            </Sheet>
            <div>
              <h2 className="text-lg font-semibold">
                Clinical Trial Design
              </h2>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <motion.span 
                  className="w-2 h-2 rounded-full bg-green-500"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
                AI is thinking...
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="border-accent/50 bg-accent/10 text-accent rounded-md">
              🤝 Human–AI Collaboration
            </Badge>
            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </header>

        {/* Message Area */}
        <main className="flex-1 overflow-y-auto">
          <ScrollArea className="h-full" ref={scrollAreaRef}>
            <div className="p-4 sm:p-6 space-y-6">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    layout
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.98 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className={cn(
                      "flex items-end gap-3 max-w-xl",
                      message.author === "User" ? "ml-auto flex-row-reverse" : "mr-auto"
                    )}
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={message.author === "AI" ? "/bst-logo-light.svg" : "https://github.com/shadcn.png"} />
                      <AvatarFallback>
                        {message.author === "AI" ? <Bot size={16} /> : <User size={16} />}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={cn(
                        "p-3 px-4 rounded-2xl shadow-sm",
                        message.author === "User"
                          ? "bg-primary text-primary-foreground rounded-br-none"
                          : "bg-muted text-foreground rounded-bl-none"
                      )}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </main>

        {/* Input Area */}
        <footer className="p-4 border-t border-border/50 bg-background/80 backdrop-blur-sm">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <Input
                placeholder="Ask your AI assistant..."
                className="w-full h-12 px-12 py-3 text-base bg-muted border-border/50 rounded-xl focus-visible:ring-1 focus-visible:ring-primary/50"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button variant="ghost" size="icon" className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full h-8 w-8 text-muted-foreground">
                <Paperclip className="w-4 h-4" />
              </Button>
              <Button
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg h-8 w-8"
                size="icon"
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ChatPage;

