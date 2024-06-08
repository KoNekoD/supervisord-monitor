import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { login } from '~/api/use-login';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ROUTES } from '~/shared/const';
import { useSession } from '~/app/providers/session';

const schema = z.object({
  login: z.string(),
  password: z.string(),
});

type Schema = z.infer<typeof schema>;

export const LoginPage = () => {
  const { setStatus, setUser } = useSession();
  const navigate = useNavigate();

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: Schema) => {
    await login(data)
      .then(response => {
        toast.success('Logged in successfully');
        setUser(response.data);
        setStatus('authenticated');
        navigate(ROUTES.HOME);
      })
      .catch(error => toast.error(error.response.data.detail));
  };

  return (
    <>
      <div className='flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8'>
        <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
          <img className='mx-auto h-14 w-auto' src='/logo.svg' alt='Supervisord Monitor' />
          <h2 className='mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white'>Sign in to your account</h2>
        </div>

        <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6' action='#' method='POST'>
            <div>
              <label htmlFor='login' className='block text-sm font-medium leading-6 text-gray-900 dark:text-white'>
                Login
              </label>
              <div className='mt-2'>
                <input {...form.register('login')} required className='block w-full rounded-md border-0 bg-gray-200 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-800 dark:ring-gray-700 dark:placeholder:text-gray-400' />
              </div>
            </div>

            <div>
              <div className='flex items-center justify-between'>
                <label htmlFor='password' className='block text-sm font-medium leading-6 text-gray-900 dark:text-white'>
                  Password
                </label>
              </div>
              <div className='mt-2'>
                <input {...form.register('password')} type='password' autoComplete='current-password' required className='block w-full rounded-md border-0 bg-gray-200 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-800 dark:ring-gray-700 dark:placeholder:text-gray-400' />
              </div>
            </div>

            <div>
              <button type='submit' className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
