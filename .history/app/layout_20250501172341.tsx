import type { Metadata } from "next";
// Import Space Grotesk, remove Roboto
import { Space_Grotesk, Outfit } from "next/font/google"; // Note the underscore in Space_Grotesk
import "./globals.css";
// import { MenuProvider } from './context/MenuContext'; // Remove MenuProvider for now

// Configure Space Grotesk (replace Roboto)
const space_grotesk = Space_Grotesk({ 
  subsets: ["latin"], 
  weight: ['400', '700'], // Include necessary weights (adjust if needed)
  variable: '--font-space-grotesk' // Assign CSS variable for default sans
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
    <html lang="en" className={`${space_grotesk.variable} ${outfit.variable}`}>
      <head>
        {/* Keep viewport settings, remove others if not needed */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      </head>
      {/* Keep font-sans on body, Tailwind should pick up the variable */}
      <body className="antialiased font-sans">
        {/* <MenuProvider> */}
          {children}
        {/* </MenuProvider> */}
      </body>
    </html>
  );
}
