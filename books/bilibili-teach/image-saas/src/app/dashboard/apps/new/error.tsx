'use client';

import { Button } from '@/components/ui/Button';

export default function CreateAppError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <div className="w-64 flex-col mx-auto p-8 flex justify-center items-center">
        Create App Fail
        <Button onClick={reset}>reset</Button>
      </div>
    </div>
  );
}
