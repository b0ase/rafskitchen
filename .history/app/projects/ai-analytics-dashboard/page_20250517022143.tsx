'use client';

import React from 'react';
import Link from 'next/link';

export default function AiAnalyticsDashboardPage() {
  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-4">AI-Powered Analytics Dashboard</h1>
        <p className="text-xl text-gray-300">
          Detailed information about the AI-Powered Analytics Dashboard project.
        </p>
      </header>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-white mb-4">Project Overview</h2>
        <p className="text-gray-400 leading-relaxed">
          This page will explore the AI-Powered Analytics Dashboard, a business intelligence tool that leverages
          machine learning to predict trends, visualize data, and provide actionable insights for informed decision-making.
        </p>
        {/* Placeholder for screenshots, charts, etc. */}
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-white mb-4">Key Features</h2>
        <ul className="list-disc list-inside text-gray-400 space-y-2">
          <li>Integration with multiple data sources.</li>
          <li>Predictive modeling for forecasting future trends.</li>
          <li>Customizable dashboards and interactive data visualizations.</li>
          <li>Anomaly detection and automated alerts.</li>
          <li>User-friendly interface for non-technical users.</li>
        </ul>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-white mb-4">Technologies Used</h2>
        <div className="flex flex-wrap gap-2">
          {['TensorFlow', 'Python', 'D3.js', 'Docker', 'React', 'FastAPI'].map((tech) => (
            <span key={tech} className="px-3 py-1 bg-gray-800 text-cyan-400 text-xs rounded-full">
              {tech}
            </span>
          ))}
        </div>
      </section>

      <div className="mt-12">
        <Link href="/services/software-development"
          className="text-sky-400 hover:text-sky-300 transition-colors duration-150">
          &larr; Back to Software Development Services
        </Link>
      </div>
      <div className="mt-4">
        <Link href="/"
          className="text-gray-400 hover:text-gray-300 transition-colors duration-150 text-sm">
          &larr; Back to Homepage
        </Link>
      </div>
    </div>
  );
} 