import React from 'react';

type Props = {
  message: string;
};

export const ValidationMessage = ({ message }: Props) => {
  return (
    <div className="invalid-feedback m-0" style={{ display: message ? 'block' : 'none' }}>
      {message}
    </div>
  );
};
