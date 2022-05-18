import React from 'react';
import propsTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import glibphonenumber from 'google-libphonenumber';
import Config from 'react-native-config';

import { PrefixView, StyledInput } from './styled';
import TextInput from '../TextInput';
import codesList from './codes.json';


const DEFAULT_COUNTRY_CODE = Config.DEFAULT_COUNTRY_CODE || 'IL';


const phoneUtil = glibphonenumber.PhoneNumberUtil.getInstance();
const PNF = require('google-libphonenumber').PhoneNumberFormat;

const styles = StyleSheet.create({
  mainView: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0)',
  },
  inputView: {
    marginBottom: 24,
  },
});

// Returns a phoneUtil based on https://www.npmjs.com/package/google-libphonenumber

export default class PhoneNumberInput extends React.Component {
  constructor() {
    super();
    this.state = {
      // selectedCode: MccMnc.defaultCountryCode,
      selectedCode: DEFAULT_COUNTRY_CODE,
      number: '',
    };
  }

  onChangeCountry = (selectedCode) => {
    this.setState({ selectedCode }, () => {
      this.updatePhoneNumber();
    });
  }

  onInput = (number) => {
    this.setState({ number }, () => {
      this.updatePhoneNumber();
    });
  }

  updatePhoneNumber = () => {
    let response;
    try {
      const phoneNumber = phoneUtil.parseAndKeepRawInput(
        this.state.number,
        this.state.selectedCode,
      );

      response = {
        valid: phoneUtil.isValidNumber(phoneNumber),
        phoneNumber,
        international: phoneUtil.format(phoneNumber, PNF.E164).replace('+', ''),
      };
    } catch (error) {
      response = {
        valid: false,
        phoneNumber: '',
        international: '',
        error,
      };
    }

    this.props.onNumberInput(response);
  }

  async isoCode() {
    // const mobileIso = await MccMnc.getInputIsoCode();
    this.onChangeCountry(DEFAULT_COUNTRY_CODE);
  }

  componentDidMount() {
    this.isoCode();
  }


  render() {
    return (
      <View style={styles.mainView}>
        <PrefixView>
          <RNPickerSelect
            items={codesList.map(country => ({ label: `${country.name}  ${country.dialCode}`, value: country.code }))}
            onValueChange={this.onChangeCountry}
            style={{
              // inputIOS: [textInputStyle.input,
              // textInputStyle.inputFont],
              color: '#333333',
              height: 40,
              underline: { borderTopWidth: 0 },
            }}
            value={this.state.selectedCode}
            hideIcon
          />
        </PrefixView>
        <StyledInput
          testID="phoneInput"
          onChangeText={this.onInput}
          keyboardType="numeric"
          placeholder={this.props.placeholder}
          returnKeyType="done"
        />
      </View>
    );
  }
}

PhoneNumberInput.defaultProps = {
  onNumberInput: () => null,
  defaultCountryCode: 'IL',
  placeholder: 'Phone Number',
};

PhoneNumberInput.propTypes = {
  onNumberInput: propsTypes.func,
  defaultCountryCode: propsTypes.string,
  placeholder: propsTypes.string,
};
