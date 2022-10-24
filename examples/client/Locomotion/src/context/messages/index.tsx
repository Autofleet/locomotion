import React, {
  createContext,
  useState,
  useEffect,
  useContext,
} from 'react';
import moment from 'moment';
import Toast from 'react-native-toast-message';
import { UserContext } from '../user';
import { setNotificationsHandlers } from '../../services/one-signal';
import {
  getUserMessages, getMessage, markReadMessage as markReadMessageCall, dismissMessage as dismissMessageCall,
} from './api';

export type messageProps = {
    id: string;
    title: string;
    isRead: boolean;
    subTitle: string;
    html?: string;
    sentAt: Date;
    link?: string;
    linkDisplay?: string;
}

interface MessagesContextInterface {
    userMessages: messageProps[];
    viewingMessage: messageProps | null;
    setViewingMessage: React.Dispatch<React.SetStateAction<messageProps | null>>;
    setUserMessages: React.Dispatch<React.SetStateAction<messageProps[]>>;
    loadUserMessages: () => Promise<void>;
    isLoading: boolean;
    markReadMessages: () => Promise<any>
    dismissMessages: () => Promise<any>
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
});

const MessagesProvider = ({ children }: { children: any }) => {
  const { user } = useContext(UserContext);
  const [viewingMessage, setViewingMessage] = useState<messageProps | null>(null);
  const [userMessages, setUserMessages] = useState<messageProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const notificationHandler = {
    message: async (notification: any) => {

    },
  };

  /*   useEffect(() => {
    setNotificationsHandlers(notificationHandler);
  }, []); */


  const checkUnreadMessages = (messages: any) => {
    const unreadMessage = messages.find(message => !message.readAt);
    if (unreadMessage) {
      displayMessage(unreadMessage.id);
    }
  };

  const showToast = (userMessage) => {
    const { id: userMessageId, message } = userMessage;
    Toast.show({
      type: 'tomatoToast',
      text1: message.title,
      text2: message.subTitle,
      visibilityTime: 10000,
      props: {
        // image: 'https://res.cloudinary.com/autofleet/image/upload/v1535368744/Control-Center/green.png',
        userMessageId,
        message,
        /*         onHide: () => {
          dismissMessages([userMessageId]);
        }, */
      },
      onHide: () => {
        dismissMessages([userMessageId]);
      },
    });
  };

  const loadUserMessages = async () => {
    try {
      setIsLoading(true);
      const messages = await getUserMessages(user.id);
      console.log('loadUserMessages messages', messages);
      setUserMessages(messages);
      setIsLoading(false);
      return messages;
    } catch (e) {
      console.log(e);
    }
  };

  const markReadMessages = async (userMessageIds: string[] = []) => {
    const response = await markReadMessageCall(userMessageIds);
    loadUserMessages();
    return response;
  };

  const dismissMessages = async (userMessageIds:string[] = []) => {
    const response = await dismissMessageCall(userMessageIds);
    loadUserMessages();
    return response;
  };

  const checkMessagesForToast = async () => {
    const unreadMessage = userMessages.find(message => !message.readAt && !message.dismissedAt);
    console.log('checkMessagesForToast unreadMessage', unreadMessage);
    if (unreadMessage) {
      showToast(unreadMessage);
    }
  };

  const init = async () => {
    await loadUserMessages();
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
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
};

export default MessagesProvider;
