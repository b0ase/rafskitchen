import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
// import { MenuProvider } from './context/MenuContext'; // Remove MenuProvider for now

// Configure fonts
const inter = Inter({ 
  subsets: ["latin"], 
  variable: '--font-inter' // Default sans-serif font
});

// Configure Outfit
const outfit = Outfit({
  subsets: ["latin"],
  weight: ['400', '700'], // Include regular and bold
  variable: '--font-outfit' // Assign CSS variable
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
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
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
