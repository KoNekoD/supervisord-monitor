import { Server } from './server/server';

export const Monitor = ({ servers }: { servers: ApiSupervisor[] }): JSX.Element => {
  return (
    <div className="grid grid-cols-1 gap-2 px-2 py-1 xl:grid-cols-2 2xl:grid-cols-3 4xl:grid-cols-4">
      {servers.map((item, index) => (
        <Server item={item} key={index} />
      ))}
    </div>
  );
};
