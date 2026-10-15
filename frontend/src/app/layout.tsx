import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
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
    <html lang="en" className={`${plusJakartaSans.variable} dark h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0e150e] text-[#dde5d9] selection:bg-[#b6f076] selection:text-[#121812]">
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
