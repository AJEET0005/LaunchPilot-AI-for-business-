import React, { useState, useEffect } from 'react';
import { Rocket, Sparkles, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

interface LandingProps {
  onAnalyze: (idea: string) => void;
  isLoading: boolean;
}

export default function Landing({ onAnalyze, isLoading }: LandingProps) {
  const [idea, setIdea] = useState('');
  const [stepIndex, setStepIndex] = useState(0);

  const sampleIdeas = [
    "Organic artisan herbal tea brand",
    "AI personal fitness & nutrition coach",
    "Zero-waste direct-to-consumer coffee pods",
    "B2B freelance contract management SaaS",
    "Luxury pet accessories & organic treats"
  ];

  const agentSteps = [
    "Analyzing market opportunity & target audience...",
    "Drafting executive summary & 12-month roadmap...",
    "Designing brand identity, colors & logo prompt...",
    "Authoring viral social, blog & email copy...",
    "Projecting revenue, startup costs & break-even...",
    "Synthesizing high-converting website wireframe..."
  ];

  useEffect(() => {
    if (!isLoading) {
      setStepIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev < agentSteps.length - 1 ? prev + 1 : prev));
    }, 1200);
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (idea.trim() && !isLoading) {
      onAnalyze(idea.trim());
    }
  };

  const handleSelectSample = (sample: string) => {
    setIdea(sample);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-900 relative">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl w-full space-y-8 text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-indigo-600 rounded-3xl text-white shadow-xl shadow-indigo-200/60 ring-8 ring-indigo-50">
            <Rocket size={42} strokeWidth={1.8} />
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold tracking-wide uppercase">
            <Sparkles size={14} />
            Autonomous Startup Generator
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900">
            LaunchPilot <span className="text-indigo-600">AI</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 font-medium max-w-xl mx-auto">
            From Idea to Income—Powered by AI.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="mt-8 bg-white p-2 rounded-2xl shadow-xl shadow-slate-200/60 flex flex-col sm:flex-row gap-2 border border-slate-200/80">
          <input
            type="text"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="e.g., I want to start an organic tea business..."
            className="flex-1 px-5 py-4 text-base sm:text-lg bg-transparent border-none focus:outline-none focus:ring-0 placeholder-slate-400 text-slate-900 font-medium"
            disabled={isLoading}
            required
          />
          <button
            type="submit"
            disabled={isLoading || !idea.trim()}
            className="px-8 py-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-slate-900/10 active:scale-95"
          >
            {isLoading ? (
              <span className="flex items-center gap-2 font-medium">
                <Loader2 className="animate-spin" size={18} />
                Launching...
              </span>
            ) : (
              <span className="flex items-center gap-2 font-medium">
                Launch Venture
                <ArrowRight size={18} />
              </span>
            )}
          </button>
        </form>

        {/* Loading Progress State */}
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 bg-white rounded-2xl border border-indigo-100 shadow-md text-left space-y-3"
          >
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-2 text-indigo-600">
                <Loader2 size={14} className="animate-spin" />
                Coordinating Autonomous Agents
              </span>
              <span>Step {stepIndex + 1} of {agentSteps.length}</span>
            </div>

            <p className="text-sm font-semibold text-slate-800">
              {agentSteps[stepIndex]}
            </p>

            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-700 ease-out" 
                style={{ width: `${((stepIndex + 1) / agentSteps.length) * 100}%` }}
              />
            </div>
          </motion.div>
        )}

        {/* Starter Ideas */}
        {!isLoading && (
          <div className="pt-2 text-left">
            <p className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-3 text-center">
              Or start with an example idea
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {sampleIdeas.map((sample, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectSample(sample)}
                  className="text-xs font-medium text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 px-3.5 py-2 rounded-xl transition-all shadow-xs hover:border-indigo-300"
                >
                  {sample}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-medium text-slate-400">
          <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-500" /> Market Analysis</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-500" /> Business Plan</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-500" /> Brand Kit</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-500" /> Marketing</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-500" /> Financials</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-500" /> Website</span>
        </div>
      </motion.div>
    </div>
  );
}
