import React from 'react';
import { Container } from 'react-bootstrap';

import PadComponent from '../components/PadComponent';
import './CalculatorComponent.scss';

const CalculatorComponent = () => {
  const clickHandler = (evt) => {
    console.log(evt.target.value);
  };
  return (
    <Container fluid>
      <h1>Calculator</h1>
      <PadComponent handler={clickHandler} />
    </Container>
  );
};

export default CalculatorComponent;
