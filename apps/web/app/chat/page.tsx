"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Plus, 
  ArrowUp,
  Hash,
  MessageSquare
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
    <aside className="w-64 flex-col bg-white border-r border-gray-200 p-4 hidden lg:flex">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-8 h-8 rounded-2xl bg-[#0436FF] flex items-center justify-center">
          <Hash className="w-4 h-4 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900 text-sm">Runix</span>
          <span className="text-xs text-gray-500">Research Chat</span>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="mb-6">
        <Button className="w-full h-11 rounded-2xl bg-[#0436FF] text-white hover:bg-[#0436FF]/90 transition-colors font-medium shadow-sm">
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>
      
      {/* Recent Chats */}
      <div className="flex-1">
        <h3 className="text-xs font-medium text-gray-500 mb-4 px-2">Recent</h3>
        <ScrollArea className="h-full">
          <div className="space-y-1">
            {[
              "Polymer glass transition",
              "HTRA1 mutations",
              "Protein dynamics",
              "Electron transfer",
              "Eye wavelengths"
            ].map((title, index) => (
              <div key={index} className="group py-2 px-3 rounded-xl text-sm text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-4 h-4 text-gray-400" />
                  <span className="truncate">{title}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen w-full bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 flex flex-col bg-white">

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col justify-center items-center p-8">
              <div className="max-w-2xl w-full">
                <div className="text-center mb-12">
                  <div className="w-16 h-16 rounded-2xl bg-[#E4EBFF] flex items-center justify-center mx-auto mb-6">
                    <Hash className="w-8 h-8 text-[#0436FF]" />
                  </div>
                  <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                    How can I help you explore?
                  </h2>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Ask me about research, analysis, or any scientific concept you're investigating.
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
                      className="p-4 text-left border border-gray-200 rounded-2xl hover:bg-[#E4EBFF]/30 hover:border-[#0436FF]/20 transition-all duration-200 text-sm text-gray-700 hover:text-gray-900"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-[#0436FF]"></div>
                        <span>{prompt}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
                {messages.map((message, index) => (
                  <div key={message.id} className="flex items-start gap-4">
                    <div className={cn(
                      "w-8 h-8 rounded-2xl flex items-center justify-center text-sm font-semibold shrink-0",
                      message.author === "User" 
                        ? "bg-[#0436FF] text-white" 
                        : "bg-[#A3F4E9] text-[#18E0C8]"
                    )}>
                      {message.author === "User" ? "U" : "R"}
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                      <div className="text-sm font-medium mb-2 text-gray-900">
                        {message.author === "User" ? "You" : "Runix"}
                      </div>
                      <div className={cn(
                        "rounded-2xl px-4 py-3 text-sm leading-relaxed max-w-none",
                        message.author === "User" 
                          ? "bg-[#E4EBFF] text-gray-900" 
                          : "bg-gray-50 text-gray-900"
                      )}>
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))}
                {isAiTyping && (
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-2xl bg-[#A3F4E9] text-[#18E0C8] flex items-center justify-center text-sm font-semibold shrink-0">
                      R
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                      <div className="text-sm font-medium mb-2 text-gray-900">Runix</div>
                      <div className="rounded-2xl px-4 py-3 bg-gray-50">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
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
          <div className="p-6 bg-white border-t border-gray-100">
            <div className="max-w-3xl mx-auto">
              <div className="relative bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-[#0436FF]/30 focus-within:bg-white transition-all duration-200 shadow-sm">
                <div className="flex items-end p-4">
                  <textarea
                    placeholder="Ask me about research, analysis, or any scientific concept..."
                    className="flex-1 bg-transparent border-0 px-2 py-2 text-sm text-gray-900 placeholder:text-gray-500 resize-none focus:outline-none min-h-[24px] max-h-[120px] leading-relaxed"
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
                    className="rounded-xl h-9 w-9 bg-[#0436FF] text-white hover:bg-[#0436FF]/90 disabled:opacity-30 disabled:pointer-events-none transition-all duration-200"
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
