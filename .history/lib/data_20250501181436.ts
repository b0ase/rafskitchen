import { Url } from "url";

// Helper function to create project stubs
const createProjectStub = (id: number, title: string, description: string, status: string = 'Concept', tech: string[] = [], tokenName: string = '', tokenProgressPercent: number = 0, imageUrl?: string, xUrl?: string, githubUrl?: string, notionUrl?: string) => {
  const safeTitle = title.toLowerCase().replace('.com', '').replace('.ai', '').replace('.online', '').replace('.app', '').replace('.', '-');
  return {
    id,
    title,
    description,
    tech,
    githubUrl: githubUrl || `https://github.com/b0ase/${safeTitle}`,
    xUrl: xUrl || `https://x.com/${safeTitle}`,
    notionUrl: notionUrl || '#',
    tokenName,
    tokenProgressPercent,
    status,
    type: 'domain', // Default type, can be overridden
    imageUrl
  };
};

// Define the structure for a Service
interface Service {
  title: string;
  description: string;
}

// Define the structure for a Project
interface Project {
  id: number;
  title: string;
  description: string;
  tech: string[];
  githubUrl?: string;
  xUrl?: string;
  notionUrl?: string;
  tokenName?: string;
  tokenProgressPercent?: number;
  status: string;
  type: 'domain' | 'github';
  imageUrl?: string;
  tokenMarketUrl?: string; // Added for specific projects
  tokenPlatform?: string; // Added for specific projects
}

// Main data object
export const portfolioData = {
  about: {
    name: 'B0ASE',
    bio: "B0ASE is a dynamic digital agency, transforming concepts into digital experiences. We deliver client solutions in web development, blockchain, content, video, and social media, while also incubating our own projects. Explore our services, view our work, and contact us to build your next venture.",
    links: {
      github: 'https://github.com/b0ase',
      linkedin: 'https://www.linkedin.com/in/richardboase/',
      x: 'https://x.com/b0ase',
      youtube: 'https://www.youtube.com/@richardboase',
    },
    token: {
      name: '$BOASE',
      marketUrl: 'https://1sat.market/market/bsv21/c3bf2d7a4519ddc633bc91bbfd1022db1a77da71e16bb582b0acc0d8f7836161_1',
      platform: 'BSV21'
    }
  },
  projects: [
    // Domain Projects
    { ...createProjectStub(7, 'ninjapunkgirls.com', 'Concept for Ninja Punk Girls project.', 'Ltd Company', [], '$NPG', 85), type: 'domain' as const },
    { ...createProjectStub(8, 'hyper-flix.com', 'Concept for Hyper-Flix project.', 'Concept', [], '$HFLIX', 100), type: 'domain' as const },
    { ...createProjectStub(9, 'tribify.ai', 'Concept for Tribify AI project.', 'Concept', [], '$TRIBE', 100), type: 'domain' as const },
    { ...createProjectStub(10, 'aitribes.online', 'Concept for AI Tribes online platform.', 'Concept', [], '$AITR', 100), type: 'domain' as const },
    { ...createProjectStub(11, 'lilithtattoo.com', 'Concept for Lilith Tattoo project.', 'Concept', [], '$LILITH', 100), type: 'domain' as const },
    { ...createProjectStub(12, 'metagraph.app', 'Concept for Metagraph application.', 'Concept', [], '$META', 100), type: 'domain' as const },
    { ...createProjectStub(13, 'floop.online', 'Concept for Floop online service.', 'Concept', [], '$FLOOP', 100), type: 'domain' as const },
    { ...createProjectStub(14, 'dns-dex.com', 'Concept for DNS DEX project.', 'Concept', [], '$DNSD', 100), type: 'domain' as const },
    { ...createProjectStub(15, 'tribeswallet.com', 'Concept for Tribes Wallet project.', 'Concept', [], '$TWALL', 100), type: 'domain' as const },
    { ...createProjectStub(16, 'pennypics.store', 'Concept for PennyPics Store.', 'Concept', [], '$PICS', 100), type: 'domain' as const },
    { ...createProjectStub(17, 'missvoid.store', 'Concept for MissVoid Store.', 'Concept', [], '$VOID', 100), type: 'domain' as const },
    { ...createProjectStub(18, 'interiordesigns.website', 'Concept for Interior Designs website.', 'Concept', [], '$NTR', 100), type: 'domain' as const },

    // GitHub Repos
    {
      id: 1,
      title: 'AIOSX',
      description: 'Fork of AIOS: LLM Agent Operating System. Exploring potential applications.',
      tech: ['Python'],
      githubUrl: 'https://github.com/b0ase/AIOSX',
      xUrl: '#',
      notionUrl: '#',
      status: 'Exploration',
      type: 'github' as const,
      tokenName: '$AIOSX',
      tokenProgressPercent: 100
    },
    {
      id: 2,
      title: 'bitcoin (Fork)',
      description: 'Fork of Bitcoin Core integration/staging tree. For study and potential integration.',
      tech: ['TypeScript'],
      githubUrl: 'https://github.com/b0ase/bitcoin',
      xUrl: '#',
      notionUrl: '#',
      status: 'Study',
      type: 'github' as const,
      tokenName: '$BTC_FORK',
      tokenProgressPercent: 100
    },
    {
      id: 3,
      title: 'npgpublic',
      description: 'Public Go project. Purpose and potential to be defined.',
      tech: ['Go'],
      githubUrl: 'https://github.com/b0ase/npgpublic',
      xUrl: '#',
      notionUrl: '#',
      status: 'Concept',
      type: 'github' as const,
      tokenName: '$NPG_DEV',
      tokenProgressPercent: 100
    },
    {
      id: 4,
      title: 'Penshun',
      description: 'Fork of simply-stream: Lock to Stream Bitcoin. Investigating streaming payment models.',
      tech: ['JavaScript'],
      githubUrl: 'https://github.com/b0ase/Penshun',
      xUrl: '#',
      notionUrl: '#',
      status: 'Investigation',
      type: 'github' as const,
      tokenName: '$PENSHUN',
      tokenProgressPercent: 100
    },
    {
      id: 5,
      title: 'Weight',
      description: 'Fork of hodlocker: Lock Bitcoins to Social Posts. Experimenting with social/economic weighting.',
      tech: ['TypeScript'],
      githubUrl: 'https://github.com/b0ase/Weight',
      xUrl: '#',
      notionUrl: '#',
      status: 'Experiment',
      type: 'github' as const,
      tokenName: '$WEIGHT',
      tokenProgressPercent: 100
    },
    {
      id: 6,
      title: 'Yours-HandCash-Login',
      description: 'Fork of Yours Wallet: Yours/HandCash Integration exploration.',
      tech: ['JavaScript'],
      githubUrl: 'https://github.com/b0ase/Yours-HandCash-Login',
      xUrl: '#',
      notionUrl: '#',
      status: 'Archived/Study',
      type: 'github' as const,
      tokenName: '$YHC',
      tokenProgressPercent: 100
    },
    {
      id: 19,
      title: 'Index Token',
      description: 'Concept and development for an index-based token system.',
      tech: ['Solidity', 'TypeScript'],
      githubUrl: 'https://github.com/b0ase/index-token',
      xUrl: '#',
      notionUrl: '#',
      status: 'Development',
      type: 'github' as const,
      tokenName: '$INDEX',
      tokenProgressPercent: 100,
      imageUrl: '/images/development/index-token/index-token-bg.jpg'
    },
  ],
  skills: [
    'JavaScript', 'TypeScript', 'Python', 'SQL', 'HTML5', 'CSS3',
    'React', 'Next.js', 'Tailwind CSS', 'Vue.js',
    'Node.js', 'Express.js', 'PostgreSQL', 'MongoDB', 'MySQL',
    'Docker', 'Kubernetes', 'AWS Basics', 'Google Cloud Basics', 'Git', 'CI/CD',
    'Figma', 'Adobe Photoshop', 'Logo Design', 'Motion Graphics', 'Video Production', 'API Integration', 'SEO Principles',
    'Adobe After Effects', 'Adobe Premiere Pro', 'Cinema 4D', 'Blender',
    'Final Cut Pro', 'DaVinci Resolve', 'Lottie/Bodymovin', 'Animation Principles',
    'Compositing', 'VFX Basics', 'Adobe Illustrator', 'Adobe InDesign', 'Adobe Creative Suite'
  ],
  services: {
    webDevelopment: { title: 'Web Development', description: 'Building responsive, performant websites and web applications using modern technologies. (Est. Rate: £120/hr | £480/day. UK VAT added where applicable. Fixed-price projects negotiable.)' },
    journalism: { title: 'Content & Copywriting', description: 'Crafting compelling narratives, articles, and website copy tailored to your audience. (Est. Rate: £100/article | £400/day)' },
    filmmaking: { title: 'Video Production', description: 'From concept and shooting to editing and final delivery for promotional or creative needs. (Est. Rate: £110/hr | £450/day)' },
    logoDesign: { title: 'Logo Design & Branding', description: 'Crafting unique logos and visual identities that effectively represent your brand. (Est. Rate: £90/hr | Project-based)' },
    photography: { title: 'Photography', description: 'High-quality photography solutions for events, products, portraits, and more. (Est. Rate: £100/hr | £400/day)' },
    seo: { title: 'SEO & Digital Marketing', description: 'Optimizing online presence and content strategy to drive organic growth. (Est. Rate: £110/hr | £450/day)' },
    socialMedia: { title: 'Social Media Management', description: 'Developing strategies, creating content, and managing social media presence to grow engagement and reach. (Est. Rate: £90/hr | Retainer)' },
    consulting: { title: 'Technical Consulting', description: 'Providing expert advice and strategy for your digital projects and technical challenges. (Est. Rate: £150/hr)' },
    support: { title: 'Ongoing Support & Maintenance', description: 'Reliable support packages to keep your digital assets running smoothly and securely. (Est. Rate: Retainer based)' }
  } as Record<string, Service> // Add type assertion for services
}; 