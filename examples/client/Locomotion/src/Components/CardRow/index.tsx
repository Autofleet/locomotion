import React, { useState } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import moment from 'moment';
import styled from 'styled-components';
import { PaymentIcon } from 'react-native-payment-icons';
import i18n from '../../I18n';
import SvgIcon from '../SvgIcon';
import selected from '../../assets/selected-v.svg';
import { Start, StartCapital } from '../../lib/text-direction';

type ContainerProps = {
  children: React.ReactNode,
  selected: boolean,
} 

const Container = styled(View)<ContainerProps>`
  flex-direction: row;
  justify-content: center;
  padding: 16px 0px;
  background-color: ${(props: any) => (props.selected ? '#rgba(36, 170, 242, 0.2)' : '#fff')};
  min-height: 70px;
  width: 100%;
`;

const ImageContainer = styled(View)`
  justify-content: center;
`;

const margin = `margin-${Start()}`;

const TextContainer = styled(View)`
  justify-content: center;
  ${margin}: 16px;
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
  margin: 0 7px;
  margin-left: 33px;
  border-radius: 15px;
`;

const PlusText = styled(Text)`
  color: #fff;
  text-align: center;
`;


const style = {
  marginTop: -10,
  [StartCapital()]: 28,
};

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}


export default (paymentMethod: any) => (
  <TouchableOpacity onPress={paymentMethod.onPress}>
    <Container selected={paymentMethod.selected}>
      <ImageContainer>
        {paymentMethod.addNew
          ? (
            <>
              <PlusContainer><PlusText>+</PlusText></PlusContainer>
            </>
          )
          : (
            <>
              <PaymentIcon type={paymentMethod.brand} />
              {paymentMethod.selected ? <SvgIcon Svg={selected} /> : null}
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
              <Type>{capitalizeFirstLetter(paymentMethod.brand)}</Type>
              {paymentMethod.lastFour ? <Description>{`**** ${capitalizeFirstLetter(paymentMethod.lastFour)}`}</Description> : null}
              {true || (paymentMethod && moment(paymentMethod.expiresAt).isBefore(moment())) ? <Error>{i18n.t('payments.expired').toString()}</Error> : null}
              {true || (paymentMethod && paymentMethod.hasOutstandingBalance) ? <Error>{i18n.t('payments.hasOutstandingBalance').toString()}</Error> : null}
            </>
          )}
      </TextContainer>
    </Container>
  </TouchableOpacity>
);

// {"brand": "visa", "createdAt": "2022-06-20T07:34:04.506Z", "customerId": "596950b9-4199-470d-9968-ac9db79a37d3", "deletedAt": null, "expiresAt": "2034-12-31T23:59:59.999Z", "hasOutstandingBalance": false, "id": "97f00c47-7eeb-4854-bdbc-aeec26ad449f", "isDefault": false, "isExpired": false, "lastFour": "4242", "name": "visa", "stripeId": "pm_1LCf7XIaHOVjSfrG0KbEBC6r", "updatedAt": "2022-06-20T07:34:04.506Z"}
