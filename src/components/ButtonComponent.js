import React from 'react';
import { Button } from 'react-bootstrap';

const ButtonComponent = (props) => {
  const {
    type, label, handler, status, id,
  } = { ...props };
  let btnWidth = '60px';
  let btnHeight = '50px';
  let btnVariant = 'secondary';

  if (/[\d|.]/.test(label)) {
    btnVariant = 'dark';
    if (label === '0') btnWidth = '120px';
  }

  if (label === 'AC') {
    btnWidth = '120px';
    btnVariant = 'danger';
  }

  if (label === '=') {
    btnHeight = '100px';
    btnVariant = 'warning';
  }
  const cssInline = {
    width: btnWidth,
    height: btnHeight,
  };

  return (
    <Button value={type} onClick={handler} disabled={status} style={cssInline} id={id} className="rounded border" variant={btnVariant}>{label}</Button>
  );
};

export default ButtonComponent;
