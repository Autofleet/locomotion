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
  getUserMessages as getUserMessagesCall, getMessage, markReadMessage as markReadMessageCall, dismissMessage as dismissMessageCall,
} from './api';
import * as navigationService from '../../services/navigation';
import { MAIN_ROUTES } from '../../pages/routes';

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
    markReadMessages: (param) => Promise<any>
    dismissMessages: () => Promise<any>
    getUserMessages: () => Promise<any>

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
});

const MessagesProvider = ({ children }: { children: any }) => {
  const { user } = useContext(UserContext);
  const [viewingMessage, setViewingMessage] = useState<messageProps | null>(null);
  const [userMessages, setUserMessages] = useState<messageProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const showToast = (userMessage) => {
    const { id: userMessageId, message } = userMessage;
    Toast.show({
      type: 'tomatoToast',
      text1: message.title,
      text2: message.subTitle,
      visibilityTime: 5000,
      autoHide: true,
      props: {
        // image: 'https://res.cloudinary.com/autofleet/image/upload/v1535368744/Control-Center/green.png',
        userMessageId,
        message,
      },
      /*  onHide: () => {
        console.log('onHide');
        Toast.hide();
        dismissMessages([userMessageId]);
      }, */
      /*       onPress: () => {
        console.log('pressed');
        Toast.hide();
        dismissMessages([userMessageId]);
        navigationService.navigate(MAIN_ROUTES.MESSAGE_VIEW, { userMessageId, userMessage: message });
      }, */

    });
  };

  const loadUserMessages = async () => {
    try {
      setIsLoading(true);
      const messages = await getUserMessagesCall(user.id);
      setUserMessages(messages.sort(sortBySentAt));
      setIsLoading(false);
      return messages;
    } catch (e) {
      console.log(e);
    }
  };

  const markReadMessages = async (userMessageIds: string[] = []) => {
    const response = await markReadMessageCall(userMessageIds);
    return response;
  };

  const dismissMessages = async (userMessageIds:string[] = []) => {
    const response = await dismissMessageCall(userMessageIds);
    loadUserMessages();
    return response;
  };

  const checkMessagesForToast = async () => {
    const unreadMessage = userMessages.find(message => !message.readAt && !message.dismissedAt);
    if (unreadMessage) {
      showToast(unreadMessage);
    }
  };

  const init = async () => {
    await loadUserMessages();
  };

  const loadMessageForView = async (messageId: string) => {
    const message = await getMessage(messageId);
    setViewingMessage(message);
  };

  const getUserMessages = async () => {
    const messages = await getUserMessagesCall(user.id);
    return messages;
  };

  const sortBySentAt = (a, b) => {
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
