import React from 'react';

const DisplayComponent = (props) => {
  const { expression, total } = { ...props };
  const reNumOp = /((-?)([\d]*)([+\-*/]?))/g;
  const expressionDisplay = expression.match(reNumOp).reduce((acc, curr) => {
    if (curr) {
      const reOp = /[+\-*/]$/g;
      if (reOp.test(curr)) {
        return acc.concat(curr.substr(0, curr.length - 1), ' ', curr.substr(curr.length - 1), ' ');
      }
      return acc.concat(curr);
    }
    return acc;
  }, []);

  return (
    <div className="text-right" style={{ width: '100%' }}>
      <div style={{ height: '16px' }}>{expressionDisplay}</div>
      <h2>{total}</h2>
    </div>
  );
};

export default DisplayComponent;
