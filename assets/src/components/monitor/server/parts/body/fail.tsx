import { FaSkull } from 'react-icons/fa';

export const Fail = ({item}: { item: ApiSupervisor }) => {
  return (
    <div className='inline-flex h-full w-full items-center bg-danger-100 px-6 py-5 text-danger-700 dark:bg-transparent dark:text-red-600'>
      <span className='mr-2'>
        <FaSkull />
      </span>
      <div className='flex flex-col'>
        <span>Server is not available!</span>
        <span>Reason: {item.failError ?? 'Unknown error'}</span>
      </div>
    </div>
  );
};
