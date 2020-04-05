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
      btnEqualDisabled: true,
      lastNum: '',
      lastEntry: '',
      display: '',
      expression: '',
      total: 0,
    };
    this.state = this.initialState;
    this.numberHandler = this.numberHandler.bind(this);
    this.operatorHandler = this.operatorHandler.bind(this);
    this.totalHandler = this.totalHandler.bind(this);
    this.clearHandler = this.clearHandler.bind(this);
    this.keypressHandler = this.keypressHandler.bind(this);
    this.$document = document;
  }

  componentDidMount() {
    this.$document.addEventListener('keydown', this.keypressHandler);
  }

  componentWillUnmount() {
    this.$document.removeEventListener('keydown', this.keypressHandler);
  }

  totalHandler(evt) {
    if (evt.persist) evt.persist();

    const formatNum = (num) => {
      try {
        const numDecimals = /\.\d{5}/.test(num) ? num.toFixed(4) : num; // round to 4 if more than 4 decimals
        const reDecimalZeroes = /\.0*$/;
        return reDecimalZeroes.test(numDecimals) ? numDecimals.replace(reDecimalZeroes, '') : numDecimals; // remove trailing zero decimals
      } catch (e) {
        console.log('format number error', e);
        return 0;
      }
    };

    this.setState((prevState) => {
      let {
        total, expression, lastNum, display, lastEntry,
      } = { ...prevState };
      const re = /[^\d]+$/;

      if (re.test(expression)) {
        total = formatNum(evaluate(expression.replace(re, '')));
        expression = total.toString();
        display = '';
        lastNum = total.toString();
      } else {
        total = formatNum(evaluate(expression));
      }

      lastEntry = evt.target.value;
      return {
        total, expression, lastNum, display, lastEntry,
      };
    });
  }

  operatorHandler(evt) {
    const currEntry = evt.target.value;
    // console.log(currEntry);
    if (evt.persist) evt.persist();

    this.setState((prevState) => {
      const { display } = { ...prevState };
      let {
        lastEntry, lastNum, expression,
      } = { ...prevState };
      const reOps = /[+\-*/]/g;
      const reMinus = /[-]/g;
      const reMultDiv = /[*/]/g;

      if (lastEntry === '=') {
        lastNum = lastNum.concat(currEntry);
      } else {
        switch (currEntry) {
          case '-':
            if (!reMinus.test(lastNum) || lastNum.match(reOps).length < 2) {
              lastNum = lastNum.concat(currEntry); // concat - if no - or ops < 2
            }
            break;
          case '+':
            if (currEntry !== lastEntry) {
              if (reMinus.test(lastNum)) { // -
                // -
                if (lastNum.match(reMinus).length < 2) { // *- /- +-
                  if (reMultDiv.test(lastNum)) { // *- /-
                    lastNum = lastNum.replace(reMinus, currEntry);
                  } else { // +-
                    lastNum = lastNum.substr(0, lastNum.length - 2)
                      .concat(lastNum.substr(lastNum.length - 1))
                      .concat(currEntry); // +- or -- becomes -+
                  }
                } else {
                // --
                  lastNum = lastNum.substr(0, lastNum.length - 2)
                    .concat(lastNum.substr(lastNum.length - 1))
                    .concat(currEntry); // +- or -- becomes -+
                }
              } else { // * /
                lastNum = reOps.test(lastNum)
                  ? lastNum.replace(reOps, currEntry)
                  : lastNum.concat(currEntry);
              }
            }
            break;
          default: // * and  /
            if (currEntry !== lastEntry) {
              if (reOps.test(lastNum)) { // +, -, + and -
                lastNum = lastNum.replace(reOps, '').concat(currEntry); // replace ops with empty and concat * or /
              } else { // no ops
                lastNum = lastNum.concat(currEntry); // concat * or /
              }
            }
        }
      }

      lastEntry = currEntry;
      expression = display.concat(lastNum);

      return {
        lastEntry, lastNum, expression,
      };
    });
  }

  numberHandler(evt) {
    const currEntry = evt.target.value;
    // console.log(currEntry);
    /* Warning: This synthetic event is reused for performance reasons. If you're seeing this, you're accessing the property `target` on a released/nullified synthetic event. This is set to null. If you must keep the original synthetic event around, use event.persist(). See https://fb.me/react-event-pooling for more information.
    https://reactjs.org/docs/events.html#event-pooling */
    if (evt.persist) evt.persist(); // the warning is caused by the setState async call below

    this.setState((prevState) => {
      let {
        lastEntry, lastNum, display, expression, btnEqualDisabled,
      } = { ...prevState };

      // reset for new entry
      if (/[+\-*/]/g.test(lastNum)) {
        display = display.concat(prevState.lastNum);
        lastNum = '';
        lastEntry = '';
      }

      switch (currEntry) {
        case '.':
          if (lastEntry !== '.') {
            lastEntry = '.';
            // forbid multiple decimals
            if (!/[.]/g.test(lastNum)) {
              lastNum = lastNum.concat('.');
            }
          }
          break;
        case '0':
          // allow zero if after decimal
          if (/[.]/g.test(lastNum)) {
            lastNum = lastNum.concat('0');
            lastEntry = '0';
          } else if (lastEntry !== '0') {
          // allow zero if first entry before decimal
            lastNum = prevState.lastNum.concat('0');
            lastEntry = '0';
          }
          break;
        default:
          lastNum = lastNum.concat(currEntry);
          lastEntry = currEntry;
      }

      expression = display.concat(lastNum);
      btnEqualDisabled = false;

      return {
        lastEntry, lastNum, display, expression, btnEqualDisabled,
      };
    });
  }

  clearHandler() {
    this.setState(this.initialState);
  }

  keypressHandler(evt) {
    const reNum = /[.\d]/;
    const reOps = /[+\-*/]/;
    const evtCustom = evt;

    evtCustom.target.value = evt.key;

    if (reNum.test(evt.key)) {
      this.numberHandler(evt);
    } else if (reOps.test(evt.key)) {
      this.operatorHandler(evt);
    } else if (evt.key === 'Enter') {
      evtCustom.target.value = '=';
      this.totalHandler(evt);
    } else if (evt.key === 'Escape') {
      evtCustom.target.value = 'AC';
      this.clearHandler(evt);
    }
  }

  render() {
    const {
      expression, total, btnEqualDisabled,
    } = { ...this.state };
    const btns = {
      row1: [
        {
          type: 'AC',
          label: 'AC',
          handler: this.clearHandler,
          id: 'clear',
        },
        {
          type: '/',
          label: '/',
          handler: this.operatorHandler,
          id: 'divide',
        },
        {
          type: '*',
          label: 'x',
          handler: this.operatorHandler,
          id: 'multiply',
        },
      ],
      row2: [
        {
          type: '7',
          label: '7',
          handler: this.numberHandler,
          id: 'seven',
        },
        {
          type: '8',
          label: '8',
          handler: this.numberHandler,
          id: 'eight',
        },
        {
          type: '9',
          label: '9',
          handler: this.numberHandler,
          id: 'nine',
        },
        {
          type: '-',
          label: '-',
          handler: this.operatorHandler,
          id: 'subtract',
        },
      ],
      row3: [
        {
          type: '4',
          label: '4',
          handler: this.numberHandler,
          id: 'four',
        },
        {
          type: '5',
          label: '5',
          handler: this.numberHandler,
          id: 'five',
        },
        {
          type: '6',
          label: '6',
          handler: this.numberHandler,
          id: 'six',
        },
        {
          type: '+',
          label: '+',
          handler: this.operatorHandler,
          id: 'add',
        },
      ],
      row4: [
        {
          type: '1',
          label: '1',
          handler: this.numberHandler,
          id: 'one',
        },
        {
          type: '2',
          label: '2',
          handler: this.numberHandler,
          id: 'two',
        },
        {
          type: '3',
          label: '3',
          handler: this.numberHandler,
          id: 'three',
        },
      ],
      row5: [
        {
          type: '0',
          label: '0',
          handler: this.numberHandler,
          id: 'zero',
        },
        {
          type: '.',
          label: '.',
          handler: this.numberHandler,
          id: 'decimal',
        },
      ],
      col4: [
        {
          type: '=',
          label: '=',
          handler: this.totalHandler,
          status: btnEqualDisabled,
          id: 'equals',
        },
      ],
    };
    const btnsRow1 = btns.row1.map((btn) => <ButtonComponent key={btn.type} type={btn.type} label={btn.label} handler={btn.handler} id={btn.id} />);
    const btnsRow2 = btns.row2.map((btn) => <ButtonComponent key={btn.type} type={btn.type} label={btn.label} handler={btn.handler} id={btn.id} />);
    const btnsRow3 = btns.row3.map((btn) => <ButtonComponent key={btn.type} type={btn.type} label={btn.label} handler={btn.handler} id={btn.id} />);
    const btnsRow4 = btns.row4.map((btn) => <ButtonComponent key={btn.type} type={btn.type} label={btn.label} handler={btn.handler} id={btn.id} />);
    const btnsCol4 = btns.col4.map((btn) => <ButtonComponent key={btn.type} type={btn.type} label={btn.label} handler={btn.handler} status={btn.status} id={btn.id} />);
    const btnsRow5 = btns.row5.map((btn) => <ButtonComponent key={btn.type} type={btn.type} label={btn.label} handler={btn.handler} id={btn.id} />);

    return (
      <Container fluid className="calculator-container">
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
