import Link from 'next/link';

export default function ProgressiveWebAppPage() {
  return (
    <div className="min-h-screen bg-black text-gray-100 px-4 py-12">
      <div className="max-w-2xl mx-auto bg-gray-900 border border-white rounded-lg shadow-lg p-8">
        <Link href="/featured" className="text-sky-400 hover:underline text-sm mb-4 inline-block">← Back to Featured Work</Link>
        <h1 className="text-3xl font-bold mb-2">Progressive Web App</h1>
        <p className="mb-6 text-gray-300">Progressive web app with offline functionality and real-time data synchronization.</p>
        <div>
          <h2 className="text-xl font-semibold mb-2">Tech Stack</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-200">
            <li>React</li>
            <li>Service Workers</li>
            <li>IndexedDB</li>
            <li>WebSockets</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 