import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Import Inter
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SubNavigation from "./components/SubNavigation";

// Configure Inter font
const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter', // Define CSS variable for Inter
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
    <html lang="en">
      {/* Apply the Inter font variable to the body */}
      <body className={`${inter.variable} font-sans`}> 
        {children}
      </body>
    </html>
  );
}
