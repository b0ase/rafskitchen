"use client";

import React, { useEffect, useState } from "react";
import { portfolioData } from "@/lib/data";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const ADMIN_EMAIL = "richardwboase@gmail.com";

interface ProjectLogin {
  id: string;
  project_slug: string;
  created_at: string;
}

export default function ProjectLoginsAdminPage() {
  const [logins, setLogins] = useState<ProjectLogin[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [addForm, setAddForm] = useState({ project_slug: "", password: "" });
  const [editForm, setEditForm] = useState<{ project_slug: string; password: string } | null>(null);
  const [authUser, setAuthUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  const projects = portfolioData.projects.filter((p) => p.type === "domain");

  // Auth logic
  useEffect(() => {
    const getSession = async () => {
      setAuthLoading(true);
      const { data, error } = await supabase.auth.getUser();
      setAuthUser(data?.user || null);
      setAuthLoading(false);
    };
    getSession();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthUser(session?.user || null);
    });
    return () => { listener?.subscription.unsubscribe(); };
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: loginForm.email,
      password: loginForm.password,
    });
    if (error) setAuthError(error.message);
    setAuthLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setAuthUser(null);
  }

  // Admin UI logic
  async function fetchLogins() {
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/project-logins");
    const data = await res.json();
    if (res.ok) setLogins(data);
    else setError(data.error || "Failed to fetch logins");
    setLoading(false);
  }

  useEffect(() => {
    if (authUser && authUser.email === ADMIN_EMAIL) {
      fetchLogins();
    }
  }, [authUser]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    const res = await fetch("/api/admin/project-logins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(addForm),
    });
    const data = await res.json();
    if (res.ok) {
      setSuccess("Project login added!");
      setAddForm({ project_slug: "", password: "" });
      fetchLogins();
    } else {
      setError(data.error || "Failed to add login");
    }
    setLoading(false);
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editForm) return;
    setLoading(true);
    setError("");
    setSuccess("");
    const res = await fetch("/api/admin/project-logins", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    const data = await res.json();
    if (res.ok) {
      setSuccess("Password updated!");
      setEditForm(null);
      fetchLogins();
    } else {
      setError(data.error || "Failed to update password");
    }
    setLoading(false);
  }

  async function handleDelete(slug: string) {
    if (!window.confirm("Are you sure you want to delete this login?")) return;
    setLoading(true);
    setError("");
    setSuccess("");
    const res = await fetch("/api/admin/project-logins", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ project_slug: slug }),
    });
    const data = await res.json();
    if (res.ok) {
      setSuccess("Login deleted.");
      fetchLogins();
    } else {
      setError(data.error || "Failed to delete login");
    }
    setLoading(false);
  }

  // Render logic
  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center text-xl">Loading...</div>;
  }
  if (!authUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-gray-100">
        <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
        <form onSubmit={handleLogin} className="bg-gray-900 p-6 rounded shadow-lg border border-gray-800 flex flex-col gap-4 w-full max-w-sm">
          <input
            type="email"
            placeholder="Email"
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded"
            value={loginForm.email}
            onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded"
            value={loginForm.password}
            onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
            required
          />
          <button
            type="submit"
            className="bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            disabled={authLoading || !loginForm.email || !loginForm.password}
          >
            {authLoading ? "Logging in..." : "Login"}
          </button>
          {authError && <p className="text-red-400 text-sm mt-2">{authError}</p>}
        </form>
      </div>
    );
  }
  if (authUser.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-gray-100">
        <h1 className="text-2xl font-bold mb-6">Access Denied</h1>
        <p className="mb-4">You are not authorized to view this page.</p>
        <button onClick={handleLogout} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">Logout</button>
      </div>
    );
  }

  // Admin UI
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center py-12 px-2">
      <div className="w-full flex justify-end max-w-2xl mb-2">
        <span className="mr-4 text-sm text-gray-400">{authUser.email}</span>
        <button onClick={handleLogout} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">Logout</button>
      </div>
      <h1 className="text-3xl font-bold mb-8">Admin: Project Logins</h1>
      <div className="w-full max-w-2xl bg-gray-900 p-6 rounded shadow-lg border border-gray-800 mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Project Login</h2>
        <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-3 items-center">
          <select
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded w-full md:w-1/2"
            value={addForm.project_slug}
            onChange={e => setAddForm(f => ({ ...f, project_slug: e.target.value }))}
            required
          >
            <option value="" disabled>Select Project</option>
            {projects.map(p => (
              <option key={p.slug} value={p.slug}>{p.title}</option>
            ))}
          </select>
          <input
            type="password"
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded w-full md:w-1/2"
            placeholder="Password"
            value={addForm.password}
            onChange={e => setAddForm(f => ({ ...f, password: e.target.value }))}
            required
          />
          <button
            type="submit"
            className="bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            disabled={loading || !addForm.project_slug || !addForm.password}
          >
            Add
          </button>
        </form>
      </div>

      <div className="w-full max-w-2xl bg-gray-900 p-6 rounded shadow-lg border border-gray-800">
        <h2 className="text-xl font-semibold mb-4">Existing Project Logins</h2>
        {loading ? <p>Loading...</p> : (
          <table className="w-full text-left mb-4">
            <thead>
              <tr>
                <th className="py-2">Project</th>
                <th className="py-2">Slug</th>
                <th className="py-2">Created</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {logins.map(login => {
                const project = projects.find(p => p.slug === login.project_slug);
                return (
                  <tr key={login.id} className="border-t border-gray-800">
                    <td className="py-2">{project ? project.title : login.project_slug}</td>
                    <td className="py-2">{login.project_slug}</td>
                    <td className="py-2 text-xs text-gray-400">{new Date(login.created_at).toLocaleString()}</td>
                    <td className="py-2 flex gap-2">
                      <button
                        className="bg-blue-700 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                        onClick={() => setEditForm({ project_slug: login.project_slug, password: "" })}
                      >
                        Update Password
                      </button>
                      <button
                        className="bg-red-700 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                        onClick={() => handleDelete(login.project_slug)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {editForm && (
          <form onSubmit={handleEdit} className="flex flex-col md:flex-row gap-3 items-center mt-4">
            <input
              type="password"
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded w-full md:w-1/2"
              placeholder="New Password"
              value={editForm.password}
              onChange={e => setEditForm(f => f ? { ...f, password: e.target.value } : null)}
              required
            />
            <button
              type="submit"
              className="bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
              disabled={loading || !editForm.password}
            >
              Save
            </button>
            <button
              type="button"
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
              onClick={() => setEditForm(null)}
            >
              Cancel
            </button>
          </form>
        )}
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        {success && <p className="text-green-400 text-sm mt-2">{success}</p>}
      </div>
    </div>
  );
} 