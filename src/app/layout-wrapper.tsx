'use client';

import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';

const Navbar = dynamic(() => import('@/components/layout/Navbar'), { ssr: false });
const Footer = dynamic(() => import('@/components/layout/Footer'), { ssr: false });

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // Check for admin page with or without locale prefix: /admin, /fr/admin, /en/admin, /ar/admin
  const isAdminPage = pathname?.startsWith('/admin') || /^\/(fr|en|ar)\/admin/.test(pathname || '');

  if (isAdminPage) {
    // Admin pages without navbar and footer
    return (
      <div className="min-h-screen">
        {children}
      </div>
    );
  }

  // Regular pages with navbar and footer
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}