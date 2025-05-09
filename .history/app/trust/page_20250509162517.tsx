export default function TrustPage() {
  return (
    <main className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">The Boase Trust</h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
        This page provides an overview of The Boase Trust, including its portfolio of physical and digital assets.
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Documents</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Key legal documents, trust deeds, and official records pertaining to The Boase Trust.
        </p>
        {/* Placeholder for document links or embedded viewers */}
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Balance Sheet</h2>
        <p className="text-gray-600 dark:text-gray-400">
          A summary of The Boase Trust's financial position, detailing assets, liabilities, and equity at a specific point in time.
        </p>
        {/* Placeholder for balance sheet data or a summary table */}
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Ledger of Assets</h2>
        <p className="text-gray-600 dark:text-gray-400">
          A detailed record of all assets held by The Boase Trust, including acquisition dates, current valuations, and relevant notes.
        </p>
        {/* Placeholder for a detailed list or table of assets */}
      </section>

      {/* Sections for Physical Assets, Digital Assets, and Trust Administration can be added or refined later. */}
    </main>
  );
} 