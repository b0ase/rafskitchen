import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import ConditionalLayout from './components/ConditionalLayout';
import { Providers } from './components/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'b0ase.com | Richard Boase | Web Developer & UI/UX Designer',
  description: 'Portfolio and project hub for Richard Boase, a full-stack developer and UI/UX designer specializing in modern web technologies.',
};

export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-black text-gray-300`}>
        <Providers>
          <ConditionalLayout session={session}>
            {children}
          </ConditionalLayout>
        </Providers>
      </body>
    </html>
  );
}
