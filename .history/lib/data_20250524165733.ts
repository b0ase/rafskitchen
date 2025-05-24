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
      'JavaScript', 'TypeScript', 'Python', 'SQL', 'HTML5', 'CSS3',
      'React', 'Next.js', 'Tailwind CSS', 'Vue.js',
      'Node.js', 'Express.js', 'PostgreSQL', 'MongoDB', 'MySQL',
      'Docker', 'Kubernetes', 'AWS', 'Google Cloud', 'Git', 'CI/CD',
      'Blockchain Development', 'Smart Contracts', 'DeFi', 'NFTs',
      'AI/ML', 'TensorFlow', 'PyTorch', 'OpenAI API',
      'Mobile Development', 'React Native', 'Flutter'
    ],
    // soft: ["Innovation", "Strategic Thinking", "Team Leadership"] // Add soft skills here if desired
  },
  services: [
    { 
      id: 1, 
      slug: "startup-incubation", 
      title: "Startup Incubation", 
      description: "Complete incubation program for early-stage tech startups with mentorship, funding, and technical support.",
      detailedDescription: "Our comprehensive incubation program provides everything early-stage startups need to succeed. From initial concept validation to MVP development, funding assistance, and go-to-market strategy. We offer hands-on mentorship, technical expertise, and access to our network of investors and industry experts.",
      priceInfo: "Equity-based program | Custom terms negotiable"
    },
    { 
      id: 2, 
      slug: "web3-development", 
      title: "Web3 & Blockchain Development", 
      description: "End-to-end blockchain solutions including smart contracts, DApps, and tokenization.",
      detailedDescription: "Specialized in building decentralized applications, smart contracts, and blockchain infrastructure. We develop DeFi protocols, NFT marketplaces, tokenization platforms, and Web3 integrations. Our team has expertise across multiple blockchains including Ethereum, BSV, and emerging networks.",
      priceInfo: "From $25,000 per project | Retainer options available"
    },
    { 
      id: 3, 
      slug: "ai-integration",
      title: "AI Integration & Development", 
      description: "Custom AI solutions and integrations to enhance your products and operations.", 
      detailedDescription: "We build AI-powered features and applications using cutting-edge machine learning models. From chatbots and recommendation systems to computer vision and natural language processing, we help businesses leverage AI to gain competitive advantages.",
      priceInfo: "From $15,000 per project | Ongoing support available" 
    },
    { 
      id: 4, 
      slug: "full-stack-development",
      title: "Full-Stack Development", 
      description: "Complete web and mobile application development using modern technologies.",
      detailedDescription: "End-to-end development services for web and mobile applications. We build scalable, performant applications using modern frameworks and best practices. From simple MVPs to complex enterprise solutions, we deliver high-quality software that grows with your business.",
      priceInfo: "From $10,000 per project | Hourly rates available" 
    },
    { 
      id: 5, 
      slug: "technical-consulting",
      title: "Technical Consulting", 
      description: "Strategic technology guidance and architecture consulting for growing companies.", 
      detailedDescription: "Expert technical consulting to help you make informed technology decisions. We provide architecture reviews, technology stack recommendations, scalability planning, and technical due diligence for investments. Perfect for companies looking to optimize their tech infrastructure.",
      priceInfo: "From $200/hour | Project-based engagements available" 
    },
    { 
      id: 6, 
      slug: "product-strategy",
      title: "Product Strategy & Development", 
      description: "Comprehensive product development from concept to market launch.",
      detailedDescription: "Full product lifecycle support including market research, product strategy, UX/UI design, development, and launch planning. We help startups and established companies bring innovative products to market quickly and efficiently.",
      priceInfo: "From $20,000 per engagement | Equity partnerships considered" 
    }
  ],
  contact: {
    email: "hello@rafskitchen.website"
  }
}; 