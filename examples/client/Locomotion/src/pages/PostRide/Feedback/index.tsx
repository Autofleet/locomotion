import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { ThemeContext } from 'styled-components';
import { TouchableOpacity } from 'react-native';
import i18n from '../../../I18n';
import {
  ActiveLabelContainer,
  ActiveWriteCommentLabel,
  WriteCommentContainer,
  LabelComment,
  StyledTextArea,
  Container,
  Counter,
  TextAreaTopBar,
} from './styled';
import SvgIcon from '../../../Components/SvgIcon';
import addCommentIcon from '../../../assets/add_comment.svg';
import settings from '../../../context/settings';
import settingsKeys from '../../../context/settings/keys';

interface RideFeedbackProps {
  onTextChange: (text: string) => void;
}

const MAX_LENGTH = 150;

const RideFeedback = ({
  onTextChange,
}: RideFeedbackProps) => {
  const [isActive, setIsActive] = useState(false);
  const [shouldShowPage, setShouldShowPage] = useState(false);
  const [currentText, updateText] = useState('');
  const inputRef = useRef();
  const theme = useContext(ThemeContext);

  const onChange = (text: string) => {
    updateText(text);
    onTextChange(text);
  };

  const { primaryColor } = useContext(ThemeContext);
  const { getSettingByKey } = settings.useContainer();

  const onLabelClick = () => {
    setIsActive(true);
  };

  const updateShouldShowPage = async () => {
    setShouldShowPage(await getSettingByKey(settingsKeys.SHOW_POST_RIDE_FEEDBACK));
  };

  useEffect(() => {
    updateShouldShowPage();
  }, []);

  const writeCommentText: string = i18n.t('postRide.writeComment.title');

  return (
    shouldShowPage
    && (
      <Container>
        {!isActive ? (
          <TouchableOpacity testID="addFeedback" activeOpacity={1} onPress={onLabelClick}>
            <ActiveLabelContainer>
              <SvgIcon
                width={20}
                height={20}
                Svg={addCommentIcon}
                fill={primaryColor}
              />
              <ActiveWriteCommentLabel>{writeCommentText}</ActiveWriteCommentLabel>
            </ActiveLabelContainer>
          </TouchableOpacity>
        )
          : (
            <WriteCommentContainer>
              <TextAreaTopBar>
                <LabelComment>{writeCommentText}</LabelComment>
                <Counter>{`${currentText.length}/${MAX_LENGTH}`}</Counter>
              </TextAreaTopBar>
              <StyledTextArea
                autoFocus={false}
                ref={inputRef}
                value={currentText}
                multiline
                numberOfLines={2}
                textAlignVertical="top"
                placeholder={i18n.t('postRide.writeComment.placeholder')}
                onChangeText={onChange}
                maxLength={MAX_LENGTH}
                placeholderTextColor={theme.disabledColor}
              />
            </WriteCommentContainer>
          )
      }
      </Container>
    )
  );
};

export default RideFeedback;
