"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function SupabaseTest() {
  const [result, setResult] = useState<string>("Testing...");

  useEffect(() => {
    async function testConnection() {
      // Query the 'clients' table instead of 'pg_tables'
      const { error } = await supabase.from("clients").select("*").limit(1);
      if (error) {
        setResult("❌ Supabase connection failed: " + error.message);
      } else {
        setResult("✅ Supabase connection successful!");
      }
    }
    testConnection();
  }, []);

  return (
    <div className="p-4 bg-gray-900 text-white rounded">
      <h2 className="font-bold mb-2">Supabase Connection Test</h2>
      <p>{result}</p>
    </div>
  );
} 