'use client';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { S3StorageConfiguration } from '@/server/db/schema';
import { useForm } from 'react-hook-form';

interface Props {
  params: Promise<{ appId: string }>;
}

export default function StoragePage(props: Props) {
  const { register } = useForm<S3StorageConfiguration & { name: string }>();

  return (
    <div className="container pt-10">
      <form>
        <Input {...register('name', { required: 'Name is required' })} />
        <Input {...register('bucket', { required: 'Bucket is required' })} />
        <Input
          {...register('accessKeyId', { required: 'AccessKeyId is required' })}
        />
        <Input {...register('region', { required: 'Region is required' })} />
        <Input
          type="password"
          {...register('secretAccessKey', {
            required: 'SecretAccessKey is required',
          })}
        />
        <Input
          {...register('accessKeyId', { required: 'AccessKeyId is required' })}
        />
        <Input {...register('apiEndPoint')} />

        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}
