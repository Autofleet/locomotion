import React, {
  createContext,
  useState,
  useEffect,
  useContext,
} from 'react';
import moment from 'moment';
import { UserContext } from '../user';

export type messageProps = {
    id: string;
    title: string;
    isRead: boolean;
    subTitle: string;
    sentAt: Date;
}

interface MessagesContextInterface {
    userMessages: messageProps[]
    viewingMessage: messageProps | null,
    setViewingMessage: React.Dispatch<React.SetStateAction<messageProps | null>>
    setUserMessages: React.Dispatch<React.SetStateAction<messageProps[]>>
}

export const MessagesContext = createContext<MessagesContextInterface>({
  userMessages: [],
  viewingMessage: null,
  setViewingMessage: () => undefined,
  setUserMessages: () => undefined,
});

const MessagesProvider = ({ children }: { children: any }) => {
  const { user } = useContext(UserContext);
  const [viewingMessage, setViewingMessage] = useState<messageProps | null>(null);
  const [userMessages, setUserMessages] = useState<messageProps[]>([]);

  const loadUserMessages = async () => {
    // const messages = await getUserMessages(user.id)
    const messages = [
      {
        id: 'a',
        title: 'Attention! Changes in operational hours very soon',
        isRead: false,
        subTitle: 'Due to maintenance somewhere we are obliged to change our operational hours from this and that into a mind blowing dramatic change. please pay attention. Changes will take place from 1st of May at 13:00 until 10th of May at 10:00.',
        sentAt: moment().subtract(3, 'minutes').toDate(),
      },
      {
        id: 'b',
        title: 'Attention! Changes in operational hours very soon',
        isRead: true,
        subTitle: 'Due to maintenance somewhere we are ',
        sentAt: moment().subtract(5, 'hours').toDate(),
      },
      {
        id: 'c',
        title: 'Attention! Changes in operational hours very soon',
        isRead: true,
        subTitle: 'Due to maintenance somewhere we are ',
        sentAt: moment().subtract(5, 'hours').toDate(),
      },
      {
        id: 'd',
        title: 'Attention! Changes in operational hours very soon',
        isRead: true,
        subTitle: 'Due to maintenance somewhere we are ',
        sentAt: moment().subtract(5, 'hours').toDate(),
      },
      {
        id: 'e',
        title: 'Attention! Changes in operational hours very soon',
        isRead: true,
        subTitle: 'Due to maintenance somewhere we are ',
        sentAt: moment().subtract(5, 'hours').toDate(),
      },
      {
        id: 'f',
        title: 'Attention! Changes in operational hours very soon',
        isRead: true,
        subTitle: 'Due to maintenance somewhere we are ',
        sentAt: moment().subtract(5, 'hours').toDate(),
      },
      {
        id: 'g',
        title: 'Attention! Changes in operational hours very soon',
        isRead: true,
        subTitle: 'Due to maintenance somewhere we are ',
        sentAt: moment().subtract(5, 'hours').toDate(),
      }];
    setUserMessages(messages);
  };

  useEffect(() => {
    loadUserMessages();
  }, []);
  return (
    <MessagesContext.Provider
      value={{
        userMessages,
        viewingMessage,
        setViewingMessage,
        setUserMessages,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
};

export default MessagesProvider;
