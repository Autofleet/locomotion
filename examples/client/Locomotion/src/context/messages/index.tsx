import React, {
  createContext,
  useState,
  useEffect,
  Dispatch,
  useContext,
} from 'react';
import moment from 'moment';
import useInterval from '../../lib/useInterval';
import { RideInterface } from '../newRideContext';
import * as futureRideApi from './api';
import { UserContext } from '../user';

export type messageProps = {
    title: string;
    isRead: boolean;
    text: string;
    sentAt: Date;
}

interface MessagesContextInterface {
    userMessages: messageProps[]
}

export const MessagesContext = createContext<MessagesContextInterface>({
  userMessages: [],
});

const MessagesProvider = ({ children }: { children: any }) => {
  const { user } = useContext(UserContext);
  const [userMessages, setUserMessages] = useState<messageProps[]>([]);

  const loadUserMessages = async () => {
    // const messages = await getUserMessages(user.id)
    const messages = [
      {
        title: 'Attention! Changes in operational hours very soon',
        isRead: false,
        text: 'Due to maintenance somewhere we are obliged to change our operational hours from this and that into a mind blowing dramatic change. please pay attention. Changes will take place from 1st of May at 13:00 until 10th of May at 10:00.',
        sentAt: moment().subtract(3, 'minutes').toDate(),
      },
      {
        title: 'Attention! Changes in operational hours very soon',
        isRead: true,
        text: 'Due to maintenance somewhere we are ',
        sentAt: moment().subtract(5, 'hours').toDate(),
      },
      {
        title: 'Attention! Changes in operational hours very soon',
        isRead: true,
        text: 'Due to maintenance somewhere we are ',
        sentAt: moment().subtract(5, 'hours').toDate(),
      },
      {
        title: 'Attention! Changes in operational hours very soon',
        isRead: true,
        text: 'Due to maintenance somewhere we are ',
        sentAt: moment().subtract(5, 'hours').toDate(),
      },
      {
        title: 'Attention! Changes in operational hours very soon',
        isRead: true,
        text: 'Due to maintenance somewhere we are ',
        sentAt: moment().subtract(5, 'hours').toDate(),
      },
      {
        title: 'Attention! Changes in operational hours very soon',
        isRead: true,
        text: 'Due to maintenance somewhere we are ',
        sentAt: moment().subtract(5, 'hours').toDate(),
      },
      {
        title: 'Attention! Changes in operational hours very soon',
        isRead: true,
        text: 'Due to maintenance somewhere we are ',
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
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
};

export default MessagesProvider;
