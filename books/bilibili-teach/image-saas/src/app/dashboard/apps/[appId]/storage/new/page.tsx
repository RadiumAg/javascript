'use client';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { S3StorageConfiguration } from '@/server/db/schema';
import { useForm } from 'react-hook-form';

interface Props {
  params: Promise<{ appId: string }>;
}

export default function StoragePage(props: Props) {
  const { register, handleSubmit } = useForm<
    S3StorageConfiguration & { name: string }
  >();
  const onSubmit = () => {
    console.log('submit');
  };

  return (
    <div className="pt-10 mx-auto max-w-md">
      <h1 className="text-3xl mb-6">Create Storage</h1>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label>Name</Label>
          <Input {...register('name', { required: 'Name is required' })} />
        </div>

        <div>
          <Label>Bucket</Label>
          <Input {...register('bucket', { required: 'Bucket is required' })} />
        </div>

        <div>
          <Label>AccessKeyId</Label>
          <Input
            {...register('accessKeyId', {
              required: 'AccessKeyId is required',
            })}
          />
        </div>

        <div>
          <Label>Region</Label>
          <Input {...register('region', { required: 'Region is required' })} />
        </div>

        <div>
          <Label>SecretAccessKey</Label>
          <Input
            type="password"
            {...register('secretAccessKey', {
              required: 'SecretAccessKey is required',
            })}
          />
        </div>

        <div>
          <Label>AccessKeyId</Label>
          <Input
            {...register('accessKeyId', {
              required: 'AccessKeyId is required',
            })}
          />
        </div>

        <div>
          <Label>ApiEndPoint</Label>
          <Input {...register('apiEndPoint')} />
        </div>

        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}
