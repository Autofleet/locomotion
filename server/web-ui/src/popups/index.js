import AddUser from './AddUser';
import AddTimeSlot from './AddTimeSlot';

const MyDialogs = {
  AddUser,
  EditUser: AddUser,
  AddTimeSlot
};

export default popupName => MyDialogs[popupName];

