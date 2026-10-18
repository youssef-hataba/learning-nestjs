import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ToastContainer from '@/components/ui/ToastContainer';
import AuthModal from '@/components/ui/AuthModal';
import ProfileModal from '@/components/ui/ProfileModal';

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Planto | Breath Natural - Biophilic Plant Sanctuary',
  description: 'Curated architectural houseplants cultivated for air purification, wellness, and interior tranquility.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${plusJakartaSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[var(--bg-app)] text-[var(--text-body)] selection:bg-[var(--accent-lime)] selection:text-[var(--on-primary)] transition-colors duration-300">
        <Script
          id="planto-theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('planto-theme');
                  var theme = saved ? JSON.parse(saved).state?.theme : 'light';
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {
                  document.documentElement.classList.remove('dark');
                }
              })();
            `,
          }}
        />
        <ToastContainer />
        <AuthModal />
        <ProfileModal />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
