
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components';
import i18n from '../../../I18n';
import { TextInputWithIcon } from '../../../Components/TextInput';
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
const Tips = ({

}) => {
  const [selectedTip, setSelectedTip] = useState(null);
  const [customTip, setCustomTip] = useState('');


  const isOnlyDigits = str => /^[+-]?\d+(\.\d+)?$/.test(str);
  //  const isPercentage = ridePrice >= settings.percentageThreshold;
  //  const buttons = isPercentage ? settings.percentage : settings.fixedPrice;
  //  const tipSuffix = isPercentage ? '%' : '$';
  //

  useEffect(() => {
    console.log(isOnlyDigits(customTip));
  }, [customTip]);
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
        {/*         <BottomSheetInput
          style={{ width: '100%' }}
          fullBorder
          placeholderTextColor="#929395"
          autoCorrect={false}
        /> */}
        <TextInputWithIcon
          style={{ width: '100%' }}
          fullBorder
          placeholderTextColor="#929395"
          autoCorrect={false}
          type="number"
          placeholder={i18n.t('postRide.tip.customTip.inputPlaceholder')}
          value={customTip}
          onChangeText={(text) => {
            setCustomTip(text);
          }}
          onFocus={(e) => {

          }}
        >
          {/* <Icon>{tipSuffix}</Icon> */}
        </TextInputWithIcon>
      </DetailsContainer>
      <DetailsContainer>

        <ErrorContainer>
          <ErrorText>Please enter a valid amount</ErrorText>
        </ErrorContainer>
      </DetailsContainer>

      <DetailsContainer style={{ marginTop: 15 }}>
        <View style={{ flex: 1, paddingRight: 10 }}>

          <RoundedButton
            type="confirm"
            hollow
            disabled={false}
            useCancelTextButton={false}
            setLoading={null}
            style={{}}
          >
            {i18n.t('postRide.tip.customTip.cancel')}

          </RoundedButton>
        </View>
        <View style={{ flex: 1, paddingLeft: 10 }}>

          <RoundedButton
            type="confirm"
            hollow={false}
            disabled
            useCancelTextButton={false}
            setLoading={null}
            style={{}}
          >
            {i18n.t('postRide.tip.customTip.submit')}
          </RoundedButton>
        </View>

      </DetailsContainer>


    </Container>
  );
};


export default Tips;
