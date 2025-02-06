import './globals.css';
import { MenuProvider } from './context/MenuContext';

export const metadata = {
  title: '$B0ASE',
  description: 'AI-powered blockchain interface'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
      </head>
      <body className="font-arial antialiased">
        <MenuProvider>
          {children}
        </MenuProvider>
      </body>
    </html>
  );
}
