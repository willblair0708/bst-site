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
    <aside className="w-72 flex-col bg-gray-100 border-r border-gray-200 p-3 hidden lg:flex">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-2">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-7 h-7 rounded-lg bg-gray-900 text-white flex items-center justify-center text-sm font-bold">
            R
          </div>
          <span className="font-semibold text-base text-gray-900">Runix</span>
        </Link>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      
      {/* Chat History */}
      <ScrollArea className="flex-1 -mx-1">
        <div className="space-y-1 px-1">
          <Button variant="ghost" className="w-full justify-start text-sm font-normal h-9 px-3 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg">
            <MessageSquare className="w-4 h-4 mr-3 shrink-0" />
            <span className="truncate">Previous conversation</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start text-sm font-normal h-9 px-3 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg">
            <MessageSquare className="w-4 h-4 mr-3 shrink-0" />
            <span className="truncate">Design discussion</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start text-sm font-normal h-9 px-3 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg">
            <MessageSquare className="w-4 h-4 mr-3 shrink-0" />
            <span className="truncate">Code review help</span>
          </Button>
        </div>
      </ScrollArea>

      {/* Bottom Actions */}
      <div className="pt-3 border-t border-gray-200 space-y-2">
        <div className="flex items-center justify-between px-2">
          <span className="text-xs text-gray-600 font-medium">Settings</span>
          <ThemeToggle />
        </div>
        <Button variant="ghost" size="sm" className="w-full justify-start text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg">
          <Settings className="w-3 h-3 mr-2" />
          Preferences
        </Button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen w-full bg-white text-gray-900">
      <Sidebar />
      
      <main className="flex-1 flex flex-col bg-gray-50">
        {/* Top Header */}
        <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm p-4">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
              <h1 className="font-semibold text-lg text-gray-900">New Chat</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                Model: o3-MAX
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col justify-center items-center p-6">
              <div className="max-w-2xl text-center">
                <motion.h1 
                  className="text-3xl font-medium mb-3 text-gray-900"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  How can I help you today?
                </motion.h1>
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
                      transition={{ duration: 0.4 }}
                      className="mb-6 group"
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold",
                          message.author === "User" 
                            ? "bg-blue-500 text-white" 
                            : "bg-gray-200 text-gray-700"
                        )}>
                          {message.author === "User" ? "WB" : "R"}
                        </div>
                        <div className="flex-1 pt-1">
                          <div className="text-sm font-medium text-gray-900 mb-1">
                            {message.author === "User" ? "You" : "Runix"}
                          </div>
                          <div className="prose prose-sm max-w-none">
                            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                              {message.content}
                            </p>
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
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center shrink-0 text-xs font-semibold">
                          R
                        </div>
                        <div className="flex-1 pt-1">
                          <div className="text-sm font-medium text-gray-900 mb-1">Runix</div>
                          <div className="flex items-center gap-1">
                            <motion.div 
                              className="w-2 h-2 bg-gray-400 rounded-full" 
                              animate={{ scale: [1, 1.2, 1] }} 
                              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }} 
                            />
                            <motion.div 
                              className="w-2 h-2 bg-gray-400 rounded-full" 
                              animate={{ scale: [1, 1.2, 1] }} 
                              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }} 
                            />
                            <motion.div 
                              className="w-2 h-2 bg-gray-400 rounded-full" 
                              animate={{ scale: [1, 1.2, 1] }} 
                              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }} 
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
          
          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="max-w-3xl mx-auto">
              <div className="relative bg-white rounded-2xl border border-gray-300 shadow-sm focus-within:border-gray-400 transition-all duration-200">
                <div className="flex items-end p-3">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="shrink-0 rounded-lg h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                  <textarea
                    placeholder="Ask Cursor to build, fix bugs, explore"
                    className="flex-1 bg-transparent border-0 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 resize-none focus:outline-none min-h-[32px] max-h-[200px] leading-relaxed"
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
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-lg h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <Search className="w-4 h-4" />
                    </Button>
                    {inputValue.trim() ? (
                      <Button
                        size="icon"
                        onClick={handleSendMessage}
                        className="rounded-lg h-8 w-8 bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-lg h-8 w-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                        disabled
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatPage;
