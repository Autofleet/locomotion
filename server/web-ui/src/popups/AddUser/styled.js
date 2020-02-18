import styled from 'styled-components';

export const NextShiftsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
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

export const PopupFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  /* justify-content: space-between; */
  width: 100%;
  max-height: 60vh;
  padding: 15px 50px 0px 60px;
  overflow-y: auto;
  height: 380px;
`;

export const DriverAvatarContainer = styled.div`
  width: 138px;
  height: 138px;
  border-radius: 50%;
  padding: 1px;
  margin: 0 auto;
`;

export const DriverAvatarContainerInner = styled.div`
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

export const DriverAvatar = styled.div`
  width: 126px;
  height: 126px;
  border-radius: 50%;
  background-color: #dedede;
`;

export const ToggleText = styled.div`
  font-size: .75rem;
  text-align: left;
  letter-spacing: -.2px;
  color: #5c5c5c;

  &:hover {
    color: #333;
  }
`;

export const FormInputsSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  margin-top:10px;
  justify-content: space-between;
`;

export const RightSidePopupForm = styled.div`
  width: 45%;
  display: flex;
  flex-direction: column;
  margin-top:10px;
`;

export const ToggleContainer = styled.span`
    display: block;
    line-height: 1;
    font-size: .8125rem;
    color: rgba(51, 51, 51, 0.7);
    margin-top: 10px;
  `;
