import {ActButton, Type} from "./act-button";
import {RiPlayFill, RiStopFill} from "react-icons/ri";
import {TfiReload} from "react-icons/tfi";
import React from "react";
import {useStore} from "../../main/context-provider";
import {ProcessInfoDTO, WorkerDTO} from "../../api-client/generated";

export const ProcessGroupButtons = ({isAnyProcessRunning, server, group}: { isAnyProcessRunning: boolean, server: string, group: string }) => {
    const {landingStore} = useStore();

    const running_buttons = (
            <div className="flex space-x-1">
                <ActButton type={Type.Red} onClick={() => landingStore.stopProcessGroup(server, group)}><RiStopFill/></ActButton>
                <ActButton type={Type.Blue} onClick={() => landingStore.restartProcessGroup(server, group)}><TfiReload/></ActButton>
            </div>
    );

    const not_running_buttons = (
            <div className="flex space-x-1">
                <ActButton type={Type.Green} onClick={() => landingStore.startProcessGroup(server, group)}><RiPlayFill/></ActButton>
            </div>
    );

    return <div>{isAnyProcessRunning && running_buttons || not_running_buttons}</div>
}
