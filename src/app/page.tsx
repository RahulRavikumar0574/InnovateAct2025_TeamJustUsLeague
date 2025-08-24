import { redirect } from 'next/navigation';

export default function Home() {
  // Server Component redirect for App Router
  redirect('/auth/login');
}
