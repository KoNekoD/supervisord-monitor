import React from "react";
import {RiAddFill, RiCloseFill} from "react-icons/ri";
import {ActButton, Type} from "./act-button";

export const AddProgram = () => {

    const [showModal, setShowModal] = React.useState(false);
    return (
            <>
                <ActButton type={Type.Green} onClick={() => setShowModal(true)}><RiAddFill/></ActButton>
                {showModal ? (
                        <>
                            <div className="fixed left-0 top-0 z-[1055] mx-8 my-4 h-full w-full overflow-y-auto overflow-x-hidden outline-none p-10">
                                <div className="pointer-events-none relative h-[calc(100%-1rem)] w-full">
                                    <div className="pointer-events-auto relative flex max-h-[100%] w-full flex-col overflow-hidden rounded-md border-none bg-white bg-clip-padding text-current shadow-lg outline-none dark:bg-neutral-600">
                                        <div className="flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50">
                                            <h5 className="text-xl font-medium leading-normal text-neutral-800 dark:text-neutral-200">Create process</h5>
                                            <button type="button" className="h-10 box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none" onClick={() => setShowModal(false)}>
                                                <RiCloseFill/>
                                            </button>
                                        </div>

                                        <div className="relative overflow-y-auto p-4">add form here</div>

                                        <div className="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50">
                                            <button type="button" onClick={() => setShowModal(false)}
                                                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none ease-linear transition-all duration-150"
                                            >Close
                                            </button>
                                            <button type="button"
                                                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                                                    onClick={() => {
                                                        // landingStore.createProcess(...);
                                                        setShowModal(false)
                                                    }}
                                            >Create
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                ) : null}
            </>
    );
}
