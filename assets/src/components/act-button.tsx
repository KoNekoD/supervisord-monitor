import React from 'react';

export enum Type {
  Red = 'red',
  Orange = 'orange',
  Green = 'green',
  Blue = 'blue',
}

export const ActButton = ({ children, onClick, type }: { children: React.ReactNode; onClick: () => void; type: Type }) => {
  const colors = {
    [Type.Red]: 'bg-red-500',
    [Type.Orange]: 'bg-orange-500',
    [Type.Green]: 'bg-green-500',
    [Type.Blue]: 'bg-blue-500',
  };

  const className = `p-2 text-white rounded ${colors[type] || 'bg-gray-500'}`;

  return <button type='button' className={className} onClick={() => onClick()}>{children}</button>;
};
