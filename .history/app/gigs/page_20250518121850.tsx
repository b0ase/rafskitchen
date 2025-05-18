"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaStar, FaUserCircle } from 'react-icons/fa';

// Assuming a hypothetical function signature for the web search tool
// In a real scenario, this would be provided by the environment/API
declare function webSearchTool(searchTerm: string): Promise<{ snippets: string[], summary?: string }>;

const researchQuestions = [
  "What are the most popular web development gig categories on Fiverr in 2024?",
  "What are common pricing tiers for logo design on Fiverr?",
  "What are current trends in AI-related freelance services on Fiverr?",
  "Which design service gigs (UI/UX, Brand Design) have high demand on Fiverr?",
  "What are top-rated Fiverr sellers offering in SaaS platform development?",
  "What keywords are buyers using to find marketing & SEO gigs on Fiverr?",
  "What \"extras\" or upsells are common for website development gigs on Fiverr?",
  "Are there gaps in the market for blockchain/Web3 services on Fiverr?",
  "What is the typical delivery time for mobile app development gigs on Fiverr?",
  "How do successful Fiverr sellers structure their gig descriptions and images?"
];

interface Gig {
  id: string;
  thumbnailUrl: string;
  title: string;
  avatarUrl: string;
  sellerName: string;
  sellerLevel: string;
  starRating: number;
  reviewCount: number;
  price: string;
  priceCurrency: string;
  fiverrLink: string;
}

const placeholderGigs: Gig[] = [
  {
    id: '1',
    thumbnailUrl: 'https://picsum.photos/seed/gig1/600/400',
    title: 'I will do organic youtube video promotion with channel growth',
    avatarUrl: 'https://picsum.photos/seed/avatar1/40/40',
    sellerName: 'Nahid Akter',
    sellerLevel: 'Level 2',
    starRating: 4.9,
    reviewCount: 328,
    price: '8',
    priceCurrency: '£',
    fiverrLink: 'https://www.fiverr.com/your_gig_path_1',
  },
  {
    id: '2',
    thumbnailUrl: 'https://picsum.photos/seed/gig2/600/400',
    title: 'I will do super fast organic youtube video promotion with views',
    avatarUrl: 'https://picsum.photos/seed/avatar2/40/40',
    sellerName: 'Nayeeb',
    sellerLevel: 'Level 2',
    starRating: 4.9,
    reviewCount: 85,
    price: '4',
    priceCurrency: '£',
    fiverrLink: 'https://www.fiverr.com/your_gig_path_2',
  },
  {
    id: '3',
    thumbnailUrl: 'https://picsum.photos/seed/gig3/600/400',
    title: 'I will be your youtube channel promotion manager',
    avatarUrl: 'https://picsum.photos/seed/avatar3/40/40',
    sellerName: 'Tania Akter',
    sellerLevel: 'Level 2',
    starRating: 4.8,
    reviewCount: 296,
    price: '16',
    priceCurrency: '£',
    fiverrLink: 'https://www.fiverr.com/your_gig_path_3',
  },
  {
    id: '4',
    thumbnailUrl: 'https://picsum.photos/seed/gig4/600/400',
    title: 'I will do organic youtube video promotion through google ads',
    avatarUrl: 'https://picsum.photos/seed/avatar4/40/40',
    sellerName: 'Fahim Shahriar',
    sellerLevel: 'Level 2',
    starRating: 4.8,
    reviewCount: 66,
    price: '8',
    priceCurrency: '£',
    fiverrLink: 'https://www.fiverr.com/your_gig_path_4',
  },
  {
    id: '5',
    thumbnailUrl: 'https://picsum.photos/seed/gig5/600/400',
    title: 'I will organically youtube video promotion through google ads',
    avatarUrl: 'https://picsum.photos/seed/avatar5/40/40',
    sellerName: 'Md Selina',
    sellerLevel: 'Level 1',
    starRating: 4.9,
    reviewCount: 56,
    price: '8',
    priceCurrency: '£',
    fiverrLink: 'https://www.fiverr.com/your_gig_path_5',
  },
  {
    id: '6',
    thumbnailUrl: 'https://picsum.photos/seed/gig6/600/400',
    title: 'I will create a stunning modern website design',
    avatarUrl: 'https://picsum.photos/seed/avatar6/40/40',
    sellerName: 'DesignMaster',
    sellerLevel: 'Top Rated',
    starRating: 5.0,
    reviewCount: 1052,
    price: '150',
    priceCurrency: '$',
    fiverrLink: 'https://www.fiverr.com/your_gig_path_6',
  },
  {
    id: '7',
    thumbnailUrl: 'https://picsum.photos/seed/gig7/600/400',
    title: 'I will write engaging SEO blog posts and articles',
    avatarUrl: 'https://picsum.photos/seed/avatar7/40/40',
    sellerName: 'WordSmithPro',
    sellerLevel: 'Level 2',
    starRating: 4.9,
    reviewCount: 430,
    price: '25',
    priceCurrency: '$',
    fiverrLink: 'https://www.fiverr.com/your_gig_path_7',
  },
  {
    id: '8',
    thumbnailUrl: 'https://picsum.photos/seed/gig8/600/400',
    title: 'I will develop a custom mobile app for iOS and Android',
    avatarUrl: 'https://picsum.photos/seed/avatar8/40/40',
    sellerName: 'AppWizard',
    sellerLevel: 'Level 2',
    starRating: 4.8,
    reviewCount: 180,
    price: '500',
    priceCurrency: '$',
    fiverrLink: 'https://www.fiverr.com/your_gig_path_8',
  },
  {
    id: '9',
    thumbnailUrl: 'https://picsum.photos/seed/gig9/600/400',
    title: 'I will manage your social media and grow your audience',
    avatarUrl: 'https://picsum.photos/seed/avatar9/40/40',
    sellerName: 'SocialGuru',
    sellerLevel: 'Top Rated',
    starRating: 5.0,
    reviewCount: 780,
    price: '120',
    priceCurrency: '$',
    fiverrLink: 'https://www.fiverr.com/your_gig_path_9',
  },
  {
    id: '10',
    thumbnailUrl: 'https://picsum.photos/seed/gig10/600/400',
    title: 'I will provide professional voice over services',
    avatarUrl: 'https://picsum.photos/seed/avatar10/40/40',
    sellerName: 'VoiceOverKing',
    sellerLevel: 'Level 1',
    starRating: 4.7,
    reviewCount: 215,
    price: '50',
    priceCurrency: '$',
    fiverrLink: 'https://www.fiverr.com/your_gig_path_10',
  },
  {
    id: '11',
    thumbnailUrl: 'https://picsum.photos/seed/gig11/600/400',
    title: 'I will design a unique and professional logo for your brand',
    avatarUrl: 'https://picsum.photos/seed/avatar11/40/40',
    sellerName: 'LogoPro',
    sellerLevel: 'Level 2',
    starRating: 4.9,
    reviewCount: 550,
    price: '75',
    priceCurrency: '$',
    fiverrLink: 'https://www.fiverr.com/your_gig_path_11',
  },
  {
    id: '12',
    thumbnailUrl: 'https://picsum.photos/seed/gig12/600/400',
    title: 'I will create amazing whiteboard animation videos',
    avatarUrl: 'https://picsum.photos/seed/avatar12/40/40',
    sellerName: 'AnimateWizard',
    sellerLevel: 'Top Rated',
    starRating: 5.0,
    reviewCount: 920,
    price: '100',
    priceCurrency: '£',
    fiverrLink: 'https://www.fiverr.com/your_gig_path_12',
  },
  {
    id: '13',
    thumbnailUrl: 'https://picsum.photos/seed/gig13/600/400',
    title: 'I will be your virtual assistant for data entry and web research',
    avatarUrl: 'https://picsum.photos/seed/avatar13/40/40',
    sellerName: 'VirtuAssist',
    sellerLevel: 'Level 1',
    starRating: 4.8,
    reviewCount: 310,
    price: '10',
    priceCurrency: '$',
    fiverrLink: 'https://www.fiverr.com/your_gig_path_13',
  },
  {
    id: '14',
    thumbnailUrl: 'https://picsum.photos/seed/gig14/600/400',
    title: 'I will craft compelling marketing copy that converts',
    avatarUrl: 'https://picsum.photos/seed/avatar14/40/40',
    sellerName: 'CopyQueen',
    sellerLevel: 'Level 2',
    starRating: 4.9,
    reviewCount: 680,
    price: '90',
    priceCurrency: '£',
    fiverrLink: 'https://www.fiverr.com/your_gig_path_14',
  },
  {
    id: '15',
    thumbnailUrl: 'https://picsum.photos/seed/gig15/600/400',
    title: 'I will build a responsive WordPress website design',
    avatarUrl: 'https://picsum.photos/seed/avatar15/40/40',
    sellerName: 'WP_Expert',
    sellerLevel: 'Top Rated',
    starRating: 5.0,
    reviewCount: 1250,
    price: '200',
    priceCurrency: '$',
    fiverrLink: 'https://www.fiverr.com/your_gig_path_15',
  },
  {
    id: '16',
    thumbnailUrl: 'https://picsum.photos/seed/gig16/600/400',
    title: 'I will proofread and edit your document for perfection',
    avatarUrl: 'https://picsum.photos/seed/avatar16/40/40',
    sellerName: 'EditorEagle',
    sellerLevel: 'Level 2',
    starRating: 4.9,
    reviewCount: 475,
    price: '30',
    priceCurrency: '$',
    fiverrLink: 'https://www.fiverr.com/your_gig_path_16',
  },
  {
    id: '17',
    thumbnailUrl: 'https://picsum.photos/seed/gig17/600/400',
    title: 'I will create 3D models and product renderings',
    avatarUrl: 'https://picsum.photos/seed/avatar17/40/40',
    sellerName: '3DModeler',
    sellerLevel: 'Level 1',
    starRating: 4.7,
    reviewCount: 190,
    price: '150',
    priceCurrency: '£',
    fiverrLink: 'https://www.fiverr.com/your_gig_path_17',
  },
  {
    id: '18',
    thumbnailUrl: 'https://picsum.photos/seed/gig18/600/400',
    title: 'I will design eye-catching social media posts and graphics',
    avatarUrl: 'https://picsum.photos/seed/avatar18/40/40',
    sellerName: 'SocialSpark',
    sellerLevel: 'Level 2',
    starRating: 4.8,
    reviewCount: 880,
    price: '60',
    priceCurrency: '$',
    fiverrLink: 'https://www.fiverr.com/your_gig_path_18',
  },
  {
    id: '19',
    thumbnailUrl: 'https://picsum.photos/seed/gig19/600/400',
    title: 'I will set up and manage your Google Ads PPC campaigns',
    avatarUrl: 'https://picsum.photos/seed/avatar19/40/40',
    sellerName: 'PPCPro',
    sellerLevel: 'Top Rated',
    starRating: 5.0,
    reviewCount: 950,
    price: '250',
    priceCurrency: '£',
    fiverrLink: 'https://www.fiverr.com/your_gig_path_19',
  },
  {
    id: '20',
    thumbnailUrl: 'https://picsum.photos/seed/gig20/600/400',
    title: 'I will translate English to Spanish or vice versa accurately',
    avatarUrl: 'https://picsum.photos/seed/avatar20/40/40',
    sellerName: 'TranslatorAce',
    sellerLevel: 'Level 2',
    starRating: 4.9,
    reviewCount: 720,
    price: '5',
    priceCurrency: '$',
    fiverrLink: 'https://www.fiverr.com/your_gig_path_20',
  },
  {
    id: '21',
    thumbnailUrl: 'https://picsum.photos/seed/gig21/600/400',
    title: 'I will create a custom intro and outro for your YouTube videos',
    avatarUrl: 'https://picsum.photos/seed/avatar21/40/40',
    sellerName: 'VideoFXArtist',
    sellerLevel: 'Level 1',
    starRating: 4.8,
    reviewCount: 150,
    price: '45',
    priceCurrency: '£',
    fiverrLink: 'https://www.fiverr.com/your_gig_path_21',
  },
  {
    id: '22',
    thumbnailUrl: 'https://picsum.photos/seed/gig22/600/400',
    title: 'I will develop a professional Shopify store for your business',
    avatarUrl: 'https://picsum.photos/seed/avatar22/40/40',
    sellerName: 'ShopifyGuru',
    sellerLevel: 'Top Rated',
    starRating: 5.0,
    reviewCount: 1100,
    price: '300',
    priceCurrency: '$',
    fiverrLink: 'https://www.fiverr.com/your_gig_path_22',
  },
  {
    id: '23',
    thumbnailUrl: 'https://picsum.photos/seed/gig23/600/400',
    title: 'I will create a unique illustration for your project',
    avatarUrl: 'https://picsum.photos/seed/avatar23/40/40',
    sellerName: 'IllustrateMe',
    sellerLevel: 'Level 2',
    starRating: 4.9,
    reviewCount: 600,
    price: '80',
    priceCurrency: '£',
    fiverrLink: 'https://www.fiverr.com/your_gig_path_23',
  },
  {
    id: '24',
    thumbnailUrl: 'https://picsum.photos/seed/gig24/600/400',
    title: 'I will write high-quality articles and web content',
    avatarUrl: 'https://picsum.photos/seed/avatar24/40/40',
    sellerName: 'ContentCreatorX',
    sellerLevel: 'Level 2',
    starRating: 4.8,
    reviewCount: 520,
    price: '35',
    priceCurrency: '$',
    fiverrLink: 'https://www.fiverr.com/your_gig_path_24',
  },
  {
    id: '25',
    thumbnailUrl: 'https://picsum.photos/seed/gig25/600/400',
    title: 'I will design a professional resume and cover letter',
    avatarUrl: 'https://picsum.photos/seed/avatar25/40/40',
    sellerName: 'ResumeRx',
    sellerLevel: 'Level 1',
    starRating: 4.9,
    reviewCount: 300,
    price: '50',
    priceCurrency: '£',
    fiverrLink: 'https://www.fiverr.com/your_gig_path_25',
  },
  {
    id: '26',
    thumbnailUrl: 'https://picsum.photos/seed/gig26/600/400',
    title: 'I will provide expert SEO keyword research and competitor analysis',
    avatarUrl: 'https://picsum.photos/seed/avatar26/40/40',
    sellerName: 'SEOMastermind',
    sellerLevel: 'Top Rated',
    starRating: 5.0,
    reviewCount: 850,
    price: '120',
    priceCurrency: '$',
    fiverrLink: 'https://www.fiverr.com/your_gig_path_26',
  },
  {
    id: '27',
    thumbnailUrl: 'https://picsum.photos/seed/gig27/600/400',
    title: 'I will create a custom Discord server setup',
    avatarUrl: 'https://picsum.photos/seed/avatar27/40/40',
    sellerName: 'DiscordDev',
    sellerLevel: 'Level 2',
    starRating: 4.9,
    reviewCount: 400,
    price: '70',
    priceCurrency: '£',
    fiverrLink: 'https://www.fiverr.com/your_gig_path_27',
  },
  {
    id: '28',
    thumbnailUrl: 'https://picsum.photos/seed/gig28/600/400',
    title: 'I will be your professional beta reader and provide feedback',
    avatarUrl: 'https://picsum.photos/seed/avatar28/40/40',
    sellerName: 'BetaReaderPro',
    sellerLevel: 'Level 1',
    starRating: 4.8,
    reviewCount: 250,
    price: '20',
    priceCurrency: '$',
    fiverrLink: 'https://www.fiverr.com/your_gig_path_28',
  },
  {
    id: '29',
    thumbnailUrl: 'https://picsum.photos/seed/gig29/600/400',
    title: 'I will design an amazing book cover',
    avatarUrl: 'https://picsum.photos/seed/avatar29/40/40',
    sellerName: 'CoverArtist',
    sellerLevel: 'Level 2',
    starRating: 4.9,
    reviewCount: 650,
    price: '95',
    priceCurrency: '£',
    fiverrLink: 'https://www.fiverr.com/your_gig_path_29',
  },
  {
    id: '30',
    thumbnailUrl: 'https://picsum.photos/seed/gig30/600/400',
    title: 'I will mix and master your song professionally',
    avatarUrl: 'https://picsum.photos/seed/avatar30/40/40',
    sellerName: 'AudioEngineer',
    sellerLevel: 'Top Rated',
    starRating: 5.0,
    reviewCount: 1000,
    price: '150',
    priceCurrency: '$',
    fiverrLink: 'https://www.fiverr.com/your_gig_path_30',
  }
];

export default function GigsPage() {
  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <h1 className="text-4xl font-bold mb-4 text-sky-400">My Gigs Showcase</h1>
      <p className="text-lg text-gray-400 mb-10">
        Explore our portfolio of services. Click on any gig to view details on Fiverr.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {placeholderGigs.map((gig) => (
          <Link key={gig.id} href={gig.fiverrLink} passHref legacyBehavior>
            <a 
              target="_blank" 
              rel="noopener noreferrer"
              className="block bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-lg hover:shadow-sky-500/40 transition-all duration-300 ease-in-out transform hover:-translate-y-1 group"
            >
              <div className="relative w-full h-48">
                <Image 
                  src={gig.thumbnailUrl} 
                  alt={gig.title} 
                  layout="fill" 
                  objectFit="cover" 
                  className="transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4 flex flex-col h-[calc(100%-12rem)]"> {/* 12rem is h-48 for thumbnail */}
                <div className="flex items-center mb-2">
                  {gig.avatarUrl ? (
                    <Image 
                      src={gig.avatarUrl} 
                      alt={gig.sellerName} 
                      width={24} 
                      height={24} 
                      className="rounded-full mr-2 object-cover"
                    />
                  ) : (
                    <FaUserCircle className="w-6 h-6 rounded-full mr-2 text-gray-500" />
                  )}
                  <span className="text-xs text-gray-400 font-medium truncate group-hover:text-sky-300">{gig.sellerName}</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-100 mb-1 min-h-[40px] group-hover:text-sky-400 overflow-hidden line-clamp-2" title={gig.title}>
                  {gig.title}
                </h3>
                <p className="text-xs text-gray-500 mb-2">{gig.sellerLevel}</p>
                
                <div className="flex items-center text-xs text-yellow-400 mb-3">
                  <FaStar className="mr-1" />
                  <span className="font-bold">{gig.starRating.toFixed(1)}</span>
                  <span className="text-gray-500 ml-1">({gig.reviewCount})</span>
                </div>

                <div className="mt-auto pt-2 border-t border-gray-700/50 flex justify-end items-center">
                  <span className="text-xs text-gray-500 mr-1">FROM</span>
                  <span className="text-md font-semibold text-sky-400">{gig.priceCurrency}{gig.price}</span>
                </div>
              </div>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
} 