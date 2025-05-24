import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'RafsKitchen',
    template: '%s | RafsKitchen',
  },
  metadataBase: new URL('https://rafskitchen.website'),
  description: 'RafsKitchen - Tech incubator transforming concepts into digital realities',
  openGraph: {
    title: 'RafsKitchen',
    description: 'Dynamic tech incubator specializing in blockchain, AI, and emerging technologies',
    images: [`/api/og?title=RafsKitchen`],
  },
  twitter: {
    card: 'summary_large_image',
  },
}; 