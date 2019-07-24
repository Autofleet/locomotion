import styled from 'styled-components';

import Button from '../../../Components/Button';

export const Drawer = styled.View`
  position: absolute;
  bottom: 50;
  width: 90%;
  background-color: #fff;
  left: 5%;
  border-radius: 10;
  shadow-offset: 0px 0px;
  shadow-color: #04214f;
  shadow-opacity: 0.4;
`;

const address = `
  min-height: 50;
  padding-top: 10;
  padding-bottom: 10;
  padding-start: 24;
  align-items: center;
  flex-direction: row;
`;


export const RideCard = styled.View`
  ${address}
  border-bottom-color: #f2f2f2;
  border-bottom-width: 1;
  flex-direction: column;
  padding-start: 10;
  padding-end: 20;
`;

export const DriverAvatar = styled.Image`
  width: 30px;
  height: 30px;
  border-radius: 100;
  margin-left: 15px;
  border-width: 1px;
  border-color: #a7a7a7;
  margin-bottom: 10px;
`;

const styleForDriverIsArrivedState = `
  height: 60px;
  color: #00aeef;
  margin-top: 40px;
`;

export const RideStatusText = styled.Text`
  font-size: 16;
  color: #666666;
  margin-start: 12;
  ${({ state }) => (state === 'driverArrived' ? styleForDriverIsArrivedState : null)}
`;

export const RideDetailsText = styled.Text`
  font-size: 13;
  color: #666666;
  margin-start: 10;
  text-align: ${({ right }) => (right ? 'right' : 'left')};
  /* background-color: red; */
`;


export const RideButton = styled(Button)`
  height: 50;
  border-bottom-end-radius: 10;
  border-bottom-start-radius: 10;
  flex: 1;
  justify-content: center;
  align-items: center;
  ${({ inRide, readyToBook }) => {
    if (inRide) {
      return 'background-color: red;';
    }
    console.log('aasdsadadsa', readyToBook);
    if (readyToBook) {
      return 'background-color: #00435c;';
    }
    return 'background-color: #666666;';
  }}
  /* background-color: #666666; */
`;

export const RideDetailsContainer = styled.View`
  flex: 1;
  flex-direction: row;
  width: 100%;
  margin-top: 16;
`;

export const RideButtonText = styled.Text`
  color: #fff;
  font-size: 18;
`;
