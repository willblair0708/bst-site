"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Plus,
  ArrowUp,
  ArrowDown,
  Hash,
  Sparkles,
  RotateCcw,
  Square,
  Globe,
  Bot,
  User,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import Textarea from "react-textarea-autosize";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  type TraceEvent = { ts: number; type: string; detail?: string };
  type ToolTrace = { tool: string; t_ms?: number; args?: Record<string, any>; phase?: string };
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
    const threshold = 48;
    setAtBottom(el.scrollHeight - el.scrollTop - el.clientHeight < threshold);
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
        </div>
      </div>

      {/* Actions */}
      <div className="mt-auto space-y-2">
        {activeSession && (
          <Button variant="destructive" className="w-full rounded-lg text-foreground" onClick={() => setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, messages: [] } : s))}>Clear</Button>
        )}
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen w-full bg-background text-foreground">
      <Sidebar />
      
      <main className="flex-1 flex flex-col bg-background">
        {/* Top bar */}
        <div className="h-12 border-b bg-background/70 backdrop-blur px-3 sm:px-4 flex items-center gap-2">
          <div className="text-sm font-medium">Runix Chat</div>
          <span className="text-[10px] text-muted-foreground">Director mode</span>
          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" variant="outline" className="rounded" onClick={createSession}><Plus className="w-3.5 h-3.5 mr-1"/>New</Button>
            <button className="text-xs px-2 py-1 rounded border hover:bg-muted/60" onClick={() => setShowInspector(v => !v)}>{showInspector ? 'Hide' : 'Show'} inspector</button>
            <ThemeToggle />
          </div>
        </div>

        {/* Main Content with optional Inspector panel */}
        <div className={cn("flex-1 grid grid-cols-1 overflow-hidden", showInspector ? "lg:grid-cols-[minmax(0,1fr)_340px]" : "lg:grid-cols-1")}>
          <section className="flex flex-col border-r bg-gradient-to-b from-background to-muted/20 overflow-hidden">
            <div className="flex-1 overflow-hidden">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col justify-center items-center p-8">
                  <div className="max-w-2xl w-full">
                    <div className="text-center mb-12">
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                        <Hash className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <h2 className="text-3xl font-bold mb-4 text-foreground">Unlock Your Next Breakthrough</h2>
                      <p className="text-muted-foreground max-w-lg mx-auto">I'm an AI research assistant, ready to help you analyze data, generate hypotheses, and accelerate your scientific discovery.</p>
                    </div>
                    {/* Example Prompts */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        "Analyze the impact of HTRA1 mutations on macular degeneration.",
                        "Simulate electron transfer dynamics in protein complexes.",
                        "Evaluate the therapeutic potential of targeting PTHR in small cell lung cancer.",
                        "What are the physical limits of light detection in mammalian eyes?"
                      ].map((prompt, index) => (
                        <button key={index} onClick={() => setInputValue(prompt)} className="p-4 text-left border rounded-lg hover:bg-muted transition-colors text-sm text-foreground h-full">
                          <Sparkles className="w-4 h-4 mb-3 text-muted-foreground" />
                          <p className="font-medium leading-relaxed">{prompt}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full overflow-hidden">
                  <div ref={listRef} onScroll={handleScroll} className="h-full max-w-2xl mx-auto px-6 py-8 space-y-6 overflow-auto">
                    {messages.slice(-MAX_MESSAGES).map((message, index) => {
                      const isUser = message.author === 'User';
                      return (
                        <motion.div
                          key={message.id}
                          className={cn("group/message relative flex items-start gap-3", isUser ? "justify-end" : "justify-start")}
                          variants={fadeInUp}
                          initial="initial"
                          animate="animate"
                          transition={{ delay: index * 0.05, duration: 0.35 }}
                        >
                          {!isUser && (
                            <div className="shrink-0 w-8 h-8 rounded-full border bg-primary-100/50 flex items-center justify-center">
                              <Bot className="w-4 h-4" />
                            </div>
                          )}
                          <Card className={cn("max-w-[68ch] rounded-2xl text-sm", isUser ? "bg-foreground text-background" : "bg-card/60")} variant={isUser ? undefined : "glass" as any}>
                            <CardContent className="px-4 py-3">
                              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{message.content}</ReactMarkdown>
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
                            </CardContent>
                          </Card>
                          {isUser && (
                            <div className="shrink-0 w-8 h-8 rounded-full border bg-muted flex items-center justify-center">
                              <User className="w-4 h-4" />
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                    {isAiTyping && (
                      <motion.div className="flex justify-start" variants={fadeInUp} initial="initial" animate="animate">
                        <div className="rounded-2xl px-4 py-3 text-sm shadow-sm bg-muted">
                          <div className="flex items-center gap-2">
                            <motion.div className="w-2 h-2 rounded-full bg-muted-foreground" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} />
                            <motion.div className="w-2 h-2 rounded-full bg-muted-foreground" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.15 }} />
                            <motion.div className="w-2 h-2 rounded-full bg-muted-foreground" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.3 }} />
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={endRef} />
                  </div>
                </div>
              )}
            </div>
            {/* Input area inside center pane */}
            <div className="p-4 sm:p-6 bg-background/80 border-t backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="max-w-2xl mx-auto">
                <motion.div className="relative bg-background rounded-2xl border focus-within:border-ring transition-colors shadow-soft" variants={fadeInUp} initial="initial" animate="animate" transition={{ delay: 0.2, duration: 0.5 }}>
                  <div className="flex items-center p-2">
                    <Textarea
                      placeholder="Ask me about research, analysis, or any scientific concept..."
                      className="flex-1 bg-transparent border-0 px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none min-h-[40px] max-h-[96px] leading-relaxed"
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
                          <Button size="icon" onClick={() => handleSendMessage()} disabled={!inputValue.trim()} className="rounded-xl h-8 w-8 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-30 disabled:pointer-events-none btn-primary-glow">
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
                {!atBottom && (
                  <button
                    onClick={() => endRef.current?.scrollIntoView({ behavior: 'smooth' })}
                    className="fixed right-6 bottom-28 z-10 inline-flex items-center gap-1 px-2 py-1 rounded-full border bg-background shadow-sm text-xs hover:bg-muted"
                    title="Scroll to newest"
                  >
                    <ArrowDown className="w-3.5 h-3.5" /> New messages
                  </button>
                )}
              </div>
            </div>
          </section>
          {/* Inspector Panel */}
          {showInspector && (
          <aside className="hidden lg:flex flex-col max-h-full overflow-hidden border-l bg-background/40">
            <div className="px-4 py-3 border-b bg-background/80 backdrop-blur">
              <div className="text-sm font-semibold">Run Inspector</div>
              <div className="mt-2 grid grid-cols-3 gap-2">
                <span className="text-[10px] px-2 py-1 rounded-full border bg-primary-100/40 text-foreground">Events: {events.length}</span>
                <span className="text-[10px] px-2 py-1 rounded-full border bg-accent-100/40 text-foreground">Tools: {Array.from(new Set(toolTrace.map(t=>t.tool))).length}</span>
                <span className="text-[10px] px-2 py-1 rounded-full border bg-collaboration-100/40 text-foreground">{runDuration!==null?`${(runDuration/1000).toFixed(1)}s`:'—'}</span>
              </div>
            </div>
            <div className="flex-1 p-4 space-y-4 overflow-hidden">
              {/* Events - compact list */}
              {events.length > 0 && (
                <Card variant="bento" className="bg-primary-100 shadow-elevation-1">
                  <CardHeader className="py-3 px-3"><CardTitle className="text-xs">Events</CardTitle></CardHeader>
                  <CardContent className="px-3 pb-3">
                    <ul className="text-xs space-y-1">
                      {events.slice(-MAX_EVENTS).map((e,i)=> (
                        <li key={i} className="font-mono truncate">[{new Date(e.ts).toLocaleTimeString()}] {e.type}{e.detail?` — ${e.detail}`:''}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Tool Trace - compact list */}
              {toolTrace.length > 0 && (
                <Card variant="bento" className="bg-collaboration-100 shadow-elevation-1">
                  <CardHeader className="py-3 px-3"><CardTitle className="text-xs">Tools</CardTitle></CardHeader>
                  <CardContent className="px-3 pb-3">
                    <ul className="text-xs space-y-2">
                      {toolTrace.slice(-MAX_TOOLS).map((t,i)=> (
                        <li key={i} className="flex items-center justify-between gap-2 border-b last:border-b-0 pb-1">
                          <span className="font-mono truncate max-w-[120px]" title={t.tool}>{t.tool}</span>
                          <span className="text-muted-foreground">{t.phase || ''}</span>
                          <span className="text-muted-foreground">{Number.isFinite(t.t_ms)?t.t_ms:''}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Evidence - compact list */}
              {evidence.length > 0 && (
                <Card variant="bento" className="bg-accent-100 shadow-elevation-1">
                  <CardHeader className="py-3 px-3"><CardTitle className="text-xs">Evidence</CardTitle></CardHeader>
                  <CardContent className="px-3 pb-3">
                    <ul className="text-xs space-y-2 max-h-56 overflow-auto">
                      {evidence.slice(0, 12).map((e:any, i:number)=> (
                        <li key={i} className="border-b last:border-b-0 pb-1">
                          <div className="font-medium truncate" title={e.doc_id || ''}>{e.doc_id || 'Unknown source'}</div>
                          {e.raw_text && <div className="text-muted-foreground line-clamp-2">{e.raw_text}</div>}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="rounded" onClick={() => { setEvents([]); setToolTrace([]); setEvidence([]); }}>Clear</Button>
              </div>
            </div>
          </aside>
          )}
        </div>
      </main>
      {/* API Key modal removed per design.mdc simplification */}
    </div>
  );
};

export default ChatPage;
