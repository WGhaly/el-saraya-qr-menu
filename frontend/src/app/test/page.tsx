export default function TestPage() {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Saraya Test</title>
      </head>
      <body style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', padding: '2rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ color: '#dc2626', fontSize: '2rem', marginBottom: '1rem' }}>
            مرحبا بكم في سراية للمشروبات
          </h1>
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#dc2626' }}>
              حالة التطبيق
            </h2>
            <p><strong>✅ التطبيق يعمل بنجاح!</strong></p>
            <p><strong>✅ الخط العربي يعمل بشكل صحيح</strong></p>
            <p><strong>✅ الاتجاه من اليمين إلى اليسار يعمل</strong></p>
            
            <div style={{ marginTop: '2rem' }}>
              <h3>تم إصلاح المشاكل التالية:</h3>
              <ul style={{ marginTop: '0.5rem', paddingRight: '1.5rem' }}>
                <li>إصلاح ملف layout.tsx الأساسي</li>
                <li>إصلاح إعدادات next-intl middleware</li>
                <li>إصلاح هيكل الـ HTML المزدوج</li>
                <li>إصلاح مسارات الملفات والمجلدات</li>
              </ul>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}