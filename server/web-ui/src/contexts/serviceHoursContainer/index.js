import { useState } from 'react';
import { createContainer } from 'unstated-next';
import { getUsers, update, remove, add, getSlots } from './api';

const useServiceHours = () => {
  const [slotsMap, setSlotsMap] = useState([]);


  const loadServiceHours = async () => {
    const slotsData = await getSlots();
    setSlotsMap(slotsData);
  };

  const deleteSlot = async (slotId) => {
    const removeUser = await remove(slotId);
    if (removeUser) {
      loadServiceHours();
    }
  };

  const AddSlot = async (data) => {
    const addSlot = await add(data);
    if (addSlot) {
      loadServiceHours();
    }
  };

/*
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
    if (Object.keys(newData).length !== 0) {
      const updateState = await update(userId, newData);
      if (updateState) {
        setUser(userId, newData);
      }
    }
  };






  const getUser = userId => usersMap.find(user => user.id === userId);

 */
  return {
    loadServiceHours,
    slotsMap,
    AddSlot,
    deleteSlot
  };
};

export default createContainer(useServiceHours);

