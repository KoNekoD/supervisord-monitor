import React from "react";
import {SupervisorBlock} from "./supervisor-block";

export const SupervisorBlocks = ({blocks}: { blocks: ApiSupervisor[] }): JSX.Element => {
    return (
            <div className="px-2 py-1 grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-2">
                {blocks.map((item, i) => <SupervisorBlock item={item} key={"supervisor_" + i}/>)}
            </div>
    )
}
