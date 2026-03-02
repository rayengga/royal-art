'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const localeConfig = {
  fr: { flag: '🇫🇷', label: 'FR' },
  en: { flag: '🇬🇧', label: 'EN' },
  ar: { flag: '🇹🇳', label: 'AR' },
} as const;

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const current = localeConfig[locale as keyof typeof localeConfig] || localeConfig.fr;

  function switchLocale(newLocale: string) {
    setOpen(false);
    router.replace(pathname, { locale: newLocale as (typeof routing.locales)[number] });
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium
          bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20
          text-stone-700 hover:text-stone-900 transition-all duration-200"
        aria-label="Switch language"
      >
        <span className="text-base">{current.flag}</span>
        <span className="text-xs font-semibold">{current.label}</span>
        <svg
          className={`w-3 h-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-1.5 bg-white rounded-xl shadow-lg border border-stone-200 overflow-hidden z-50 min-w-[100px]"
          >
            {routing.locales.map((loc) => {
              const config = localeConfig[loc as keyof typeof localeConfig];
              const isActive = loc === locale;
              return (
                <button
                  key={loc}
                  onClick={() => switchLocale(loc)}
                  className={`flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors
                    ${isActive
                      ? 'bg-amber-50 text-amber-700 font-semibold'
                      : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                    }`}
                >
                  <span className="text-base">{config.flag}</span>
                  <span>{config.label}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
