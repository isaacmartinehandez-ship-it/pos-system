'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Box, Users, BarChart3 } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { href: '/', icon: ShoppingCart, label: 'Punto de Venta' },
    { href: '/products', icon: Box, label: 'Artículos' },
    { href: '/customers', icon: Users, label: 'Clientes' },
    { href: '/reports', icon: BarChart3, label: 'Informes' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-4">
        <h1 className="text-2xl font-bold mb-8">POS System</h1>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded ${pathname === item.href ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
