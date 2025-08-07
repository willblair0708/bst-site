"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Plus, 
  Settings, 
  ArrowUp
} from "lucide-react";
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
    <aside className="w-64 flex-col bg-background border-r border-border/30 p-6 hidden lg:flex">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
            R
          </div>
          <span className="font-medium text-foreground">Runix</span>
        </Link>
      </div>
      
      {/* New Chat Button */}
      <Button className="w-full mb-6 h-9 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-sm">
        <Plus className="w-4 h-4 mr-2" />
        New Chat
      </Button>
      
      {/* Recent Chats */}
      <div className="flex-1">
        <h3 className="text-xs font-medium text-muted-foreground mb-3">Recent</h3>
        <ScrollArea className="flex-1">
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start text-sm h-8 px-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md">
              <span className="truncate">Polymer glass transition</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start text-sm h-8 px-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md">
              <span className="truncate">HTRA1 mutation analysis</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start text-sm h-8 px-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md">
              <span className="truncate">Protein dynamics</span>
            </Button>
          </div>
        </ScrollArea>
      </div>

      {/* Settings */}
      <div className="pt-4 border-t border-border/30">
        <Button variant="ghost" size="sm" className="w-full justify-start text-sm text-muted-foreground hover:text-foreground h-8 px-2 rounded-md">
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen w-full bg-background text-foreground">
      <Sidebar />
      
      <main className="flex-1 flex flex-col bg-muted/30">
        {/* Top Header */}
        <header className="border-b border-border/20 bg-background/80 backdrop-blur-sm px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <h1 className="font-medium text-lg text-foreground">Chat</h1>
            <div className="flex items-center gap-2 px-3 py-1 bg-muted/40 rounded-full border border-border/20">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span className="text-xs text-muted-foreground">Online</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col justify-center items-center p-8">
              <div className="max-w-2xl w-full">
                <div className="text-center mb-12">
                  <h2 className="text-xl font-medium mb-3 text-foreground">
                    What can I help you explore?
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Ask me about research, analysis, or any scientific concept.
                  </p>
                </div>
                
                {/* Example Prompts */}
                <div className="grid gap-3">
                  {[
                    "HTRA1 mutations and macular degeneration",
                    "Electron transfer in protein simulations",
                    "PTHR targeting in lung cancer",
                    "Mammalian eye wavelength detection"
                  ].map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => setInputValue(prompt)}
                      className="p-3 text-left border border-border/40 rounded-lg hover:bg-muted/30 hover:border-border/60 transition-colors text-sm text-foreground"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
                {messages.map((message, index) => (
                  <div key={message.id} className="group">
                    <div className={cn(
                      "flex items-start gap-3",
                      message.author === "User" ? "flex-row-reverse" : "flex-row"
                    )}>
                      <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium shrink-0",
                        message.author === "User" 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted text-muted-foreground"
                      )}>
                        {message.author === "User" ? "U" : "R"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={cn(
                          "text-xs font-medium mb-2",
                          message.author === "User" ? "text-right" : "text-left"
                        )}>
                          {message.author === "User" ? "You" : "Runix"}
                        </div>
                        <div className={cn(
                          "rounded-lg px-3 py-2 text-sm leading-relaxed",
                          message.author === "User" 
                            ? "bg-primary text-primary-foreground ml-8" 
                            : "bg-muted text-foreground mr-8"
                        )}>
                          {message.content}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {isAiTyping && (
                  <div className="group">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-medium shrink-0">
                        R
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium mb-2 text-left">Runix</div>
                        <div className="rounded-lg px-3 py-2 bg-muted mr-8">
                          <div className="flex items-center gap-1">
                            <div className="w-1 h-1 bg-muted-foreground rounded-full animate-pulse" />
                            <div className="w-1 h-1 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                            <div className="w-1 h-1 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}
          
          {/* Input Area */}
          <div className="p-6 bg-background border-t border-border/20">
            <div className="max-w-2xl mx-auto">
              <div className="relative bg-background rounded-lg border border-border/40 focus-within:border-border transition-colors">
                <div className="flex items-end p-3">
                  <textarea
                    placeholder="Ask me anything..."
                    className="flex-1 bg-transparent border-0 px-2 py-2 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none min-h-[20px] max-h-[120px] leading-relaxed"
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
                  <Button
                    size="icon"
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    className="rounded-md h-8 w-8 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </Button>
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
