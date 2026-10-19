import type { Metadata } from 'next';
// import { Inter } from 'next/font/google';
import Providers from '@/app/components/common/Providers';
import { APP_NAME, APP_DESCRIPTION, SITE_URL } from '@/lib/constants';
import './globals.css';

// const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${APP_NAME} — Free Online Video Editor`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: [
    'video editor',
    'online video editing',
    'free video editor',
    'AI video editor',
    'browser video editor',
    APP_NAME,
  ],
  openGraph: {
    type: 'website',
    title: `${APP_NAME} — Free Online Video Editor`,
    description: APP_DESCRIPTION,
    url: SITE_URL,
    siteName: APP_NAME,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${APP_NAME} — Free Online Video Editor`,
    description: APP_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={` dark`}>
      <body className="min-h-screen bg-slate-950 font-sans text-white antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}