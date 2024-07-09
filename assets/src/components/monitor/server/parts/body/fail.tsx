import { FaSkull } from 'react-icons/fa';

export const Fail = ({ item }: { item: ApiSupervisor }) => {
  return (
    <div className='inline-flex h-full w-full items-center rounded-b-xl border-b-2 border-l-2 border-r-2 border-gray-200 bg-red-100 px-6 py-5 text-red-700 dark:bg-transparent dark:text-red-600'>
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
