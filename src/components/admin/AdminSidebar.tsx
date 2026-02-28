'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FolderOpen,
  BarChart3,
  Settings,
  Image as ImageIcon,
  Plus,
  LogOut,
  X,
  XCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const sidebarItems = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    name: 'Products',
    href: '/admin/products',
    icon: Package,
    children: [
      { name: 'All Products', href: '/admin/products' },
      { name: 'Add Product', href: '/admin/products/add' },
    ]
  },
  {
    name: 'Categories',
    href: '/admin/categories',
    icon: FolderOpen,
    children: [
      { name: 'All Categories', href: '/admin/categories' },
      { name: 'Add Category', href: '/admin/categories/add' },
    ]
  },
  {
    name: 'Orders',
    href: '/admin/orders',
    icon: ShoppingCart,
  },
  {
    name: 'Cancelled',
    href: '/admin/cancelled',
    icon: XCircle,
  },
  {
    name: 'Clients',
    href: '/admin/clients',
    icon: Users,
  },
  {
    name: 'Images',
    href: '/admin/images',
    icon: ImageIcon,
  },
  {
    name: 'Statistics',
    href: '/admin/stats',
    icon: BarChart3,
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(item => item !== itemName)
        : [...prev, itemName]
    );
  };

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-gray-700/50 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-3"
        >
          <div className="w-10 h-10 bg-gradient-to-r from-soft-gold to-electric-blue rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">D</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-xl">RoyArt</h1>
            <p className="text-gray-400 text-sm">Admin Panel</p>
          </div>
        </motion.div>
        <button
          onClick={onClose}
          className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
        {sidebarItems.map((item, index) => (
          <div key={item.name}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {item.children ? (
                <button
                  onClick={() => toggleExpanded(item.name)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                    pathname.startsWith(item.href)
                      ? 'bg-gradient-to-r from-soft-gold/20 to-electric-blue/20 text-soft-gold border border-soft-gold/30'
                      : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon size={20} />
                    <span>{item.name}</span>
                  </div>
                  <Plus 
                    size={16} 
                    className={`transform transition-transform ${
                      expandedItems.includes(item.name) ? 'rotate-45' : ''
                    }`} 
                  />
                </button>
              ) : (
                <Link
                  href={item.href}
                  onClick={handleLinkClick}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                    pathname === item.href
                      ? 'bg-gradient-to-r from-soft-gold/20 to-electric-blue/20 text-soft-gold border border-soft-gold/30'
                      : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                  }`}
                >
                  <item.icon size={20} />
                  <span>{item.name}</span>
                </Link>
              )}
            </motion.div>

            {/* Submenu */}
            {item.children && expandedItems.includes(item.name) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="ml-6 mt-2 space-y-1"
              >
                {item.children.map((child) => (
                  <Link
                    key={child.name}
                    href={child.href}
                    onClick={handleLinkClick}
                    className={`block p-2 pl-4 rounded-lg text-sm transition-all duration-200 ${
                      pathname === child.href
                        ? 'bg-soft-gold/10 text-soft-gold border-l-2 border-soft-gold'
                        : 'text-gray-400 hover:bg-gray-700/30 hover:text-white'
                    }`}
                  >
                    {child.name}
                  </Link>
                ))}
              </motion.div>
            )}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-700/50">
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:bg-red-600/20 hover:text-red-400 transition-all duration-200"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col fixed left-0 top-0 h-full w-64 bg-gray-800/90 backdrop-blur-md border-r border-gray-700/50 shadow-2xl z-30">
        {sidebarContent}
      </div>

      {/* Mobile Sidebar - overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: -288 }}
              animate={{ x: 0 }}
              exit={{ x: -288 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="lg:hidden fixed left-0 top-0 h-full w-72 bg-gray-800/95 backdrop-blur-md border-r border-gray-700/50 shadow-2xl z-50 flex flex-col"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}