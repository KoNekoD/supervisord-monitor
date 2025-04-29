import { SupervisordSkeleton } from '~/components/monitor/SupervisordSkeleton';

export const PageLoader = () => {
  return (
    <div className='grid grid-cols-1 gap-2 px-2 py-1 xl:grid-cols-2 2xl:grid-cols-3 4xl:grid-cols-4'>
      {Array.from({ length: 7 }).map((_, index) => (
        <SupervisordSkeleton key={index} />
      ))}
    </div>
  );
};
