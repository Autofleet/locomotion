import styled from 'styled-components';

export const FormGroup = styled.label`
    position: relative;
    width: 100%;
    margin-top: ${({marginTop}) => marginTop ? marginTop : '0px'};
    display: block;

    &:first-of-type {
      margin-top: 0;
    }
    ${({ disabled }) => disabled && 'opacity: 0.3'};
  `;

export const FormGroupLabel = styled.span`
    display: block;
    margin-bottom: 6px;
    opacity: 0.7;
    line-height: 1;
    font-size: .8125rem;
    color: rgba(51, 51, 51, 0.7);
  `;

export const InputGroup = styled.div`
    position: relative;

    input[type="password"] {
      padding-right: 43px;
    }
  `;

export const FormGroupIcon = styled.img`
    width: 16px;
    position: absolute;
    top: 50%;
    right: 19px;
    transform: translate(0, -50%);
  `;

export const ErrorMessage = styled.span`
    display: block;
    width: 100%;
    font-size: .75rem;
    color: #f03a5f;
    height: 15px;
    margin-top: 10px;
    text-align: center;
  `;
