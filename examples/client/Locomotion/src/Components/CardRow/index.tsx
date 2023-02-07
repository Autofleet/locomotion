/* eslint-disable no-nested-ternary */
/* eslint-disable no-mixed-operators */
import React, { useContext, useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import moment from 'moment';
import styled, { ThemeContext } from 'styled-components';
import { PaymentIcon } from 'react-native-payment-icons';
import { PaymentMethodInterface } from 'context/payments/interface';
import Button from '../Button';
import { capitalizeFirstLetter, getLastFourFormattedShort } from '../../pages/Payments/cardDetailUtils';
import i18n from '../../I18n';
import SvgIcon from '../SvgIcon';
import selected from '../../assets/selected-v.svg';
import { Start, StartCapital } from '../../lib/text-direction';
import cashIcon from '../../assets/cash.svg';
import chevronIcon from '../../assets/chevron.svg';
import { isCashPaymentMethod } from '../../lib/ride/utils';


type ContainerProps = {
  children: React.ReactNode,
  selected: boolean,
};

const InnerContainer = styled(View)<{chooseMethodPage: boolean}>`
  flex-direction: row;
  justify-content: flex-start;
  width: 100%;
  align-items: center;
  padding: ${({ chooseMethodPage }) => (chooseMethodPage ? '0 15px' : '0px')};
`;

const Container = styled(View) < ContainerProps >`
  background-color: ${(props: any) => (props.selected ? '#rgba(36, 170, 242, 0.2)' : '#fff')};
  min-height: 50px;
  flex-direction: row;
  justify-content: flex-start;
  width: 100%;
  align-items: center;

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

const CardRow = (paymentMethod: any) => {
  const { primaryColor } = useContext(ThemeContext);
  const [isCardExpired, setIsCardExpired] = useState(false);
  useEffect(() => {
    let isExpired = false;
    setTimeout(() => {
      isExpired = moment(paymentMethod.expiresAt).isBefore(moment());
      setIsCardExpired(isExpired);
    }, 100);
  }, [paymentMethod]);
  return (
    <Button
      noBackground
      testID={paymentMethod.addNew ? 'AddPaymentMethod' : 'ChoosePaymentMethod'}
      activeOpacity={paymentMethod.onPress ? 0 : 1}
      onPress={() => {
        if (paymentMethod.onPress) {
          paymentMethod.onPress();
        }
      }}
    >
      <Container selected={paymentMethod.selected}>
        <InnerContainer chooseMethodPage={paymentMethod.chooseMethodPage}>
          <ImageContainer>
            {paymentMethod.addNew
              ? (
                <>
                  <PlusContainer><PlusText>+</PlusText></PlusContainer>
                </>
              )
              : (
                <>
                  {!paymentMethod.lastFour
                    ? isCashPaymentMethod(paymentMethod) ? <SvgIcon Svg={cashIcon} width={40} height={25} /> : null
                    : <PaymentIcon type={paymentMethod.brand} />}
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
                        {`${i18n.t(`payments.${isCashPaymentMethod(paymentMethod) ? 'cash' : 'offline'}`)}`}
                      </Type>
                    )
                    : (
                      <Type>
                        {capitalizeFirstLetter(paymentMethod.name)}
                      </Type>
                    )}
                  {paymentMethod.lastFour
                    ? <Description>{getLastFourFormattedShort(paymentMethod.lastFour)}</Description>
                    : null}
                  {paymentMethod && paymentMethod.expiresAt && !!paymentMethod.lastFour && isCardExpired ? <Error>{i18n.t('payments.expired').toString()}</Error> : null}
                  {paymentMethod && !!paymentMethod.lastFour && paymentMethod.hasOutstandingBalance ? <Error>{i18n.t('payments.hasOutstandingBalance').toString()}</Error> : null}
                </>
              )}
          </TextContainer>
          {paymentMethod.showArrow && <SvgIcon Svg={chevronIcon} stroke="#d7d7d7" />}
        </InnerContainer>
      </Container>
    </Button>
  );
};

export default CardRow;
