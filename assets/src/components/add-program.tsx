import React from 'react';
import { RiAddFill, RiCloseFill } from 'react-icons/ri';
import { ActButton, Type } from './act-button';

export const AddProgram = () => {
  const [showModal, setShowModal] = React.useState(false);
  return (
    <>
      <ActButton type={Type.Green} onClick={() => setShowModal(true)}>
        <RiAddFill />
      </ActButton>
      {showModal ? (
        <>
          <div className='fixed left-0 top-0 z-[1055] mx-8 my-4 h-full w-full overflow-y-auto overflow-x-hidden p-10 outline-none'>
            <div className='pointer-events-none relative h-[calc(100%-1rem)] w-full'>
              <div className='pointer-events-auto relative flex max-h-[100%] w-full flex-col overflow-hidden rounded-md border-none bg-white bg-clip-padding text-current shadow-lg outline-none dark:bg-neutral-600'>
                <div className='flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50'>
                  <h5 className='text-xl font-medium leading-normal text-neutral-800 dark:text-neutral-200'>Create process</h5>
                  <button
                    type='button'
                    className='box-content h-10 rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none'
                    onClick={() => setShowModal(false)}
                  >
                    <RiCloseFill />
                  </button>
                </div>

                <div className='relative overflow-y-auto p-4'>add form here</div>

                <div className='flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50'>
                  <button
                    type='button'
                    onClick={() => setShowModal(false)}
                    className='background-transparent px-6 py-2 text-sm font-bold uppercase text-red-500 outline-none transition-all duration-150 ease-linear focus:outline-none'
                  >
                    Close
                  </button>
                  <button
                    type='button'
                    className='rounded bg-emerald-500 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-emerald-600'
                    onClick={() => {
                      // landingStore.createProcess(...);
                      setShowModal(false);
                    }}
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};
