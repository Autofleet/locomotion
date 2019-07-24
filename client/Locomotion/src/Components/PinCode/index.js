import React from 'react';
import propsTypes from 'prop-types';
import { Container, Box, DigitInput } from './styled';

export default class PinCode extends React.Component {
  static CalcRefName = place => `inputRef-${place}`;

  constructor() {
    super();
    this.state = {
      digits: [...Array(4)].map((item, i) => ({ digit: i, value: null })),
      focusInputNumber: null,
    };
  }

  onFocus = place => () => {
    this.setState({ focusInputNumber: place });
  }

  onBlur = () => {
    this.setState({ focusInputNumber: null });
  }

  // Handle backspace
  onKeyPress = (e) => {
    let cursorPlace;
    const digits = [...this.state.digits];

    if (e.nativeEvent.key === 'Backspace') {
      if (digits[this.state.focusInputNumber].value === null) {
        cursorPlace = Math.max(this.state.focusInputNumber - 1, 0);
      } else {
        cursorPlace = this.state.focusInputNumber;
      }

      digits[cursorPlace].value = null;

      this.setState({ digits }, () => {
        this.triggerOnChangeProp(() => this.jumpTo(cursorPlace));
      });
    }
  }

  // Handle typing on integer
  onChange = place => (text) => {
    console.log('GOT DIGIT', text, new RegExp(/^\d+$/).test(text));
    if (!new RegExp(/^\d+$/).test(text)) {
      return;
    }

    const digits = [...this.state.digits];
    digits[place].value = text;

    this.setState({ digits }, () => {
      this.triggerOnChangeProp((() => {
        const nextPlace = text && text.length > 0 ? place + 1 : place - 1;
        this.jumpTo(nextPlace);
      }));
    });
  }

  triggerOnChangeProp = async (cb) => {
    await this.props.onChange(this.state.digits.map(digit => digit.value).join(''));
    return cb();
  }

  // Jump to next position
  jumpTo(nextPlace) {
    if (this[PinCode.CalcRefName(nextPlace)]) {
      this[PinCode.CalcRefName(nextPlace)].focus();
    } else if (this.state.focusInputNumber) {
      this[PinCode.CalcRefName(this.state.focusInputNumber)].blur();
      this.props.onLastDigit();
    }
  }

  render() {
    return (
      <Container>
        {this.state.digits.map((item, i) => (
          <Box
            key={`${item.digit}`}
          >
            <DigitInput
              autoFocus={i === 0}
              ref={(input) => { this[PinCode.CalcRefName(i)] = input; }}
              onBlur={this.onBlur}
              onFocus={this.onFocus(i)}
              onChangeText={this.onChange(i)}
              onKeyPress={this.onKeyPress}
              controlled
              value={this.state.digits[i].value}
              underlineColorAndroid="transparent"
              keyboardType="numeric"
              maxLength={1}
            />
          </Box>
        ))}
      </Container>
    );
  }
}

PinCode.defaultProps = {
  onLastDigit: () => null,
  onChange: () => null,
};

PinCode.propTypes = {
  onLastDigit: propsTypes.func,
  onChange: propsTypes.func,
};
