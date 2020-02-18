import AddUser from './AddUser';

const MyDialogs = {
  AddUser,
  EditUser: AddUser,
};

export default popupName => MyDialogs[popupName];

