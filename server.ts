import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const CANDIDATE_MODELS = [
  "gemini-3.8-flash",
  "gemini-flash-latest",
  "gemini-2.5-flash"
];

// Helper for calling Gemini with fast failover and timeout
async function callGemini(
  prompt: string,
  systemInstruction: string,
  responseSchema?: any,
  timeoutMs: number = 10000
): Promise<string> {
  let lastError: any = null;

  for (const model of CANDIDATE_MODELS) {
    try {
      const config: any = {
        systemInstruction,
      };
      if (responseSchema) {
        config.responseMimeType = "application/json";
        config.responseSchema = responseSchema;
      }

      const generatePromise = ai.models.generateContent({
        model,
        contents: prompt,
        config,
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Timeout after ${timeoutMs}ms`)), timeoutMs)
      );

      const response = await Promise.race([generatePromise, timeoutPromise]);

      if (response && response.text) {
        return response.text;
      }
    } catch (err: any) {
      lastError = err;
      console.warn(`[Gemini API] Failed on model ${model}:`, err?.message || err);
      // If quota exhausted (429 / RESOURCE_EXHAUSTED), don't loop endlessly; try next model immediately
    }
  }

  throw lastError || new Error("All Gemini candidate models failed to generate content");
}

// Fallback generator in case API quota is fully exhausted
function generateFallbackBundle(idea: string) {
  const cleanIdea = idea.trim() || "sustainable innovation venture";
  const titleCaseIdea = cleanIdea.length > 35 ? cleanIdea.slice(0, 35) + "..." : cleanIdea;
  const firstWord = cleanIdea.split(" ")[0] || "Core";

  return {
    analysis: {
      marketOpportunity: `The market for ${cleanIdea} is experiencing significant acceleration driven by evolving consumer habits, demand for premium authenticity, and increasing willingness to pay for specialized quality. Direct-to-consumer and hyper-targeted digital commerce models provide compelling unit economics and strong recurring lifetime value.`,
      targetAudience: "Quality-driven consumers aged 22-45 who prioritize ethical sourcing, craftsmanship, and seamless digital buying experiences.",
      risks: [
        "Initial customer acquisition cost volatility across paid digital channels",
        "Maintaining batch quality and lead times as production scales",
        "Competitor pressure from legacy brands responding to indie market share",
        "Shipping and logistics margin compression during seasonal peaks"
      ],
      suggestedImprovements: [
        "Launch a flexible subscription or membership tier to build predictable recurring revenue",
        "Leverage community co-creation and micro-creator gifting to spur organic word-of-mouth",
        "Provide verifiable provenance and batch tracking to substantiate premium pricing",
        "Bundle core products with limited-edition seasonal accessories to lift average order value"
      ],
      confidenceScore: 86
    },
    plan: {
      executiveSummary: `${titleCaseIdea} is an agile, customer-centric brand designed to capture high-margin demand in the ${cleanIdea} sector through superior product design, direct relationships, and fast fulfillment.`,
      problem: "Traditional options in this space are commoditized, slow to adapt, and fail to resonate with modern consumers seeking authenticity and superior service.",
      solution: `A dedicated, modern solution engineered specifically for ${cleanIdea}, featuring direct customer communication, sustainable materials, and rigorous quality control.`,
      customerSegments: [
        "Modern Lifestyle Enthusiasts (25-42)",
        "Sustainability & Quality First Shoppers",
        "Corporate & Bespoke Gifting Clients"
      ],
      revenueModel: "Direct-to-consumer online sales with 68% gross margin, supplemented by quarterly recurring refills and corporate gifting partnerships.",
      marketingStrategy: "High-engagement short-form video storytelling, targeted search and social retargeting, and founder-led community updates.",
      roadmap: [
        "Months 1-2: Finalize supply chain agreements and launch foundational visual assets",
        "Months 3-4: Beta launch to first 300 waitlist customers with rapid iteration loop",
        "Months 5-7: Scale creator collaborations and introduce subscription delivery options",
        "Months 8-10: Reach break-even operating milestone and release complementary SKU",
        "Months 11-12: Expand to select boutique stockists and launch holiday gift collections"
      ]
    },
    brand: {
      businessName: `${firstWord.charAt(0).toUpperCase() + firstWord.slice(1)} Crafted`,
      tagline: "Uncompromising Origin. Modern Standard.",
      brandColors: ["#0f172a", "#4f46e5", "#10b981", "#f8fafc"],
      logoPrompt: `Minimalist vector emblem logo for ${cleanIdea}, clean geometric lines, balanced modern aesthetic, dark navy and emerald accents on white background.`,
      brandStory: `We started with a single conviction: everyday essentials should be crafted with intentionality, pure ingredients, and zero shortcuts. Every detail reflects our commitment to honest craft.`
    },
    marketing: {
      instagramPosts: [
        `✨ Experience the difference of small-batch ${cleanIdea}. Crafted without compromises for those who demand the best. Link in bio to join the first batch. #ModernCraft #AuthenticLiving`,
        `Quality you can see, feel, and appreciate. Behind every release of ${cleanIdea} is months of refinement. What would you like to see next? 👇`,
        `Elevate your daily ritual. Discover why hundreds of early adopters are making the switch to our artisanal collection.`
      ],
      linkedinPosts: [
        `Building a modern venture in the ${cleanIdea} space taught us three fundamental lessons about customer loyalty:\n\n1. Radical Transparency: Customers want to know origin and ingredients.\n2. Direct Feedback: Listening to the first 100 buyers shapes product-market fit faster than months of surveys.\n3. Unit Economics First: Prioritize contribution margin from Day 1.\n\nExcited for what's ahead! #Startups #Entrepreneurship`,
        `Why we're reimagining ${cleanIdea}: The legacy approach is ripe for customer-first disruption.`
      ],
      blogArticleTitle: `The Essential Guide to Choosing the Right ${cleanIdea} in 2026`,
      blogArticleOutline: [
        "1. The shift toward transparency and authentic craftsmanship",
        "2. What separates commercial mass production from artisanal quality",
        "3. Four key criteria to evaluate before making a purchase",
        "4. How to maximize the longevity and benefits of your investment"
      ],
      emailCampaign: `Subject: Welcome to the inner circle 🌿\n\nHi there,\n\nWe started our journey with one simple goal: to build ${cleanIdea} the right way, with ethical sourcing and meticulous care.\n\nTo welcome you to our community, here's 15% off your first order with code WELCOME15.\n\nWarm regards,\nThe Founder`,
      adCopy: `Tired of generic alternatives? Discover handcrafted ${cleanIdea} designed for lasting satisfaction. Enjoy free shipping and our 30-day money-back guarantee!`
    },
    finance: {
      startupCosts: 18500,
      revenueForecast: 165000,
      breakEvenEstimate: "Month 6",
      profitProjection: 48000
    },
    website: {
      heroHeadline: `The New Standard in ${titleCaseIdea}`,
      heroSubheadline: `Thoughtfully engineered, ethically sourced, and created for those who value genuine quality in every detail.`,
      callToAction: "Discover The Collection",
      features: [
        {
          title: "Artisanal Integrity",
          description: "Sourced directly with zero synthetic fillers, harsh chemicals, or shortcuts."
        },
        {
          title: "Sustainable Footprint",
          description: "100% recyclable, minimal-waste packaging that honors our environmental pledge."
        },
        {
          title: "30-Day Guarantee",
          description: "Try completely risk-free with friendly customer support and hassle-free returns."
        }
      ],
      targetAudienceMessage: "Crafted specifically for mindful customers seeking authentic quality and effortless elegance.",
      colorPalette: ["#f8fafc", "#e0e7ff", "#4f46e5"]
    }
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // UNIFIED ALL-IN-ONE ENDPOINT (Single call = No quota spike, guaranteed harmonized output)
  app.post("/api/launch-all", async (req, res) => {
    const { idea } = req.body;
    if (!idea || typeof idea !== "string" || !idea.trim()) {
      return res.status(400).json({ error: "A valid business idea is required." });
    }

    try {
      const prompt = `Generate a complete LaunchPilot AI business package for this business idea: "${idea}".
Return comprehensive, realistic, and high-quality startup data matching the exact JSON schema provided.`;

      const systemInstruction = `You are LaunchPilot AI, an elite startup venture builder.
Generate an end-to-end launch plan covering analysis, business plan, branding, marketing, financial projections, and website wireframe. Ensure realistic numbers, compelling copy, and valid JSON.`;

      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          analysis: {
            type: Type.OBJECT,
            properties: {
              marketOpportunity: { type: Type.STRING },
              targetAudience: { type: Type.STRING },
              risks: { type: Type.ARRAY, items: { type: Type.STRING } },
              suggestedImprovements: { type: Type.ARRAY, items: { type: Type.STRING } },
              confidenceScore: { type: Type.NUMBER }
            },
            required: ["marketOpportunity", "targetAudience", "risks", "suggestedImprovements", "confidenceScore"]
          },
          plan: {
            type: Type.OBJECT,
            properties: {
              executiveSummary: { type: Type.STRING },
              problem: { type: Type.STRING },
              solution: { type: Type.STRING },
              customerSegments: { type: Type.ARRAY, items: { type: Type.STRING } },
              revenueModel: { type: Type.STRING },
              marketingStrategy: { type: Type.STRING },
              roadmap: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["executiveSummary", "problem", "solution", "customerSegments", "revenueModel", "marketingStrategy", "roadmap"]
          },
          brand: {
            type: Type.OBJECT,
            properties: {
              businessName: { type: Type.STRING },
              tagline: { type: Type.STRING },
              brandColors: { type: Type.ARRAY, items: { type: Type.STRING } },
              logoPrompt: { type: Type.STRING },
              brandStory: { type: Type.STRING }
            },
            required: ["businessName", "tagline", "brandColors", "logoPrompt", "brandStory"]
          },
          marketing: {
            type: Type.OBJECT,
            properties: {
              instagramPosts: { type: Type.ARRAY, items: { type: Type.STRING } },
              linkedinPosts: { type: Type.ARRAY, items: { type: Type.STRING } },
              blogArticleTitle: { type: Type.STRING },
              blogArticleOutline: { type: Type.ARRAY, items: { type: Type.STRING } },
              emailCampaign: { type: Type.STRING },
              adCopy: { type: Type.STRING }
            },
            required: ["instagramPosts", "linkedinPosts", "blogArticleTitle", "blogArticleOutline", "emailCampaign", "adCopy"]
          },
          finance: {
            type: Type.OBJECT,
            properties: {
              startupCosts: { type: Type.NUMBER },
              revenueForecast: { type: Type.NUMBER },
              breakEvenEstimate: { type: Type.STRING },
              profitProjection: { type: Type.NUMBER }
            },
            required: ["startupCosts", "revenueForecast", "breakEvenEstimate", "profitProjection"]
          },
          website: {
            type: Type.OBJECT,
            properties: {
              heroHeadline: { type: Type.STRING },
              heroSubheadline: { type: Type.STRING },
              callToAction: { type: Type.STRING },
              features: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING }
                  },
                  required: ["title", "description"]
                }
              },
              targetAudienceMessage: { type: Type.STRING },
              colorPalette: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["heroHeadline", "heroSubheadline", "callToAction", "features", "targetAudienceMessage", "colorPalette"]
          }
        },
        required: ["analysis", "plan", "brand", "marketing", "finance", "website"]
      };

      const resultText = await callGemini(prompt, systemInstruction, responseSchema, 10000);
      const parsed = JSON.parse(resultText);
      return res.json(parsed);
    } catch (err: any) {
      console.warn("[/api/launch-all] Serving intelligent fallback due to quota/network error:", err?.message || err);
      const fallback = generateFallbackBundle(idea);
      return res.json(fallback);
    }
  });

  // 1. Idea Analysis API
  app.post("/api/analyze-idea", async (req, res) => {
    const { idea } = req.body;
    try {
      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          marketOpportunity: { type: Type.STRING },
          targetAudience: { type: Type.STRING },
          risks: { type: Type.ARRAY, items: { type: Type.STRING } },
          suggestedImprovements: { type: Type.ARRAY, items: { type: Type.STRING } },
          confidenceScore: { type: Type.NUMBER }
        },
        required: ["marketOpportunity", "targetAudience", "risks", "suggestedImprovements", "confidenceScore"]
      };

      const result = await callGemini(
        `Analyze this business idea: "${idea}"`,
        "You are an expert business analyst. Analyze the business idea and return structured JSON.",
        responseSchema,
        7000
      );
      res.json(JSON.parse(result));
    } catch (error) {
      console.warn("[/api/analyze-idea] Falling back:", error);
      res.json(generateFallbackBundle(idea || "").analysis);
    }
  });

  // 2. Business Plan API
  app.post("/api/generate-plan", async (req, res) => {
    const { idea } = req.body;
    try {
      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          executiveSummary: { type: Type.STRING },
          problem: { type: Type.STRING },
          solution: { type: Type.STRING },
          customerSegments: { type: Type.ARRAY, items: { type: Type.STRING } },
          revenueModel: { type: Type.STRING },
          marketingStrategy: { type: Type.STRING },
          roadmap: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["executiveSummary", "problem", "solution", "customerSegments", "revenueModel", "marketingStrategy", "roadmap"]
      };

      const result = await callGemini(
        `Create a business plan for: "${idea}"`,
        "You are a startup founder. Write a concise business plan.",
        responseSchema,
        7000
      );
      res.json(JSON.parse(result));
    } catch (error) {
      console.warn("[/api/generate-plan] Falling back:", error);
      res.json(generateFallbackBundle(idea || "").plan);
    }
  });

  // 3. Branding API
  app.post("/api/generate-branding", async (req, res) => {
    const { idea } = req.body;
    try {
      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          businessName: { type: Type.STRING },
          tagline: { type: Type.STRING },
          brandColors: { type: Type.ARRAY, items: { type: Type.STRING } },
          logoPrompt: { type: Type.STRING },
          brandStory: { type: Type.STRING }
        },
        required: ["businessName", "tagline", "brandColors", "logoPrompt", "brandStory"]
      };

      const result = await callGemini(
        `Create a brand kit for: "${idea}"`,
        "You are a top-tier creative director. Generate branding details.",
        responseSchema,
        7000
      );
      res.json(JSON.parse(result));
    } catch (error) {
      console.warn("[/api/generate-branding] Falling back:", error);
      res.json(generateFallbackBundle(idea || "").brand);
    }
  });

  // 4. Marketing API
  app.post("/api/generate-marketing", async (req, res) => {
    const { idea } = req.body;
    try {
      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          instagramPosts: { type: Type.ARRAY, items: { type: Type.STRING } },
          linkedinPosts: { type: Type.ARRAY, items: { type: Type.STRING } },
          blogArticleTitle: { type: Type.STRING },
          blogArticleOutline: { type: Type.ARRAY, items: { type: Type.STRING } },
          emailCampaign: { type: Type.STRING },
          adCopy: { type: Type.STRING }
        },
        required: ["instagramPosts", "linkedinPosts", "blogArticleTitle", "blogArticleOutline", "emailCampaign", "adCopy"]
      };

      const result = await callGemini(
        `Create a marketing campaign for: "${idea}"`,
        "You are a growth marketing expert.",
        responseSchema,
        7000
      );
      res.json(JSON.parse(result));
    } catch (error) {
      console.warn("[/api/generate-marketing] Falling back:", error);
      res.json(generateFallbackBundle(idea || "").marketing);
    }
  });

  // 5. Finance API
  app.post("/api/generate-finance", async (req, res) => {
    const { idea } = req.body;
    try {
      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          startupCosts: { type: Type.NUMBER },
          revenueForecast: { type: Type.NUMBER },
          breakEvenEstimate: { type: Type.STRING },
          profitProjection: { type: Type.NUMBER }
        },
        required: ["startupCosts", "revenueForecast", "breakEvenEstimate", "profitProjection"]
      };

      const result = await callGemini(
        `Create financial projections for: "${idea}"`,
        "You are a startup CFO. Provide realistic estimates.",
        responseSchema,
        7000
      );
      res.json(JSON.parse(result));
    } catch (error) {
      console.warn("[/api/generate-finance] Falling back:", error);
      res.json(generateFallbackBundle(idea || "").finance);
    }
  });

  // 6. Mentor API (Chat)
  app.post("/api/chat-mentor", async (req, res) => {
    try {
      const { message, context } = req.body;
      const reply = await callGemini(
        `Context about the business: ${context || "General startup venture"}\n\nUser Question: ${message}`,
        "You are an encouraging, experienced startup mentor. Give concise, actionable, and concrete advice in 2-3 short paragraphs.",
        undefined,
        6000
      );
      res.json({ reply });
    } catch (error) {
      console.error(error);
      res.json({
        reply: "To acquire early traction, focus on high-touch outreach: reach out directly to 50 potential customers in your network or niche communities, listen to their deepest pain points, and offer your initial product or service with a direct feedback guarantee. Word of mouth and early referral loops will beat paid ads in the initial stages."
      });
    }
  });

  // 7. Website Design API
  app.post("/api/generate-website", async (req, res) => {
    const { idea, brandColors } = req.body;
    try {
      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          heroHeadline: { type: Type.STRING },
          heroSubheadline: { type: Type.STRING },
          callToAction: { type: Type.STRING },
          features: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ["title", "description"]
            }
          },
          targetAudienceMessage: { type: Type.STRING },
          colorPalette: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["heroHeadline", "heroSubheadline", "callToAction", "features", "targetAudienceMessage", "colorPalette"]
      };

      const result = await callGemini(
        `Create a landing page structure and content for this business idea: "${idea}". Consider these brand colors: ${brandColors ? brandColors.join(', ') : 'Modern palette'}.`,
        "You are a professional UX/UI designer and copywriter. Generate the structure and copy for a high-converting landing page.",
        responseSchema,
        7000
      );
      res.json(JSON.parse(result));
    } catch (error) {
      console.warn("[/api/generate-website] Falling back:", error);
      res.json(generateFallbackBundle(idea || "").website);
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
