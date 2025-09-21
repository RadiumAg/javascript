'use client';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Textarea } from '@/components/Textarea';
import { trpcClientReact } from '@/utils/api';

export default function Home() {
  const { data, isError, error, isLoading } = trpcClientReact.hello.useQuery(
    undefined,
    { refetchOnWindowFocus: false },
  );

  return (
    <div className="h-screen flex justify-center items-center">
      <form className="w-full max-w-md flex flex-col gap-4">
        <h1 className="text-center text-xl font-bold">Create App</h1>
        <Input name="name" placeholder="App Name"></Input>
        <Textarea name="description" placeholder="Description"></Textarea>
        <Button type="submit">Submit</Button>

        {data?.hello}
        {isLoading && <div>Loading...</div>}
        {isError && <div>Error: {error.message}</div>}
      </form>
    </div>
  );
}
