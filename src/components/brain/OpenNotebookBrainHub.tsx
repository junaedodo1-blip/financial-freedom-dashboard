"use client";

import React, { useEffect, useState } from "react";
import {
  BookOpen,
  Bot,
  Brain,
  CheckCircle2,
  Cpu,
  Database,
  ExternalLink,
  FilePlus,
  FileText,
  Filter,
  FolderPlus,
  Layers,
  Lightbulb,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Tag,
  Wand2,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export interface OpenNotebookStatus {
  status: string;
  brain_name: string;
  local_repo_path: string;
  total_sources: number;
  vector_index_status: string;
  last_updated: string;
}

export interface KnowledgeSource {
  id: string;
  title: string;
  category: string;
  content: string;
  author: string;
  created_at: string;
}

export function OpenNotebookBrainHub() {
  const [status, setStatus] = useState<OpenNotebookStatus | null>(null);
  const [sources, setSources] = useState<KnowledgeSource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  // AI Agent RAG Search State
  const [aiQuery, setAiQuery] = useState("");
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [ragResult, setRagResult] = useState<{
    query: string;
    matches_count: number;
    top_citation: string;
    sources: KnowledgeSource[];
  } | null>(null);

  // New Document Modal/Form State
  const [showIndexModal, setShowIndexModal] = useState(false);
  const [isSubmittingDoc, setIsSubmittingDoc] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Tax & Wealth Strategy");
  const [newAuthor, setNewAuthor] = useState("Kalo Strategic Advisory");
  const [newContent, setNewContent] = useState("");

  const fetchBrainData = async () => {
    setIsLoading(true);
    try {
      const [statusRes, sourcesRes] = await Promise.all([
        fetch("/api/open-notebook/brain/status"),
        fetch("/api/open-notebook/brain/sources"),
      ]);

      if (statusRes.ok) {
        const sData = await statusRes.json();
        setStatus(sData);
      }
      if (sourcesRes.ok) {
        const srcData = await sourcesRes.json();
        setSources(srcData);
      }
    } catch (err) {
      console.error("Error fetching Open-Notebook brain data:", err);
      toast.error("Could not load Open-Notebook status");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBrainData();
  }, []);

  const handleRagSearch = async (queryToSearch?: string) => {
    const q = queryToSearch !== undefined ? queryToSearch : aiQuery;
    if (!q.trim() || isAiSearching) return;

    setIsAiSearching(true);
    try {
      const res = await fetch("/api/open-notebook/brain/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, top_k: 3 }),
      });

      if (res.ok) {
        const data = await res.json();
        setRagResult(data);
        toast.success(`🔍 RAG Search Complete`, {
          description: `Found ${data.matches_count} matching sources from Open-Notebook Knowledge Brain.`,
        });
      } else {
        toast.error("RAG search query failed");
      }
    } catch (err) {
      toast.error("Error executing RAG search query");
    } finally {
      setIsAiSearching(false);
    }
  };

  const handleIndexDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      toast.error("Please provide both Title and Content for the playbook.");
      return;
    }

    setIsSubmittingDoc(true);
    try {
      const res = await fetch("/api/open-notebook/brain/index-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          category: newCategory,
          content: newContent,
          author: newAuthor,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success("🧠 Playbook Indexed into Open-Notebook!", {
          description: data.message || `Indexed '${newTitle}' into company brain.`,
        });
        setNewTitle("");
        setNewContent("");
        setShowIndexModal(false);
        fetchBrainData();
      } else {
        toast.error("Failed to index playbook document");
      }
    } catch (err) {
      toast.error("Error connecting to document indexer");
    } finally {
      setIsSubmittingDoc(false);
    }
  };

  const categories = [
    "All",
    "Tax & Wealth Strategy",
    "Regulatory & Legal",
    "Sales & AI Pitch",
    "Branch Operations",
  ];

  const filteredSources =
    activeCategory === "All"
      ? sources
      : sources.filter((s) => s.category === activeCategory);

  return (
    <div className="relative min-h-screen space-y-8 bg-slate-950 p-6 text-slate-100">
      {/* Impeccable Radial Glow Backdrops */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute right-10 top-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

      {/* Header Banner */}
      <div className="relative flex flex-col gap-4 border-b border-slate-800 pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 ring-1 ring-emerald-500/30">
              <Brain className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-extrabold tracking-tight text-white">
                  Open-Notebook Knowledge Brain
                </h1>
                <Badge className="bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40">
                  RAG Vector Active
                </Badge>
              </div>
              <p className="mt-1 text-sm text-slate-400">
                Kalo Systems enterprise knowledge base powered by open-notebook repository. AI Fleet Agents automatically query this brain for real-time compliance & strategy context.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={fetchBrainData}
            disabled={isLoading}
            className="border-slate-700 bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh Status
          </Button>
          <Button
            onClick={() => setShowIndexModal(true)}
            className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow-lg shadow-emerald-900/30 hover:from-emerald-500 hover:to-cyan-500"
          >
            <FilePlus className="mr-2 h-4 w-4" />
            Index Playbook
          </Button>
        </div>
      </div>

      {/* Connectivity Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-md">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Connection Status
              </span>
              <Badge className="bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30">
                CONNECTED
              </Badge>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              <span className="text-xl font-bold text-white">
                {status?.brain_name || "Kalo Enterprise Brain"}
              </span>
            </div>
            <p className="mt-1 truncate text-xs text-slate-500">
              Path: {status?.local_repo_path || "c:...\\open-notebook"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-md">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Indexed Knowledge Sources
              </span>
              <BookOpen className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-cyan-300">
                {sources.length}
              </span>
              <span className="text-xs text-slate-400">Active Playbooks</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              100% Vectorized for Paperclip RAG
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-md">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Vector Index Engine
              </span>
              <Database className="h-4 w-4 text-purple-400" />
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Badge className="bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/40">
                {status?.vector_index_status || "INDEXED_READY"}
              </Badge>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Cosine Similarity Keyword Vector Matrix
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-md">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                AI Fleet Agent Access
              </span>
              <Bot className="h-4 w-4 text-amber-400" />
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xl font-bold text-amber-300">4 Fleet Bots</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Speed-to-Lead, Scout, CASL & Mastermind
            </p>
          </CardContent>
        </Card>
      </div>

      {/* AI Agent RAG Advisor Box (Impeccable Design) */}
      <Card className="relative overflow-hidden border-emerald-500/30 bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/40 shadow-2xl backdrop-blur-xl">
        <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-emerald-500/10 blur-2xl" />
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40">
                <Wand2 className="h-5 w-5 animate-pulse text-emerald-400" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-white">
                  Paperclip AI Knowledge Advisor
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Ask natural language questions to query Open-Notebook RAG vector context in real-time.
                </CardDescription>
              </div>
            </div>
            <Badge className="bg-emerald-500/10 text-emerald-300 border-emerald-500/30">
              RAG Engine v1.0
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Ask your company brain (e.g., 'What is our CASL 180-day consent rule?')..."
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleRagSearch()}
                className="border-slate-800 bg-slate-950/80 pl-9 text-slate-200 placeholder:text-slate-500 focus:border-emerald-500"
              />
            </div>
            <Button
              onClick={() => handleRagSearch()}
              disabled={isAiSearching || !aiQuery.trim()}
              className="bg-emerald-600 text-white hover:bg-emerald-500"
            >
              {isAiSearching ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Query Brain
            </Button>
          </div>

          {/* Quick RAG Presets */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-slate-400">Preset Queries:</span>
            {[
              "CASL 180-day implied consent rule",
              "Canadian HoldCo tax sheltering strategy",
              "Sub-45s speed to lead pitch script",
              "Canadian branch workshop capacity",
            ].map((preset) => (
              <button
                key={preset}
                onClick={() => {
                  setAiQuery(preset);
                  handleRagSearch(preset);
                }}
                className="rounded-md border border-slate-800 bg-slate-950/60 px-2.5 py-1 text-xs text-emerald-300 transition-colors hover:border-emerald-500/50 hover:bg-emerald-950/30"
              >
                ⚡ {preset}
              </button>
            ))}
          </div>

          {/* RAG Search Results Output Card */}
          {ragResult && (
            <div className="mt-4 rounded-xl border border-emerald-500/30 bg-slate-950/90 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm font-semibold text-emerald-300">
                    RAG Context Citation: {ragResult.top_citation}
                  </span>
                </div>
                <Badge className="bg-slate-800 text-xs text-slate-300">
                  {ragResult.matches_count} Sources Matched
                </Badge>
              </div>

              <div className="space-y-3">
                {ragResult.sources.map((src, idx) => (
                  <div
                    key={src.id}
                    className="rounded-lg border border-slate-800 bg-slate-900/60 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white">
                        [{idx + 1}] {src.title}
                      </span>
                      <Badge className="bg-cyan-500/20 text-cyan-300 text-xs">
                        {src.category}
                      </Badge>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-slate-300">
                      {src.content}
                    </p>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Author: {src.author}</span>
                      <span>Source ID: {src.id}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Knowledge Base Catalog Section */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-white">
              Indexed Company Knowledge Playbooks
            </h2>
            <Badge className="bg-slate-800 text-slate-300">{filteredSources.length}</Badge>
          </div>

          {/* Category Filter Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400 mr-1" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/50"
                    : "bg-slate-900/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Playbook Cards Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredSources.map((src) => (
            <Card
              key={src.id}
              className="group relative border-slate-800 bg-slate-900/60 transition-all duration-200 hover:border-emerald-500/40 hover:bg-slate-900/90"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Badge className="mb-2 bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30">
                      {src.category}
                    </Badge>
                    <CardTitle className="text-base font-bold text-white group-hover:text-emerald-300">
                      {src.title}
                    </CardTitle>
                  </div>
                  <Badge variant="outline" className="border-slate-700 text-slate-400 text-xs">
                    {src.id}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs leading-relaxed text-slate-300">
                  {src.content}
                </p>
                <div className="flex items-center justify-between border-t border-slate-800/80 pt-3 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                    <span>{src.author}</span>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span className="text-[11px]">RAG Vectored</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Index Playbook Modal / Form overlay */}
      {showIndexModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                  <FilePlus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Index New Playbook</h3>
                  <p className="text-xs text-slate-400">
                    Add company documents into Open-Notebook for real-time AI Fleet RAG lookup.
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowIndexModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </Button>
            </div>

            <form onSubmit={handleIndexDocument} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300">
                  Document Title
                </label>
                <Input
                  placeholder="e.g. 2026 High-Yield HoldCo Strategy & Compliance Manual"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="mt-1 border-slate-800 bg-slate-950 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-800 bg-slate-950 p-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Tax & Wealth Strategy">Tax & Wealth Strategy</option>
                    <option value="Regulatory & Legal">Regulatory & Legal</option>
                    <option value="Sales & AI Pitch">Sales & AI Pitch</option>
                    <option value="Branch Operations">Branch Operations</option>
                    <option value="Product & SOP">Product & SOP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300">
                    Author / Department
                  </label>
                  <Input
                    placeholder="e.g. CASL Compliance Officer"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    className="mt-1 border-slate-800 bg-slate-950 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300">
                  Playbook Content & Key Rules
                </label>
                <textarea
                  rows={5}
                  placeholder="Enter detailed knowledge content, regulations, pitch scripts, or operational procedures..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-800 bg-slate-950 p-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowIndexModal(false)}
                  className="border-slate-800 bg-slate-950 text-slate-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmittingDoc}
                  className="bg-emerald-600 text-white hover:bg-emerald-500"
                >
                  {isSubmittingDoc ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <FilePlus className="mr-2 h-4 w-4" />
                  )}
                  Index Playbook
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
