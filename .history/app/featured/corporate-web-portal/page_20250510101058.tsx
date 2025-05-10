import Link from 'next/link';

export default function CorporateWebPortalPage() {
  return (
    <div className="min-h-screen bg-black text-gray-100 px-4 py-12">
      <div className="max-w-2xl mx-auto bg-gray-900 border border-white rounded-lg shadow-lg p-8">
        <Link href="/featured" className="text-sky-400 hover:underline text-sm mb-4 inline-block">← Back to Featured Work</Link>
        <h1 className="text-3xl font-bold mb-2">Corporate Web Portal</h1>
        <p className="mb-6 text-gray-300">Corporate web portal with secure document management and collaboration tools.</p>
        <div>
          <h2 className="text-xl font-semibold mb-2">Tech Stack</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-200">
            <li>Next.js</li>
            <li>Firebase</li>
            <li>Auth0</li>
            <li>Material UI</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 