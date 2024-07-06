import { RiFileShredLine, RiPlayFill, RiStopFill } from 'react-icons/ri';
import { TfiReload } from 'react-icons/tfi';

interface ButtonsProps {
  clearAllProcessLog: () => void;
  startAll: () => void;
  stopAll: () => void;
  restartAll: () => void;
}

export const Buttons = ({ clearAllProcessLog, stopAll, startAll, restartAll }: ButtonsProps) => (
  <div className='flex justify-end'>
    <div className='flex items-center space-x-1 text-white'>
      <button className='rounded bg-orange-500 p-2' onClick={clearAllProcessLog}>
        <RiFileShredLine />
      </button>
      <button className='rounded bg-green-500 p-2' onClick={startAll}>
        <RiPlayFill />
      </button>
      <button className='rounded bg-red-500 p-2' onClick={stopAll}>
        <RiStopFill />
      </button>
      <button className='rounded bg-blue-500 p-2' onClick={restartAll}>
        <TfiReload />
      </button>
    </div>
  </div>
);
