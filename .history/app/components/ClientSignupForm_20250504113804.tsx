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
    socials: "",
    github_links: "",
    inspiration_links: "",
    project_types: [] as string[],
  });
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const projectTypes = [
    // Core Digital Services
    "Web App", "Mobile App", "E-commerce", "SaaS Platform",
    
    // Emerging Tech
    "AI/ML", "Blockchain", "NFT", "Web3", "IoT Integration",
    
    // Design & Experience
    "UI/UX Design", "Brand Identity", "3D Design", "Motion Graphics",
    
    // Content & Marketing
    "Content Strategy", "Social Media", "Email Marketing", "SEO/SEM",
    
    // Video & Media
    "Video Production", "Animation", "Live Streaming", "Podcast Setup",
    
    // Business & Integration
    "CRM Integration", "Payment Systems", "API Development", "Analytics",
    
    // Specialized Solutions
    "Educational Platform", "Healthcare Tech", "FinTech Solution", "Real Estate Tech",
    
    // Support Services
    "Technical Consulting", "DevOps Setup", "Security Audit", "Performance Optimization"
  ];

  const toggleProjectType = (type: string) => {
    setForm(f => ({
      ...f,
      project_types: f.project_types.includes(type)
        ? f.project_types.filter(t => t !== type)
        : [...f.project_types, type]
    }));
  };

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
    try {
      // Clean up the form data before submission
      const formData = {
        ...form,
        // Convert empty budget string to null, or convert to number if it has a value
        requested_budget: form.requested_budget ? Number(form.requested_budget) : null
      };

      const res = await fetch("/api/client-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      
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
          socials: "",
          github_links: "",
          inspiration_links: "",
          project_types: [],
        });
      } else {
        setError(`Submission failed: ${data.error || 'Unknown error occurred'}`);
        console.error('Form submission error:', data);
      }
    } catch (err) {
      setError(`Request failed: ${err instanceof Error ? err.message : 'Unknown error occurred'}`);
      console.error('Form submission error:', err);
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Project Types</h3>
          <div className="flex flex-wrap gap-2">
            {projectTypes.map(type => (
              <button
                key={type}
                type="button"
                onClick={() => toggleProjectType(type)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  form.project_types.includes(type)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Contact Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded" placeholder="Your Name" value={form.name} required onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <input className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded" placeholder="Your Email" type="email" value={form.email} required onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            <input className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded" placeholder="Your Phone (optional)" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            <input className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded" placeholder="Your Website (optional)" value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Project Details</h3>
          <textarea className="w-full px-3 py-4 bg-gray-800 border border-gray-700 rounded min-h-[120px]" placeholder="Tell us about your project, goals, audience, and anything else you'd like us to know..." value={form.project_brief} required onChange={e => setForm(f => ({ ...f, project_brief: e.target.value }))} />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Brand & Logo</h3>
          <div className="flex items-center gap-2">
            <input className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded" placeholder="Logo URL (optional)" value={form.logo_url} onChange={e => setForm(f => ({ ...f, logo_url: e.target.value }))} />
            <label className="bg-blue-700 hover:bg-blue-600 text-white px-3 py-2 rounded cursor-pointer">
              Upload
              <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleLogoUpload} />
            </label>
          </div>
          {form.logo_url && (
            <img src={form.logo_url} alt="Logo preview" className="mt-2 h-12 rounded bg-white object-contain" />
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Budget & Discovery</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded" placeholder="Requested Budget (e.g. 5000)" type="number" value={form.requested_budget} onChange={e => setForm(f => ({ ...f, requested_budget: e.target.value }))} />
            <input className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded" placeholder="How did you hear about us? (optional)" value={form.how_heard} onChange={e => setForm(f => ({ ...f, how_heard: e.target.value }))} />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Links & Inspiration <span className="text-sm font-normal text-gray-400">(Optional)</span></h3>
          <div className="space-y-4 text-sm">
            <div>
              <label className="block text-gray-300 mb-1">Social Media Links</label>
              <textarea 
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded" 
                placeholder="Twitter, LinkedIn, Instagram, etc." 
                value={form.socials} 
                onChange={e => setForm(f => ({ ...f, socials: e.target.value }))} 
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">GitHub or Code Repository Links</label>
              <textarea 
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded" 
                placeholder="Share any relevant code repositories" 
                value={form.github_links} 
                onChange={e => setForm(f => ({ ...f, github_links: e.target.value }))} 
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Inspiration</label>
              <textarea 
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded" 
                placeholder="Share links to sites, apps, or designs that inspire your vision" 
                value={form.inspiration_links} 
                onChange={e => setForm(f => ({ ...f, inspiration_links: e.target.value }))} 
              />
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-700 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded disabled:opacity-50" 
          disabled={uploading || !form.name || !form.email || !form.project_brief}
          onClick={() => {
            if (!form.name) console.log('Missing name');
            if (!form.email) console.log('Missing email');
            if (!form.project_brief) console.log('Missing project brief');
            if (uploading) console.log('Still uploading');
          }}
        >
          {uploading ? "Uploading..." : "Submit Request"}
        </button>
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        {success && <p className="text-green-400 text-sm mt-2">{success}</p>}
      </form>
    </div>
  );
} 