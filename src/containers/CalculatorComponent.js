import React from 'react';
import {
  Container, Col, Row,
} from 'react-bootstrap';
import { evaluate } from 'mathjs';

import ButtonComponent from '../components/ButtonComponent';
import DisplayComponent from '../components/DisplayComponent';
import './CalculatorComponent.scss';

class CalculatorComponent extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = {
      lastKeyStroke: '',
      display: '',
      expression: '',
      total: 0,
    };
    this.state = this.initialState;
    this.numberHandler = this.numberHandler.bind(this);
    this.operatorHandler = this.operatorHandler.bind(this);
    this.totalHandler = this.totalHandler.bind(this);
    this.clearHandler = this.clearHandler.bind(this);
  }

  totalHandler() {
    const reExpression = /([\d.+\-*/]*)([\d.])/g;

    this.setState((prevState) => {
      const expressionValidated = prevState.expression.match(reExpression);
      return {
        total: evaluate(expressionValidated[0]),
        expression: expressionValidated[0],
        lastKeyStroke: 'total',
      };
    });
  }

  operatorHandler(evt) {
    // console.log(evt.target.value);
    evt.persist();
    const reOp = /([+\-*/]$)|([+\-*/][-?]$)/;
    const opValidated = evt.target.value.match(reOp);

    this.setState((prevState) => ({
      expression: prevState.expression.concat(opValidated[0]),
      lastKeyStroke: '',
    }));
  }

  numberHandler(evt) {
    // console.log(evt.target.value);
    // Warning: This synthetic event is reused for performance reasons. If you're seeing this, you're accessing the property `target` on a released/nullified synthetic event. This is set to null. If you must keep the original synthetic event around, use event.persist(). See https://fb.me/react-event-pooling for more information.
    // https://reactjs.org/docs/events.html#event-pooling
    evt.persist(); // the warning is caused by the setState async call below

    const reNum = /([^0*])(\d*)(.?)(\d*)/;
    const numValidated = evt.target.value.match(reNum);

    this.setState((prevState) => ({
      expression: prevState.lastKeyStroke === 'total' ? numValidated[0] : prevState.expression.concat(numValidated[0]),
      lastKeyStroke: '',
    }));
  }

  clearHandler() {
    this.setState(this.initialState);
  }

  render() {
    const { expression, total } = { ...this.state };
    const btns = {
      row1: [
        {
          type: 'AC',
          label: 'AC',
          handler: this.clearHandler,
        },
        {
          type: '/',
          label: '/',
          handler: this.operatorHandler,
        },
        {
          type: '*',
          label: 'x',
          handler: this.operatorHandler,
        },
      ],
      row2: [
        {
          type: '7',
          label: '7',
          handler: this.numberHandler,
        },
        {
          type: '8',
          label: '8',
          handler: this.numberHandler,
        },
        {
          type: '9',
          label: '9',
          handler: this.numberHandler,
        },
        {
          type: '-',
          label: '-',
          handler: this.operatorHandler,
        },
      ],
      row3: [
        {
          type: '4',
          label: '4',
          handler: this.numberHandler,
        },
        {
          type: '5',
          label: '5',
          handler: this.numberHandler,
        },
        {
          type: '6',
          label: '6',
          handler: this.numberHandler,
        },
        {
          type: '+',
          label: '+',
          handler: this.operatorHandler,
        },
      ],
      row4: [
        {
          type: '1',
          label: '1',
          handler: this.numberHandler,
        },
        {
          type: '2',
          label: '2',
          handler: this.numberHandler,
        },
        {
          type: '3',
          label: '3',
          handler: this.numberHandler,
        },
      ],
      row5: [
        {
          type: '0',
          label: '0',
          handler: this.numberHandler,
        },
        {
          type: '.',
          label: '.',
          handler: this.numberHandler,
        },
      ],
      col4: [
        {
          type: '=',
          label: '=',
          handler: this.totalHandler,
        },
      ],
    };
    const btnsRow1 = btns.row1.map((btn) => <ButtonComponent key={btn.type} type={btn.type} label={btn.label} handler={btn.handler} />);
    const btnsRow2 = btns.row2.map((btn) => <ButtonComponent key={btn.type} type={btn.type} label={btn.label} handler={btn.handler} />);
    const btnsRow3 = btns.row3.map((btn) => <ButtonComponent key={btn.type} type={btn.type} label={btn.label} handler={btn.handler} />);
    const btnsRow4 = btns.row4.map((btn) => <ButtonComponent key={btn.type} type={btn.type} label={btn.label} handler={btn.handler} />);
    const btnsCol4 = btns.col4.map((btn) => <ButtonComponent key={btn.type} type={btn.type} label={btn.label} handler={btn.handler} />);
    const btnsRow5 = btns.row5.map((btn) => <ButtonComponent key={btn.type} type={btn.type} label={btn.label} handler={btn.handler} />);

    return (
      <Container fluid>
        <Row className="mx-auto my-4 p-4 row rounded" style={{ width: '276px', backgroundColor: 'black' }}>
          <DisplayComponent expression={expression} total={total} />
          <div>{btnsRow1}</div>
          <div>{btnsRow2}</div>
          <div>{btnsRow3}</div>
          <Col className="p-0">
            {btnsRow4}
            {btnsRow5}
          </Col>
          <div>{btnsCol4}</div>
        </Row>
      </Container>
    );
  }
}

export default CalculatorComponent;
