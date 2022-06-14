import React, {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import styled from 'styled-components';
import BottomSheetInput from '../../../../Components/TextInput/BottomSheetInput';
import i18n from '../../../../I18n';

const InputContainer = styled.View`
    width: 100%;
  `;

const SearchBar = props => (
  <InputContainer>
    <BottomSheetInput
      placeholder={i18n.t('addressView.whereTo')}
      onChangeText={() => null}
      value=""
      fullBorder
      placeholderTextColor="#929395"
      {...props}
    />
  </InputContainer>
);

export default SearchBar;
