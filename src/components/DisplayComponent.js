import React from 'react';

const DisplayComponent = (props) => {
  const { expression, total } = { ...props };

  const totalDisplay = /[.]/g.test(total) ? Number.parseFloat(total).toFixed(4) : total;

  const reNumOp = /((-?)([\d]*)(.?)([+\-*/]?))/g;
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
    <div className="text-right text-white" style={{ width: '100%' }}>
      <div className="p-2 bg-dark mb-1 rounded" style={{ height: '30px' }}>{expressionDisplay}</div>
      <h2>{totalDisplay}</h2>
    </div>
  );
};

export default DisplayComponent;
