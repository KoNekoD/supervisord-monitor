import React, { useEffect } from 'react';
import { useStore } from '../../main/context-provider';
import { observer } from 'mobx-react-lite';
import { SupervisorBlocks } from '../components/supervisor-blocks';
import { LoadingBlock } from '../components/loading-block';

export const LandingPage = observer(() => {
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

    return <LoadingBlock />;
  }

  return <SupervisorBlocks blocks={landingStore.actualData?.value} />;
});
