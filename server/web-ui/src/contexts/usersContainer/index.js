import { useState } from 'react';
import { createContainer } from 'unstated-next';
import { getUsers, update, remove } from './api';

const useUsers = () => {
  const [usersMap, setUsersMap] = useState([]);


  const loadUsers= async () => {
    const usersData = await getUsers();
    setUsersMap(usersData);
  };

  const getUserIndex = userId => usersMap.findIndex(u => u.id === userId);

  const setUser = (userId, newData) => {
    const index = getUserIndex(userId);
    const tmp = [...usersMap];
    tmp[index] = { ...tmp[index], ...newData };
    if (Object.keys(newData).length === 0) {
      tmp.splice(index, 1);
    }

    setUsersMap(tmp);
  };

  const setUserState = async (userId, active) => {
    const updateState = await update(userId, { active });
    if (updateState) {
      setUser(userId, { active });
    }
  };

  const deleteUser = async (userId) => {
    const removeUser = await remove(userId);
    if (removeUser) {
      setUser(userId, {});
    }
  };

  const getUser = userId => usersMap[userId];


  return {
    loadUsers,
    usersMap,
    deleteUser,
    setUserState,
    getUser
  };
};

export default createContainer(useUsers);

