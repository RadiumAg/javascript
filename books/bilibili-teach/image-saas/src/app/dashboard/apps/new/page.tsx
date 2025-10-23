import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { createAppSchema } from '@/server/db/validate-schema';
import { serverCaller } from '@/utils/trpc';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default function Home() {
  const createApp = async (formData: FormData) => {
    'use server';
    const name = formData.get('name');
    const description = formData.get('description');
    const input = createAppSchema
      .pick({ name: true, description: true })
      .safeParse({ name, description });

    if(input.success) {
        const session = await getServerSession();
        const newApp = await serverCaller({session}).apps.createApp(input.data);
        redirect(`/dashboard/apps/${newApp.id}`);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <form className="w-full max-w-md flex flex-col gap-4" action={createApp}>
        <h1 className="text-center text-xl font-bold">Create App</h1>
        <Input name="name" placeholder="App Name"></Input>
        <Textarea name="description" placeholder="Description"></Textarea>
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}
