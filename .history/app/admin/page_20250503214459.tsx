import Link from 'next/link';
import { FaUsersCog } from 'react-icons/fa';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white py-12">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
      <div className="w-full max-w-md bg-gradient-to-br from-blue-900/80 to-gray-900/80 rounded-xl shadow-lg p-8 flex flex-col items-center">
        <FaUsersCog size={48} className="mb-4 text-blue-400" />
        <h2 className="text-2xl font-semibold mb-2">Client Approvals</h2>
        <p className="text-gray-300 mb-6 text-center">Review, approve, or reject new client sign-up requests.</p>
        <Link href="/admin/clients">
          <button className="bg-blue-700 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg shadow transition-all">
            Go to Client Approvals
          </button>
        </Link>
      </div>
    </div>
  );
} 