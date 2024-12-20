import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/providers/auth-provider';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import z from 'zod';

const formSchema = z.object({
  username: z.string()
    .min(1, { message: 'username required.' })
    .max(128, { message: 'username too long.' })
    .regex(/^[a-zA-Z0-9_]+$/, { message: 'username must be alphanumeric.' }),
  password: z.string()
    .min(1, { message: 'password required.' }),
  passwordConfirm: z.string()
    .min(1, { message: 'password confirmation required.' })
}).refine(data => data.password === data.passwordConfirm, {
  message: 'passwords do not match.',
  path: ['passwordConfirm'],
});

type FormSchema = z.infer<typeof formSchema>;

export default function Register() {
  const { register } = useAuth();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => setPasswordVisible(b => !b);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
      passwordConfirm: '',
    },
  });

  async function onSubmit(values: FormSchema) {
    setLoading(true);
    try {
      const username = await register(values.username, values.password);
      toast.success('Logged in successfully.');
      navigate(`/${username}`);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className='w-full h-full flex items-center justify-center'>
      <div className='w-[400px] h-[600px] rounded-xl overflow-hidden items-center shadow-sm border flex flex-col justify-center'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='w-[310px] flex flex-col gap-4'>
            <h1 className='text-center'>register</h1>
            <div className='h-4' />
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <div className='flex flex-row items-center'>
                    <FormLabel className='leading-1'>username {form.formState.errors.username && <> - {form.formState.errors.username.message}</>}</FormLabel>
                  </div>
                  <FormControl>
                    <Input
                      placeholder='wuguishifu'
                      autoComplete='on'
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <div className='flex flex-row items-center'>
                    <FormLabel className='leading-1'>password {form.formState.errors.password && <> - {form.formState.errors.password.message}</>}</FormLabel>
                  </div>
                  <div className='relative'>
                    <FormControl>
                      <Input
                        placeholder={passwordVisible ? 'password' : '••••••••'}
                        autoComplete='on'
                        type={passwordVisible ? 'text' : 'password'}
                        {...field}
                      />
                    </FormControl>
                    <Button
                      type='button'
                      variant='ghost'
                      className='absolute right-0 top-0 bottom-0 px-2 aspect-square'
                      onClick={togglePasswordVisibility}
                    >
                      {passwordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='passwordConfirm'
              render={({ field }) => (
                <FormItem>
                  <div className='flex flex-row items-center'>
                    <FormLabel className='leading-1'>confirm password {form.formState.errors.passwordConfirm && <> - {form.formState.errors.passwordConfirm.message}</>}</FormLabel>
                  </div>
                  <div className='relative'>
                    <FormControl>
                      <Input
                        placeholder={passwordVisible ? 'password' : '••••••••'}
                        autoComplete='on'
                        type={passwordVisible ? 'text' : 'password'}
                        {...field}
                      />
                    </FormControl>
                    <Button
                      type='button'
                      variant='ghost'
                      className='absolute right-0 top-0 bottom-0 px-2 aspect-square'
                      onClick={togglePasswordVisibility}
                    >
                      {passwordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>
                </FormItem>
              )}
            />
            <div className='h-4' />
            <Button type='submit' disabled={loading}>log in</Button>
            <div className='h-4' />
          </form>
        </Form>
      </div>
    </main>
  );
};
