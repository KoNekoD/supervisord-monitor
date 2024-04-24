import {ActButton, Type} from "./act-button";
import {RiPlayFill, RiStopFill} from "react-icons/ri";
import {TfiReload} from "react-icons/tfi";
import React from "react";
import {useStore} from "../../main/context-provider";
import {ProcessInfoDTO, WorkerDTO} from "../../api-client/generated";

export const ProcessButtons = ({process, worker}: { process: ProcessInfoDTO, worker: WorkerDTO }) => {
    const {landingStore} = useStore();

    const running_buttons = (
            <div className="flex space-x-1">
                <ActButton type={Type.Red} onClick={() => landingStore.stopProcess(worker)}><RiStopFill/></ActButton>
                <ActButton type={Type.Blue} onClick={() => landingStore.restartProcess(worker)}><TfiReload/></ActButton>
            </div>
    );

    const not_running_buttons = (
            <div className="flex space-x-1">
                <ActButton type={Type.Green} onClick={() => landingStore.startProcess(worker)}><RiPlayFill/></ActButton>
            </div>
    );

    return (
            <div>
                {process.stateName === 'RUNNING' && running_buttons}
                {['STOPPED', 'EXITED', 'FATAL'].includes(process.stateName) && not_running_buttons}
            </div>
    );
}
