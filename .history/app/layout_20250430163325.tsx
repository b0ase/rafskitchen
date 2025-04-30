import type { Metadata } from "next";
import "./globals.css";
// import { MenuProvider } from './context/MenuContext'; // Remove MenuProvider for now

export const metadata: Metadata = {
  title: "Your Name - Portfolio", // Update title
  description: "Portfolio showcasing web development, creative work, and more.", // Update description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Keep viewport settings, remove others if not needed */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      </head>
      {/* Use a more generic font class if desired, remove font-arial if not needed */}
      <body className="antialiased">
        {/* <MenuProvider> */}
          {children}
        {/* </MenuProvider> */}
      </body>
    </html>
  );
}
