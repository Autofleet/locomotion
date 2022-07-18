
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components';
import { useBottomSheet } from '@gorhom/bottom-sheet';
import * as yup from 'yup';
import i18n from '../../../I18n';
import TextInputWithIcon from '../../../Components/TextInputWithIcon';
import RoundedButton from '../../../Components/RoundedButton';

const Container = styled.View`
  flex-direction: column;
  padding: 0px 30px;
`;

const Title = styled.Text`
  font-size: 20px;
  color: #333333;
  font-weight: 600;
  margin-bottom: 8px;
`;

const SubTitle = styled.Text`
  font-size: 16px;
  color: #000000;
  opacity: 0.7;
`;

const DetailsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

const Column = styled.View`
  flex: 1;
  flex-direction: column;
`;

const ErrorContainer = styled.View`
  display: flex;
  align-items: center;
  flex: 1;
  margin-top: 12px;
  height: 20px;
`;

const ErrorText = styled.Text`
  font-size: 14px;
  color: #f35657;

`;

const ButtonsContainer = styled.View`
  flex: 1;
  padding-right: 10px;
`;

const numberSchema = yup.number().required().positive().transform(value => value);
const isValidNumber = async (number) => {
  try {
    const newNumber = await numberSchema.validate(number);
    return newNumber;
  } catch (e) {
    return false;
  }
};

const Tips = ({
  customAmount,
  onSubmit,
  tipSuffix,
  isExpanded,
}) => {
  const [customTip, setCustomTip] = useState(customAmount);
  const [isValid, setIsValid] = useState(null);
  const { expand, forceClose } = useBottomSheet();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isExpanded) {
      inputRef.current.focus();
    } else {
      inputRef.current.blur();
    }
  }, [isExpanded]);

  const submitValue = async () => {
    const validatedNumber = await isValidNumber(customTip);
    if (validatedNumber) {
      onSubmit(validatedNumber);
      forceClose();
    }
  };
  const onCancel = () => {
    forceClose();
  };

  const validateTip = async (tip) => {
    if (tip === '' || !tip) {
      setIsValid(null);
      return null;
    }
    const validatedNumber = await isValidNumber(tip);

    if (!validatedNumber) {
      setIsValid(false);
      return false;
    }

    if (validatedNumber < 0) {
      setIsValid(false);
      return false;
    }

    setIsValid(true);
    return true;
  };

  useEffect(() => {
    validateTip(customTip);
  }, [customTip]);

  useEffect(() => {
    inputRef.current.clear();
  }, [customAmount]);

  return (
    <Container>
      <DetailsContainer>
        <Column>
          <Title>
            {i18n.t('postRide.tip.customTip.title')}
          </Title>
          <SubTitle>
            {i18n.t('postRide.tip.customTip.subTitle')}
          </SubTitle>
        </Column>
      </DetailsContainer>
      <DetailsContainer style={{ marginTop: 25 }}>
        <TextInputWithIcon
          inputIcon={tipSuffix}
          ref={inputRef}
          error={!isValid && isValid !== null}
          fullBorder
          style={{ width: '100%' }}
          placeholderTextColor="#929395"
          autoCorrect={false}
          type="number"
          placeholder={i18n.t('postRide.tip.customTip.inputPlaceholder')}
          value={customTip}
          onChangeText={(text) => {
            setCustomTip(text);
          }}
          onFocus={(e) => {
            expand();
          }}
        />
      </DetailsContainer>
      <DetailsContainer>

        <ErrorContainer>
          {!isValid && isValid !== null ? <ErrorText>{i18n.t('postRide.tip.customTip.invalidAmountError')}</ErrorText> : null}
        </ErrorContainer>
      </DetailsContainer>

      <DetailsContainer style={{ marginTop: 15 }}>
        <ButtonsContainer>
          <RoundedButton
            type="confirm"
            hollow
            disabled={false}
            useCancelTextButton={false}
            setLoading={null}
            onPress={onCancel}
          >
            {i18n.t('postRide.tip.customTip.cancel')}

          </RoundedButton>
        </ButtonsContainer>
        <ButtonsContainer>
          <RoundedButton
            type="confirm"
            hollow={false}
            disabled={!isValid}
            useCancelTextButton={false}
            setLoading={null}
            onPress={() => submitValue(customTip)}
          >
            {i18n.t('postRide.tip.customTip.submit')}
          </RoundedButton>
        </ButtonsContainer>

      </DetailsContainer>


    </Container>
  );
};


export default Tips;
