import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
// import { MenuProvider } from './context/MenuContext'; // Remove MenuProvider for now

// Configure fonts
const inter = Inter({ 
  subsets: ["latin"], 
  variable: '--font-inter' // Default sans-serif font
});

const ibmPlexMono = IBM_Plex_Mono({ 
  subsets: ["latin"], 
  weight: ['400', '700'], // Include weights needed (e.g., regular, bold)
  variable: '--font-ibm-plex-mono' // Variable for the mono font
});

export const metadata: Metadata = {
  title: "b0ase.com", // Update browser tab title
  description: "Digital Project Incubator & Service Provider", // Removed name
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${ibmPlexMono.variable}`}>
      <head>
        {/* Keep viewport settings, remove others if not needed */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      </head>
      {/* Use a more generic font class if desired, remove font-arial if not needed */}
      <body className="antialiased font-sans">
        {/* <MenuProvider> */}
          {children}
        {/* </MenuProvider> */}
      </body>
    </html>
  );
}
