import styled from 'styled-components';
import Svg from 'react-svg-inline';

// import Plus from '../../../src/assets/images/management/plus.svg';

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
  // svg: Plus,
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

export const popupFormContainer = styled.css`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  max-height: 60vh;
  padding: 40px 50px 0px 60px;
  overflow-y: auto;
`;

export const leftSidePopupForm = styled.css`
  width: 47%;
`;

export const driverAvatarContainer = styled.css`
  width: 127px;
  height: 128px;
  border-radius: 50%;
  padding: 1px;
`;

export const driverAvatarContainerInner = styled.css`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 138px;
  height: 138px;
  border-radius: 50%;
  background-color: #F6F6F8;
  position: relative;

  &::after {
    position: absolute;
    top: -1px;
    left: -1px;
    width: 140px;
    height: 140px;
    border-radius: 50%;
    content: '';
    z-index: -1;
    background: linear-gradient(#1ef5b9, #55c3ff);
  }
`;

export const driverAvatar = styled.css`
  width: 126px;
  height: 126px;
  border-radius: 50%;
  background-color: #dedede;
`;

export const nextShiftsContainer = styled.css`
  width: 100%;
`;

export const nextShiftsContainerTitle = styled.css`
  margin-top: 40px;
  font-family: 'Montserrat', sans-serif;
  font-size: .8125rem;
`;

export const toggleText = styled.css`
  font-size: .75rem;
  text-align: left;
  letter-spacing: -.2px;
  color: #5c5c5c;

  &:hover {
    color: #333;
  }
`;

export const rightSidePopupForm = styled.css`
  width: 47%;
`;

