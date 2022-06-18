import {MAIN_ROUTES} from '../pages/routes';
import {getUserDetails} from '../context/user/api';
import Auth from './auth';

const UserService = {
  getUser: async navigation => {
    const userData = await getUserDetails();

    if (!navigation) {
      return userData;
    }

    if (userData === null) {
      Auth.logout(navigation);
    }

    if (userData.active === false) {
      navigation.navigate(MAIN_ROUTES.LOCK);
    }

    return userData;
  },
};

module.exports = UserService;
