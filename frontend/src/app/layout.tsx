import './globals.css';

export const metadata = {
  title: 'Saraya Drinks - Premium Beverage Menu | قائمة مشروبات سراية',
  description: 'Experience our premium beverage selection | استمتع بتشكيلة المشروبات المميزة',
  icons: {
    icon: '/saraya-logo.jpeg',
    shortcut: '/saraya-logo.jpeg',
    apple: '/saraya-logo.jpeg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="font-arabic">
        {children}
      </body>
    </html>
  );
}