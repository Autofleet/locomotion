import React, {
  createContext,
  useState,
  useEffect,
  useContext,
} from 'react';
import moment from 'moment';
import Toast from 'react-native-toast-message';
import { UserContext } from '../user';
import OneSignal from '../../services/one-signal';
import {
  getUserMessages as getUserMessagesCall,
  getMessage,
  markReadMessage as markReadMessageCall,
  dismissMessage as dismissMessageCall,
} from './api';
import * as navigationService from '../../services/navigation';
import { MAIN_ROUTES } from '../../pages/routes';
import i18n from '../../I18n';

export type messageProps = {
    id: string;
    title: string;
    readAt: Date | null;
    subTitle: string;
    html?: string;
    sentAt: Date;
    link?: string;
    linkText?: string;
    content?: string;
    dismissedAt: Date | null;
}

interface MessagesContextInterface {
    userMessages: messageProps[];
    viewingMessage: messageProps | null;
    setViewingMessage: React.Dispatch<React.SetStateAction<messageProps | null>>;
    setUserMessages: React.Dispatch<React.SetStateAction<messageProps[]>>;
    loadUserMessages: () => Promise<void>;
    isLoading: boolean;
    markReadMessages: (param: any) => Promise<any>
    dismissMessages: () => Promise<any>
    getUserMessages: () => Promise<any>
    checkMessagesForToast: () => any

}

export const MessagesContext = createContext<MessagesContextInterface>({
  userMessages: [],
  viewingMessage: null,
  setViewingMessage: () => undefined,
  setUserMessages: () => undefined,
  loadUserMessages: async () => undefined,
  isLoading: false,
  markReadMessages: async () => undefined,
  dismissMessages: async () => undefined,
  getUserMessages: async () => undefined,
  checkMessagesForToast: () => undefined,
});

const MessagesProvider = ({ children }: { children: any }) => {
  const { user } = useContext(UserContext);
  const [viewingMessage, setViewingMessage] = useState<messageProps | null>(null);
  const [userMessages, setUserMessages] = useState<messageProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const showToast = (userMessage: any) => {
    const { id: userMessageId, message } = userMessage;
    Toast.show({
      type: 'tomatoToast',
      text1: message.title,
      text2: message.subTitle,
      autoHide: false,
      topOffset: 60,
      props: {
        // image: 'https://res.cloudinary.com/autofleet/image/upload/v1535368744/Control-Center/green.png',
        userMessageId,
        messageId: message.id,
        onButtonClick: () => Toast.hide(),
        buttonText: i18n.t('messages.toast.dismiss'),
      },
      onPress: () => {
        Toast.hide();
        navigationService.navigate(MAIN_ROUTES.MESSAGE_VIEW, { messageId: message.id });
      },
      onHide: () => {
        dismissMessages([userMessageId]);
      },
    });
  };

  const loadUserMessages = async () => {
    try {
      setIsLoading(true);
      const messages = await getUserMessagesCall(user?.id);
      setUserMessages(messages.sort(sortBySentAt));
      setIsLoading(false);
      return messages;
    } catch (e) {
      console.log(e);
    }
  };

  const markReadMessages = async (userMessageIds: string[]): Promise<void> => {
    const response = await markReadMessageCall(userMessageIds);
    return response;
  };

  const dismissMessages = async (userMessageIds:string[] = []) => {
    const response = await dismissMessageCall(userMessageIds);
    loadUserMessages();
    return response;
  };

  const checkMessagesForToast = () => {
    const unreadMessage = userMessages.find(message => !message.readAt && !message.dismissedAt);
    if (unreadMessage) {
      showToast(unreadMessage);
    }
  };

  const init = async () => {
    await loadUserMessages();
  };

  const getUserMessages = async () => {
    const messages = await getUserMessagesCall(user?.id);
    return messages;
  };

  const sortBySentAt = (a: any, b:any) => {
    const sentAtA = moment(a.message.sentAt);
    const sentAtB = moment(b.message.sentAt);
    if (sentAtA.isBefore(sentAtB)) {
      return 1;
    }
    if (sentAtA.isAfter(sentAtB)) {
      return -1;
    }
    return 0;
  };

  useEffect(() => {
    if (user && user.id) {
      init();
    }
  }, [user?.id]);

  return (
    <MessagesContext.Provider
      value={{
        userMessages,
        viewingMessage,
        setViewingMessage,
        setUserMessages,
        loadUserMessages,
        isLoading,
        markReadMessages,
        dismissMessages,
        checkMessagesForToast,
        getUserMessages,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
};

export default MessagesProvider;
