import { getServerSession } from '@/server/auth';
import { redirect } from 'next/navigation';
import '../globals.css';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  if (!session?.user) {
    redirect('/api/auth/signin');
  }
  return <body>{children}</body>;
}
