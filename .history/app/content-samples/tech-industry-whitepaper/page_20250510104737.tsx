import Link from 'next/link';

export default function TechIndustryWhitepaperPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="w-full px-4 md:px-8 py-8 border-b border-gray-800 mb-8">
        <Link href="/services/content-copywriting" className="text-sky-400 hover:underline text-sm mb-4 inline-block">← Back to Content & Copywriting</Link>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Tech Industry Whitepaper</h1>
        <p className="text-xl text-gray-300 max-w-4xl mb-2">
          Comprehensive analysis of emerging technologies in the blockchain space, tailored for executive audiences.
        </p>
      </header>
      <section className="px-4 md:px-8 mb-12">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Project Overview</h2>
          <p className="text-gray-300 mb-4">
            This whitepaper demystifies blockchain, smart contracts, and decentralized finance for business leaders. It provides actionable insights, market analysis, and strategic recommendations for organizations considering blockchain adoption.
          </p>
        </div>
      </section>
      <section className="px-4 md:px-8 mb-12">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">What Was Done</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>In-depth research on blockchain trends and enterprise use cases</li>
            <li>Interviews with industry experts and CTOs</li>
            <li>Clear, jargon-free explanations for non-technical readers</li>
            <li>Strategic recommendations for C-suite decision makers</li>
            <li>Professional layout and data visualization</li>
          </ul>
        </div>
      </section>
      <section className="px-4 md:px-8 mb-12">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Key Features</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>Executive summary and actionable insights</li>
            <li>Market analysis with charts and infographics</li>
            <li>Case studies of successful blockchain adoption</li>
            <li>Glossary of key terms</li>
          </ul>
        </div>
      </section>
      <section className="px-4 md:px-8 mb-12">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Results & Impact</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>Helped client secure new B2B partnerships</li>
            <li>Whitepaper cited in industry publications</li>
            <li>Positive feedback from executive readers</li>
          </ul>
        </div>
      </section>
      <section className="px-4 md:px-8 mb-16">
        <div className="max-w-2xl mx-auto">
          <div className="bg-black p-6 border border-gray-800 shadow-xl relative">
            <div className="text-4xl text-cyan-500 opacity-30 absolute top-4 left-4">"</div>
            <div className="relative z-10">
              <p className="text-gray-300 mb-4 italic">"Blockchain is more than a buzzword. This whitepaper gave us the clarity and confidence to move forward with our digital strategy."</p>
              <div>
                <p className="font-semibold text-white">Client CEO</p>
                <p className="text-gray-400 text-sm">Tech Industry</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 