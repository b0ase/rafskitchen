import type { Metadata } from "next";
// Import Roboto, remove Inter
import { Roboto, Outfit } from "next/font/google";
import "./globals.css";
// import { MenuProvider } from './context/MenuContext'; // Remove MenuProvider for now

// Configure Roboto (replace Inter)
const roboto = Roboto({ 
  subsets: ["latin"], 
  weight: ['400', '700'], // Include necessary weights
  variable: '--font-roboto' // Assign CSS variable for default sans
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
    <html lang="en" className={`${roboto.variable} ${outfit.variable}`}>
      <head>
        {/* Keep viewport settings, remove others if not needed */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      </head>
      {/* Update body tag to use font-roboto if needed, or confirm font-sans uses the variable */}
      <body className="antialiased font-sans"> {/* Keep font-sans for now, Tailwind should pick up the variable */}
        {/* <MenuProvider> */}
          {children}
        {/* </MenuProvider> */}
      </body>
    </html>
  );
}
