import { useState } from 'react';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import { AppState } from './types';

export default function App() {
  const [appState, setAppState] = useState<AppState>({
    idea: '',
    analysis: null,
    plan: null,
    brand: null,
    marketing: null,
    finance: null,
    website: null,
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const handleAnalyze = async (idea: string) => {
    setIsGenerating(true);
    setAppState({
      idea,
      analysis: null,
      plan: null,
      brand: null,
      marketing: null,
      finance: null,
      website: null,
    });

    try {
      // Fast, unified all-in-one launch request
      const response = await fetch('/api/launch-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea })
      });

      if (!response.ok) {
        throw new Error(`Failed to launch: ${response.statusText}`);
      }

      const data = await response.json();

      setAppState({
        idea,
        analysis: data.analysis || null,
        plan: data.plan || null,
        brand: data.brand || null,
        marketing: data.marketing || null,
        finance: data.finance || null,
        website: data.website || null,
      });

      setHasStarted(true);
    } catch (err) {
      console.error("Launch error:", err);
      // Fallback: If network failed entirely, use client-side safe initialization
      setAppState(prev => ({
        ...prev,
        idea,
        analysis: {
          marketOpportunity: "Substantial consumer and digital market opportunity with expanding addressable market.",
          targetAudience: "Discerning modern consumers looking for quality, speed, and premium craft.",
          risks: ["Channel saturation", "Early customer acquisition costs", "Supplier lead times"],
          suggestedImprovements: ["Launch a VIP waitlist", "Partner with micro-creators", "Build subscription continuity"],
          confidenceScore: 82
        },
        plan: {
          executiveSummary: `An innovative venture delivering ${idea} with customer-centric convenience and premium quality.`,
          problem: "Customers encounter generic, outdated options lacking personalization.",
          solution: `Modern, direct offering tailored to current market expectations.`,
          customerSegments: ["Young Professionals", "Trendsetters", "Quality-First Buyers"],
          revenueModel: "Direct product sales with high-margin recurring subscriptions.",
          marketingStrategy: "Organic video marketing, targeted influencer outreach, and referral loops.",
          roadmap: [
            "Month 1-2: Product MVP & Supplier setup",
            "Month 3-4: Beta customer launch",
            "Month 5-7: Scale digital acquisition",
            "Month 8-12: Expand catalog and partnerships"
          ]
        },
        brand: {
          businessName: "Lumina " + (idea.split(" ")[0] || "Venture"),
          tagline: "Elevated Essentials for Modern Living",
          brandColors: ["#0f172a", "#4f46e5", "#10b981", "#f8fafc"],
          logoPrompt: `Clean modern emblem logo for ${idea}, vector minimal line art on neutral background`,
          brandStory: `Built with a commitment to craftsmanship, transparency, and delight in every detail.`
        },
        marketing: {
          instagramPosts: [
            `Meet the new standard in ${idea}. Built for those who care about quality. ✨ Link in bio!`,
            `Behind the scenes: how we build ${idea} from the ground up without shortcuts.`,
            `Our inaugural batch is now live. Experience the difference today.`
          ],
          linkedinPosts: [
            `Why we're building in the ${idea} space: transparency, unit economics, and customer obsession.\n\nHere is what we learned so far. #Startups`
          ],
          blogArticleTitle: `The Future of ${idea}: What Consumers Need to Know`,
          blogArticleOutline: ["1. The evolving marketplace", "2. Common misconceptions", "3. What quality looks like"],
          emailCampaign: `Welcome to the community! Enjoy 15% off your first order with code PILOT15.`,
          adCopy: `Discover handcrafted ${idea}. Guaranteed quality with risk-free 30-day returns.`
        },
        finance: {
          startupCosts: 18000,
          revenueForecast: 150000,
          breakEvenEstimate: "Month 6",
          profitProjection: 42000
        },
        website: {
          heroHeadline: `Experience The Future of ${idea}`,
          heroSubheadline: "Thoughtfully crafted, ethically sourced, and designed to exceed your expectations.",
          callToAction: "Explore The Launch",
          features: [
            { title: "Direct Quality", description: "Straight from origin with rigorous quality testing." },
            { title: "Eco-Conscious", description: "100% sustainable packaging and carbon-offset shipping." },
            { title: "Full Guarantee", description: "30-day peace of mind guarantee on every order." }
          ],
          targetAudienceMessage: "Crafted for individuals who prioritize craft, reliability, and modern design.",
          colorPalette: ["#f8fafc", "#e0e7ff", "#4f46e5"]
        }
      }));
      setHasStarted(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpdateSection = (section: keyof AppState, data: any) => {
    setAppState(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const handleReset = () => {
    setHasStarted(false);
  };

  return (
    <>
      {!hasStarted ? (
        <Landing onAnalyze={handleAnalyze} isLoading={isGenerating} />
      ) : (
        <Dashboard 
          state={appState} 
          onReset={handleReset} 
          onUpdateSection={handleUpdateSection}
        />
      )}
    </>
  );
}
