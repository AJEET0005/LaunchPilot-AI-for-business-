export interface IdeaAnalysis {
  marketOpportunity: string;
  targetAudience: string;
  risks: string[];
  suggestedImprovements: string[];
  confidenceScore: number;
}

export interface BusinessPlan {
  executiveSummary: string;
  problem: string;
  solution: string;
  customerSegments: string[];
  revenueModel: string;
  marketingStrategy: string;
  roadmap: string[];
}

export interface BrandKit {
  businessName: string;
  tagline: string;
  brandColors: string[];
  logoPrompt: string;
  brandStory: string;
}

export interface MarketingCampaign {
  instagramPosts: string[];
  linkedinPosts: string[];
  blogArticleTitle: string;
  blogArticleOutline: string[];
  emailCampaign: string;
  adCopy: string;
}

export interface FinancialProjections {
  startupCosts: number;
  revenueForecast: number;
  breakEvenEstimate: string;
  profitProjection: number;
}

export interface WebsiteDesign {
  heroHeadline: string;
  heroSubheadline: string;
  callToAction: string;
  features: { title: string; description: string }[];
  targetAudienceMessage: string;
  colorPalette: string[];
}

export interface AppState {
  idea: string;
  analysis: IdeaAnalysis | null;
  plan: BusinessPlan | null;
  brand: BrandKit | null;
  marketing: MarketingCampaign | null;
  finance: FinancialProjections | null;
  website: WebsiteDesign | null;
}
