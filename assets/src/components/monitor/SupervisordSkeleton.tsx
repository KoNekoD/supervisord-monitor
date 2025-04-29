export const SupervisordSkeleton = () => {
  return (
    <div className="animate-pulse border-2 rounded-xl px-2 py-1 border-gray-200 rounded-lgp-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-4 w-48 bg-gray-200 rounded"></div>
        <div className='flex items-center space-x-1'>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
          <div className="flex space-x-1 ml-auto">
            <div className="h-6 w-6 bg-gray-200 rounded"></div>
            <div className="h-6 w-6 bg-gray-200 rounded"></div>
            <div className="h-6 w-6 bg-gray-200 rounded"></div>
            <div className="h-6 w-6 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
          <div className="flex space-x-1">
            <div className="h-6 w-6 bg-gray-200 rounded"></div>
            <div className="h-6 w-6 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
          <div className="flex space-x-1">
            <div className="h-6 w-6 bg-gray-200 rounded"></div>
            <div className="h-6 w-6 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
          <div className="flex space-x-1">
            <div className="h-6 w-6 bg-gray-200 rounded"></div>
            <div className="h-6 w-6 bg-gray-200 rounded"></div>
            <div className="h-6 w-6 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="h-4 w-2/5 bg-gray-200 rounded"></div>
          <div className="flex space-x-1">
            <div className="h-6 w-6 bg-gray-200 rounded"></div>
            <div className="h-6 w-6 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="h-4 w-3/5 bg-gray-200 rounded"></div>
          <div className="flex space-x-1">
            <div className="h-6 w-6 bg-gray-200 rounded"></div>
            <div className="h-6 w-6 bg-gray-200 rounded"></div>
            <div className="h-6 w-6 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
