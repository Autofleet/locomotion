import styled from 'styled-components';
import {FONT_STYLES} from '../../../../services/sharedStyles';

export const WelcomeText = styled.Text`
  font-size: 35px;
  font-weight: 600;
  margin: 10px 0;
  text-align: center;
`;
export const WelcomeSubText = styled.Text`
  font-size: ${FONT_STYLES.SIZE.MEDIUM};
  margin: 10px 0;
  text-align: center;
  opacity: 0.6;
`;

export const PageContainer = styled.View`
  flex: 1;
  padding: 30px;
  align-items: center;
`;

export const TextContainer = styled.View`
  align-items: center;
`;
