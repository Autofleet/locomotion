/* eslint-disable no-nested-ternary */
/* eslint-disable no-mixed-operators */
import React, { useContext, useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import moment from 'moment';
import styled, { ThemeContext } from 'styled-components';
import { PaymentIcon } from 'react-native-payment-icons';
import { nonCardPaymentMethodToIconMap } from '../../pages/Payments/consts';
import Button from '../Button';
import { capitalizeFirstLetter, getLastFourForamttedShort } from '../../pages/Payments/cardDetailUtils';
import i18n from '../../I18n';
import SvgIcon from '../SvgIcon';
import selected from '../../assets/selected-v.svg';
import { Start, StartCapital } from '../../lib/text-direction';
import chevronIcon from '../../assets/chevron.svg';
import { isCashPaymentMethod } from '../../lib/ride/utils';
import settingsContext from '../../context/settings';

type ContainerProps = {
  children: React.ReactNode,
  selected: boolean,
  chooseMethodPage: boolean
};

const InnerContainer = styled(View)`
  flex-direction: row;
  justify-content: flex-start;
  width: 100%;
  align-items: center;
`;

const Container = styled(View) < ContainerProps >`
  background-color: ${(props: any) => (props.selected ? '#rgba(36, 170, 242, 0.2)' : '#fff')};
  min-height: 50px;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  opacity: ${(props: any) => (props.disabled ? 0.3 : 1)};
  padding: ${({ chooseMethodPage }) => (chooseMethodPage ? '0 15px' : '0px')};
`;

const ImageContainer = styled(View)`
  justify-content: center;
  position: relative;
`;

const margin = `margin-${Start()}`;

const TextContainer = styled(View)`
  justify-content: center;
  ${margin}: 16px;
  width: 80%;
`;

const Type = styled(Text)`
  justify-content: flex-start;
  font-weight: 500;
`;

export const Description = styled(Text)`
  justify-content: flex-start;
  color: #333333;
  font-size: 11px;
`;

const Error = styled(Text)`
  justify-content: flex-start;
  color: #f35657;
  font-size: 11px;
`;

const PlusContainer = styled(View)`
  background-color: #000;
  width: 20px;
  height: 20px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PlusText = styled(Text)`
  color: #fff;
  line-height: 16px;
`;


const style = {
  marginTop: -10,
  [StartCapital()]: 28,
};


const CardRow = async (paymentMethod: any) => {
  const { primaryColor } = useContext(ThemeContext);
  const { getSettingByKey } = settingsContext.useContainer();
  const [isCardExpired, setIsCardExpired] = useState(false);
  useEffect(() => {
    let isExpired = false;
    setTimeout(() => {
      isExpired = moment(paymentMethod.expiresAt).isBefore(moment());
      setIsCardExpired(isExpired);
    }, 100);
  }, [paymentMethod]);
  const testID = paymentMethod.addNew ? `${paymentMethod.testIdPrefix || ''}AddPaymentMethod` : (`${paymentMethod.testIdPrefix || ''}ChoosePaymentMethod`);

  const getNonCardPaymentMethodText = async () => {
    if (isCashPaymentMethod(paymentMethod)) { return i18n.t('payments.cash'); }

    // offline payment method
    const { name: fallbackName } = paymentMethod;
    const nameFromSetting = await getSettingByKey('offlinePaymentMethodDisplayName');
    return nameFromSetting || fallbackName;
  };
  const getPaymentMethodIcon = () => {
    const { brand, id, lastFour } = paymentMethod;
    const isCard = lastFour;
    if (isCard) {
      return <PaymentIcon type={brand} />;
    }
    return (
      <SvgIcon
        fill={primaryColor}
        Svg={nonCardPaymentMethodToIconMap[id]}
        width={40}
        height={25}
      />
    );
  };
  return (
    <>
      <Button
        noBackground
        testID={testID}
        activeOpacity={paymentMethod.onPress && !paymentMethod.disabledReason ? 0 : 1}
        onPress={() => {
          if (paymentMethod.onPress && !paymentMethod.disabledReason) {
            paymentMethod.onPress();
          }
        }}
      >
        <Container
          chooseMethodPage={paymentMethod.chooseMethodPage}
          selected={paymentMethod.selected}
          disabled={paymentMethod.disabledReason}
        >
          <InnerContainer>
            <ImageContainer>
              {paymentMethod.addNew
                ? (
                  <>
                    <PlusContainer><PlusText>+</PlusText></PlusContainer>
                  </>
                )
                : (
                  <>
                    {getPaymentMethodIcon()}
                    {paymentMethod.mark ? (
                      <SvgIcon
                        style={{
                          position: 'absolute',
                          right: -7,
                          bottom: -7,
                        }}
                        Svg={selected}
                        fill={primaryColor}
                      />
                    ) : null }
                  </>
                )
        }

            </ImageContainer>
            <TextContainer>
              {paymentMethod.addNew
                ? (
                  <>
                    <Type>{i18n.t('payments.addNewCreditCard').toString()}</Type>
                  </>
                )
                : (
                  <>
                    {!paymentMethod.lastFour
                      ? (
                        <Type>
                          {getNonCardPaymentMethodText()}
                        </Type>
                      )
                      : (
                        <Type>
                          {capitalizeFirstLetter(paymentMethod.name)}
                        </Type>
                      )}
                    {paymentMethod.lastFour
                      ? <Description>{getLastFourForamttedShort(paymentMethod.lastFour)}</Description>
                      : null}
                    {paymentMethod && paymentMethod.expiresAt && !!paymentMethod.lastFour && isCardExpired ? <Error>{i18n.t('payments.expired').toString()}</Error> : null}
                    {paymentMethod && !!paymentMethod.lastFour && paymentMethod.hasOutstandingBalance ? <Error>{i18n.t('payments.hasOutstandingBalance').toString()}</Error> : null}
                  </>
                )}
            </TextContainer>
            {paymentMethod.showArrow && <SvgIcon Svg={chevronIcon} stroke="#d7d7d7" />}
          </InnerContainer>
          {paymentMethod.disabledReason && (
          <Description>
            {paymentMethod.disabledReason}
          </Description>
          )}
        </Container>
      </Button>
    </>
  );
};

export default CardRow;
