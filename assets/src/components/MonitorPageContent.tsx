import { useGetSupervisors, useInvalidateSupervisors } from '~/api/use-get-supervisors';
import { Server } from '~/components/Server';
import { PageLoader } from '~/components/PageLoader';
import { useSettings } from '~/hooks/useSettings';
import { toastManager } from '~/util/toastManager';
import { useEffect } from 'react';

export const MonitorPageContent = () => {
  const { data, isLoading } = useGetSupervisors();
  const { autoRefresh } = useSettings();
  const invalidateSupervisors = useInvalidateSupervisors();

  useEffect(() => {
    const interval = setInterval(() => {
      if (autoRefresh) {
        invalidateSupervisors().then(() => {
          toastManager.success('Data auto-refreshed');
        });
      }
    }, 10 * 1000);

    return () => clearInterval(interval);
  }, [data]);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className='grid grid-cols-1 gap-2 px-2 py-1 xl:grid-cols-2 2xl:grid-cols-3 4xl:grid-cols-4'>
      {data?.data?.map((item, index) => <Server key={index} item={item} />)}
    </div>
  );
};
