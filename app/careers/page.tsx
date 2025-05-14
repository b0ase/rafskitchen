'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';
import { FaBriefcase, FaFileUpload, FaClipboardList, FaEnvelope, FaUserTie, FaDollarSign, FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import { createClientComponentClient, User } from '@supabase/auth-helpers-nextjs';

export default function CareersPage() {
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<User | null>(null);

  // CV Upload State
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvFileName, setCvFileName] = useState<string>('');
  const [isUploadingCv, setIsUploadingCv] = useState<boolean>(false);
  const [cvUploadSuccessMessage, setCvUploadSuccessMessage] = useState<string>('');
  const [cvUploadErrorMessage, setCvUploadErrorMessage] = useState<string>('');
  const [uploadedCvPath, setUploadedCvPath] = useState<string | null>(null);

  // Form fields state (will be used more when form is fully active)
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [salaryExpectations, setSalaryExpectations] = useState('');

  // Fetch user on component mount
  React.useEffect(() => {
    const fetchUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      setUser(authUser);
    };
    fetchUser();
  }, [supabase]);

  const handleCvFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCvFile(file);
      setCvFileName(file.name);
      setCvUploadSuccessMessage('');
      setCvUploadErrorMessage('');
      setUploadedCvPath(null);
      // Automatically attempt upload on file selection
      await handleCvUpload(file);
    } else {
      setCvFile(null);
      setCvFileName('');
    }
  };

  const handleCvUpload = async (fileToUpload: File) => {
    if (!fileToUpload) {
      setCvUploadErrorMessage('Please select a file to upload.');
      return;
    }
    if (!user) {
      setCvUploadErrorMessage('You must be logged in to upload a CV.');
      return;
    }

    setIsUploadingCv(true);
    setCvUploadSuccessMessage('');
    setCvUploadErrorMessage('');

    const fileExt = fileToUpload.name.split('.').pop();
    const uniqueFileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${user.id}/${uniqueFileName}`;

    try {
      const { data, error: uploadError } = await supabase.storage
        .from('cv_uploads') // Use the correct bucket name
        .upload(filePath, fileToUpload, {
          cacheControl: '3600',
          upsert: false, // Set to false to avoid overwriting if a file with the exact same random name somehow existed
        });

      if (uploadError) {
        throw uploadError;
      }

      if (data) {
        setCvUploadSuccessMessage(`CV "${fileToUpload.name}" uploaded successfully!`);
        setUploadedCvPath(data.path); // Store the path for form submission
        // Clear file input after successful upload if desired, though retaining name is fine
        // setCvFile(null);
        // setCvFileName(fileToUpload.name); // Keep showing the name of uploaded file
      } else {
        throw new Error('Upload completed but no data returned.');
      }
    } catch (e: any) {
      console.error('Error uploading CV:', e);
      setCvUploadErrorMessage(`Failed to upload CV: ${e.message}`);
      setUploadedCvPath(null);
    } finally {
      setIsUploadingCv(false);
    }
  };

  // Placeholder for full form submission
  const handleApplicationSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!uploadedCvPath) {
      alert('Please upload your CV first.');
      return;
    }
    // Logic to save application to database with `uploadedCvPath` and other form fields
    alert(`Form submission placeholder:\nName: ${fullName}\nEmail: ${email}\nCV Path: ${uploadedCvPath}\nCover Letter: ${coverLetter}\nSalary: ${salaryExpectations}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 text-center">
          <FaBriefcase className="text-sky-400 text-6xl mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-white">Join Our Team at b0ase.com</h1>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            We're building the future of project collaboration and are always looking for passionate, talented individuals to help us grow. 
            Explore opportunities to contribute your skills and be part of an innovative team.
          </p>
        </header>

        {/* General Application Section Placeholder */}
        <section className="mb-16 p-6 md:p-8 bg-gray-850 border border-gray-700 rounded-lg shadow-xl">
          <div className="flex items-center mb-6">
            <FaUserTie className="text-3xl text-green-400 mr-4" />
            <h2 className="text-3xl font-semibold text-white">General Application</h2>
          </div>
          <p className="text-gray-400 mb-6">
            Don't see a specific role that fits? We're still keen to hear from you! 
            Tell us about yourself, your skills, and how you envision contributing to b0ase.com.
          </p>
          <form onSubmit={handleApplicationSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
              <input type="text" name="name" id="name" autoComplete="name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none placeholder-gray-500" placeholder="e.g., Jane Doe" required />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
              <input type="email" name="email" id="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none placeholder-gray-500" placeholder="you@example.com" required />
            </div>
            <div>
              <label htmlFor="cv" className="block text-sm font-medium text-gray-300 mb-1">Upload CV/Resume</label>
              <input 
                type="file"
                name="cv"
                id="cv"
                onChange={handleCvFileChange}
                accept=".pdf,.doc,.docx,.txt"
                className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-600 file:text-white hover:file:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                disabled={isUploadingCv}
              />
              {cvFileName && !isUploadingCv && !cvUploadSuccessMessage && !cvUploadErrorMessage && (
                <p className="mt-2 text-sm text-gray-500">Selected: {cvFileName}</p>
              )}
              {isUploadingCv && (
                <div className="mt-2 flex items-center text-sm text-sky-400">
                  <FaSpinner className="animate-spin mr-2" />
                  Uploading "{cvFileName}"...
                </div>
              )}
              {cvUploadSuccessMessage && (
                <div className="mt-2 flex items-center text-sm text-green-400">
                  <FaCheckCircle className="mr-2" />
                  {cvUploadSuccessMessage}
                </div>
              )}
              {cvUploadErrorMessage && (
                <div className="mt-2 flex items-center text-sm text-red-400">
                  <FaTimesCircle className="mr-2" />
                  {cvUploadErrorMessage}
                </div>
              )}
              <p className="mt-1 text-xs text-gray-500">PDF, DOC, DOCX, TXT. Max 5MB.</p>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Cover Letter / Message</label>
              <textarea id="message" name="message" rows={4} value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none placeholder-gray-500" placeholder="Tell us about your aspirations and why you'd be a great fit..." required></textarea>
            </div>
             <div>
              <label htmlFor="salary" className="block text-sm font-medium text-gray-300 mb-1">Salary Expectations (Optional)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaDollarSign className="h-5 w-5 text-gray-500" />
                </div>
                <input type="text" name="salary" id="salary" value={salaryExpectations} onChange={(e) => setSalaryExpectations(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none placeholder-gray-500" placeholder="e.g., 60,000 USD per year / 50 USD per hour" />
              </div>
            </div>
            <button 
              type="submit"
              disabled={isUploadingCv || !uploadedCvPath}
              className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed transition-colors"
            >
              {isUploadingCv ? 'Uploading CV...' : (uploadedCvPath ? 'Submit Application' : 'Upload CV to Submit')}
            </button>
          </form>
          <p className="mt-6 text-xs text-center text-gray-500">
            We are currently setting up our application system. Please check back soon!
          </p>
        </section>

        {/* Current Openings Section Placeholder */}
        <section className="p-6 md:p-8 bg-gray-850 border border-gray-700 rounded-lg shadow-xl">
          <div className="flex items-center mb-6">
             <FaClipboardList className="text-3xl text-amber-400 mr-4" />
            <h2 className="text-3xl font-semibold text-white">Current Openings</h2>
          </div>
          <p className="text-gray-400 mb-4">
            While we are gearing up, we'll be listing specific freelance and contract opportunities here. Stay tuned!
          </p>
          {/* Example of how a job listing might look (placeholder) */}
          <div className="bg-gray-800 p-4 rounded-md border border-gray-700/50 opacity-50">
            <h3 className="text-xl font-semibold text-sky-300">Freelance Frontend Developer (React/Next.js)</h3>
            <p className="text-sm text-gray-500 mb-2">Remote | Contract</p>
            <p className="text-gray-400 text-sm">
              Looking for an experienced Next.js developer to help build out new features for our platform... (Details coming soon)
            </p>
            <button className="mt-3 text-sm text-sky-400 hover:text-sky-300 cursor-not-allowed">Learn More & Apply (Not Active)</button>
          </div>
          {/* Add more job listing placeholders as needed */}
        </section>

        <div className="mt-16 text-center">
          <Link href="/profile" className="text-sky-400 hover:text-sky-300 transition-colors">
            &larr; Back to Profile
          </Link>
        </div>
      </div>
    </div>
  );
} 