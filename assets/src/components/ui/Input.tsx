import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  text: string;
}

export const Input = ({ text, ...props }: InputProps) => {
  return (
    <div>
      <label htmlFor={props.id} className='mb-2 block text-sm font-medium text-gray-900 dark:text-white'>
        {text}
      </label>
      <input
        type='text'
        className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'
        {...props}
      />
    </div>
  );
};
