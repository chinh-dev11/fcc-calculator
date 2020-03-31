import React from 'react';
import { Container } from 'react-bootstrap';
import { evaluate } from 'mathjs';

import PadComponent from '../components/PadComponent';
import KeyComponent from '../components/KeyComponent';
import DisplayComponent from '../components/DisplayComponent';
import './CalculatorComponent.scss';

class CalculatorComponent extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = {
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
    // console.log(evaluate(this.state.expression));
    this.setState((prevState) => ({
      total: evaluate(prevState.expression),
    }));
  }

  operatorHandler(evt) {
    // console.log(evt.target.value);
    evt.persist();

    this.setState((prevState) => ({
      expression: prevState.expression.concat(evt.target.value),
    }));
  }

  numberHandler(evt) {
    // console.log(evt.target.value);
    // Warning: This synthetic event is reused for performance reasons. If you're seeing this, you're accessing the property `target` on a released/nullified synthetic event. This is set to null. If you must keep the original synthetic event around, use event.persist(). See https://fb.me/react-event-pooling for more information.
    // https://reactjs.org/docs/events.html#event-pooling
    evt.persist(); // the warning is caused by the setState async call below

    this.setState((prevState) => ({
      expression: prevState.expression.concat(evt.target.value),
    }));
  }

  clearHandler() {
    this.setState(this.initialState);
  }

  render() {
    const { expression, total } = { ...this.state };
    return (
      <Container fluid>
        <h1>Calculator</h1>
        <DisplayComponent expression={expression} total={total} />
        <PadComponent handler={this.numberHandler} />
        <KeyComponent value="+" handler={this.operatorHandler} />
        <KeyComponent value="-" handler={this.operatorHandler} />
        <KeyComponent value="*" handler={this.operatorHandler} />
        <KeyComponent value="/" handler={this.operatorHandler} />
        <KeyComponent value="=" handler={this.totalHandler} />
        <KeyComponent value="AC" handler={this.clearHandler} />
      </Container>
    );
  }
}

export default CalculatorComponent;
