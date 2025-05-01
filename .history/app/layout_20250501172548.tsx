import type { Metadata } from "next";
// Import Roboto Mono, remove Space Grotesk
import { Roboto_Mono, Outfit } from "next/font/google"; 
import "./globals.css";
// import { MenuProvider } from './context/MenuContext'; // Remove MenuProvider for now

// Configure Roboto Mono (replace Space Grotesk)
const roboto_mono = Roboto_Mono({ 
  subsets: ["latin"], 
  weight: ['400', '700'], // Include necessary weights
  variable: '--font-roboto-mono' // Assign CSS variable for default mono
});

// Configure Outfit (remains for specific elements like header)
const outfit = Outfit({
  subsets: ["latin"],
  weight: ['400', '700'], // Include regular and bold
  variable: '--font-outfit' // Keep CSS variable for Outfit
});

export const metadata: Metadata = {
  title: "b0ase.com | Digital Agency", // Updated browser tab title
  description: "A digital agency offering web development, blockchain solutions, creative media services, and incubating innovative projects.", // Updated description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${roboto_mono.variable} ${outfit.variable}`}>
      <head>
        {/* Keep viewport settings, remove others if not needed */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      </head>
      {/* Change body class from font-sans to font-mono */}
      <body className="antialiased font-mono">
        {/* <MenuProvider> */}
          {children}
        {/* </MenuProvider> */}
      </body>
    </html>
  );
}
