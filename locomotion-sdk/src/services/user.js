import { ONBOARDING_PAGE_NAMES } from '../pages/routes';
import { getUserDetails } from '../context/user/api';
import Auth from './auth';

const UserService = {
  getUser: async (navigation) => {
    const userData = await getUserDetails();

    if (!navigation) {
      return userData;
    }

    if (userData === null) {
      Auth.logout(navigation);
    }

    if (userData.active === false) {
      navigation.navigate(ONBOARDING_PAGE_NAMES.LOCK);
    }

    return userData;
  },
};

module.exports = UserService;
