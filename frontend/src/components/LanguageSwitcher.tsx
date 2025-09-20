'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useTransition } from 'react';
import { Languages } from 'lucide-react';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchLanguage = () => {
    const newLocale = locale === 'ar' ? 'en' : 'ar';
    
    startTransition(() => {
      // Remove current locale from pathname if present
      const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '');
      const newPath = `/${newLocale}${pathWithoutLocale}`;
      router.replace(newPath);
    });
  };

  return (
    <button
      onClick={switchLanguage}
      disabled={isPending}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-lg
        bg-white/10 backdrop-blur-sm
        text-white hover:bg-white/20
        transition-all duration-200
        border border-white/20
        ${isPending ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
        ${locale === 'ar' ? 'flex-row' : 'flex-row-reverse'}
      `}
      title={locale === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
    >
      <Languages className="w-4 h-4" />
      <span className="text-sm font-medium">
        {locale === 'ar' ? 'EN' : 'عربي'}
      </span>
    </button>
  );
}