export const Status = ({ stateName }: { stateName: string }) => {
  switch (stateName) {
    case 'RUNNING':
      return (
        <span className='whitespace-nowrap rounded bg-green-100 px-2 text-center text-xs font-bold text-green-700'>
          {stateName}
        </span>
      );
    case 'STARTING':
      return (
        <span className='whitespace-nowrap rounded bg-blue-100 px-2 text-center text-xs font-bold text-blue-800'>
          {stateName}
        </span>
      );
    case 'FATAL':
      return (
        <span className='whitespace-nowrap rounded bg-red-100 px-2 text-center text-xs font-bold text-red-700'>
          {stateName}
        </span>
      );
    case 'STOPPED':
      return (
        <span className='whitespace-nowrap rounded bg-gray-800 px-2 text-center text-xs font-bold text-gray-50'>
          {stateName}
        </span>
      );
    default:
      return (
        <span className='whitespace-nowrap rounded bg-yellow-100 px-2 text-center text-xs font-bold text-yellow-800'>
          {stateName}
        </span>
      );
  }
};
