import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import '../globals.css';

const locales = ['ar', 'en'];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export function generateMetadata({ params: { locale } }: { params: { locale: string } }): Metadata {
  return {
    title: 'Saraya Drinks - Premium Beverage Menu | قائمة مشروبات سراية',
    description: locale === 'ar' 
      ? 'استمتع بتشكيلة المشروبات المميزة من سراية'
      : 'Experience our premium beverage selection at Saraya Drinks'
  };
}

export default function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Validate that the incoming `locale` parameter is valid
  const isValidLocale = locales.some((cur) => cur === locale);
  if (!isValidLocale) notFound();

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Cairo:wght@200;300;400;500;600;700&family=Amiri:wght@400;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body 
        className={locale === 'ar' ? 'font-cairo' : 'font-inter'}
        style={{ 
          minHeight: '100vh', 
          backgroundColor: '#f9fafb',
          direction: locale === 'ar' ? 'rtl' : 'ltr',
        }}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}