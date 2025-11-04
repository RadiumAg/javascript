'use client';
import { use, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { trpcClientReact } from '@/utils/api';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/Popover';
import { Input } from '@/components/ui/Input';

interface Props {
  params: Promise<{ appId: string }>;
}

export default function StoragePage(props: Props) {
  const { appId } = use(props.params);
  const newApiKeyName = useRef('');
  const utils = trpcClientReact.useUtils();
  const { mutate } = trpcClientReact.apiKeys.createApiKey.useMutation({
    onSuccess: (data) => {
      utils.apiKeys.listApiKeys.setData({ appId }, (prev) => {
        newApiKeyName.current = '';
        if (!prev || !data) {
          return prev;
        }

        return [data, ...prev];
      });
    },
  });
  const { data: apiKeys } = trpcClientReact.apiKeys.listApiKeys.useQuery({
    appId,
  });

  return (
    <div className="pt-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl mb-6">Api Keys</h1>
        <Popover>
          <PopoverTrigger>
            <Button>
              <Plus></Plus>
            </Button>
          </PopoverTrigger>

          <PopoverContent>
            <div className="flex flex-col gap-4">
              <Input
                placeholder="Name"
                onChange={(e) => {
                  newApiKeyName.current = e.target.value;
                }}
              ></Input>
              <Button
                type="submit"
                onClick={() => {
                  mutate({ appId, name: newApiKeyName.current });
                }}
              >
                Submit
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      {apiKeys?.map((storage) => {
        return (
          <div
            key={storage.id}
            className="border p-4 flex justify-between items-center m-4"
          >
            <span>{storage.name}</span>
            <span>{storage.key}</span>
          </div>
        );
      })}
    </div>
  );
}
