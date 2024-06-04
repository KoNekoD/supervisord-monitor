export const Status = ({ stateName }: { stateName: string }) => {
  switch (stateName) {
    case 'RUNNING':
      return <span className='inline-block whitespace-nowrap rounded-[0.27rem] bg-green-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-green-700'>{stateName}</span>;
    case 'STARTING':
      return <span className='inline-block whitespace-nowrap rounded-[0.27rem] bg-blue-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-blue-800'>{stateName}</span>;
    case 'FATAL':
      return <span className='inline-block whitespace-nowrap rounded-[0.27rem] bg-red-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-red-700'>{stateName}</span>;
    case 'STOPPED':
      return <span className='inline-block whitespace-nowrap rounded-[0.27rem] bg-gray-800 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-gray-50 dark:bg-gray-900'>{stateName}</span>;
    default:
      return <span className='inline-block whitespace-nowrap rounded-[0.27rem] bg-yellow-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-yellow-800'>{stateName}</span>;
  }
};
