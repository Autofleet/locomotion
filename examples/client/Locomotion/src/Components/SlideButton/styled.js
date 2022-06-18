import styled from 'styled-components';

export const SliderContainer = styled.View`
  border-radius: 24px;
  height: 50px;
  width: 100%;
`;
export const ButtonText = styled.Text`
  color: ${({verified}) => (!verified ? '#08355c' : '#ffffff')};
  ${({verified}) => (verified ? 'margin-right: 20px' : '')};
`;
export const DrawerButtonContainer = styled.View`
  padding-top: 10px;
  padding-bottom: 20px;
  margin: 0 auto;
  min-height: 40px;
  width: 70%;
`;
export const styleSchemed = theme => ({
  default: {
    buttonSize: 50,
    backgroundColor: '#f0f0f0',
    textColor: '#08355c',
    buttonColor: theme.primaryColor,
    borderRadius: 30,
  },
  verified: {
    backgroundColor: theme.secondaryColor,
    textColor: '#ffffff',
    buttonColor: '#08902d',
  },
});
