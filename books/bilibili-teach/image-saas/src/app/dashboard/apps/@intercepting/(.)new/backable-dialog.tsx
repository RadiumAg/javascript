'use client';
import React from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { useRouter } from 'next/navigation';

type Props = {
  children: React.ReactNode;
};

export default function BackableDialog(props: Props) {
  const router = useRouter();
  const { children } = props;

  return (
    <Dialog
      open
      onOpenChange={() => {
        router.back();
      }}
    >
      {children}
    </Dialog>
  );
}
