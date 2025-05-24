import { Url } from "url";

// Helper function to create project stubs
const createProjectStub = (id: number, title: string, description: string, status?: string, tech?: string[], tokenName?: string, tokenProgressPercent?: number, cardImageUrls?: string[], xUrl?: string, githubUrl?: string, notionUrl?: string) => {
  // Ensure title is treated as a string for slug generation
  const safeTitle = (title || ''); 
  const slug = safeTitle.toLowerCase().replace(/\s+/g, '-') // Replace spaces with hyphens
                       .replace(/[^a-z0-9\-]/g, '') // Remove invalid chars
                       .replace(/\.+/g, '-'); // Replace periods with hyphens specifically for domain-like titles

  const defaultStatus = status || 'Concept';
  const defaultTech = tech || [];
  const defaultTokenName = tokenName || '';
  const defaultTokenProgress = tokenProgressPercent || 0;
  const defaultCardImageUrls = cardImageUrls || []; // Default to empty array

  return {
    id,
    title,
    slug, // Add generated slug
    description,
    tech: defaultTech,
    githubUrl: githubUrl || `https://github.com/rafskitchen/${slug}`, // Updated to rafskitchen
    xUrl: xUrl || `https://x.com/${slug}`,
    notionUrl: notionUrl || '#',
    tokenName: defaultTokenName,
    tokenProgressPercent: defaultTokenProgress,
    status: defaultStatus,
    type: 'domain', // Default type, can be overridden
    cardImageUrls: defaultCardImageUrls // Use the new array field
  };
};

// Define the structure for a Service
export interface Service {
  id: number;
  slug: string;
  title: string;
  description: string;
  detailedDescription: string;
  priceInfo?: string;
}

// Define the structure for a Project
export interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  tech: string[];
  githubUrl?: string;
  xUrl?: string;
  notionUrl?: string;
  tokenName?: string;
  tokenProgressPercent?: number;
  status: string;
  type: 'domain' | 'github' | 'client';
  cardImageUrls?: string[]; // Changed from imageUrl to cardImageUrls
  tokenMarketUrl?: string; // Added for specific projects
  tokenPlatform?: string; // Added for specific projects
  liveUrl?: string;
  subtitle?: string;
}

export interface SkillsData {
    technical: string[];
    // soft?: string[]; // Optional: Add other skill categories if needed
}

export interface PortfolioData {
    about: {
        name: string;
        tagline: string;
        bio: string;
        socials: {
            github: string;
            linkedin: string;
            x: string;
            youtube: string;
            fiverr: string;
            upwork: string;
            freelancer: string;
            telegram?: string;
            discord?: string;
        };
        token: {
            name: string;
            ticker: string;
            description: string;
            platform: string;
            marketLink: string;
        };
    };
    projects: Project[];
    skills: SkillsData;
    services: Service[];
    contact: { email: string; };
}

// Main data object
export const portfolioData: PortfolioData = {
  about: {
    name: 'RafsKitchen',
    tagline: 'A dynamic tech incubator, transforming concepts into digital realities.',
    bio: "We incubate innovative tech startups and deliver cutting-edge solutions in web development, blockchain, AI, and emerging technologies. Explore our portfolio, discover our capabilities, and partner with us to build the future.",
    socials: {
      github: 'https://github.com/rafskitchen',
      linkedin: 'https://www.linkedin.com/company/rafskitchen/',
      x: 'https://x.com/rafskitchen',
      youtube: 'https://www.youtube.com/@rafskitchen',
      fiverr: 'https://www.fiverr.com/rafskitchen',
      upwork: 'https://www.upwork.com/freelancers/rafskitchen',
      freelancer: 'https://www.freelancer.com/u/rafskitchen',
      telegram: '#telegram',
      discord: '#discord'
    },
    token: {
      name: 'RAFKITCHEN',
      ticker: 'RAF',
      description: "RAFKITCHEN is the utility token for the RafsKitchen ecosystem. Used for platform governance and accessing premium incubator services.",
      platform: 'BSV21',
      marketLink: '#'
    }
  },
  projects: [
    {
      id: 20,
      title: 'robust-ae.com',
      slug: 'robust-ae-com',
      description: 'A comprehensive digital platform for Robust, a leading company in the UAE specializing in innovative solutions and services.',
      type: 'domain',
      status: 'active',
      liveUrl: 'https://robust-ae.com',
      tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'React', 'Node.js'],
      cardImageUrls: ['/images/clientprojects/robust-ae-com/slug/robust-logo.png'],
      subtitle: 'Enterprise Solutions Platform',
      xUrl: '#',
      notionUrl: '#',
      githubUrl: 'https://github.com/b0ase/robust-ae'
    },
    // Domain Projects
    { ...createProjectStub(7, 'ninjapunkgirls.com', 'A vibrant NFT marketplace showcasing unique digital art of cyberpunk female warriors.', 'Ltd Company', [], '$NPG', 85, [
      '/images/clientprojects/ninjapunkgirls/slug/NPG%20logo.png'
    ]), type: 'domain' as const },
    { ...createProjectStub(8, 'hyper-flix.com', 'Innovative memecoin marketing platform specializing in viral TikTok campaigns and social engagement.', 'B2C', ['TikTok', 'Social Media', 'Crypto'], '$HFLIX', 100, ['/images/clientprojects/hyper-flix/slug/HYPERFLIXLOGO%20(1).png']), type: 'domain' as const },
    { ...createProjectStub(9, 'tribify.ai', 'AI-powered community platform that connects like-minded individuals through shared interests.', 'SaaS', [], '$TRIBE', 100, ['/images/clientprojects/tribify/slug/TribifyAILogo.JPG']), type: 'domain' as const },
    { ...createProjectStub(10, 'aitribes.online', 'Dynamic social network where AI agents and humans collaborate to create unique digital experiences.', 'Platform', [], '$AITR', 100, []), type: 'domain' as const },
    { 
      ...createProjectStub(
        11, 
        'lilithtattoo.com', 
        'Elegant portfolio showcase for a renowned tattoo artist specializing in dark art and mystical designs.', 
        'Service', 
        [], 
        '$LILITH', 
        100, 
        ['/images/clientprojects/lilithtattoo-com/slug/lilith-ai-logo.png'] // Updated image path for lilithtattoo.com
      ), 
      type: 'domain' as const 
    },
    { ...createProjectStub(12, 'metagraph.app', 'Innovative data visualization tool that transforms complex relationships into interactive 3D networks.', 'App', [], '$META', 100, []), type: 'domain' as const },
    { ...createProjectStub(13, 'floop.online', 'Real-time collaborative workspace for creative professionals with integrated project management.', 'Platform', [], '$FLOOP', 100, []), type: 'domain' as const },
    { ...createProjectStub(14, 'dns-dex.com', 'Decentralized domain name exchange platform revolutionizing how web addresses are traded.', 'Platform', [], '$DNSD', 100, []), type: 'domain' as const },
    { ...createProjectStub(15, 'tribeswallet.com', 'Secure multi-chain cryptocurrency wallet designed for community-driven token ecosystems.', 'App', [], '$TWALL', 100, []), type: 'domain' as const },
    { ...createProjectStub(16, 'pennypics.store', 'Micro-payment based image marketplace where photographers earn per view.', 'E-commerce', [], '$PICS', 100, []), type: 'domain' as const },
    { ...createProjectStub(17, 'missvoid.store', 'Avant-garde fashion boutique featuring cyberpunk and dystopian-inspired clothing.', 'E-commerce', [], '$VOID', 100, ['/images/clientprojects/missvoid.store/slug/missvoid_logo.png']), type: 'domain' as const },
    { ...createProjectStub(18, 'interiordesigns.website', 'Virtual interior design consultation platform with AI-powered room visualization.', 'Service', [], '$NTR', 100, []), type: 'domain' as const },
    {
      // Using createProjectStub for consistency, then overriding/adding specific fields
      ...createProjectStub(
        21, // New unique ID
        'Marina3D.xyz', // Title
        'Cutting-edge 3D visualization and interactive experiences for the web.', // Description
        'Live', // Status
        ['Next.js', 'TypeScript', 'Three.js', 'WebGL'], // Example Tech Stack (customize as needed)
        undefined, // tokenName (undefined if not applicable)
        0, // tokenProgressPercent (0 if not applicable)
        ['/images/clientprojects/marina3d-xyz/slug/mar3D_logo.png'] // Updated image path
      ),
      type: 'domain' as const, // Ensure it's treated as a domain project
      liveUrl: 'https://marina3d.xyz', // Specific live URL
      subtitle: 'Interactive 3D Web Experiences' // Example subtitle
    },

    // GitHub Repos
    {
      id: 1,
      title: 'AIOSX',
      slug: 'aiosx', // Manually add slug
      description: 'Fork of AIOS: LLM Agent Operating System. Exploring potential applications.',
      tech: ['Python'],
      githubUrl: 'https://github.com/b0ase/AIOSX',
      xUrl: '#',
      notionUrl: '#',
      status: 'Exploration',
      type: 'github' as const,
      tokenName: '$AIOSX',
      tokenProgressPercent: 100,
      cardImageUrls: [] // Initialize for GitHub repos
    },
    {
      id: 2,
      title: 'bitcoin (Fork)',
      slug: 'bitcoin-fork', // Manually add slug
      description: 'Fork of Bitcoin Core integration/staging tree. For study and potential integration.',
      tech: ['TypeScript'],
      githubUrl: 'https://github.com/b0ase/bitcoin',
      xUrl: '#',
      notionUrl: '#',
      status: 'Study',
      type: 'github' as const,
      tokenName: '$BTC_FORK',
      tokenProgressPercent: 100,
      cardImageUrls: []
    },
    {
      id: 3,
      title: 'npgpublic',
      slug: 'npgpublic', // Manually add slug
      description: 'Public Go project. Purpose and potential to be defined.',
      tech: ['Go'],
      githubUrl: 'https://github.com/b0ase/npgpublic',
      xUrl: '#',
      notionUrl: '#',
      status: 'Concept',
      type: 'github' as const,
      tokenName: '$NPG_DEV',
      tokenProgressPercent: 100,
      cardImageUrls: []
    },
    {
      id: 4,
      title: 'Penshun',
      slug: 'penshun', // Manually add slug
      description: 'Fork of simply-stream: Lock to Stream Bitcoin. Investigating streaming payment models.',
      tech: ['JavaScript'],
      githubUrl: 'https://github.com/b0ase/Penshun',
      xUrl: '#',
      notionUrl: '#',
      status: 'Investigation',
      type: 'github' as const,
      tokenName: '$PENSHUN',
      tokenProgressPercent: 100,
      cardImageUrls: []
    },
    {
      id: 5,
      title: 'Weight',
      slug: 'weight', // Manually add slug
      description: 'Fork of hodlocker: Lock Bitcoins to Social Posts. Experimenting with social/economic weighting.',
      tech: ['TypeScript'],
      githubUrl: 'https://github.com/b0ase/Weight',
      xUrl: '#',
      notionUrl: '#',
      status: 'Experiment',
      type: 'github' as const,
      tokenName: '$WEIGHT',
      tokenProgressPercent: 100,
      cardImageUrls: []
    },
    {
      id: 6,
      title: 'Yours-HandCash-Login',
      slug: 'yours-handcash-login', // Manually add slug
      description: 'Fork of Yours Wallet: Yours/HandCash Integration exploration.',
      tech: ['JavaScript'],
      githubUrl: 'https://github.com/b0ase/Yours-HandCash-Login',
      xUrl: '#',
      notionUrl: '#',
      status: 'Archived/Study',
      type: 'github' as const,
      tokenName: '$YHC',
      tokenProgressPercent: 100,
      cardImageUrls: []
    },
    {
      id: 19,
      title: 'Index Token',
      slug: 'index-token', // Manually add slug
      description: 'Concept and development for an index-based token system.',
      tech: ['Solidity', 'TypeScript'],
      githubUrl: 'https://github.com/b0ase/index-token',
      xUrl: '#',
      notionUrl: '#',
      status: 'Development',
      type: 'github' as const,
      tokenName: '$INDEX',
      tokenProgressPercent: 100,
      cardImageUrls: ['/images/development/index-token/index-token-bg.jpg']
    },
  ],
  skills: {
    technical: [
      'Mediterranean Cuisine', 'Italian Cooking', 'Baking & Pastry', 'Grilling & BBQ',
      'Vegetarian Dishes', 'Vegan Options', 'Gluten-Free Cooking', 'Meal Prep',
      'Food Photography', 'Recipe Development', 'Nutrition Planning', 'Spice Blending',
      'Fermentation', 'Bread Making', 'Sauce Creation', 'Seasonal Cooking',
      'Farm-to-Table', 'Organic Ingredients', 'Culinary Presentation', 'Food Safety'
    ],
    // soft: ["Teaching", "Creativity", "Time Management"] // Add soft skills here if desired
  },
  services: [
    { 
      id: 1, 
      slug: "cooking-classes", 
      title: "Cooking Classes", 
      description: "Learn authentic recipes and cooking techniques in hands-on classes for all skill levels.",
      detailedDescription: "Our cooking classes offer an immersive culinary experience where you'll learn to prepare delicious dishes from scratch. We focus on traditional techniques with modern twists, covering everything from basic knife skills to advanced cooking methods. Classes are available for individuals, couples, and groups.",
      priceInfo: "From $75 per person | Group discounts available"
    },
    { 
      id: 2, 
      slug: "personal-chef", 
      title: "Personal Chef Services", 
      description: "Custom meal preparation and private dining experiences tailored to your preferences.",
      detailedDescription: "Enjoy restaurant-quality meals in the comfort of your own home. Our personal chef services include menu planning, grocery shopping, meal preparation, and kitchen cleanup. Perfect for special occasions, dinner parties, or regular meal prep services.",
      priceInfo: "Starting at $200 per event | Weekly meal prep packages available"
    },
    { 
      id: 3, 
      slug: "recipe-development",
      title: "Recipe Development", 
      description: "Custom recipe creation and testing for restaurants, blogs, or personal collections.", 
      detailedDescription: "We develop unique, tested recipes tailored to your specific needs. Whether you're a restaurant looking for signature dishes, a food blogger needing content, or someone wanting to preserve family recipes, we provide detailed, foolproof recipes with professional photography.",
      priceInfo: "Starting at $150 per recipe | Package deals available" 
    },
    { 
      id: 4, 
      slug: "catering",
      title: "Catering Services", 
      description: "Professional catering for events, parties, and special occasions with fresh, local ingredients.",
      detailedDescription: "Full-service catering featuring fresh, seasonal ingredients and creative presentations. We handle everything from intimate dinner parties to large corporate events, offering customizable menus to suit any dietary requirements or theme.",
      priceInfo: "Starting at $35 per person | Custom quotes available" 
    },
    { 
      id: 5, 
      slug: "food-styling",
      title: "Food Styling & Photography", 
      description: "Professional food photography and styling for restaurants, cookbooks, and marketing materials.", 
      detailedDescription: "Make your dishes look as good as they taste with professional food styling and photography. We work with restaurants, food brands, cookbook authors, and food bloggers to create stunning visual content that showcases your culinary creations.",
      priceInfo: "Starting at $300 per session | Project-based pricing" 
    },
    { 
      id: 6, 
      slug: "meal-planning",
      title: "Nutrition & Meal Planning", 
      description: "Personalized meal plans and nutritional guidance for healthy, delicious eating.",
      detailedDescription: "Get customized meal plans designed around your dietary goals, preferences, and lifestyle. Our nutrition-focused approach ensures you enjoy delicious, balanced meals while meeting your health objectives. Includes shopping lists and prep instructions.",
      priceInfo: "Starting at $125 per month | One-time consultations available" 
    }
  ],
  contact: {
    email: "hello@rafskitchen.website"
  }
}; 