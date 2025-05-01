'use client'; // Keep client directive if using hooks, remove if fully static

import React from 'react';
import { useParams } from 'next/navigation'; // Hook to get dynamic params
// Revert back to alias paths
import { portfolioData } from '@/lib/data'; // Use alias
import Header from '@/components/Header'; // Use alias
import Footer from '@/components/Footer'; // Use alias
import Link from 'next/link';

// Define the expected params shape
interface ServicePageParams {
    slug: string;
}

export default function ServicePage() {
    const params = useParams() as ServicePageParams; // Get params and assert type
    const slug = params?.slug; // Safely access slug

    // Find the service data matching the slug
    const service = portfolioData.services.find(s => s.slug === slug);

    // Handle case where service is not found
    if (!service) {
        return (
            <div className="min-h-screen flex flex-col dark:bg-gradient-to-b dark:from-gray-950 dark:via-black dark:to-gray-950 dark:text-gray-300">
                <Header />
                <main className="flex-grow container mx-auto px-4 py-16 text-center">
                    <h1 className="text-2xl font-bold text-red-600 dark:text-red-500">Service Not Found</h1>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">The requested service could not be found.</p>
                    <Link href="/#services" className="mt-6 inline-block px-6 py-2 bg-blue-700 text-white font-medium hover:bg-blue-600 transition-colors shadow-md">
                        Back to Services
                    </Link>
                </main>
                <Footer />
            </div>
        );
    }

    // Render the service details
    return (
        <div className="min-h-screen flex flex-col dark:bg-gradient-to-b dark:from-gray-950 dark:via-black dark:to-gray-950 dark:text-gray-300">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-12 md:py-16">
                 {/* Service Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-6 border-b border-gray-200 dark:border-gray-800 pb-3">
                   <span className="text-blue-500 dark:text-blue-400">//</span> {service.title}
                </h1>

                {/* Detailed Description */}
                <div className="bg-white dark:bg-black p-6 md:p-8 border border-gray-200 dark:border-gray-800 shadow-md dark:shadow-xl mb-8">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                        {service.detailedDescription}
                    </p>
                </div>

                {/* Pricing Info (Optional) */}
                {service.priceInfo && (
                    <div className="bg-gray-100 dark:bg-gray-900 p-4 border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-400 mb-8">
                         <h3 className="font-semibold text-black dark:text-white mb-2">Pricing Information</h3>
                        <p className="italic">{service.priceInfo}</p>
                    </div>
                )}
                
                {/* Optional: Add related projects or specific contact CTA */}
                <div className="text-center">
                    <Link href="/#contact" className="inline-block px-6 py-3 bg-blue-700 text-white font-medium hover:bg-blue-600 transition-colors shadow-md">
                        Contact Us About {service.title}
                    </Link>
                </div>

            </main>
            <Footer />
        </div>
    );
}

// Optional: Generate static paths if needed for better performance/SEO
// export async function generateStaticParams() {
//   return portfolioData.services.map((service) => ({
//     slug: service.slug,
//   }));
// } 