import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Raf\'s Kitchen',
    template: '%s | Raf\'s Kitchen',
  },
  metadataBase: new URL('https://rafskitchen.website'),
  description: 'Raf\'s Kitchen - Culinary experiences and recipes',
  openGraph: {
    title: 'Raf\'s Kitchen',
    description: 'Discover culinary experiences and recipes at Raf\'s Kitchen',
    images: [`/api/og?title=Raf\'s Kitchen`],
  },
  twitter: {
    card: 'summary_large_image',
  },
}; 