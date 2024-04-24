import React, {useEffect} from "react";
import {useStore} from "../../main/context-provider";
import {observer} from "mobx-react-lite";
import {SupervisorBlock} from "../components/supervisor-block";
import {AllProcessInfoDTO} from "../../api-client/generated";

export const LandingPage = observer(() => {
    const {landingStore} = useStore();

    useEffect(() => {
        if (landingStore.actualData) {
            return;
        }

        landingStore.fetchData();
    })

    const blocks_fn = (controlData: AllProcessInfoDTO[]) => {
        return controlData.map((item, i) => {
            return <SupervisorBlock item={item} key={"supervisor_" + i}/>
        })
    }

    const loading_block = <div className="w-full flex justify-center items-center space-x-4 mb-4 rounded-lg px-6 py-5 text-base text-neutral-50 dark:bg-neutral-900" role="alert"><div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status"><span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span></div><span>Loading data... Please wait...</span></div>

    if (landingStore.actualData?.state !== 'fulfilled') {
        if (landingStore.prevData?.state === 'fulfilled') {
            const prev_blocks = blocks_fn(landingStore.prevData?.value);

            // return <div className="px-2 py-1 flex flex-wrap gap-2">{prev_blocks}</div>
            return <div className="px-2 py-1 grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-2">{prev_blocks}</div>
        }

        return loading_block
    }

    const blocks = blocks_fn(landingStore.actualData?.value);

    // return <div className="px-2 py-1 flex flex-wrap gap-2">{blocks}</div>
    return <div className="px-2 py-1 grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-2">{blocks}</div>
});
