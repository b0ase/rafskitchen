import type { Metadata } from "next";
// Import both Inter and Fira_Code
import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
// Import ThemeProvider
import { ThemeProvider } from "./context/ThemeContext";

// Configure Inter (for default body text)
const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter', // Variable for Inter
});

// Configure Fira_Code (for specific elements)
const fira_code = Fira_Code({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-fira-code', // Variable for Fira Code
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
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${fira_code.variable}`}>
      {/* Apply default font (Inter) via font-sans class */}
      <body className={`font-sans`}>
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
