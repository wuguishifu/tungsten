import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { Inter } from 'next/font/google';

import './globals.css';
import './index.css';
import Providers from './providers';

import Toaster from '@/components/toaster';
import { cn } from '@/lib/utils';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Tungsten',
  description: 'Created by Bo Bramer',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={cn(inter.variable, 'antialiased min-h-screen h-screen')}>
        <ThemeProvider attribute='class' defaultTheme='dark' enableSystem storageKey='theme' disableTransitionOnChange>
          <Providers>
            {children}
          </Providers>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
