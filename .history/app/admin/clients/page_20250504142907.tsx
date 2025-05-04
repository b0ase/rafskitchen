"use client";
import { useEffect, useState } from "react";

interface ClientRequest {
  id: number;
  name: string;
  email: string;
  phone?: string;
  website?: string;
  logo_url?: string;
  project_brief: string;
  requested_budget?: string;
  how_heard?: string;
  socials?: string;
  github_links?: string;
  inspiration_links?: string;
  status: string;
  reviewed_by?: string;
  reviewed_at?: string;
  review_notes?: string;
  rejection_reason?: string;
  created_at?: string;
}

export default function AdminClientsPage() {
  // Placeholder: Replace with real auth check
  const isAdmin = true;
  const [requests, setRequests] = useState<ClientRequest[]>([]);
  const [selected, setSelected] = useState<ClientRequest | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/client-requests");
    if (res.ok) {
      setRequests(await res.json());
    } else {
      setError("Failed to fetch client requests");
    }
    setLoading(false);
  }

  async function handleApprove(id: number) {
    setLoading(true);
    setError("");
    setSuccess("");
    const res = await fetch(`/api/admin/client-requests/${id}/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ review_notes: reviewNotes }),
    });
    if (res.ok) {
      setSuccess("Client approved and notified.");
      setSelected(null);
      fetchRequests();
    } else {
      setError("Failed to approve client.");
    }
    setLoading(false);
  }

  async function handleReject(id: number) {
    setLoading(true);
    setError("");
    setSuccess("");
    const res = await fetch(`/api/admin/client-requests/${id}/reject`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ review_notes: reviewNotes, rejection_reason: rejectionReason }),
    });
    if (res.ok) {
      setSuccess("Client rejected and email draft opened.");
      setSelected(null);
      fetchRequests();
    } else {
      setError("Failed to reject client.");
    }
    setLoading(false);
  }

  async function handleResendApprovalEmail(id: number) {
    setResendLoading(true);
    setError("");
    setSuccess("");
    const res = await fetch(`/api/admin/client-requests/${id}/resend-approval-email`, {
      method: "POST",
    });
    const data = await res.json();
    if (res.ok && data.success) {
      setSuccess(data.message || "Approval email resent successfully.");
    } else {
      setError(data.error || "Failed to resend approval email.");
    }
    setResendLoading(false);
  }

  if (!isAdmin) {
    return <div className="p-8 text-center text-red-500">Access denied.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto my-12 p-6 bg-gray-900 text-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6">Client Requests Review</h1>
      {loading && <p>Loading requests...</p>}
      {error && <p className="text-red-400 mb-4">Error: {error}</p>}
      {success && <p className="text-green-400 mb-4">Success: {success}</p>}
      <table className="w-full mb-8 text-left">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="py-2">Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Submitted</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(req => (
            <tr key={req.id} className="border-b border-gray-800 hover:bg-gray-800 cursor-pointer" onClick={() => setSelected(req)}>
              <td className="py-2">{req.name}</td>
              <td>{req.email}</td>
              <td>{req.status}</td>
              <td>{req.created_at ? new Date(req.created_at).toLocaleString() : ""}</td>
              <td>
                <button className="text-blue-400 underline" onClick={e => { e.stopPropagation(); setSelected(req); }}>Review</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selected && (
        <div className="bg-gray-800 p-6 rounded-xl mb-8">
          <h2 className="text-2xl font-bold mb-2">Review: {selected.name}</h2>
          <div className="mb-2 text-sm text-gray-300">Email: {selected.email}</div>
          <div className="mb-2 text-sm text-gray-300">Status: {selected.status}</div>
          <div className="mb-2 text-sm text-gray-300">Project: {selected.project_brief}</div>
          <div className="mb-2 text-sm text-gray-300">Budget: {selected.requested_budget}</div>
          <div className="mb-2 text-sm text-gray-300">Socials: {selected.socials}</div>
          <div className="mb-2 text-sm text-gray-300">GitHub: {selected.github_links}</div>
          <div className="mb-2 text-sm text-gray-300">Inspiration: {selected.inspiration_links}</div>
          <div className="mb-2 text-sm text-gray-300">Notes: {selected.review_notes}</div>
          <textarea className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded mt-2 mb-2" placeholder="Review notes (private)" value={reviewNotes} onChange={e => setReviewNotes(e.target.value)} readOnly={selected.status !== 'pending'} />
          <div className="flex gap-4 mt-4 items-start">
            {selected.status === "pending" && (
              <>
                <button className="bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50" onClick={() => handleApprove(selected.id)} disabled={loading}>Approve</button>
                <div className="flex-grow">
                  <textarea className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded" placeholder="Rejection reason (will be emailed)" value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} />
                  <button className="bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mt-2 disabled:opacity-50" onClick={() => handleReject(selected.id)} disabled={loading || !rejectionReason}>Reject</button>
                </div>
              </>
            )}
            {selected.status === "approved" && (
              <button className="bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50" onClick={() => handleResendApprovalEmail(selected.id)} disabled={resendLoading}>{resendLoading ? 'Resending...' : 'Resend Approval Email'}</button>
            )}
          </div>
          <button className="mt-6 text-gray-400 underline" onClick={() => setSelected(null)}>Close Details</button>
        </div>
      )}
    </div>
  );
} 