import React from 'react';

import KeyComponent from './KeyComponent';


const PadComponent = (props) => {
  const { handler } = { ...props };
  const keys = [7, 8, 9, 4, 5, 6, 1, 2, 3, 0, '.'];
  const pad = keys.map((key) => <KeyComponent value={key} handler={handler} key={key} />);
  return (
    <div>
      {pad}
    </div>
  );
};

export default PadComponent;
