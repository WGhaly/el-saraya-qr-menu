import { redirect } from 'next/navigation';

export default function RootPage() {
  // Redirect to Arabic (default locale)
  redirect('/ar');
}