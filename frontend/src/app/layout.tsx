import './globals.css';

export const metadata: Metadata = {
  title: 'Saraya Drinks - Premium Beverage Menu | قائمة مشروبات الســـرايــا',
  description: 'Discover our premium beverage selection',
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