import type { Metadata, Viewport } from 'next';
import { DM_Sans, Instrument_Serif, DM_Mono } from 'next/font/google';
import './globals.css';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import CustomCursor from '@/components/motion/CustomCursor';
import { siteConfig } from '@/data/site';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
  display: 'swap',
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-dm-mono',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#080808',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://zeeshan-edit.com'),
  title: `${siteConfig.displayName} — ${siteConfig.role}`,
  description: siteConfig.summary,
  keywords: [
    'Zeeshan',
    'Zeeshan Rafik Shaikh',
    'Video Editor',
    'Short-form content specialist',
    'YouTube video editor',
    'Viral video editing',
    'Mumbai video editor',
    'Adobe Premiere Pro',
    'Adobe After Effects',
    'FRAME portfolio',
  ],
  authors: [{ name: siteConfig.brandName }],
  creator: siteConfig.brandName,
  icons: {
    icon: '/assets/branding/logo.svg',
  },
  openGraph: {
    title: `${siteConfig.displayName} — ${siteConfig.role}`,
    description: siteConfig.summary,
    url: 'https://zeeshan-edit.com',
    siteName: 'FRAME® Video Editor Portfolio',
    images: [
      {
        url: '/assets/branding/portrait.jpg',
        width: 1200,
        height: 630,
        alt: `${siteConfig.displayName} Portfolio`,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${instrumentSerif.variable} ${dmMono.variable} scroll-smooth`}
    >
      <body className="bg-[#080808] text-[#F0F0ED] antialiased selection:bg-[#F0F0ED] selection:text-[#080808]">
        {/* Subtle Film Grain Noise Texture */}
        <div className="film-grain" aria-hidden="true" />

        {/* Inertial Smooth Scrolling System */}
        <SmoothScrollProvider>
          {/* Custom Interactive Follower Cursor (Fine pointer only) */}
          <CustomCursor />

          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
