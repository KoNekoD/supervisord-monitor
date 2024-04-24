import React from "react";

export enum Type {
    Red = 'red',
    Orange = 'orange',
    Green = 'green',
    Blue = 'blue',
}

export const ActButton = ({children, onClick, type}: { children: React.ReactNode, onClick: () => void, type: Type }) => {
    let className = 'p-2 text-white rounded'

    if (type === Type.Red) {
        className += ' bg-red-500'
    } else if (type === Type.Orange) {
        className += ' bg-orange-500'
    } else if (type === Type.Green) {
        className += ' bg-green-500'
    } else if (type === Type.Blue) {
        className += ' bg-blue-500'
    }

    return <button type="button" className={className} onClick={() => onClick()}>{children}</button>
}
