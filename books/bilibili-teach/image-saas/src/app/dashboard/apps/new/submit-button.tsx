'use client';
import { Button } from '@/components/ui/Button';
import { useFormStatus } from 'react-dom';

export default function SubmitButton() {
  const status = useFormStatus();

  return (
    <Button type="submit" disabled={status.pending}>
      Submit
    </Button>
  );
}
