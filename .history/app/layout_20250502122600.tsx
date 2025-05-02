import type { Metadata } from "next";
// Import both Inter and Fira_Code
import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
// Import new nav components
import ServicesNavigation from "./components/ServicesNavigation";
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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function getInitialTheme() {
                  try {
                    const storedTheme = window.localStorage.getItem('theme');
                    if (storedTheme) return storedTheme;
                    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  } catch (e) {
                    // If localStorage is unavailable (e.g., cookies disabled or SSR)
                    return 'light'; // Default to light theme
                  }
                }
                const theme = getInitialTheme();
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
        {/* Other head elements like meta tags will be injected by Next.js here */}
      </head>
      {/* Apply default font (Inter) via font-sans class */}
      <body className={`font-sans`}>
        <ThemeProvider>
          {/* Header and Footer MUST be outside ThemeProvider or siblings to {children} to wrap content */}
          <Header />
          <ServicesNavigation />
          <div className="flex flex-col min-h-screen"> {/* Optional wrapper for main content flex */} 
            <main className="flex-grow">
              {children} 
            </main>
          </div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
