"use client";

import type React from "react";
import { useEffect, useState } from "react";

import {
  Activity,
  Brain,
  CheckCircle2,
  Clock,
  Cpu,
  Filter,
  HardDrive,
  History,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Wand2,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export interface LightMemStatus {
  status: string;
  engine_name: string;
  local_repo_path: string;
  total_memories: number;
  active_agents: number;
  compression_ratio: string;
  decay_strategy: string;
  last_consolidation: string;
}

export interface MemoryItem {
  id: string;
  agent_id: string;
  agent_name: string;
  user_input: string;
  assistant_reply: string;
  tags: string[];
  importance_score: number;
  created_at: string;
}

export function LightMemHub() {
  const [status, setStatus] = useState<LightMemStatus | null>(null);
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [_isLoading, setIsLoading] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string>("all");
  const [isConsolidating, setIsConsolidating] = useState(false);

  // Memory Search State
  const [memoryQuery, setMemoryQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [retrievedResult, setRetrievedResult] = useState<{
    query: string;
    matches_count: number;
    top_memory_agent: string;
    memories: MemoryItem[];
  } | null>(null);

  // New Memory Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agentId, setAgentId] = useState("speed-to-lead-ai");
  const [userInput, setUserInput] = useState("");
  const [assistantReply, setAssistantReply] = useState("");
  const [tagsInput, setTagsInput] = useState("Toronto, Tax Strategy");
  const [importance, setImportance] = useState("0.90");

  const fetchLightMemData = async () => {
    setIsLoading(true);
    try {
      const [statusRes, memoriesRes] = await Promise.all([
        fetch("/api/lightmem/status"),
        fetch("/api/lightmem/memories"),
      ]);

      if (statusRes.ok) {
        const sData = await statusRes.json();
        setStatus(sData);
      }
      if (memoriesRes.ok) {
        const mData = await memoriesRes.json();
        setMemories(mData);
      }
    } catch (err) {
      console.error("Error fetching LightMem data:", err);
      toast.error("Could not load LightMem status");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLightMemData();
  }, [fetchLightMemData]);

  const handleRetrieveMemories = async (queryToSearch?: string) => {
    const q = queryToSearch !== undefined ? queryToSearch : memoryQuery;
    if (!q.trim() || isSearching) return;

    setIsSearching(true);
    try {
      const res = await fetch("/api/lightmem/retrieve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: q,
          agent_id: selectedAgent,
          limit: 3,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setRetrievedResult(data);
        toast.success(`🧠 LightMem Retrieval Complete`, {
          description: `Retrieved ${data.matches_count} contextual memories for '${q}'.`,
        });
      } else {
        toast.error("Memory retrieval query failed");
      }
    } catch (_err) {
      toast.error("Error connecting to LightMem retrieval endpoint");
    } finally {
      setIsSearching(false);
    }
  };

  const handleConsolidate = async () => {
    setIsConsolidating(true);
    try {
      const res = await fetch("/api/lightmem/consolidate", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        toast.success("✨ LightMem Consolidation Complete!", {
          description: data.message || "Offline memory update and decay pass finished.",
        });
        fetchLightMemData();
      } else {
        toast.error("Memory consolidation failed");
      }
    } catch (_err) {
      toast.error("Error executing LightMem consolidation");
    } finally {
      setIsConsolidating(false);
    }
  };

  const handleAddMemoryTurn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || !assistantReply.trim()) {
      toast.error("Please fill in both User Input and Assistant Reply.");
      return;
    }

    setIsSubmitting(true);
    try {
      const tagsArray = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await fetch("/api/lightmem/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agent_id: agentId,
          user_input: userInput,
          assistant_reply: assistantReply,
          tags: tagsArray,
          importance_score: parseFloat(importance) || 0.9,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success("💾 Memory Turn Saved to LightMem!", {
          description: data.message || "Successfully recorded interaction turn.",
        });
        setUserInput("");
        setAssistantReply("");
        setShowAddModal(false);
        fetchLightMemData();
      } else {
        toast.error("Failed to add memory turn");
      }
    } catch (_err) {
      toast.error("Error adding turn to LightMem");
    } finally {
      setIsSubmitting(false);
    }
  };

  const agentFilters = [
    { id: "all", name: "All Agents" },
    { id: "speed-to-lead-ai", name: "Speed-to-Lead AI" },
    { id: "scout-bot", name: "Scout Bot" },
    { id: "casl-compliance-officer", name: "CASL Compliance Officer" },
    { id: "mastermind-coach", name: "Mastermind Coach" },
    { id: "intent-consultant", name: "AI Intent Consultant" },
  ];

  const filteredMemories = selectedAgent === "all" ? memories : memories.filter((m) => m.agent_id === selectedAgent);

  return (
    <div className="relative min-h-screen space-y-8 bg-slate-950 p-6 text-slate-100">
      {/* Impeccable Violet Radial Glow Backdrops */}
      <div className="pointer-events-none absolute -top-20 -left-20 h-96 w-96 rounded-full bg-purple-600/10 blur-3xl" />
      <div className="pointer-events-none absolute top-40 right-10 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />

      {/* Header Banner */}
      <div className="relative flex flex-col gap-4 border-slate-800 border-b pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 ring-1 ring-purple-500/30">
              <Cpu className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-3xl text-white tracking-tight">LightMem AI Agent Memory Layer</h1>
                <Badge className="bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/40">StructMem Active</Badge>
              </div>
              <p className="mt-1 text-slate-400 text-sm">
                Lightweight long-term memory framework integrated with local LightMem repository. Enables Paperclip AI
                Fleet Agents to retain event-centric context across user conversations.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleConsolidate}
            disabled={isConsolidating}
            className="border-purple-500/30 bg-purple-950/40 text-purple-300 hover:bg-purple-900/60"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isConsolidating ? "animate-spin" : ""}`} />
            Consolidate Memory
          </Button>
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-900/30 hover:from-purple-500 hover:to-indigo-500"
          >
            <Plus className="mr-2 h-4 w-4" />
            Inject Memory Turn
          </Button>
        </div>
      </div>

      {/* Connectivity Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-md">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-400 text-xs uppercase tracking-wider">Engine Status</span>
              <Badge className="bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30">CONNECTED</Badge>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-purple-400" />
              <span className="font-bold text-white text-xl">{status?.engine_name || "LightMem Memory Layer"}</span>
            </div>
            <p className="mt-1 truncate text-slate-500 text-xs">Path: {status?.local_repo_path || "c:...\\LightMem"}</p>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-md">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-400 text-xs uppercase tracking-wider">Stored Agent Memories</span>
              <HardDrive className="h-4 w-4 text-purple-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-extrabold text-3xl text-purple-300">{memories.length}</span>
              <span className="text-slate-400 text-xs">Interaction Turns</span>
            </div>
            <p className="mt-1 text-slate-500 text-xs">5 AI Fleet Bots Ingesting Context</p>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-md">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-400 text-xs uppercase tracking-wider">
                Context Compression Ratio
              </span>
              <Zap className="h-4 w-4 text-amber-400" />
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="font-extrabold text-2xl text-amber-300">{status?.compression_ratio || "4.2x"}</span>
              <Badge className="bg-amber-500/20 text-amber-300 text-xs">LLMLingua2 Optimized</Badge>
            </div>
            <p className="mt-1 text-slate-500 text-xs">Event-Centric StructMem Hierarchy</p>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-md">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-400 text-xs uppercase tracking-wider">
                Decay & Offline Consolidation
              </span>
              <Activity className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="font-semibold text-cyan-300 text-sm">AUTO DECAY PASS</span>
            </div>
            <p className="mt-1 text-slate-500 text-xs">
              Last run:{" "}
              {status?.last_consolidation ? new Date(status.last_consolidation).toLocaleTimeString() : "Just now"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* LightMem AI Memory Advisor Agent Box (Impeccable Design) */}
      <Card className="relative overflow-hidden border-purple-500/30 bg-gradient-to-r from-slate-900 via-slate-900/90 to-purple-950/40 shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-purple-500/10 blur-2xl" />
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/40">
                <Wand2 className="h-5 w-5 animate-pulse text-purple-400" />
              </div>
              <div>
                <CardTitle className="font-bold text-lg text-white">Paperclip LightMem Context Retrieval</CardTitle>
                <CardDescription className="text-slate-400">
                  Search long-term interaction memories across all 5 AI Fleet Bots using vector & StructMem key lookup.
                </CardDescription>
              </div>
            </div>
            <Badge className="border-purple-500/30 bg-purple-500/10 text-purple-300">LightMem v1.2</Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute top-3 left-3 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Query agent long-term memory (e.g., 'Toronto M5V HoldCo tax strategy')..."
                value={memoryQuery}
                onChange={(e) => setMemoryQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleRetrieveMemories()}
                className="border-slate-800 bg-slate-950/80 pl-9 text-slate-200 placeholder:text-slate-500 focus:border-purple-500"
              />
            </div>
            <Button
              onClick={() => handleRetrieveMemories()}
              disabled={isSearching || !memoryQuery.trim()}
              className="bg-purple-600 text-white hover:bg-purple-500"
            >
              {isSearching ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Retrieve Memory
            </Button>
          </div>

          {/* Preset Memory Queries */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-slate-400 text-xs">Quick Presets:</span>
            {[
              "Toronto M5V tax strategy memories",
              "Vancouver CASL 180-day implied consent",
              "Calgary high intent lead requirements",
              "Sub-45s speed to lead pitch script",
            ].map((preset) => (
              <button
                key={preset}
                onClick={() => {
                  setMemoryQuery(preset);
                  handleRetrieveMemories(preset);
                }}
                className="rounded-md border border-slate-800 bg-slate-950/60 px-2.5 py-1 text-purple-300 text-xs transition-colors hover:border-purple-500/50 hover:bg-purple-950/30"
              >
                ⚡ {preset}
              </button>
            ))}
          </div>

          {/* Memory Search Output Card */}
          {retrievedResult && (
            <div className="mt-4 space-y-3 rounded-xl border border-purple-500/30 bg-slate-950/90 p-4">
              <div className="flex items-center justify-between border-slate-800 border-b pb-2">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-purple-400" />
                  <span className="font-semibold text-purple-300 text-sm">
                    Retrieved Memories ({retrievedResult.matches_count} Matches)
                  </span>
                </div>
                <Badge className="bg-slate-800 text-slate-300 text-xs">
                  Primary Agent: {retrievedResult.top_memory_agent}
                </Badge>
              </div>

              <div className="space-y-3">
                {retrievedResult.memories.map((mem, idx) => (
                  <div key={mem.id} className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-purple-400 text-xs">
                        [{idx + 1}] {mem.agent_name}
                      </span>
                      <div className="flex items-center gap-2">
                        {mem.tags.map((t) => (
                          <Badge key={t} className="bg-slate-800 text-[10px] text-slate-300">
                            #{t}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="mt-2 space-y-1 text-xs">
                      <p className="font-medium text-slate-400">User: {mem.user_input}</p>
                      <p className="text-slate-200">Assistant: {mem.assistant_reply}</p>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                      <span>Importance: {(mem.importance_score * 100).toFixed(0)}%</span>
                      <span>Memory ID: {mem.id}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stored Agent Memory Timeline & Filter Grid */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-purple-400" />
            <h2 className="font-bold text-white text-xl">AI Fleet Long-Term Memory Timeline</h2>
            <Badge className="bg-slate-800 text-slate-300">{filteredMemories.length}</Badge>
          </div>

          {/* Agent Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="mr-1 h-4 w-4 text-slate-400" />
            {agentFilters.map((af) => (
              <button
                key={af.id}
                onClick={() => setSelectedAgent(af.id)}
                className={`rounded-lg px-3 py-1.5 font-medium text-xs transition-all ${
                  selectedAgent === af.id
                    ? "bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/50"
                    : "bg-slate-900/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
              >
                {af.name}
              </button>
            ))}
          </div>
        </div>

        {/* Memory Items Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredMemories.map((mem) => (
            <Card
              key={mem.id}
              className="group relative border-slate-800 bg-slate-900/60 transition-all duration-200 hover:border-purple-500/40 hover:bg-slate-900/90"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Badge className="mb-2 bg-purple-500/10 text-purple-300 ring-1 ring-purple-500/30">
                      {mem.agent_name}
                    </Badge>
                    <div className="flex flex-wrap gap-1.5">
                      {mem.tags.map((t) => (
                        <span key={t} className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Badge variant="outline" className="border-slate-700 text-slate-400 text-xs">
                    {mem.id}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1.5 rounded-lg border border-slate-800/80 bg-slate-950/60 p-2.5 text-xs">
                  <p className="font-medium text-slate-400">💬 {mem.user_input}</p>
                  <p className="text-slate-200">🤖 {mem.assistant_reply}</p>
                </div>
                <div className="flex items-center justify-between border-slate-800/80 border-t pt-3 text-slate-500 text-xs">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <span>{new Date(mem.created_at).toLocaleTimeString()}</span>
                  </div>
                  <div className="flex items-center gap-1 text-purple-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span className="text-[11px]">Score: {(mem.importance_score * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Manual Memory Turn Ingestion Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-slate-800 border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400">
                  <HardDrive className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Inject Memory Turn into LightMem</h3>
                  <p className="text-slate-400 text-xs">
                    Add conversation turn for long-term agent retention and StructMem retrieval.
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </Button>
            </div>

            <form onSubmit={handleAddMemoryTurn} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 text-xs">AI Agent Owner</label>
                  <select
                    value={agentId}
                    onChange={(e) => setAgentId(e.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-800 bg-slate-950 p-2 text-white text-xs focus:border-purple-500 focus:outline-none"
                  >
                    <option value="speed-to-lead-ai">Speed-to-Lead AI</option>
                    <option value="scout-bot">Scout Bot</option>
                    <option value="casl-compliance-officer">CASL Compliance Officer</option>
                    <option value="mastermind-coach">Mastermind Coach</option>
                    <option value="intent-consultant">AI Intent Consultant</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 text-xs">Importance Weight (0.1 - 1.0)</label>
                  <Input
                    type="number"
                    step="0.05"
                    min="0.1"
                    max="1.0"
                    value={importance}
                    onChange={(e) => setImportance(e.target.value)}
                    className="mt-1 border-slate-800 bg-slate-950 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 text-xs">User Input / Lead Query</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Lead asked about Toronto M5V branch workshop seating capacity..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-800 bg-slate-950 p-3 text-white text-xs focus:border-purple-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 text-xs">
                  Assistant Reply / Action Resolution
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Reserved 2 seats for Toronto masterclass and emailed CASL compliance verification..."
                  value={assistantReply}
                  onChange={(e) => setAssistantReply(e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-800 bg-slate-950 p-3 text-white text-xs focus:border-purple-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 text-xs">Tags (Comma Separated)</label>
                <Input
                  placeholder="e.g. Toronto, Workshop, High Intent"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="mt-1 border-slate-800 bg-slate-950 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                  className="border-slate-800 bg-slate-950 text-slate-300"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="bg-purple-600 text-white hover:bg-purple-500">
                  {isSubmitting ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="mr-2 h-4 w-4" />
                  )}
                  Save to LightMem
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
