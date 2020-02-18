import { useState } from 'react';
import { createContainer } from 'unstated-next';
import { getUsers, update, remove, add } from './api';

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

  const UpdateUser = async (userId, newData) => {
    const updateState = await update(userId, newData);
    if (updateState) {
      setUser(userId, newData);
    }
  };


  const AddUser = async (data) => {
    const addUser = await add(data);
    if (addUser) {
      setUser(addUser.id, addUser.data);
    }
  };

  const deleteUser = async (userId) => {
    const removeUser = await remove(userId);
    if (removeUser) {
      setUser(userId, {});
    }
  };

  const getUser = userId => usersMap.find(user => user.id === userId);

  const uploadImage = async (photoUri) => {
    const formData = new FormData();
    formData.append('avatar', photoUri);

    const response = await uploadImage(formData);

    return response;
  };

  return {
    loadUsers,
    usersMap,
    deleteUser,
    setUserState,
    getUser,
    AddUser,
    uploadImage,
    UpdateUser
  };
};

export default createContainer(useUsers);

