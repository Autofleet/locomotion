import React, { createContext, useState } from 'react';

interface User {
  firstName: string;
  lastName: string;
  avatar: string;
  email: string;
  pushToken: string;
  pushUserId: string;
}

interface UserContextInterface {
  setUser: (user: User) => void,
  user: User | null,
}

export const UserContext = createContext<UserContextInterface | null>(null);

const UserContextProvider = ({ children }: { children: any }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider
      value={{
        setUser: u => setUser(u),
        user,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};


export default UserContextProvider;
