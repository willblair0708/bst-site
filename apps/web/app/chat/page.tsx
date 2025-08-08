"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Plus,
  ArrowUp,
  Hash,
  RotateCcw,
  Square,
  Globe,
  Copy,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import Textarea from "react-textarea-autosize";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Inspector, { TraceEvent as InspectorEvent, ToolTrace as InspectorToolTrace } from "@/components/inspector";
// Simplified UI: sliders/selects removed

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
};

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
    blockquote: (props: any) => <blockquote className="border-l-2 pl-3 text-muted-foreground" {...props} />,
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

  const Sidebar = () => (
    <aside className="w-80 flex-col bg-muted/20 p-4 hidden lg:flex border-r overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center">
          <Hash className="w-4 h-4 text-background" />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-foreground text-sm">Runix</span>
          <span className="text-xs text-muted-foreground">Research Chat</span>
        </div>
        <div className="ml-auto"><ThemeToggle /></div>
      </div>

      {/* New Chat */}
      <div className="mb-6">
        <Button className="w-full h-11 rounded-xl bg-background text-foreground hover:bg-muted transition-colors font-medium shadow-sm border" onClick={createSession}>
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Conversation History */}
      <div className="flex-1 overflow-hidden">
        <h3 className="text-xs font-medium text-muted-foreground mb-4 px-2 tracking-wider uppercase">Chats</h3>
        <div className="h-full overflow-hidden">
          <div className="space-y-1">
            {sessions.slice(0, MAX_SESSIONS).map(s => (
              <div key={s.id} className={cn("group py-2 px-3 rounded-lg text-sm cursor-pointer flex items-center gap-2", activeSessionId === s.id ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted")}
                onClick={() => { setActiveSessionId(s.id); setCurrentAgent(s.agent); }}>
                {editingSessionId === s.id ? (
                  <input
                    autoFocus
                    className="flex-1 bg-transparent outline-none border rounded px-2 py-1 text-foreground"
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
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      <button
                        className="p-1 rounded hover:bg-background/50"
                        onClick={(e) => { e.stopPropagation(); setEditingSessionId(s.id); setEditingTitle(s.title); }}
                        title="Rename"
                        aria-label="Rename chat"
                      >
                        ✎
                      </button>
                      <button
                        className="p-1 rounded hover:bg-background/50"
                        onClick={(e) => { e.stopPropagation(); deleteSession(s.id); }}
                        title="Delete"
                        aria-label="Delete chat"
                      >
                        ✕
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-auto space-y-2">
        {activeSession && (
          <Button variant="destructive" className="w-full rounded-lg text-foreground" onClick={() => setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, messages: [] } : s))}>Clear</Button>
        )}
        <Button variant="outline" className="w-full rounded-lg" onClick={() => setShowInspector(v => !v)}>{showInspector ? 'Hide' : 'Show'} inspector</Button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen w-full bg-background text-foreground">
      <Sidebar />
      
      <main className="flex-1 flex flex-col bg-background">
        {/* Top bar removed per design */}

        {/* Main Content with optional Inspector panel */}
        <div className={cn("flex-1 grid overflow-hidden", showInspector ? "lg:grid-cols-[1fr_340px]" : "lg:grid-cols-1")}>            
          <section className="flex flex-col overflow-hidden">
            <div className="flex-1 overflow-hidden">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <div className="mx-auto w-full max-w-[740px] px-4 sm:px-6 lg:px-8">
                    <div className="bg-card rounded-2xl border focus-within:ring-1 focus-within:ring-ring">
                      <div className="flex items-end p-2 gap-2">
                        <Textarea
                          ref={composerRef as any}
                          placeholder="Ask anything…"
                          className="flex-1 bg-transparent border-0 px-3 py-2 text-[15px] leading-relaxed resize-none focus:outline-none min-h-[48px] max-h-[180px]"
                          value={inputValue}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInputValue(e.target.value)}
                          onKeyDown={(e: any) => {
                            if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                          rows={1}
                        />
                        {isAiTyping ? (
                          <Button size="icon" onClick={handleStop} className="rounded-lg h-9 w-9" title="Stop">
                            <Square className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button size="icon" onClick={() => handleSendMessage()} disabled={!inputValue.trim()} className="rounded-lg h-9 w-9">
                            <ArrowUp className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 text-center text-[11px] text-muted-foreground">Enter to send • Shift+Enter for newline</div>
                  </div>
                </div>
              ) : (
                <div className="h-full overflow-hidden">
                  <div
                    ref={listRef}
                    onScroll={handleScroll}
                    role="log"
                    aria-live={isAiTyping ? "polite" : "off"}
                    className="h-full overflow-auto"
                  >
                    <div className="relative mx-auto w-full max-w-[740px] px-4 sm:px-6 lg:px-8 py-6">
                      {messages.slice(-MAX_MESSAGES).map((message, index) => {
                        const isUser = message.author === 'User';
                        return (
                          <motion.div
                            key={message.id}
                            className="group relative flex gap-3 py-2"
                            variants={fadeInUp}
                            initial="initial"
                            animate="animate"
                            transition={{ duration: 0.25 }}
                          >
                            {!isUser && <div className="mt-1 h-7 w-7 rounded-full bg-muted shrink-0" />}
                            <div
                              className={cn(
                                "min-w-0 rounded-2xl border border-border/60",
                                isUser ? "bg-muted/40 ml-auto" : "bg-card"
                              )}
                            >
                              <div className={cn(
                                "prose prose-sm dark:prose-invert max-w-none px-4 py-3"
                              )}>
                                {(!isUser && !message.content) ? (
                                  <div className="flex items-center gap-2">
                                    <motion.div className="w-2 h-2 rounded-full bg-muted-foreground/70" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} />
                                    <motion.div className="w-2 h-2 rounded-full bg-muted-foreground/70" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.15 }} />
                                    <motion.div className="w-2 h-2 rounded-full bg-muted-foreground/70" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.3 }} />
                                  </div>
                                ) : (
                                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{message.content}</ReactMarkdown>
                                )}
                                {!isUser && message.content && extractLinks(message.content).length > 0 && (
                                  <div className="mt-3 flex flex-wrap gap-2">
                                    {extractLinks(message.content).map((l, i) => (
                                      <a key={i} href={l.href} target="_blank" rel="noreferrer" className="text-xs inline-flex items-center gap-1 px-2 py-1 rounded-full border bg-background/50 hover:bg-background transition-colors">
                                        <Globe className="w-3.5 h-3.5" /> {l.text}
                                      </a>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <div className={cn(
                                "absolute -bottom-6 left-10 sm:left-12 hidden group-hover:flex gap-2 text-xs text-muted-foreground"
                              )}>
                                <button className="inline-flex items-center gap-1 hover:text-foreground" onClick={() => copyToClipboard(message.content)}>
                                  Copy
                                </button>
                                {!isUser && (
                                  <button className="inline-flex items-center gap-1 hover:text-foreground" onClick={() => regenerateFromAI(index)}>
                                    Regenerate
                                  </button>
                                )}
                                <span className="hidden sm:inline">· {new Date(message.createdAt).toLocaleTimeString()}</span>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                      <div ref={endRef} />
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Sticky Composer */}
            {messages.length > 0 && (
              <footer className="sticky bottom-0 inset-x-0 border-t bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="mx-auto w-full max-w-[740px] px-4 sm:px-6 lg:px-8 py-4">
                  <div className="bg-card rounded-2xl border focus-within:ring-1 focus-within:ring-ring">
                    <div className="flex items-end p-2 gap-2">
                      <Textarea
                        ref={composerRef as any}
                        placeholder="Message Runix…"
                        className="flex-1 bg-transparent border-0 px-3 py-2 text-[15px] leading-relaxed resize-none focus:outline-none min-h-[40px] max-h-[180px]"
                        value={inputValue}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInputValue(e.target.value)}
                        onKeyDown={(e: any) => {
                          if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        rows={1}
                      />
                      {isAiTyping ? (
                        <Button size="icon" onClick={handleStop} className="rounded-lg h-9 w-9" title="Stop">
                          <Square className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button size="icon" onClick={() => handleSendMessage()} disabled={!inputValue.trim()} className="rounded-lg h-9 w-9">
                          <ArrowUp className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                    <div>Enter to send • Shift+Enter for newline</div>
                    {messages.at(-1)?.author === 'AI' && (
                      <button className="hover:text-foreground inline-flex items-center gap-1" onClick={handleRegenerate}>
                        <RotateCcw className="w-3.5 h-3.5" /> Regenerate
                      </button>
                    )}
                  </div>
                </div>
              </footer>
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
