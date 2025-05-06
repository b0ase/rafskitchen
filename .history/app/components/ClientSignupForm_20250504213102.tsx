"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Define the type for the form data based on your state
interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  website: string; // Client's main website
  live_website_url: string; // Project's live URL
  logo_url: string;
  project_brief: string;
  requested_budget: string | number; // Allow string for input, number for processing
  how_heard: string;
  socials: string;
  github_links: string;
  inspiration_links: string;
  project_types: string[];
  // Add other fields corresponding to the ProjectData type if needed for editing
  id?: string; // Optional id if editing
  slug?: string; // Optional slug if editing
}

// Define the props the component accepts
interface ClientSignupFormProps {
  initialData?: Partial<ClientFormData>; // Optional initial data for editing
  onSave?: (data: Partial<ClientFormData>) => Promise<void>; // Optional save handler for editing
}

export default function ClientSignupForm({ initialData, onSave }: ClientSignupFormProps) {
  // Initialize state from initialData if provided, otherwise default
  const [form, setForm] = useState<ClientFormData>(() => ({
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    website: initialData?.website || "", // Client website
    live_website_url: initialData?.live_website_url || "", // Project live website
    logo_url: initialData?.logo_url || "",
    project_brief: initialData?.project_brief || "",
    requested_budget: initialData?.requested_budget || "",
    how_heard: initialData?.how_heard || "",
    socials: initialData?.socials || "",
    github_links: initialData?.github_links || "",
    inspiration_links: initialData?.inspiration_links || "",
    project_types: initialData?.project_types || [],
    id: initialData?.id,
    slug: initialData?.slug,
  }));
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  // Populate form when initialData changes (e.g., when switching to edit mode)
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        website: initialData.website || "", // Client website
        live_website_url: initialData.live_website_url || "", // Project live website
        logo_url: initialData.logo_url || "",
        project_brief: initialData.project_brief || "",
        requested_budget: initialData.requested_budget || "",
        how_heard: initialData.how_heard || "",
        socials: initialData.socials || "",
        github_links: initialData.github_links || "",
        inspiration_links: initialData.inspiration_links || "",
        project_types: initialData.project_types || [],
        id: initialData.id,
        slug: initialData.slug,
      });
    }
  }, [initialData]);

  const mainProjectTypes = [
    // Digital
    "Website", "Mobile App", "E-Commerce Store", "SaaS Platform", "API Development",
    
    // Creative
    "Brand Design", "UI/UX", "Video", "Motion Graphics", "3D Design",
    
    // Innovation
    "AI/ML", "Blockchain", "Web3",
    
    // Growth
    "Marketing", "Social Media", "SEO", "Content", "Email Marketing",
    
    // Support
    "Consulting", "DevOps"
  ];

  const additionalProjectTypes = [
    // Specialized Digital
    "Progressive Web App", "Native Mobile App", "Cross-Platform App",
    "Marketplace Platform", "Subscription Platform", "Custom CMS",
    "Database Design", "System Integration", "Legacy System Modernization",
    
    // Advanced Creative
    "Design System", "Interactive Design", "Animation", "Illustration",
    "Logo Design", "Typography", "Icon Design", "Print Design",
    "Packaging Design", "Environmental Design",
    
    // Extended Innovation
    "Machine Learning", "Natural Language Processing", "Computer Vision",
    "Smart Contracts", "DeFi", "NFT Platform", "DAO Tools",
    "Data Science", "Predictive Analytics", "IoT Platform",
    
    // Comprehensive Growth
    "Growth Strategy", "Content Strategy", "Influencer Marketing",
    "PPC Advertising", "Marketing Automation", "Lead Generation",
    "Conversion Optimization", "Analytics Setup", "Performance Marketing",
    
    // Additional Services
    "Security", "Code Review", "Performance Optimization", "Security Audit",
    "Cloud Architecture", "Infrastructure Setup", "CI/CD Pipeline",
    "Technical Documentation", "Team Training", "Project Management"
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
    console.log("handleLogoUpload triggered"); // Log function start
    if (e.target.files && e.target.files[0]) {
      console.log("File selected:", e.target.files[0]); // Log selected file
      setUploading(true);
      setError(""); // Clear previous errors
      const file = e.target.files[0];
      const filePath = `logos/${Date.now()}_${file.name}`;
      console.log("Uploading to filePath:", filePath); // Log target path
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("client-logos") // Make sure this bucket name is correct in your Supabase project
        .upload(filePath, file, { upsert: true });

      console.log("Supabase upload result:", { uploadData, uploadError }); // Log upload result

      if (uploadError) {
        console.error("Supabase upload error object:", uploadError);
        setError(`Logo upload failed: ${uploadError.message}`);
      } else if (uploadData) {
        console.log("Upload successful, getting public URL for path:", uploadData.path);
        try {
          // Get public URL - this might throw on error or return data only
          const { data: urlData } = supabase.storage
            .from("client-logos")
            .getPublicUrl(uploadData.path);

          console.log("Supabase getPublicUrl result:", { urlData }); // Log URL data

          if (urlData && urlData.publicUrl) {
            console.log("Setting logo_url:", urlData.publicUrl);
            setForm(f => ({ ...f, logo_url: urlData.publicUrl }));
            setSuccess("Logo uploaded successfully!");
          } else {
            // Handle case where getPublicUrl succeeded but returned unexpected data
            console.warn("getPublicUrl did not return expected publicUrl data.", urlData);
            setError("Failed to retrieve logo URL after upload.");
          }
        } catch (urlError) {
            // Catch any error thrown by getPublicUrl
            console.error("Supabase getPublicUrl error object:", urlError);
            setError(`Failed to get logo URL: ${urlError instanceof Error ? urlError.message : String(urlError)}`);
        }
      } else {
        // Should not happen if uploadError is null, but handle just in case
        console.warn("Upload seemed successful but no data returned?");
        setError("Logo upload failed: Unknown reason");
      }
      setUploading(false);
    } else {
        console.log("No file selected or e.target.files is empty.");
    }
  }

  // Updated handleSubmit to check if it's in edit mode (onSave prop exists)
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Prepare data, converting budget to number or null
    const submissionData: Partial<ClientFormData> = {
        ...form,
        requested_budget: form.requested_budget ? Number(form.requested_budget) : null
    };

    if (onSave) {
      // EDIT MODE: Call the onSave handler passed from the parent
      await onSave(submissionData);
      // Parent component (ClientProjectPage) handles success/error state
    } else {
      // CREATE MODE: Submit to the client request API
      try {
        const res = await fetch("/api/client-request", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submissionData), // Use cleaned data
        });
        const data = await res.json();
        if (res.ok) {
          setSuccess("Thank you! Your request has been submitted. We'll be in touch soon.");
          // Reset form only in create mode
          setForm({ 
              name: "", email: "", phone: "", website: "", live_website_url: "", logo_url: "", 
              project_brief: "", requested_budget: "", how_heard: "", 
              socials: "", github_links: "", inspiration_links: "", 
              project_types: [] 
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
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Project Types</h3>
          <div className="flex flex-wrap gap-2 items-center">
            {mainProjectTypes.map(type => (
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
            <button
              type="button"
              onClick={() => setShowMoreOptions(!showMoreOptions)}
              className="px-4 py-2 rounded-full text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1 border border-gray-700"
            >
              {showMoreOptions ? 'Show Less' : 'Show More Options'} {showMoreOptions ? <FaChevronUp /> : <FaChevronDown />}
            </button>
          </div>

          {showMoreOptions && (
            <div className="mt-4 flex flex-wrap gap-2">
              {additionalProjectTypes.map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleProjectType(type)}
                  className={`px-4 py-2 rounded-full transition-colors text-sm ${
                    form.project_types.includes(type)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Contact Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded" placeholder="Your Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <input required type="email" className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded" placeholder="Your Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            <input className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded" placeholder="Phone (Optional)" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            <input className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded" placeholder="Current Website (Optional)" value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} />
          </div>
            
          {/* Live Website URL Input (Moved outside grid) */}
          <div>
            <label htmlFor="live_website_url" className="block text-sm font-medium text-gray-300 mb-1">
              Project Live Website URL (if applicable)
            </label>
            <input
              type="url" // Use URL type for better validation/input methods
              id="live_website_url"
              name="live_website_url"
              value={form.live_website_url}
              onChange={(e) => setForm(f => ({ ...f, live_website_url: e.target.value }))}
              placeholder="https://yourproject.live"
              className="block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
            
          {/* Logo Upload Input */}
          <div className="md:col-span-2">
              <label htmlFor="logo-upload" className="block text-sm font-medium text-gray-300 mb-1">Upload Logo (Optional)</label>
              <input 
                  type="file" 
                  id="logo-upload"
                  accept="image/png, image/jpeg, image/gif, image/svg+xml" // Specify acceptable image types
                  onChange={handleLogoUpload} 
                  className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 disabled:opacity-50"
                  disabled={uploading}
              />
              {uploading && <p className="text-xs text-blue-400 mt-1">Uploading...</p>}
              {/* Display uploaded logo preview */}
              {form.logo_url && (
                  <div className="mt-2">
                      <img src={form.logo_url} alt="Uploaded logo preview" className="h-16 w-auto object-contain bg-gray-700 p-1 rounded" />
                  </div>
              )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Project Details</h3>
          <textarea className="w-full px-3 py-4 bg-gray-800 border border-gray-700 rounded min-h-[120px]" placeholder="Tell us about your project, goals, audience, and anything else you'd like us to know..." value={form.project_brief} onChange={e => setForm(f => ({ ...f, project_brief: e.target.value }))} />
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

        {/* Form Submission Button */}
        <div className="mt-8 border-t border-gray-700 pt-6">
            <button 
                type="submit" 
                className="w-full md:w-auto px-6 py-3 bg-green-700 hover:bg-green-600 text-white font-bold rounded transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={uploading} // Disable during upload
            >
                {onSave ? 'Update Details' : 'Submit Request'} {uploading ? '...' : ''}
            </button>
            {/* Display success/error messages */}
            {success && <p className="mt-4 text-green-400">{success}</p>}
            {error && <p className="mt-4 text-red-500">{error}</p>}
        </div>
      </form>
    </div>
  );
} 