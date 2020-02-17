import styled from 'styled-components';
import Svg from 'react-svg-inline';

import Plus from '../../../src/assets/images/management/plus.svg';

export const NextShiftsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const ToggleContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  padding-bottom: 12px;
  padding-right: 14px;
  border-bottom: 2px solid rgba(222,222,222,.7);
`;

export const LeftSidePopupForm = styled.div`
  width: 47%;
  display: flex;
  flex-direction: column;
`;

export const NextShiftsTitle = styled.div`
  margin-top: 40px;
  font-family: 'Montserrat', sans-serif;
  font-size: .8125rem;
  flex: 0 0;
`;

export const NextShiftsBody = styled.div`
  margin-top: 10px;
  overflow-y: auto;
  flex: 1 1 auto;
`;

export const UploadButton = styled.button`
  position: absolute;
  width: 31px;
  height: 31px;
  border-radius: 50%;
  bottom: 0;
  right: 0;
  background-color: #23a0fe;
  box-shadow: 4px 2.9px 8px 0 rgba(85, 195, 255, 0.5);
  display: flex;
  align-item: center;
  justify-content: center;

  stroke: #eee;
  &:hover {
    stroke: #aff;
    opacity: .9;
    box-shadow: 2px 2px 8px 0 rgba(85, 195, 255, 0.5);
  }
  &:active {
    opacity: .7;
    box-shadow: 0px 0px 8px 0 rgba(85, 195, 255, 0.5);
  }
`;

export const PlusIcon = styled(Svg).attrs({
  svg: Plus,
})`
  cursor: pointer;
  pointer-events: none;
  width: 17px;
  height: 17px;
  svg {
    width: 100%;
    height: 100%;
  }
`;

export const ImageUploader = styled.input.attrs({
  type: 'file',
  accept: 'image/*',
})`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  padding: 0;
  opacity: 0;
`;

export const ImageUploaderContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 50%;
`;

export const Image = styled.div`
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  background-image: url(${({ src }) => src});
  border-radius: 50%;
`;
