import React, {useState} from 'react';
import {Input} from './styled';

const TextInput = props => {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <Input
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      isFocused={isFocused}
      {...props}
    />
  );
};

export default TextInput;

// width: ${({ width }) => (width || '100%')};
// border-bottom-width: 1px;
// margin: 15px auto;
// ${({ theme }) => `
//     border-bottom-color: ${theme.isDarkMode ? '#fff' : '#e2e2e2'};
//     color: ${theme.textColor};
//     ${commonInputStyleWithTheme(theme)}
//   `}
// `;
