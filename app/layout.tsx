import '@/styles/globals.css';
import { ReactNode } from 'react';
import { Navbar } from '@/components/navbar';
import { AlphaBanner } from '@/components/alpha-banner';
import { FooterLinks } from '@/components/footer-links';
import { AnalyticsProvider } from '@/components/analytics-provider';
import { StoreProvider } from '@/lib/store';

export const metadata = {
  title: 'Meet me',
  description: 'Find your people through shared interests.'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="gradient-bg">
        <StoreProvider>
          <AnalyticsProvider />
          <div className="mx-auto flex min-h-screen max-w-[1480px]">
            <Navbar />
            <main className="min-w-0 flex-1 pb-24 lg:pb-0">{children}</main>
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
