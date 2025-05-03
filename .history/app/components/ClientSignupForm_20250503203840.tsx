"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function ClientSignupForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    logo_url: "",
    project_brief: "",
    requested_budget: "",
    how_heard: "",
  });
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setUploading(true);
      const file = e.target.files[0];
      const filePath = `logos/${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage
        .from("client-logos")
        .upload(filePath, file, { upsert: true });
      if (!error && data) {
        const { data: urlData } = supabase.storage
          .from("client-logos")
          .getPublicUrl(data.path);
        setForm(f => ({ ...f, logo_url: urlData.publicUrl }));
      } else {
        setError("Logo upload failed");
      }
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    const res = await fetch("/api/client-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setSuccess("Thank you! Your request has been submitted. We'll be in touch soon.");
      setForm({
        name: "",
        email: "",
        phone: "",
        website: "",
        logo_url: "",
        project_brief: "",
        requested_budget: "",
        how_heard: "",
      });
    } else {
      setError("Submission failed. Please try again.");
    }
  }

  return (
    <div className="max-w-lg mx-auto my-8 p-6 bg-gray-900 text-white rounded shadow">
      <h2 className="text-2xl font-bold mb-2 text-center">Welcome to B0ASE!</h2>
      <p className="text-gray-300 text-center mb-4">
        Tell us about your project and we'll get back to you soon.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded"
          placeholder="Your Name" value={form.name} required
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
        <input className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded"
          placeholder="Your Email" type="email" value={form.email} required
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
        <input className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded"
          placeholder="Your Phone (optional)" value={form.phone}
          onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
        <input className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded"
          placeholder="Your Website (optional)" value={form.website}
          onChange={e => setForm(f => ({ ...f, website: e.target.value }))} />
        <div className="flex items-center gap-2">
          <input className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded"
            placeholder="Logo URL (optional)" value={form.logo_url}
            onChange={e => setForm(f => ({ ...f, logo_url: e.target.value }))} />
          <label className="bg-blue-700 hover:bg-blue-600 text-white px-3 py-2 rounded cursor-pointer">
            Upload
            <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleLogoUpload} />
          </label>
        </div>
        {form.logo_url && (
          <img src={form.logo_url} alt="Logo preview" className="mt-2 h-12 rounded bg-white object-contain" />
        )}
        <textarea className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded"
          placeholder="Tell us about your project..." value={form.project_brief} required
          onChange={e => setForm(f => ({ ...f, project_brief: e.target.value }))} />
        <input className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded"
          placeholder="Requested Budget (e.g. 5000)" type="number" value={form.requested_budget}
          onChange={e => setForm(f => ({ ...f, requested_budget: e.target.value }))} />
        <input className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded"
          placeholder="How did you hear about us? (optional)" value={form.how_heard}
          onChange={e => setForm(f => ({ ...f, how_heard: e.target.value }))} />
        <button type="submit"
          className="w-full bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          disabled={uploading || !form.name || !form.email || !form.project_brief}>
          {uploading ? "Uploading..." : "Submit Request"}
        </button>
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        {success && <p className="text-green-400 text-sm mt-2">{success}</p>}
      </form>
    </div>
  );
} 