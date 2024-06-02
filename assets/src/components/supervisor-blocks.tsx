import { SupervisorBlock } from './supervisor-block';

export const SupervisorBlocks = ({ blocks }: { blocks: ApiSupervisor[] }): JSX.Element => {
  return (
    <div className='grid grid-cols-1 gap-2 px-2 py-1 xl:grid-cols-2 2xl:grid-cols-3'>
      {blocks.map((item, i) => {
        return <SupervisorBlock item={item} key={'supervisor_' + i} />
      })}
    </div>
  );
};
