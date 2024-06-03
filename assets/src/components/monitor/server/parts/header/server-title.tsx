export const ServerTitle = ({ item }: { item: ApiSupervisor }) => {
  return (
    <a href={item.server.webOpenUrl} className='pr-2 text-blue-400'>
      {item.server.name}
    </a>
  );
};
