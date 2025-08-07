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
    <aside className="w-80 flex-col bg-card border-r border-border/40 p-4 hidden lg:flex">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 px-1">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shadow-sm">
            R
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-base text-foreground">Runix AI</span>
            <span className="text-xs text-muted-foreground">Scientific Discovery</span>
          </div>
        </Link>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      
      {/* New Chat Button */}
      <Button className="w-full mb-4 h-10 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-medium">
        <Plus className="w-4 h-4 mr-2" />
        New Task
      </Button>
      
      {/* Recent Tasks */}
      <div className="mb-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">Recent Tasks</h3>
        <ScrollArea className="flex-1 -mx-1">
          <div className="space-y-1 px-1">
            <Button variant="ghost" className="w-full justify-start text-sm font-normal h-10 px-3 text-foreground hover:bg-muted rounded-xl">
              <Hash className="w-4 h-4 mr-3 shrink-0 text-muted-foreground" />
              <span className="truncate">Polymer glass transition</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start text-sm font-normal h-10 px-3 text-foreground hover:bg-muted rounded-xl">
              <Hash className="w-4 h-4 mr-3 shrink-0 text-muted-foreground" />
              <span className="truncate">HTRA1 mutation analysis</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start text-sm font-normal h-10 px-3 text-foreground hover:bg-muted rounded-xl">
              <Hash className="w-4 h-4 mr-3 shrink-0 text-muted-foreground" />
              <span className="truncate">Protein dynamics simulation</span>
            </Button>
          </div>
        </ScrollArea>
      </div>

      {/* Navigation */}
      <div className="mt-auto pt-4 border-t border-border/40 space-y-1">
        <Button variant="ghost" size="sm" className="w-full justify-start text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl h-9">
          <Settings className="w-4 h-4 mr-3" />
          Settings
        </Button>
        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-xs text-muted-foreground font-medium">Theme</span>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen w-full bg-background text-foreground">
      <Sidebar />
      
      <main className="flex-1 flex flex-col bg-muted/30">
        {/* Top Header */}
        <header className="border-b border-border/60 bg-background/95 backdrop-blur-xl p-5 sticky top-0 z-10">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h1 className="font-semibold text-xl text-foreground">AI Agents for Scientific Discovery</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/60 rounded-xl border border-border/40">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-muted-foreground">GPT-4.1-nano</span>
              </div>
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl px-3 py-2 text-sm font-medium">
                Request Limit Increase
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col justify-center items-center p-8">
              <div className="max-w-4xl w-full">
                <div className="text-center mb-8">
                  <motion.h2 
                    className="text-2xl font-semibold mb-4 text-foreground"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    What scientific question can I help you explore?
                  </motion.h2>
                  <motion.p 
                    className="text-muted-foreground text-lg max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  >
                    Ask me about research hypotheses, experimental design, data analysis, or any scientific concept you're investigating.
                  </motion.p>
                </div>
                
                {/* Example Prompts */}
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  {[
                    "What are some likely mechanisms by which mutations near the HTRA1 locus in humans might be causal for age-related macular degeneration?",
                    "How might you capture electron transfer effects using classical force fields for molecular dynamics simulations of protein-protein interactions?",
                    "How compelling is genetic evidence for targeting PTHR in small cell lung cancer?",
                    "What factors limit the wavelengths of light detectable by mammalian eyes?"
                  ].map((prompt, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setInputValue(prompt)}
                      className="p-4 text-left border border-border/60 rounded-xl hover:bg-muted/50 hover:border-border transition-all duration-200 group"
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary/20 transition-colors">
                          <Hash className="w-3 h-3 text-primary" />
                        </div>
                        <p className="text-sm text-foreground leading-relaxed">{prompt}</p>
                      </div>
                    </motion.button>
                  ))}
                </motion.div>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-4xl mx-auto px-4 py-8">
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={cn(
                        "mb-8 group",
                        message.author === "User" ? "flex justify-end" : "flex justify-start"
                      )}
                    >
                      <div className={cn(
                        "flex items-start gap-4 max-w-[85%]",
                        message.author === "User" ? "flex-row-reverse" : "flex-row"
                      )}>
                        <motion.div 
                          className={cn(
                            "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-sm font-semibold shadow-sm border",
                            message.author === "User" 
                              ? "bg-primary text-primary-foreground border-primary/20" 
                              : "bg-card text-foreground border-border/60"
                          )}
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                        >
                          {message.author === "User" ? "W" : "R"}
                        </motion.div>
                        <div className="flex-1 pt-0.5">
                          <div className={cn(
                            "text-sm font-semibold mb-3",
                            message.author === "User" ? "text-right text-foreground" : "text-left text-foreground"
                          )}>
                            {message.author === "User" ? "You" : "Runix AI"}
                          </div>
                          <div className={cn(
                            "rounded-2xl px-5 py-4 shadow-sm border",
                            message.author === "User" 
                              ? "bg-primary text-primary-foreground ml-auto border-primary/20" 
                              : "bg-card text-foreground border-border/60"
                          )}>
                            <div className="leading-7 text-[15px] whitespace-pre-wrap font-medium">
                              {message.content}
                            </div>
                          </div>
                          {/* Message actions */}
                          <div className={cn(
                            "flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity",
                            message.author === "User" ? "justify-end" : "justify-start"
                          )}>
                            <Button variant="ghost" size="sm" className="h-8 px-3 text-xs text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg">
                              Copy
                            </Button>
                            {message.author === "AI" && (
                              <Button variant="ghost" size="sm" className="h-8 px-3 text-xs text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg">
                                Retry
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {isAiTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-8 flex justify-start"
                    >
                      <div className="flex items-start gap-4 max-w-[85%]">
                        <div className="w-9 h-9 rounded-xl bg-card text-foreground flex items-center justify-center shrink-0 text-sm font-semibold shadow-sm border border-border/60">
                          R
                        </div>
                        <div className="flex-1 pt-0.5">
                          <div className="text-sm font-semibold text-foreground mb-3 text-left">Runix AI</div>
                          <div className="rounded-2xl px-5 py-4 shadow-sm bg-card border border-border/60">
                            <div className="flex items-center gap-2">
                              <motion.div 
                                className="w-2.5 h-2.5 bg-primary rounded-full" 
                                animate={{ scale: [1, 1.3, 1] }} 
                                transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }} 
                              />
                              <motion.div 
                                className="w-2.5 h-2.5 bg-primary rounded-full" 
                                animate={{ scale: [1, 1.3, 1] }} 
                                transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }} 
                              />
                              <motion.div 
                                className="w-2.5 h-2.5 bg-primary rounded-full" 
                                animate={{ scale: [1, 1.3, 1] }} 
                                transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }} 
                              />
                            </div>
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
          <div className="p-6 bg-background border-t border-border/60">
            <div className="max-w-4xl mx-auto">
              <div className="relative bg-card rounded-2xl border border-border/60 shadow-lg focus-within:border-primary/60 focus-within:shadow-xl transition-all duration-300">
                <div className="flex items-end p-4">
                  <textarea
                    placeholder="Give me three competing hypotheses for origin of glass transition in polymers..."
                    className="flex-1 bg-transparent border-0 px-4 py-3 text-base text-foreground placeholder:text-muted-foreground resize-none focus:outline-none min-h-[48px] max-h-[240px] leading-relaxed font-medium"
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
                  <div className="flex items-center gap-3 shrink-0">
                    {inputValue.trim() ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Button
                          size="icon"
                          onClick={handleSendMessage}
                          className="rounded-xl h-10 w-10 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md transition-all duration-200"
                        >
                          <ArrowUp className="w-5 h-5" />
                        </Button>
                      </motion.div>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-xl h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        disabled
                      >
                        <ArrowUp className="w-5 h-5" />
                      </Button>
                    )}
                  </div>
                </div>
                <div className="px-4 pb-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Press Enter to send, Shift+Enter for new line</span>
                    <div className="flex items-center gap-2">
                      <span>Powered by GPT-4.1-nano</span>
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
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
