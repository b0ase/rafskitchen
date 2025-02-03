import '#/styles/globals.css';
import { AddressBar } from '#/ui/address-bar';
import { GlobalNav } from '#/ui/global-nav';
import { RightNav } from '#/ui/right-nav';
import { TopHeader } from '#/ui/top-header';
import { Metadata } from 'next';
import { WalletNav } from '#/ui/wallet-nav';

export const metadata: Metadata = {
  title: {
    default: 'b0ase.com',
    template: '%s | b0ase.com',
  },
  metadataBase: new URL('https://app-router.vercel.app'),
  description: 'b0ase.com - Personal site and projects',
  openGraph: {
    title: 'Next.js App Router Playground',
    description:
      'A playground to explore new Next.js App Router features such as nested layouts, instant loading states, streaming, and component level data fetching.',
    images: [`/api/og?title=Next.js App Router`],
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark [color-scheme:dark]">
      <body className="relative min-h-screen bg-black text-gray-400">
        <TopHeader />
        <GlobalNav />
        <WalletNav />
        <RightNav />

        <div className="pt-14 lg:pl-[36rem] lg:pr-72">
          <div className="px-2 pt-6">
            <div className="rounded-lg bg-black p-3.5 lg:p-6">{children}</div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 h-44 border-t border-gray-800 bg-black" />
      </body>
    </html>
  );
}
