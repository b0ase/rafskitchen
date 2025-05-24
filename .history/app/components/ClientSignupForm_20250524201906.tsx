"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import Image from "next/image";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Define the type for the form data based on your state
interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  website: string; // Project's Live Website URL
  logo_url: string;
  project_brief: string;
  requested_budget: string | number | null; // Allow string for input, number for processing, and null
  how_heard: string;
  socials: string;
  github_links: string;
  inspiration_links: string;
  project_types: string[];
  id?: string; // Optional id if editing
  slug?: string; // Optional slug if editing
}

// Define the props the component accepts
interface ClientSignupFormProps {
  initialData?: Partial<ClientFormData>; // Optional initial data for editing
  onSave?: (data: Partial<ClientFormData>) => Promise<void>; // Optional save handler for editing
  onCancel?: () => void; // Added for cancellation
}

export default function ClientSignupForm({ initialData, onSave, onCancel }: ClientSignupFormProps) {
  // Initialize state from initialData if provided, otherwise default
  const [form, setForm] = useState<ClientFormData>(() => ({
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    website: initialData?.website || "", // Project Live Website URL
    logo_url: initialData?.logo_url || "",
    project_brief: initialData?.project_brief || "",
    requested_budget: initialData?.requested_budget || null, // Initialize with null for budget
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
        website: initialData.website || "", // Project Live Website URL
        logo_url: initialData.logo_url || "",
        project_brief: initialData.project_brief || "",
        requested_budget: initialData.requested_budget || null, // Initialize with null for budget
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

    const submissionData: Partial<ClientFormData> = {
        ...form,
        requested_budget: form.requested_budget ? Number(form.requested_budget) : null
    };

    if (onSave) {
      // EDIT MODE: Call the onSave handler passed from the parent
      await onSave(submissionData);
      // Parent component (ClientProjectPage) handles success/error state
    } else {
      // CREATE MODE (New flow for /signup page)

      // 1. Store form data in localStorage for the new user flow
      try {
        localStorage.setItem('pendingProjectData', JSON.stringify(submissionData));
      } catch (storageError) {
        console.error("Error saving to localStorage:", storageError);
        setError("Could not initiate project setup. Please try again or contact support.");
        // For now, we'll stop if we can't save it, as it's key to the new flow.
        return; 
      }

      // 2. Send data to the agency (existing mechanism - fire and forget)
      fetch("/api/client-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          console.error('Error sending client request to agency:', data.error || 'Unknown error');
          // Log this error, but don't necessarily block the user's signup/project creation flow
        } else {
          console.log('Client request data sent to agency successfully.');
        }
      })
      .catch(err => {
        console.error('Failed to send client request to agency:', err);
        // Log this error
      });

      // 3. Initiate Google OAuth Sign-In
      // Ensure supabase client here is the component client for auth UI methods
      const { createClientComponentClient } = await import('@supabase/auth-helpers-nextjs');
      const supabaseAuth = createClientComponentClient();

      const redirectTo = `${window.location.origin}/auth/callback?next=/projects/new&source=signup`;
      
      const { error: oauthError } = await supabaseAuth.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectTo,
        },
      });

      if (oauthError) {
        console.error("Error initiating Google OAuth:", oauthError);
        setError(`Could not initiate sign-in: ${oauthError.message}`);
      }
      // If successful, the user will be redirected to Google and then back to the app.
      // The /auth/callback route will handle the session and redirect to /projects/new.
    }
  }

  // Render function with form fields
  return (
    <div className="max-w-2xl mx-auto my-10 p-6 bg-gray-900 text-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center text-indigo-400">{onSave ? "Edit Project Details" : "Tell Us About Your Project"}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Basic Information Section */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded" placeholder="Your Full Name or Company Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            <input className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded" placeholder="Contact Email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
            <input className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded" placeholder="Contact Phone (Optional)" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            <input className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded" placeholder="Project's Live Website URL (if any)" value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} />
          </div>
        </div>

        {/* Logo Upload Section */}
        <div>
            <h3 className="text-lg font-semibold mb-2">Company Logo (Optional)</h3>
            <div className="flex flex-col items-center gap-3">
                <label className="w-full md:w-1/2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2 rounded cursor-pointer text-center transition duration-150">
                    {uploading ? "Uploading..." : "Upload Logo"}
                    <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleLogoUpload}
                        disabled={uploading}
                    />
                </label>
                {uploading && <p className="text-xs text-blue-400 mt-1">Uploading...</p>}
                {/* Logo Preview - only show if a logo URL is available and not currently uploading */}
                {!uploading && form.logo_url && (
                    <div className="mt-2 flex justify-center items-center">
                        <Image 
                            src={form.logo_url} 
                            alt="Logo Preview" 
                            className="h-20 w-20 rounded-full object-contain bg-gray-700 p-1" 
                            width={80} 
                            height={80} 
                        />
                    </div>
                )}
                {uploading && (
                    <div className="mt-2 h-20 w-20 flex items-center justify-center bg-gray-700 rounded-full p-1">
                        <p className="text-xs text-gray-400">Processing...</p>
                    </div>
                )}
            </div>
        </div>


        {/* Project Details Section */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Project Details</h3>
          <textarea
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded"
            placeholder="Describe your project, goals, and target audience..."
            value={form.project_brief}
            onChange={e => setForm(f => ({ ...f, project_brief: e.target.value }))}
            rows={5}
            required
          />
        </div>

        {/* Project Types Section */}
        <div>
          <h3 className="text-lg font-semibold mb-2">What kind of project is this? (Select all that apply)</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {mainProjectTypes.map(type => (
              <button
                type="button"
                key={type}
                onClick={() => toggleProjectType(type)}
                className={`px-3 py-2 rounded text-sm transition-colors ${
                  form.project_types.includes(type)
                    ? "bg-indigo-500 text-white"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          {form.project_types.length > 0 && (
            <div className="mt-3">
              <button 
                type="button"
                onClick={() => setShowMoreOptions(!showMoreOptions)}
                className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                {showMoreOptions ? <FaChevronUp /> : <FaChevronDown />}
                {showMoreOptions ? "Show Fewer Options" : "Show More Options"}
              </button>
              {showMoreOptions && (
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {additionalProjectTypes.map(type => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => toggleProjectType(type)}
                      className={`px-3 py-2 rounded text-sm transition-colors ${
                        form.project_types.includes(type)
                          ? "bg-indigo-500 text-white"
                          : "bg-gray-700 hover:bg-gray-600"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Budget & Discovery Section */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Budget & Discovery</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            id="requested_budget"
            type="number"
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., 15000"
            value={form.requested_budget === null ? '' : form.requested_budget}
            onChange={e => setForm(f => ({ ...f, requested_budget: e.target.value === '' ? null : Number(e.target.value) }))}
            min="0"
          />
            <input className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded" placeholder="How did you hear about us? (optional)" value={form.how_heard} onChange={e => setForm(f => ({ ...f, how_heard: e.target.value }))} />
          </div>
        </div>

        {/* Links Section (Optional) */}
        <div>
            <h3 className="text-lg font-semibold mb-2">Additional Links (Optional)</h3>
            <div className="space-y-3">
                <input className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded" placeholder="Social Media Links (comma-separated)" value={form.socials} onChange={e => setForm(f => ({ ...f, socials: e.target.value }))} />
                <input className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded" placeholder="GitHub/Repository Links (comma-separated)" value={form.github_links} onChange={e => setForm(f => ({ ...f, github_links: e.target.value }))} />
                <input className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded" placeholder="Inspiration/Reference Links (comma-separated)" value={form.inspiration_links} onChange={e => setForm(f => ({ ...f, inspiration_links: e.target.value }))} />
            </div>
        </div>
        
        {/* Form Submission & Messages */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded disabled:opacity-50 transition duration-150"
            disabled={uploading} // Disable submit button during logo upload
          >
            {onSave ? "Save Changes" : "Submit Project & Create Account"}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="mt-3 w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded transition duration-150"
            >
              Cancel
            </button>
          )}
          {error && <p className="text-red-400 text-sm mt-3 text-center">{error}</p>}
          {success && <p className="text-green-400 text-sm mt-3 text-center">{success}</p>}
        </div>
      </form>
    </div>
  );
} 