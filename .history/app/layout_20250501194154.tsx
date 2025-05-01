import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google"; // Import JetBrains_Mono
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
// Import ThemeProvider
import { ThemeProvider } from "./context/ThemeContext";

// Configure JetBrains_Mono font
const jetbrains_mono = JetBrains_Mono({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-jetbrains-mono', // Define CSS variable for JetBrains_Mono
});

export const metadata: Metadata = {
  title: "B0ASE.COM | Digital Agency",
  description: "B0ASE.COM - Digital Agency specializing in Web Development, Blockchain, Content, Video, and Social Media.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Apply the JetBrains_Mono variable and font-mono class */}
      <body className={`${jetbrains_mono.variable} font-mono`}> 
        {/* Wrap children with ThemeProvider */}
        <ThemeProvider>
          {/* Header and Footer can remain outside if they don't need theme context directly,
              or move inside if they do (e.g., for a toggle button in Header) */}
          {/* For simplicity now, let's assume Header/Footer are styled via CSS vars or body classes */} 
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
