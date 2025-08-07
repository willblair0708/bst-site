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
  Sparkles,
  Copy as CopyIcon,
  RotateCcw,
  Square,
  Globe,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import Textarea from "react-textarea-autosize";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
// Simplified UI: sliders/selects removed

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

type ChatMessage = { id: number; author: "User" | "AI"; content: string; createdAt: number };
type AgentId = "crow" | "falcon" | "owl" | "phoenix";
type ChatSession = { id: string; title: string; createdAt: number; messages: ChatMessage[]; agent: AgentId };

const AGENTS: Record<AgentId, { name: string; skill: string; risky?: boolean }> = {
  crow: { name: "Crow", skill: "General retrieval + scholarly Q&A" },
  falcon: { name: "Falcon", skill: "Deep literature survey & meta-analysis" },
  owl: { name: "Owl", skill: "Novelty checks / prior-art sweeps" },
  phoenix: { name: "Phoenix", skill: "ChemCrow planner (alpha)", risky: true },
};

const ChatPage = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const activeSession = sessions.find(s => s.id === activeSessionId) || null;
  const messages = activeSession?.messages ?? [];
  const [currentAgent, setCurrentAgent] = useState<AgentId>("crow");
  const [useDirector, setUseDirector] = useState<boolean>(true);
  const [apiKey, setApiKey] = useState<string>("");
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  type TraceEvent = { ts: number; type: string; detail?: string };
  type ToolTrace = { tool: string; t_ms?: number; args?: Record<string, any>; phase?: string };
  const [events, setEvents] = useState<TraceEvent[]>([]);
  const [toolTrace, setToolTrace] = useState<ToolTrace[]>([]);
  const [runStart, setRunStart] = useState<number | null>(null);
  const [runEnd, setRunEnd] = useState<number | null>(null);
  const runDuration = runStart && runEnd ? Math.max(0, runEnd - runStart) : null;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  // Defaults kept; controls hidden for simplicity
  const [temperature] = useState<number>(0.7);
  const [maxTokens] = useState<number>(1000);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  const scrollToBottom = () => {
    const el = scrollContainerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    } else {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    }
  };

  useEffect(() => {
    if (autoScroll) scrollToBottom();
  }, [messages, isAiTyping, autoScroll]);

  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setAutoScroll(distanceFromBottom < 120);
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
  const setAgentForActive = (agent: AgentId) => {
    setCurrentAgent(agent);
    if (!activeSessionId) return;
    setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, agent } : s));
  };

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
                  setEvents(prev => [...prev, { ts: Date.now(), type: evt.event, detail: evt.tool }]);
                }
                if (evt.error) {
                  setEvents(prev => [...prev, { ts: Date.now(), type: 'error', detail: String(evt.error) }]);
                }
                if (evt.done && evt.message) {
                  // optional backend may include tool_trace on non-stream path; safe-merge if present
                  if (evt.tool_trace && Array.isArray(evt.tool_trace)) {
                    setToolTrace(evt.tool_trace as ToolTrace[]);
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

  const exportConversation = (session: ChatSession) => {
    const blob = new Blob([JSON.stringify(session, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${session.title || 'chat'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

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

  const Sidebar = () => (
    <aside className="w-80 flex-col bg-muted/20 p-4 hidden lg:flex border-r">
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

      {/* Agent selection (kept minimal) */}
      <div className="mb-6">
        <h3 className="text-xs font-medium text-muted-foreground mb-3 px-2 tracking-wider uppercase">Agents</h3>
        <div className="space-y-1">
          {(Object.keys(AGENTS) as AgentId[]).map(a => (
            <button key={a} onClick={() => setAgentForActive(a)} className={cn("w-full text-left px-3 py-2 rounded-lg border flex items-start gap-2", currentAgent === a ? "bg-muted border-primary/30" : "hover:bg-muted/60")}> 
              <div className="mt-0.5 h-2 w-2 rounded-full" style={{ background: a === "phoenix" ? "#FF4664" : a === "falcon" ? "#0436FF" : a === "owl" ? "#A855F7" : "#18E0C8" }} />
              <div>
                <div className="text-sm font-medium text-foreground">{AGENTS[a].name}</div>
                <div className="text-xs text-muted-foreground">{AGENTS[a].skill}</div>
              </div>
            </button>
          ))}
        </div>
        {currentAgent === 'phoenix' && (
          <div className="mt-2 text-xs text-destructive-500/90 px-2">Phoenix is experimental; verify outputs.</div>
        )}
      </div>

      {/* Response controls removed for simplicity */}

      {/* New Chat Button */}
      <div className="mb-6">
        <Button className="w-full h-11 rounded-xl bg-background text-foreground hover:bg-muted transition-colors font-medium shadow-sm border" onClick={createSession}>
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>
      
      {/* Conversation History */}
      <div className="flex-1">
        <h3 className="text-xs font-medium text-muted-foreground mb-4 px-2 tracking-wider uppercase">History</h3>
        <ScrollArea className="h-full">
          <div className="space-y-1">
            {sessions.map(s => (
              <div key={s.id} className={cn("group py-2 px-3 rounded-lg text-sm cursor-pointer flex items-center justify-between", activeSessionId === s.id ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted")}
                onClick={() => { setActiveSessionId(s.id); setCurrentAgent(s.agent); }}>
                <span className="truncate mr-2">{s.title}</span>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  <button className="p-1 rounded hover:bg-background/50" onClick={(e) => { e.stopPropagation(); const t = prompt("Rename chat", s.title) || s.title; renameSession(s.id, t); }}>
                    ✎
                  </button>
                  <button className="p-1 rounded hover:bg-background/50" onClick={(e) => { e.stopPropagation(); deleteSession(s.id); }}>
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* User Profile & Theme Toggle */}
      <div className="mt-auto space-y-2">
        <Button variant="outline" className="w-full rounded-lg" onClick={() => setShowKeyModal(true)}>API Key</Button>
        {activeSession && (
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="rounded-lg" onClick={() => exportConversation(activeSession)}>Export</Button>
            <Button variant="destructive" className="rounded-lg" onClick={() => setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, messages: [] } : s))}>Clear</Button>
          </div>
        )}
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
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="max-w-3xl mx-auto px-6 h-12 flex items-center gap-2">
            <span className="inline-flex items-center gap-2 text-xs rounded-full border px-2 py-1">
              <span className="h-2 w-2 rounded-full" style={{ background: currentAgent === 'phoenix' ? '#FF4664' : currentAgent === 'falcon' ? '#0436FF' : currentAgent === 'owl' ? '#A855F7' : '#18E0C8' }} />
              {AGENTS[currentAgent].name}
            </span>
            <label className="ml-2 inline-flex items-center gap-2 text-xs border rounded-full px-2 py-1 cursor-pointer">
              <input type="checkbox" className="accent-foreground" checked={useDirector} onChange={(e) => setUseDirector(e.target.checked)} />
              Orchestrate (Director)
            </label>
            {runDuration !== null && (
              <span className="ml-2 text-xs text-muted-foreground">Run: {(runDuration/1000).toFixed(1)}s</span>
            )}
            <div className="ml-auto">
              <Button size="sm" variant="outline" className="rounded-lg" onClick={createSession}>New Chat</Button>
            </div>
          </div>

        {/* Main Content with Inspector panel */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_360px] overflow-hidden">
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
                      className="p-4 text-left border rounded-lg hover:bg-muted transition-colors text-sm text-foreground h-full"
                    >
                      <Sparkles className="w-4 h-4 mb-3 text-muted-foreground" />
                      <p className="font-medium leading-relaxed">{prompt}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-scroll border-r" ref={scrollContainerRef} onScroll={handleScroll}>
              <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
                {messages.map((message, index) => {
                  const isUser = message.author === 'User';
                  return (
                    <motion.div
                      key={message.id}
                      className={cn("group/message relative flex", isUser ? "justify-end" : "justify-start")}
                      variants={fadeInUp}
                      initial="initial"
                      animate="animate"
                      transition={{ delay: index * 0.05, duration: 0.35 }}
                    >
                      <div className={cn(
                        "max-w-[75ch] rounded-2xl px-4 py-3 text-sm shadow-sm",
                        isUser ? "bg-foreground text-background" : "bg-muted"
                      )}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {message.content}
                        </ReactMarkdown>
                        {!isUser && extractLinks(message.content).length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {extractLinks(message.content).map((l, i) => (
                              <a key={i} href={l.href} target="_blank" rel="noreferrer" className="text-xs inline-flex items-center gap-1 px-2 py-1 rounded-full border bg-background/50 hover:bg-background transition-colors">
                                <Globe className="w-3.5 h-3.5" /> {l.text}
                              </a>
                            ))}
                          </div>
                        )}
                        {/* Hover toolbar */}
                        <div className="absolute -top-3 right-2 hidden group-hover/message:flex gap-1">
                          <button className="px-2 py-1 text-[11px] rounded-md border bg-background/90 hover:bg-background" onClick={() => copyToClipboard(message.content)}>Copy</button>
                          {!isUser && (
                            <button className="px-2 py-1 text-[11px] rounded-md border bg-background/90 hover:bg-background" onClick={() => regenerateFromAI(index)}>Regenerate</button>
                          )}
                        </div>
                        <div className="mt-1 text-[11px] text-muted-foreground opacity-0 group-hover/message:opacity-100 transition-opacity">
                          {new Date(message.createdAt || Date.now()).toLocaleTimeString()}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
                {isAiTyping && (
                  <motion.div
                    className="flex justify-start"
                    variants={fadeInUp}
                    initial="initial"
                    animate="animate"
                  >
                    <div className="rounded-2xl px-4 py-3 text-sm shadow-sm bg-muted">
                      <div className="flex items-center gap-2">
                        <motion.div className="w-2 h-2 rounded-full bg-muted-foreground" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} />
                        <motion.div className="w-2 h-2 rounded-full bg-muted-foreground" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.15 }} />
                        <motion.div className="w-2 h-2 rounded-full bg-muted-foreground" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.3 }} />
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}
          {/* Inspector Panel */}
          <aside className="hidden lg:flex flex-col max-h-full overflow-hidden">
            <div className="px-4 py-3 border-b sticky top-0 bg-background/90 backdrop-blur">
              <div className="text-sm font-semibold">Run Inspector</div>
              <div className="text-xs text-muted-foreground">Live events and tool traces</div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div>
                <div className="text-xs font-semibold mb-2">Orchestration Events</div>
                <div className="space-y-1 max-h-64 overflow-auto text-xs border rounded p-2 bg-muted/50">
                  {events.length === 0 ? (
                    <div className="text-muted-foreground">No events yet</div>
                  ) : events.slice(-300).map((e, i) => (
                    <div key={i} className="font-mono">
                      [{new Date(e.ts).toLocaleTimeString()}] {e.type}{e.detail ? ` — ${e.detail}` : ''}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold mb-2">Tool Trace</div>
                <div className="overflow-auto border rounded">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-left">
                        <th className="py-1 px-2">Tool</th>
                        <th className="py-1 px-2">Phase</th>
                        <th className="py-1 px-2">Latency (ms)</th>
                        <th className="py-1 px-2">Args</th>
                      </tr>
                    </thead>
                    <tbody>
                      {toolTrace.length === 0 ? (
                        <tr><td colSpan={4} className="py-2 px-2 text-muted-foreground">No tool trace</td></tr>
                      ) : toolTrace.map((t, i) => (
                        <tr key={i} className="border-t border-border/40 align-top">
                          <td className="py-1 px-2 font-mono">{t.tool}</td>
                          <td className="py-1 px-2">{t.phase || ''}</td>
                          <td className="py-1 px-2">{Number.isFinite(t.t_ms) ? t.t_ms : ''}</td>
                          <td className="py-1 px-2 font-mono whitespace-pre-wrap break-words max-w-[280px]" title={JSON.stringify(t.args || {})}>
                            {JSON.stringify(t.args || {})}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="rounded" onClick={() => { setEvents([]); setToolTrace([]); }}>Clear</Button>
                {runDuration !== null && (
                  <div className="text-xs text-muted-foreground self-center">Duration: {(runDuration/1000).toFixed(1)}s</div>
                )}
              </div>
            </div>
          </aside>
        </div>
          {/* Input Area */}
          <div className="p-4 sm:p-6 bg-background border-t">
            <div className="max-w-3xl mx-auto">
              <motion.div 
                className="relative bg-background rounded-xl border focus-within:border-ring transition-colors"
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
                  <div className="flex items-center gap-2">
                    {isAiTyping ? (
                      <Button size="icon" onClick={handleStop} className="rounded-lg h-8 w-8" title="Stop">
                        <Square className="w-4 h-4" />
                      </Button>
                    ) : (
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          size="icon"
                          onClick={() => handleSendMessage()}
                          disabled={!inputValue.trim()}
                          className="rounded-lg h-8 w-8 bg-foreground text-background hover:bg-foreground/80 disabled:opacity-30 disabled:pointer-events-none"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <div>Enter to send • Shift+Enter for newline</div>
                {messages.length > 0 && messages[messages.length - 1]?.author === 'AI' && (
                  <button className="inline-flex items-center gap-1 hover:text-foreground" onClick={handleRegenerate}>
                    <RotateCcw className="w-3.5 h-3.5" /> Regenerate
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* API Key Modal */}
      <Dialog open={showKeyModal} onOpenChange={setShowKeyModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>API Key</DialogTitle>
            <DialogDescription>Saved locally and used as a Bearer token for /api/chat requests.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input placeholder="sk-..." value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setApiKey("")}>Clear</Button>
              <Button onClick={() => { localStorage.setItem('runix_api_key', apiKey); setShowKeyModal(false); }}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatPage;
