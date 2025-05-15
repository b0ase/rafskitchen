// Page for API and MPC Documentation Links
export default function ApiReferencePage() {
    return (
      <div className="container mx-auto px-4 py-10 text-gray-200 bg-gray-950 min-h-screen">
        <header className="mb-10">
          <h1 className="text-5xl font-bold text-white text-center mb-3">b0ase.com API &amp; MPC Documentation</h1>
          <p className="text-center text-gray-400 text-lg">
            This page provides access to the design documents for the b0ase.com internal API and the Model Context Protocol (MPC).
          </p>
          <p className="text-center text-yellow-500 mt-2 font-semibold">
            Important: Functional API endpoints for programmatic access are located under <code className='text-yellow-300 bg-gray-700 px-1 rounded'>/api/v1/...</code> routes and are not browsable here.
          </p>
        </header>
  
        <div className="space-y-10">
          <section className="p-8 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl">
            <h2 className="text-3xl font-semibold text-sky-400 mb-5 border-b-2 border-sky-500 pb-3">Internal API Design Document</h2>
            <p className="mb-6 text-gray-300">
              Outlines the design for the internal API, serving as a business logic layer. Details guiding principles and specific endpoint ideas for various platform operations.
            </p>
            <a
              href="/INTERNAL_API_DESIGN.md"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 text-lg"
            >
              View INTERNAL_API_DESIGN.md
            </a>
            <p className="mt-4 text-xs text-gray-500">
              Note: This link attempts to access the file from the project root. For reliable direct browser access, this file might need to be placed in the <code className='text-gray-400 bg-gray-700 px-1 rounded'>/public</code> directory of your Next.js project.
            </p>
          </section>
  
          <section className="p-8 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl">
            <h2 className="text-3xl font-semibold text-purple-400 mb-5 border-b-2 border-purple-500 pb-3">Model Context Protocol (MPC) Design</h2>
            <p className="mb-6 text-gray-300">
              Outlines the conceptual design for how LLM agents can effectively interact with the b0ase.com internal API, covering capability exposure, context management, and interaction flows.
            </p>
            <a
              href="/MPC_DESIGN.md"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 text-lg"
            >
              View MPC_DESIGN.md
            </a>
            <p className="mt-4 text-xs text-gray-500">
              Note: This link attempts to access the file from the project root. For reliable direct browser access, this file might need to be placed in the <code className='text-gray-400 bg-gray-700 px-1 rounded'>/public</code> directory of your Next.js project.
            </p>
          </section>
        </div>
      </div>
    );
  }