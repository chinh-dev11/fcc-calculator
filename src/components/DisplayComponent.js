import React from 'react';

const DisplayComponent = (props) => {
  const { expression, total } = { ...props };
  return (
    <div>
      <div>{expression}</div>
      <div>{total}</div>
    </div>
  );
};

export default DisplayComponent;
