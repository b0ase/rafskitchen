export default function ApiReferencePage() {\n  return (\n    <div className=\"container mx-auto px-4 py-8 text-gray-300 bg-gray-950 min-h-screen\">\n      <header className=\"mb-12\">\n        <h1 className=\"text-4xl font-bold text-white text-center\">b0ase.com API & MPC Reference</h1>\n        <p className=\"text-center text-gray-400 mt-2\">\n          This page provides links to the design documents for the b0ase.com internal API and Model Context Protocol (MPC).\n        </p>\n        <p className=\"text-center text-yellow-400 mt-1\">\n          Note: Functional API endpoints are located under <code>/api/v1/...</code> and are not directly browsable here.\n        </p>\n      </header>\n\n      <section className=\"mb-16 p-6 bg-gray-900 border border-gray-800 rounded-lg shadow-xl\">\n        <h2 className=\"text-3xl font-semibold text-sky-400 mb-6 border-b border-gray-700 pb-3\">Internal API Design</h2>\n        <p className=\"mb-4\">\n          This document outlines the design for the internal API, serving as a business logic layer on top of the Supabase backend.\n        </p>\n        <a \n          href=\"/INTERNAL_API_DESIGN.md\" \
          target=\"_blank\" \
          rel=\"noopener noreferrer\"\
          className=\"inline-block bg-sky-600 hover:bg-sky-500 text-white font-medium py-2 px-4 rounded-md transition-colors\"\
        >\
          View Internal API Design Document (INTERNAL_API_DESIGN.md)\
        </a>\
        <p className=\"mt-3 text-sm text-gray-500\">\
          (This link assumes the file is accessible at the root. You may need to move it to the /public directory for direct linking.)\
        </p>\
      </section>\n\n      <section className=\"p-6 bg-gray-900 border border-gray-800 rounded-lg shadow-xl\">\n        <h2 className=\"text-3xl font-semibold text-purple-400 mb-6 border-b border-gray-700 pb-3\">Model Context Protocol (MPC) Design</h2>\n        <p className=\"mb-4\">\
          This document outlines the conceptual design for how LLM agents can interact with the b0ase.com internal API.\
        </p>\
        <a \
          href=\"/MPC_DESIGN.md\" \
          target=\"_blank\" \
          rel=\"noopener noreferrer\"\
          className=\"inline-block bg-purple-600 hover:bg-purple-500 text-white font-medium py-2 px-4 rounded-md transition-colors\"\
        >\
          View MPC Design Document (MPC_DESIGN.md)\
        </a>\
        <p className=\"mt-3 text-sm text-gray-500\">\
          (This link assumes the file is accessible at the root. You may need to move it to the /public directory for direct linking.)\
        </p>\
      </section>\n    </div>\n  );\n}\n 