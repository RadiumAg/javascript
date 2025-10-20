import { getServerSession } from '@/server/auth';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Avatar } from '@/components/ui/Avatar';
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import '../globals.css';

export default async function RootLayout({
  children,
  nav,
}: Readonly<{
  children: React.ReactNode;
  nav: React.ReactNode;
}>) {
  const session = await getServerSession();

  if (!session?.user) {
    redirect('/api/auth/signin');
  }
  return (
    <>
      <nav className="h-[80px] border-b flex justify-center">
        <div className="container flex justify-end h-full items-center relative">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage src={session?.user?.image!}></AvatarImage>
                <AvatarFallback>
                  {session?.user?.name?.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent>{session?.user?.name}</DropdownMenuContent>
          </DropdownMenu>

          <div className="absolute h-full left-1/2 -translate-x-1/2 flex justify-center items-center">
            {nav}
          </div>
        </div>
      </nav>
      <main className="h-[calc(100vh-80px)]">{children}</main>
    </>
  );
}
