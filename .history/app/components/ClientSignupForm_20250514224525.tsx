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
  website: string; // Project's Live Website URL
  logo_url: string;
  project_brief: string;
  requested_budget: string | number; // Allow string for input, number for processing
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
        website: initialData.website || "", // Project Live Website URL
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
        setError(`Could not start Google Sign-In: ${oauthError.message}. Please try again.`);
        localStorage.removeItem('pendingProjectData'); // Clean up if OAuth fails to start
      }
      // No success message here as user will be redirected.
      // Resetting the form is also not needed as the page will navigate away.
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
            <input 
              type="url" 
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded" 
              placeholder="Project Live Website URL (Optional)"
              value={form.website} 
              onChange={e => setForm(f => ({ ...f, website: e.target.value }))} 
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

        <div className="flex justify-end space-x-3">
          {onCancel && (
            <button
              type="button" // Important: type="button" to prevent form submission
              onClick={onCancel}
              className="px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 transition duration-150"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={uploading}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 disabled:opacity-50 transition duration-150"
          >
            {onSave ? 'Save Changes' : 'Submit Request'} {/* Adjust button text based on mode */}
          </button>
        </div>

        {/* Display success/error messages */}
        {success && <p className="mt-4 text-green-400">{success}</p>}
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </form>
    </div>
  );
} 