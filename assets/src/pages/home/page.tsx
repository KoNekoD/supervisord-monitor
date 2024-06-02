import { useEffect } from 'react';
import { useStore } from '~/main/context-provider';
import { observer } from 'mobx-react-lite';
import { SupervisorBlocks } from '~/components/supervisor-blocks';

export const MainPage = observer(() => {
  const { landingStore } = useStore();

  useEffect(() => {
    if (landingStore.actualData) {
      return;
    }

    landingStore.fetchData();
  });

  if (landingStore.actualData?.state !== 'fulfilled') {
    if (landingStore.prevData?.state === 'fulfilled') {
      return <SupervisorBlocks blocks={landingStore.prevData?.value} />;
    }

    return <div
      className='mb-4 flex w-full items-center justify-center space-x-4 rounded-lg px-6 py-5 text-base text-neutral-50 dark:bg-neutral-900'>
      <div
        className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]'>
        <span
          className='!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]'>
          Loading...
        </span>
      </div>
      <span>Loading data... Please wait...</span>
    </div>;
  }

  return <SupervisorBlocks blocks={landingStore.actualData?.value}/>;
});
