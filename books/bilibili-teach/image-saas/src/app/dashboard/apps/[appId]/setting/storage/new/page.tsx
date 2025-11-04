'use client';

import { use } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { S3StorageConfiguration } from '@/server/db/schema';
import { trpcClientReact } from '@/utils/api';
import { redirect } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';

interface Props {
  params: Promise<{ appId: string }>;
}

export default function StoragePage(props: Props) {
  const { appId } = use(props.params);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<S3StorageConfiguration & { name: string }>();
  const { mutate } = trpcClientReact.storages.createStorage.useMutation();

  const onSubmit: SubmitHandler<S3StorageConfiguration & { name: string }> = (
    data,
  ) => {
    console.log('submit');
    mutate(data);
    redirect(`/dashboard/apps/${appId}/storage`);
  };

  return (
    <div className="pt-10 mx-auto max-w-md">
      <h1 className="text-3xl mb-6">Create Storage</h1>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label>Name</Label>
          <Input {...register('name', { required: 'Name is required' })} />
          <span className="text-red-500">{errors.name?.message}</span>
        </div>

        <div>
          <Label>Bucket</Label>
          <Input {...register('bucket', { required: 'Bucket is required' })} />
          <span className="text-red-500">{errors.bucket?.message}</span>
        </div>

        <div>
          <Label>AccessKeyId</Label>
          <Input
            {...register('accessKeyId', {
              required: 'AccessKeyId is required',
            })}
          />
          <span className="text-red-500">{errors.accessKeyId?.message}</span>
        </div>

        <div>
          <Label>Region</Label>
          <Input {...register('region', { required: 'Region is required' })} />
          <span className="text-red-500">{errors.region?.message}</span>
        </div>

        <div>
          <Label>SecretAccessKey</Label>
          <Input
            type="password"
            {...register('secretAccessKey', {
              required: 'SecretAccessKey is required',
            })}
          />
          <span className="text-red-500">
            {errors.secretAccessKey?.message}
          </span>
        </div>

        <div>
          <Label>AccessKeyId</Label>
          <Input
            {...register('accessKeyId', {
              required: 'AccessKeyId is required',
            })}
          />
          <span className="text-red-500">{errors.accessKeyId?.message}</span>
        </div>

        <div>
          <Label>ApiEndPoint</Label>
          <Input {...register('apiEndPoint')} />
          <span className="text-red-500">{errors.apiEndPoint?.message}</span>
        </div>

        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}
