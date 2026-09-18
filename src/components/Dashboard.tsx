import React, { useState } from 'react';
import { AppState, BusinessPlan, BrandKit, MarketingCampaign, FinancialProjections, WebsiteDesign } from '../types';
import { 
  Activity, 
  FileText, 
  Palette, 
  Megaphone, 
  DollarSign, 
  MessageSquare,
  Monitor,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Send,
  RefreshCw,
  Copy,
  Check,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  state: AppState;
  onReset: () => void;
  onUpdateSection?: (section: keyof AppState, data: any) => void;
}

export default function Dashboard({ state, onReset, onUpdateSection }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Health & Overview', icon: Activity },
    { id: 'plan', label: 'Business Plan', icon: FileText },
    { id: 'brand', label: 'Brand Kit', icon: Palette },
    { id: 'website', label: 'Website Design', icon: Monitor },
    { id: 'marketing', label: 'Marketing', icon: Megaphone },
    { id: 'finance', label: 'Finance', icon: DollarSign },
    { id: 'mentor', label: 'AI Mentor', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex-shrink-0 flex flex-col h-auto md:h-screen md:sticky md:top-0">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md shadow-indigo-100">
              LP
            </div>
            <div>
              <span className="font-bold text-base tracking-tight block">LaunchPilot</span>
              <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider block">AI Studio</span>
            </div>
          </div>
          <button
            onClick={onReset}
            title="Start new business"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
        </div>

        {/* Current Idea Badge */}
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
          <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">Active Venture</p>
          <p className="text-xs font-semibold text-slate-800 line-clamp-2" title={state.idea}>
            "{state.idea || 'Untitled Business'}"
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="p-4 flex-1 overflow-y-auto space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                activeTab === tab.id 
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm font-semibold' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <tab.icon size={18} className={activeTab === tab.id ? 'text-indigo-600' : 'text-slate-400'} />
              <span>{tab.label}</span>
              {activeTab === tab.id && <ChevronRight size={16} className="ml-auto text-indigo-600" />}
            </button>
          ))}
        </div>

        {/* Quick action footer */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={onReset}
            className="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles size={14} />
            Test Another Idea
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              {activeTab === 'overview' && <OverviewTab state={state} onUpdateSection={onUpdateSection} />}
              {activeTab === 'plan' && <PlanTab state={state} onUpdateSection={onUpdateSection} />}
              {activeTab === 'brand' && <BrandTab state={state} onUpdateSection={onUpdateSection} />}
              {activeTab === 'website' && <WebsiteTab state={state} onUpdateSection={onUpdateSection} />}
              {activeTab === 'marketing' && <MarketingTab state={state} onUpdateSection={onUpdateSection} />}
              {activeTab === 'finance' && <FinanceTab state={state} onUpdateSection={onUpdateSection} />}
              {activeTab === 'mentor' && <MentorTab state={state} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// --- Overview Tab ---
function OverviewTab({ state, onUpdateSection }: { state: AppState; onUpdateSection?: (s: keyof AppState, d: any) => void }) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const analysis = state.analysis;

  const handleRegenerate = async () => {
    if (!state.idea) return;
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/analyze-idea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: state.idea })
      });
      const data = await res.json();
      if (onUpdateSection) onUpdateSection('analysis', data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!analysis) return <LoadingState message="Analyzing market opportunity..." />;

  const risks = Array.isArray(analysis.risks) ? analysis.risks : [];
  const suggestions = Array.isArray(analysis.suggestedImprovements) ? analysis.suggestedImprovements : [];
  const score = typeof analysis.confidenceScore === 'number' ? analysis.confidenceScore : 82;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Business Health & Overview</h2>
          <p className="text-slate-500 mt-1">
            Analysis for: <span className="font-semibold text-slate-800">"{state.idea}"</span>
          </p>
        </div>
        <button
          onClick={handleRegenerate}
          disabled={isRefreshing}
          className="self-start sm:self-center px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-2 disabled:opacity-60"
        >
          <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
          {isRefreshing ? 'Analyzing...' : 'Refresh Analysis'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center gap-3 text-emerald-600 mb-4">
            <TrendingUp size={24} />
            <h3 className="font-semibold text-slate-900">Health Score</h3>
          </div>
          <div>
            <div className="text-5xl font-extrabold text-slate-900 tracking-tight">
              {score}<span className="text-2xl text-slate-400 font-medium">/100</span>
            </div>
            <div className="mt-4 w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, Math.max(0, score))}%` }} 
              />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4">Based on market demand, barriers to entry, and unit economics.</p>
        </div>

        <div className="md:col-span-2 bg-gradient-to-br from-indigo-600 to-indigo-700 p-8 rounded-2xl shadow-sm text-white flex flex-col justify-center">
          <div className="flex items-center gap-2 text-indigo-200 text-xs font-semibold tracking-wider uppercase mb-2">
            <Sparkles size={14} />
            Market Opportunity
          </div>
          <p className="text-lg md:text-xl font-medium leading-relaxed text-indigo-50">
            {analysis.marketOpportunity || "Strong emerging market opportunity with expanding digital channels and favorable demographics."}
          </p>
          <div className="mt-6 pt-4 border-t border-indigo-500/50 flex flex-col sm:flex-row gap-2 sm:items-center text-xs text-indigo-200">
            <span className="font-semibold text-white">Target Audience:</span>
            <span>{analysis.targetAudience || "Lifestyle and values-driven modern consumers."}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 text-amber-500 mb-4">
            <AlertTriangle size={20} />
            <h3 className="font-semibold text-slate-900">Key Risks & Mitigation</h3>
          </div>
          <ul className="space-y-3">
            {risks.length > 0 ? (
              risks.map((risk, i) => (
                <li key={i} className="flex gap-3 text-slate-600 text-sm leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                  <span>{risk}</span>
                </li>
              ))
            ) : (
              <li className="text-sm text-slate-400">No major risks identified.</li>
            )}
          </ul>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 text-indigo-500 mb-4">
            <Lightbulb size={20} />
            <h3 className="font-semibold text-slate-900">Strategic AI Recommendations</h3>
          </div>
          <ul className="space-y-3">
            {suggestions.length > 0 ? (
              suggestions.map((suggestion, i) => (
                <li key={i} className="flex gap-3 text-slate-600 text-sm leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                  <span>{suggestion}</span>
                </li>
              ))
            ) : (
              <li className="text-sm text-slate-400">Implement iterative feedback loops with early adopters.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

// --- Business Plan Tab ---
function PlanTab({ state, onUpdateSection }: { state: AppState; onUpdateSection?: (s: keyof AppState, d: any) => void }) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const plan = state.plan;

  const handleRegenerate = async () => {
    if (!state.idea) return;
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: state.idea })
      });
      const data = await res.json();
      if (onUpdateSection) onUpdateSection('plan', data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCopy = () => {
    if (!plan) return;
    const text = `BUSINESS PLAN: ${state.idea}\n\n` +
      `EXECUTIVE SUMMARY:\n${plan.executiveSummary}\n\n` +
      `PROBLEM:\n${plan.problem}\n\n` +
      `SOLUTION:\n${plan.solution}\n\n` +
      `REVENUE MODEL:\n${plan.revenueModel}\n\n` +
      `MARKETING STRATEGY:\n${plan.marketingStrategy}\n\n` +
      `12-MONTH ROADMAP:\n${(plan.roadmap || []).map((s, i) => `${i + 1}. ${s}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!plan) return <LoadingState message="Drafting comprehensive business plan..." />;

  const segments = Array.isArray(plan.customerSegments) ? plan.customerSegments : [];
  const roadmap = Array.isArray(plan.roadmap) ? plan.roadmap : [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Comprehensive Business Plan</h2>
          <p className="text-slate-500 mt-1">Structured 12-month blueprint and strategic execution guide</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
          >
            {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy Plan'}
          </button>
          <button
            onClick={handleRegenerate}
            disabled={isRefreshing}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-60"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            {isRefreshing ? 'Regenerating...' : 'Regenerate'}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <Card title="Executive Summary">
          <p className="text-slate-700 leading-relaxed text-base">{plan.executiveSummary}</p>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card title="The Problem">
            <p className="text-slate-700 leading-relaxed">{plan.problem}</p>
          </Card>
          <Card title="The Solution">
            <p className="text-slate-700 leading-relaxed">{plan.solution}</p>
          </Card>
        </div>

        <Card title="Target Customer Segments">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {segments.map((seg, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                <span className="text-sm font-medium text-slate-800">{seg}</span>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card title="Revenue Model">
            <p className="text-slate-700 leading-relaxed">{plan.revenueModel}</p>
          </Card>
          <Card title="Go-to-Market Strategy">
            <p className="text-slate-700 leading-relaxed">{plan.marketingStrategy}</p>
          </Card>
        </div>

        <Card title="12-Month Execution Roadmap">
          <div className="space-y-4 mt-2">
            {roadmap.map((step, i) => (
              <div key={i} className="flex items-start gap-4 p-3.5 rounded-xl bg-slate-50 border border-slate-100/80">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex flex-shrink-0 items-center justify-center font-bold text-xs shadow-sm">
                  {i + 1}
                </div>
                <div className="flex-1 mt-1">
                  <p className="text-sm font-medium text-slate-800">{step}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// --- Brand Kit Tab ---
function BrandTab({ state, onUpdateSection }: { state: AppState; onUpdateSection?: (s: keyof AppState, d: any) => void }) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const brand = state.brand;

  const handleRegenerate = async () => {
    if (!state.idea) return;
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/generate-branding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: state.idea })
      });
      const data = await res.json();
      if (onUpdateSection) onUpdateSection('brand', data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!brand) return <LoadingState message="Generating brand identity & color palette..." />;

  const colors = Array.isArray(brand.brandColors) && brand.brandColors.length > 0
    ? brand.brandColors
    : ["#0f172a", "#4f46e5", "#10b981", "#f8fafc"];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Brand Kit & Identity</h2>
          <p className="text-slate-500 mt-1">Visual identity, tone of voice, and brand narrative</p>
        </div>
        <button
          onClick={handleRegenerate}
          disabled={isRefreshing}
          className="self-start sm:self-center px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-2 disabled:opacity-60"
        >
          <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
          {isRefreshing ? 'Regenerating...' : 'Regenerate Brand'}
        </button>
      </div>

      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-transparent to-emerald-500/10" />
        <div className="relative z-10 space-y-3">
          <p className="text-xs uppercase tracking-widest text-indigo-400 font-bold">Generated Brand Name</p>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white">{brand.businessName}</h1>
          <p className="text-lg sm:text-2xl text-slate-300 font-medium italic">"{brand.tagline}"</p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card title="Brand Color Palette">
          <div className="flex flex-wrap gap-4 mt-2">
            {colors.map((color, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div 
                  className="w-16 h-16 rounded-2xl shadow-md border border-slate-200 transition-transform hover:scale-105" 
                  style={{ backgroundColor: color }} 
                />
                <span className="text-xs font-mono font-semibold text-slate-600 uppercase">{color}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="AI Logo Generation Prompt">
          <div className="space-y-3">
            <div className="bg-slate-50 p-4 rounded-xl font-mono text-xs text-slate-700 border border-slate-200/80 leading-relaxed">
              {brand.logoPrompt}
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(brand.logoPrompt || '');
                setCopiedPrompt(true);
                setTimeout(() => setCopiedPrompt(false), 2000);
              }}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
            >
              {copiedPrompt ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
              {copiedPrompt ? 'Copied Prompt!' : 'Copy Prompt for Midjourney / Imagen'}
            </button>
          </div>
        </Card>
      </div>
      
      <Card title="Brand Story & Origin">
        <p className="leading-relaxed text-slate-700 text-base">{brand.brandStory}</p>
      </Card>
    </div>
  );
}

// --- Website Wireframe Tab ---
function WebsiteTab({ state, onUpdateSection }: { state: AppState; onUpdateSection?: (s: keyof AppState, d: any) => void }) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const website = state.website;

  const handleRegenerate = async () => {
    if (!state.idea) return;
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/generate-website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          idea: state.idea, 
          brandColors: state.brand?.brandColors 
        })
      });
      const data = await res.json();
      if (onUpdateSection) onUpdateSection('website', data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!website) return <LoadingState message="Designing high-converting website wireframe..." />;

  const palette = Array.isArray(website.colorPalette) && website.colorPalette.length >= 2
    ? website.colorPalette
    : ["#f8fafc", "#e0e7ff", "#4f46e5"];
  
  const features = Array.isArray(website.features) ? website.features : [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Landing Page & Website Wireframe</h2>
          <p className="text-slate-500 mt-1">High-converting hero section, value propositions, and interactive layout</p>
        </div>
        <button
          onClick={handleRegenerate}
          disabled={isRefreshing}
          className="self-start sm:self-center px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-2 disabled:opacity-60"
        >
          <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
          {isRefreshing ? 'Redesigning...' : 'Redesign Wireframe'}
        </button>
      </div>
      
      {/* Live Landing Page Hero Mockup */}
      <div 
        className="rounded-3xl p-8 sm:p-14 text-center shadow-lg border border-slate-200 flex flex-col items-center justify-center min-h-[380px] relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${palette[0] || '#f8fafc'}, ${palette[1] || '#e0e7ff'})`,
        }}
      >
        <div className="bg-white/90 backdrop-blur-md p-8 sm:p-10 rounded-2xl shadow-xl max-w-2xl border border-white/60">
          <div className="inline-block px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-4">
            Live Preview Prototype
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 text-slate-900 leading-tight">
            {website.heroHeadline || "Turn Your Vision Into Reality"}
          </h1>
          <p className="text-base sm:text-lg font-medium mb-8 text-slate-600 leading-relaxed">
            {website.heroSubheadline || "Empowering people with the best modern craft, exceptional service, and genuine care."}
          </p>
          <button 
            className="px-8 py-3.5 text-white font-bold rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95"
            style={{ backgroundColor: palette[2] || palette[1] || '#4f46e5' }}
          >
            {website.callToAction || "Get Started Today"}
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card title="Target Audience Headline & Messaging">
          <p className="text-base leading-relaxed text-slate-700 italic border-l-4 border-indigo-500 pl-4 py-2 bg-slate-50 rounded-r-xl">
            "{website.targetAudienceMessage || 'Engineered for discerning customers who refuse to compromise on quality.'}"
          </p>
        </Card>
        
        <Card title="Website Color Styling">
          <div className="flex flex-wrap gap-4 mt-2">
            {palette.map((color, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div 
                  className="w-14 h-14 rounded-2xl shadow-sm border border-slate-200" 
                  style={{ backgroundColor: color }} 
                />
                <span className="text-xs font-mono font-semibold text-slate-500 uppercase">{color}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="Core Feature Modules">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mt-2">
          {features.length > 0 ? (
            features.map((feature, i) => (
              <div key={i} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                  <Monitor size={22} />
                </div>
                <h4 className="font-bold text-slate-900 mb-2">{feature.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center text-sm text-slate-400 py-4">Features wireframe loaded.</div>
          )}
        </div>
      </Card>
    </div>
  );
}

// --- Marketing Tab ---
function MarketingTab({ state, onUpdateSection }: { state: AppState; onUpdateSection?: (s: keyof AppState, d: any) => void }) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const marketing = state.marketing;

  const handleRegenerate = async () => {
    if (!state.idea) return;
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/generate-marketing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: state.idea })
      });
      const data = await res.json();
      if (onUpdateSection) onUpdateSection('marketing', data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!marketing) return <LoadingState message="Writing multichannel marketing content..." />;

  const igPosts = Array.isArray(marketing.instagramPosts) ? marketing.instagramPosts : [];
  const liPosts = Array.isArray(marketing.linkedinPosts) ? marketing.linkedinPosts : [];
  const outline = Array.isArray(marketing.blogArticleOutline) ? marketing.blogArticleOutline : [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Marketing & Growth Content</h2>
          <p className="text-slate-500 mt-1">Ready-to-publish social posts, email sequences, and advertising copy</p>
        </div>
        <button
          onClick={handleRegenerate}
          disabled={isRefreshing}
          className="self-start sm:self-center px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-2 disabled:opacity-60"
        >
          <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
          {isRefreshing ? 'Regenerating...' : 'Regenerate Content'}
        </button>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card title="Instagram Posts (Visual & Viral)">
          <div className="space-y-4">
            {igPosts.map((post, i) => (
              <div key={i} className="bg-pink-50/70 border border-pink-100 p-4 rounded-xl text-pink-950 text-sm leading-relaxed">
                <span className="font-bold text-xs uppercase text-pink-600 block mb-1">Post #{i + 1}</span>
                {post}
              </div>
            ))}
          </div>
        </Card>

        <Card title="LinkedIn Thought Leadership Posts">
          <div className="space-y-4">
            {liPosts.map((post, i) => (
              <div key={i} className="bg-blue-50/70 border border-blue-100 p-4 rounded-xl text-blue-950 text-sm leading-relaxed whitespace-pre-line">
                <span className="font-bold text-xs uppercase text-blue-600 block mb-1">Post #{i + 1}</span>
                {post}
              </div>
            ))}
          </div>
        </Card>
      </div>
      
      <Card title="SEO Blog Article Blueprint">
        <h3 className="font-bold text-base mb-3 text-slate-900">{marketing.blogArticleTitle}</h3>
        <ul className="space-y-2 text-slate-700 text-sm">
          {outline.map((point, i) => (
            <li key={i} className="flex gap-2.5 items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </Card>
      
      <Card title="Customer Welcome Email Campaign">
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200/80 text-sm whitespace-pre-line text-slate-700 leading-relaxed font-mono">
          {marketing.emailCampaign}
        </div>
      </Card>

      <Card title="High-Converting Ad Copy">
        <p className="text-slate-800 text-base italic border-l-4 border-indigo-500 pl-4 py-2 bg-slate-50 rounded-r-xl">
          "{marketing.adCopy}"
        </p>
      </Card>
    </div>
  );
}

// --- Finance Tab ---
function FinanceTab({ state, onUpdateSection }: { state: AppState; onUpdateSection?: (s: keyof AppState, d: any) => void }) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const finance = state.finance;

  const handleRegenerate = async () => {
    if (!state.idea) return;
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/generate-finance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: state.idea })
      });
      const data = await res.json();
      if (onUpdateSection) onUpdateSection('finance', data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!finance) return <LoadingState message="Calculating financial forecasts & burn rates..." />;

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(val) || 0);

  const startupCosts = Number(finance.startupCosts) || 15000;
  const revenueForecast = Number(finance.revenueForecast) || 120000;
  const profitProjection = Number(finance.profitProjection) || 35000;
  const breakEven = finance.breakEvenEstimate || "Month 6";

  const chartData = [
    {
      name: 'Financial Outlook',
      'Startup Costs': startupCosts,
      'Revenue Forecast': revenueForecast,
      'Profit Projection': profitProjection,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Financial Projections & Economics</h2>
          <p className="text-slate-500 mt-1">Year 1 cash requirements, revenue milestones, and break-even timeline</p>
        </div>
        <button
          onClick={handleRegenerate}
          disabled={isRefreshing}
          className="self-start sm:self-center px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-2 disabled:opacity-60"
        >
          <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
          {isRefreshing ? 'Recalculating...' : 'Recalculate Projections'}
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Est. Startup Costs</h3>
          <div className="text-3xl font-bold text-slate-900">{formatCurrency(startupCosts)}</div>
          <span className="text-xs text-rose-500 font-medium mt-1 block">Initial capital needed</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Year 1 Revenue</h3>
          <div className="text-3xl font-bold text-emerald-600">{formatCurrency(revenueForecast)}</div>
          <span className="text-xs text-emerald-500 font-medium mt-1 block">Projected gross sales</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Year 1 Net Profit</h3>
          <div className="text-3xl font-bold text-indigo-600">{formatCurrency(profitProjection)}</div>
          <span className="text-xs text-indigo-500 font-medium mt-1 block">Net margin earnings</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Break-Even Milestone</h3>
          <div className="text-2xl font-bold text-slate-900">{breakEven}</div>
          <span className="text-xs text-slate-500 font-medium mt-1 block">Operating profitability</span>
        </div>
      </div>

      <Card title="Interactive Financial Forecast Chart">
        <div className="h-[360px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
              <YAxis 
                tickFormatter={(value) => `$${value.toLocaleString()}`}
                tick={{fill: '#64748b'}} 
                axisLine={false} 
                tickLine={false}
              />
              <Tooltip 
                formatter={(value: any) => formatCurrency(Number(value) || 0)}
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="Startup Costs" fill="#ef4444" radius={[6, 6, 0, 0]} maxBarSize={60} />
              <Bar dataKey="Revenue Forecast" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={60} />
              <Bar dataKey="Profit Projection" fill="#4f46e5" radius={[6, 6, 0, 0]} maxBarSize={60} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

// --- Mentor Tab ---
function MentorTab({ state }: { state: AppState }) {
  const [messages, setMessages] = useState<{role: 'user'|'mentor', text: string}[]>([
    { 
      role: 'mentor', 
      text: `Hello! I'm your dedicated LaunchPilot AI Mentor. Ask me any strategic questions about launching, marketing, pricing, or scaling "${state.idea || 'your business'}"!` 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const suggestedQuestions = [
    "How do I get my first 100 paying customers?",
    "Should I prioritize Instagram or Google Ads?",
    "How should I price my initial offerings?",
    "What are common pitfalls to avoid in Month 1?"
  ];

  const handleSend = async (userText: string) => {
    if (!userText.trim()) return;

    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat-mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userText, 
          context: `Idea: ${state.idea}. Plan: ${state.plan?.executiveSummary || 'N/A'}. Target: ${state.analysis?.targetAudience || 'N/A'}`
        })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'mentor', text: data.reply || "Focus on direct customer conversations and rapid iteration to build early momentum." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'mentor', text: "Focus on validating your value proposition directly with your first 20 target users before spending money on advertising." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-[80vh] flex flex-col bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">AI Business Mentor</h2>
          <p className="text-xs text-slate-500">Live strategic advice grounded in your venture context</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Active Mentor
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-br-sm shadow-sm' 
                : 'bg-slate-100 text-slate-800 rounded-bl-sm border border-slate-200/60 whitespace-pre-line'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="p-4 rounded-2xl bg-slate-100 text-slate-500 rounded-bl-sm text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
              <span>Mentor is thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50 flex flex-wrap gap-2">
        {suggestedQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => handleSend(q)}
            disabled={isTyping}
            className="text-[11px] font-medium text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full transition-colors disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about marketing, pricing, customer acquisition, or scaling..."
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
            disabled={isTyping}
          />
          <button 
            type="submit" 
            disabled={isTyping || !input.trim()}
            className="w-12 flex items-center justify-center bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:bg-slate-300 transition-colors shadow-sm"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}

// --- Reusable UI Elements ---
function Card({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <h3 className="font-semibold text-slate-900 text-base mb-4">{title}</h3>
      <div className="text-slate-700">{children}</div>
    </div>
  );
}

function LoadingState({ message }: { message: string }) {
  return (
    <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-4">
      <div className="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
      <p className="font-medium text-sm animate-pulse">{message}</p>
    </div>
  );
}
