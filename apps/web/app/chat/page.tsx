"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  ArrowUp,
  Hash,
  RotateCcw,
  Square,
  Globe,
  Copy,
  Sparkles,
  MessageSquare,
  Settings,
  Search,
  Zap,
  Brain,
  Code,
  FileText,
  MoreHorizontal,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import Textarea from "react-textarea-autosize";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Inspector, { TraceEvent as InspectorEvent, ToolTrace as InspectorToolTrace } from "@/components/inspector";
// Simplified UI: sliders/selects removed

// Memoized animation variants to prevent re-renders
const containerVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: {
      duration: 0.3,
      staggerChildren: 0.1
    }
  }
} as const;

const itemVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { 
    opacity: 1, 
    y: 0
  }
} as const;

const messageVariants = {
  initial: { opacity: 0, y: 12, scale: 0.98 },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1
  },
  exit: { 
    opacity: 0, 
    y: -8, 
    scale: 0.96
  }
} as const;

const floatingVariants = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1
  }
} as const;

type ChatMessage = { id: number; author: "User" | "AI"; content: string; createdAt: number };
type AgentId = "crow" | "falcon" | "owl" | "phoenix";
type ChatSession = { id: string; title: string; createdAt: number; messages: ChatMessage[]; agent: AgentId };

const ChatPage = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const activeSession = sessions.find(s => s.id === activeSessionId) || null;
  const messages = activeSession?.messages ?? [];
  const [currentAgent, setCurrentAgent] = useState<AgentId>("crow");
  const [useDirector, setUseDirector] = useState<boolean>(true);
  const [apiKey, setApiKey] = useState<string>("");
  const [inputValue, setInputValue] = useState("");
  
  // Memoize handlers to prevent re-renders
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  }, []);
  
  const handleKeyDown = useCallback((e: any) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSendMessage();
    }
  }, []);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const [atBottom, setAtBottom] = useState(true);
  const [showInspector, setShowInspector] = useState(false);
  const composerRef = useRef<HTMLTextAreaElement | null>(null);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>("");
  type TraceEvent = InspectorEvent;
  type ToolTrace = InspectorToolTrace & { args?: Record<string, any> };
  const [events, setEvents] = useState<TraceEvent[]>([]);
  const [toolTrace, setToolTrace] = useState<ToolTrace[]>([]);
  const [runStart, setRunStart] = useState<number | null>(null);
  const [runEnd, setRunEnd] = useState<number | null>(null);
  const runDuration = runStart && runEnd ? Math.max(0, runEnd - runStart) : null;
  const abortControllerRef = useRef<AbortController | null>(null);
  const toolTimersRef = useRef<Record<string, number>>({});
  // Defaults kept; controls hidden for simplicity
  const [temperature] = useState<number>(0.7);
  const [maxTokens] = useState<number>(1000);
  const [lastTaskId, setLastTaskId] = useState<string | null>(null);
  const [evidence, setEvidence] = useState<Array<any>>([]);
  
  // Modern markdown rendering styles
  const markdownComponents: any = {
    a: (props: any) => (
      <a {...props} target="_blank" rel="noreferrer" className="underline underline-offset-2 text-primary hover:text-primary/80" />
    ),
    p: (props: any) => (
      <p className="mt-2 first:mt-0 mb-2 last:mb-0" {...props} />
    ),
    pre: ({ children }: any) => (
      <pre className="mt-2 mb-2 rounded-lg border bg-muted/60 p-3 overflow-auto text-[12px] leading-relaxed">
        {children}
      </pre>
    ),
    code: ({ inline, children, ...rest }: any) => (
      inline ? (
        <code className="px-1.5 py-0.5 rounded bg-muted/50 border text-[12px]" {...rest}>{children}</code>
      ) : (
        <code {...rest}>{children}</code>
      )
    ),
    ul: (props: any) => <ul className="list-disc ml-5 space-y-1" {...props} />,
    ol: (props: any) => <ol className="list-decimal ml-5 space-y-1" {...props} />,
    blockquote: (props: any) => <blockquote className="border-l-2 pl-3 text-gray-500" {...props} />,
    table: (props: any) => <table className="w-full text-sm border rounded-md overflow-hidden" {...props} />,
    th: (props: any) => <th className="border-b bg-muted/70 px-2 py-1 text-left" {...props} />,
    td: (props: any) => <td className="border-b px-2 py-1 align-top" {...props} />,
  };

  // Auto-scroll behavior
  useEffect(() => {
    if (atBottom) {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length, isAiTyping]);

  const handleScroll = () => {
    const el = listRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setAtBottom(distanceFromBottom < 48);
  };

  // Load sessions and API key
  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('runix_chat_sessions') : null;
    if (stored) {
      try {
        const parsed: ChatSession[] = JSON.parse(stored);
        setSessions(parsed);
        if (parsed.length > 0) {
          setActiveSessionId(parsed[0].id);
          setCurrentAgent(parsed[0].agent);
        }
      } catch {}
    } else {
      const first: ChatSession = { id: crypto.randomUUID(), title: "New Chat", createdAt: Date.now(), agent: "crow", messages: [] };
      setSessions([first]);
      setActiveSessionId(first.id);
      setCurrentAgent("crow");
    }
    const storedKey = typeof window !== 'undefined' ? localStorage.getItem('runix_api_key') : null;
    if (storedKey) setApiKey(storedKey);
  }, []);

  useEffect(() => {
    // keyboard shortcuts: '/' focus composer, Cmd/Ctrl+I toggle inspector
    const onKeyDown = (e: KeyboardEvent) => {
      const isInputActive = (e.target as HTMLElement)?.closest('input, textarea, [contenteditable="true"]');
      if (!isInputActive && e.key === '/') {
        e.preventDefault();
        composerRef.current?.focus();
      }
      if ((e.metaKey || e.ctrlKey) && (e.key.toLowerCase() === 'i')) {
        e.preventDefault();
        setShowInspector(v => !v);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem('runix_chat_sessions', JSON.stringify(sessions));
  }, [sessions]);

  const createSession = () => {
    const session: ChatSession = { id: crypto.randomUUID(), title: "New Chat", createdAt: Date.now(), agent: currentAgent, messages: [] };
    setSessions(prev => [session, ...prev]);
    setActiveSessionId(session.id);
  };

  const renameSession = (id: string, title: string) => setSessions(prev => prev.map(s => s.id === id ? { ...s, title } : s));
  const deleteSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    if (activeSessionId === id) {
      const next = sessions.find(s => s.id !== id) || null;
      setActiveSessionId(next ? next.id : null);
    }
  };
  // agent selection removed from UI for simplicity; sessions default to "crow"

  const handleSendMessage = async (forcedContent?: string) => {
    const contentToSend = (forcedContent ?? inputValue).trim();
    if (contentToSend) {
      const newUserMessage: ChatMessage = {
        id: Date.now(),
        author: "User",
        content: contentToSend,
        createdAt: Date.now(),
      };
      // Ensure there is an active session; create one on the fly if needed
      let sessionId = activeSessionId;
      if (!sessionId) {
        sessionId = crypto.randomUUID();
        const newSession: ChatSession = {
          id: sessionId,
          title: "New Chat",
          createdAt: Date.now(),
          agent: currentAgent,
          messages: [],
        };
        setSessions(prev => [newSession, ...prev]);
        setActiveSessionId(sessionId);
      }
      const updatedMessages = [...messages, newUserMessage];
      setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, messages: updatedMessages } : s));
      if (forcedContent === undefined) setInputValue("");
      setIsAiTyping(true);
      setEvents([]);
      setToolTrace([]);
      setRunStart(Date.now());
      setRunEnd(null);
      toolTimersRef.current = {};
      
      try {
        // allow stop
        abortControllerRef.current?.abort();
        const controller = new AbortController();
        abortControllerRef.current = controller;
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {}),
          },
          body: JSON.stringify({
            messages: updatedMessages,
            agent: useDirector ? 'DIRECTOR' : currentAgent,
            stream: true,
            temperature,
            max_output_tokens: maxTokens,
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('Failed to get response');
        }
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('text/event-stream') && response.body) {
          const reader = response.body.getReader();
          let partial = "";
          const aiId = Date.now() + 2;
          setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, messages: [...updatedMessages, { id: aiId, author: 'AI', content: '', createdAt: Date.now() }] } : s));
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = new TextDecoder().decode(value);
            partial += chunk;
            const parts = partial.split(/\n\n/);
            partial = parts.pop() || '';
            for (const block of parts) {
              const lines = block.split("\n");
              const evtLine = lines.find(l => l.startsWith("event:"));
              const dataLine = lines.find(l => l.startsWith("data:"));
              if (!dataLine) continue;
              const evtType = evtLine ? evtLine.replace(/^event:\s?/, "").trim() : '';
              const payload = dataLine.replace(/^data:\s?/, "");
              try {
                const evt = JSON.parse(payload);
                if (evtType && evtType !== 'open') {
                  setEvents(prev => [...prev, { ts: Date.now(), type: evtType, detail: JSON.stringify(evt) }]);
                }
                if (evt.delta) {
                  setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, messages: s.messages.map(m => m.id === aiId ? { ...m, content: m.content + evt.delta } : m) } : s));
                }
                if (evt.event && (evt.event === 'tool_call' || evt.event === 'tool_result')) {
                  const toolName = String(evt.tool || "");
                  setEvents(prev => [...prev, { ts: Date.now(), type: evt.event, detail: toolName }]);
                  if (evt.event === 'tool_call' && toolName) {
                    toolTimersRef.current[toolName] = Date.now();
                    setToolTrace(prev => {
                      const exists = prev.find(t => t.tool === toolName);
                      if (exists) return prev;
                      return [...prev, { tool: toolName, phase: 'call' }];
                    });
                  }
                  if (evt.event === 'tool_result' && toolName) {
                    const start = toolTimersRef.current[toolName];
                    const elapsed = start ? Date.now() - start : undefined;
                    setToolTrace(prev => prev.map(t => t.tool === toolName ? { ...t, phase: 'result', t_ms: elapsed } : t));
                  }
                }
                if (evt.error) {
                  setEvents(prev => [...prev, { ts: Date.now(), type: 'error', detail: String(evt.error) }]);
                }
                if (evt.done && evt.message) {
                  // optional backend may include tool_trace on non-stream path; safe-merge if present
                  if (evt.tool_trace && Array.isArray(evt.tool_trace)) {
                    setToolTrace(evt.tool_trace as ToolTrace[]);
                  }
                  if (evt.task_id) {
                    setLastTaskId(String(evt.task_id));
                    try {
                      const ev = await fetch(`/api/evidence?task_id=${encodeURIComponent(String(evt.task_id))}`, { headers: { ...(apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {}) } }).then(r=>r.json());
                      if (ev && Array.isArray(ev.evidence)) setEvidence(ev.evidence);
                    } catch {}
                  }
                  setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, messages: s.messages.map(m => m.id === aiId ? { ...evt.message, id: aiId, createdAt: Date.now() } : m) } : s));
                  // Auto-title session on first assistant reply
                  setSessions(prev => prev.map(s => {
                    if (s.id !== sessionId) return s;
                    if (s.title && s.title !== "New Chat") return s;
                    const text = (evt.message?.content as string) || "";
                    const title = text.replace(/\n+/g, " ").slice(0, 80).split(" ").slice(0, 8).join(" ");
                    return { ...s, title: title || s.title };
                  }));
                  setRunEnd(Date.now());
                }
              } catch {}
            }
          }
        } else {
          const data = await response.json();
          if (data.message) {
            const aiMessage: ChatMessage = { ...data.message, createdAt: Date.now() };
            setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, messages: [...updatedMessages, aiMessage] } : s));
            // Auto-title for non-stream
            setSessions(prev => prev.map(s => {
              if (s.id !== sessionId) return s;
              if (s.title && s.title !== "New Chat") return s;
              const text = (aiMessage.content as string) || "";
              const title = text.replace(/\n+/g, " ").slice(0, 80).split(" ").slice(0, 8).join(" ");
              return { ...s, title: title || s.title };
            }));
          } else {
            throw new Error('Invalid response format');
          }
        }
      } catch (error) {
        console.error('Chat error:', error);
        const errorMessage: ChatMessage = {
          id: Date.now() + 1,
          author: "AI",
          content: "I apologize, but I'm having trouble responding right now. Please try again in a moment.",
          createdAt: Date.now(),
        };
        setSessions(prev => prev.map(s => s.id === (sessionId || '') ? { ...s, messages: [...messages, errorMessage] } : s));
      } finally {
        setIsAiTyping(false);
        if (!runEnd) setRunEnd(Date.now());
      }
    }
  };

  const handleRegenerate = async () => {
    if (!messages.length) return;
    const lastUserIndex = [...messages].map((m, i) => ({ m, i })).reverse().find(pair => pair.m.author === 'User')?.i;
    if (lastUserIndex === undefined) return;
    const userContent = messages[lastUserIndex].content;
    setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, messages: s.messages.slice(0, lastUserIndex + 1) } : s));
    await handleSendMessage(userContent);
  };

  const handleStop = () => {
    abortControllerRef.current?.abort();
    setIsAiTyping(false);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {}
  };

  const extractLinks = (markdown: string): Array<{ href: string; text: string }> => {
    const links: Array<{ href: string; text: string }> = [];
    const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\)\s]+)\)/g;
    let match: RegExpExecArray | null;
    while ((match = linkRegex.exec(markdown)) !== null) {
      links.push({ text: match[1], href: match[2] });
    }
    return links;
  };

  // exportConversation removed per design simplification

  // Suggestions removed to reduce visual load

  const regenerateFromAI = async (aiIndex: number) => {
    // find nearest preceding user message
    for (let i = aiIndex - 1; i >= 0; i--) {
      if (messages[i]?.author === 'User') {
        await handleSendMessage(messages[i].content);
        return;
      }
    }
  };

  const MAX_SESSIONS = 12;
  const MAX_MESSAGES = 500; // show long history
  const MAX_EVENTS = 24;
  const MAX_TOOLS = 12;

  const Sidebar = useMemo(() => (
    <motion.aside 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, staggerChildren: 0.1 }}
      className="w-72 flex-col bg-gray-100 p-4 hidden lg:flex border-r border-gray-200 overflow-hidden"
    >
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.1 }}
        className="flex items-center gap-3 mb-6 px-2"
      >
        <motion.div 
          className="w-8 h-8 rounded-xl bg-gray-200 flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Hash className="w-4 h-4 text-gray-600" />
        </motion.div>
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800">Runix</span>
          <span className="text-xs text-gray-500">Assistant</span>
        </div>
        <div className="ml-auto">
          <ThemeToggle />
      </div>
      </motion.div>

      {/* New Chat Button */}
      <motion.div 
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.2 }}
        className="mb-6"
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button 
            className="w-full h-10 rounded-xl bg-gray-800 text-white hover:bg-gray-700 transition-all font-medium group" 
            onClick={createSession}
          >
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
        </motion.div>
      </motion.div>

      {/* Conversation History */}
      <div className="flex-1 overflow-hidden">
        <motion.h3 
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.3 }}
          className="text-xs font-medium text-gray-500 mb-3 px-2"
        >
          Recent
        </motion.h3>
        <div className="h-full overflow-hidden">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="space-y-1 pr-1 overflow-y-auto"
          >
            <AnimatePresence mode="popLayout">
              {sessions.slice(0, MAX_SESSIONS).map((s, index) => (
                <motion.div 
                  key={s.id}
                  layout
                  variants={messageVariants}
                  className={cn(
                    "group py-2.5 px-3 rounded-lg text-sm cursor-pointer flex items-center gap-2 transition-all",
                    activeSessionId === s.id 
                      ? "bg-gray-200 text-gray-800" 
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                  )}
                  onClick={() => { setActiveSessionId(s.id); setCurrentAgent(s.agent); }}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full shrink-0 transition-colors",
                    activeSessionId === s.id ? "bg-gray-600" : "bg-transparent"
                  )} />
                  
                {editingSessionId === s.id ? (
                  <input
                    autoFocus
                      className="flex-1 bg-transparent outline-none border border-gray-200 rounded px-2 py-1 text-gray-800 text-xs"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onBlur={() => { renameSession(s.id, editingTitle.trim() || s.title); setEditingSessionId(null); }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') { renameSession(s.id, editingTitle.trim() || s.title); setEditingSessionId(null); }
                      if (e.key === 'Escape') { setEditingSessionId(null); setEditingTitle(''); }
                    }}
                  />
                ) : (
                  <>
                    <span className="truncate mr-auto">{s.title}</span>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                        <motion.button
                          className="p-1 rounded hover:bg-foreground/10 transition-colors"
                        onClick={(e) => { e.stopPropagation(); setEditingSessionId(s.id); setEditingTitle(s.title); }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <MoreHorizontal className="w-3 h-3" />
                        </motion.button>
                    </div>
                  </>
                )}
                </motion.div>
            ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Bottom Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.5 }}
        className="mt-auto space-y-2 pt-4 border-t border-gray-200"
      >
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button 
            variant="outline" 
            size="sm"
            className={cn(
              "w-full rounded-lg text-xs h-8",
              showInspector ? "bg-foreground/5" : ""
            )}
            onClick={() => setShowInspector(v => !v)}
          >
            <Code className="w-3 h-3 mr-2" />
            {showInspector ? 'Hide' : 'Show'} Inspector
          </Button>
        </motion.div>
      </motion.div>
    </motion.aside>
  ), [sessions, activeSessionId, editingSessionId, editingTitle, showInspector, currentAgent]);

  return (
    <div className="flex h-screen w-full bg-white text-gray-800">
      {Sidebar}
      
      <main className="flex-1 flex flex-col bg-white">
        {/* Top bar removed per design */}

        {/* Main Content with optional Inspector panel */}
        <div className={cn("flex-1 grid overflow-hidden", showInspector ? "lg:grid-cols-[1fr_340px]" : "lg:grid-cols-1")}>            
          <section className="flex flex-col overflow-hidden">
            <div className="flex-1 overflow-hidden">
              {messages.length === 0 ? (
                                <motion.div 
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="h-full flex flex-col items-center justify-center px-6"
                >
                  {/* Minimal centered input */}
                  <div className="w-full max-w-2xl">
                    <motion.div 
                      className="mb-8 text-center"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: 0.1 }}
                    >
                      <h1 className="text-2xl font-medium text-gray-800 mb-2">
                        What can I help you with?
                      </h1>
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: 0.2 }}
                      className="relative"
                    >
                      <div className="bg-white border border-gray-200 rounded-2xl p-3 focus-within:border-gray-300 transition-all shadow-sm">
                        <div className="flex items-end gap-3">
                          <Textarea
                            ref={composerRef as any}
                            placeholder="Ask me anything..."
                            className="flex-1 bg-transparent border-0 px-2 py-2 text-base resize-none focus:outline-none min-h-[44px] max-h-[160px] placeholder:text-gray-400"
                            value={inputValue}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            rows={1}
                          />
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {isAiTyping ? (
                              <Button 
                                size="icon" 
                                onClick={handleStop} 
                                className="rounded-xl h-10 w-10 bg-foreground text-background hover:bg-foreground/90" 
                              >
                                <Square className="w-4 h-4" />
                              </Button>
                            ) : (
                              <Button 
                                size="icon" 
                                onClick={() => handleSendMessage()} 
                                disabled={!inputValue.trim()} 
                                className={cn(
                                  "rounded-xl h-10 w-10 transition-all",
                                  inputValue.trim() 
                                    ? "bg-gray-800 text-white hover:bg-gray-700" 
                                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                )}
                              >
                                <ArrowUp className="w-4 h-4" />
                              </Button>
                            )}
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full overflow-hidden">
                  <div
                    ref={listRef}
                    onScroll={handleScroll}
                    role="log"
                    aria-live={isAiTyping ? "polite" : "off"}
                    className="h-full overflow-auto"
                  >
                                        <div className="relative mx-auto w-full max-w-3xl px-6 py-6">
                      <AnimatePresence mode="popLayout">
                        {messages.slice(-MAX_MESSAGES).map((message, index) => {
                          const isUser = message.author === 'User';
                          
                          return (
                            <motion.div
                              key={message.id}
                              initial={{ opacity: 0, y: 12, scale: 0.98 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -8, scale: 0.96 }}
                              transition={{ duration: 0.3, ease: "easeOut" }}
                              layout
                              className={cn(
                                "group relative mb-6",
                                isUser ? "flex justify-end" : ""
                              )}
                            >
                              {isUser ? (
                                /* User Message - In Bubble */
                                <motion.div
                                  className="relative max-w-2xl rounded-3xl rounded-br-lg px-4 py-3 bg-gray-200 text-gray-800 shadow-sm"
                                >
                                  <div className="prose prose-sm max-w-none leading-relaxed text-gray-800">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                                      {message.content}
                                    </ReactMarkdown>
                                  </div>

                                  {/* Action Button for User Message */}
                                  <div className="absolute -bottom-8 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <motion.button 
                                      className="p-1.5 rounded-lg bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-background transition-colors shadow-sm"
                                      onClick={() => copyToClipboard(message.content)}
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      title="Copy message"
                                    >
                                      <Copy className="w-3 h-3 text-gray-500" />
                                    </motion.button>
                                  </div>
                                </motion.div>
                              ) : (
                                /* AI Message - No Bubble, Plain Text */
                                <div className="relative max-w-4xl">
                                  {!message.content ? (
                                    <div className="flex items-center gap-2 py-2">
                                                            <motion.div 
                        className="w-2 h-2 rounded-full bg-gray-400" 
                        animate={{ opacity: [0.4, 1, 0.4] }} 
                        transition={{ repeat: Infinity, duration: 1 }} 
                      />
                      <motion.div 
                        className="w-2 h-2 rounded-full bg-gray-400" 
                        animate={{ opacity: [0.4, 1, 0.4] }} 
                        transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} 
                      />
                      <motion.div 
                        className="w-2 h-2 rounded-full bg-gray-400" 
                        animate={{ opacity: [0.4, 1, 0.4] }} 
                        transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} 
                      />
                                    </div>
                                  ) : (
                                    <div className="prose prose-sm max-w-none leading-relaxed text-gray-800">
                                      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                                        {message.content}
                                      </ReactMarkdown>
                                    </div>
                                  )}

                                  {/* Action Buttons for AI Message */}
                                  <div className="absolute -bottom-8 left-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                    <motion.button 
                                      className="p-1.5 rounded-lg bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-background transition-colors shadow-sm"
                                      onClick={() => copyToClipboard(message.content)}
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      title="Copy message"
                                    >
                                      <Copy className="w-3 h-3 text-gray-500" />
                                    </motion.button>
                                    <motion.button 
                                      className="p-1.5 rounded-lg bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-background transition-colors shadow-sm"
                                      onClick={() => regenerateFromAI(index)}
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      title="Regenerate response"
                                    >
                                      <RotateCcw className="w-3 h-3 text-gray-500" />
                                    </motion.button>
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                      <div ref={endRef} className="h-4" />
                    </div>
                  </div>
                </div>
              )}
            </div>
                        {/* Minimal Sticky Composer */}
            {messages.length > 0 && (
              <motion.footer 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="sticky bottom-0 inset-x-0 border-t border-gray-200 bg-white"
              >
                <div className="mx-auto w-full max-w-3xl px-6 py-4">
                  <div className="bg-white border border-gray-200 rounded-2xl p-3 focus-within:border-gray-300 transition-all shadow-sm">
                    <div className="flex items-end gap-3">
                      <Textarea
                        ref={composerRef as any}
                        placeholder="Continue the conversation..."
                        className="flex-1 bg-transparent border-0 px-2 py-2 text-base resize-none focus:outline-none min-h-[44px] max-h-[160px] placeholder:text-gray-400"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        rows={1}
                      />
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {isAiTyping ? (
                          <Button 
                            size="icon" 
                            onClick={handleStop} 
                            className="rounded-xl h-10 w-10 bg-foreground text-background hover:bg-foreground/90" 
                          >
                            <Square className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button 
                            size="icon" 
                            onClick={() => handleSendMessage()} 
                            disabled={!inputValue.trim()} 
                            className={cn(
                              "rounded-xl h-10 w-10 transition-all",
                              inputValue.trim() 
                                ? "bg-gray-800 text-white hover:bg-gray-700" 
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            )}
                          >
                            <ArrowUp className="w-4 h-4" />
                          </Button>
                        )}
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.footer>
            )}
          </section>
          {/* Inspector Panel */}
          {showInspector && (
            <Inspector
              events={events}
              toolTrace={toolTrace}
              runDuration={runDuration}
              evidence={evidence}
              onClear={() => { setEvents([]); setToolTrace([]); setEvidence([]); }}
            />
          )}
        </div>
      </main>
      {/* API Key modal removed per design.mdc simplification */}
    </div>
  );
};

export default ChatPage;
