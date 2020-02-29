import Auth from './auth';
import network from './network'

const UserService = {
  getUser: async (navigation) => {
    const { data: userData } = await network.get('api/v1/me')

    if(!navigation) {
        return userData;
    }

    if(userData === null) {
        Auth.logout(navigation);
    }

    if(userData.active === false) {
        navigation.navigate('Lock');
    }

    return userData;
  }
};

module.exports = UserService;
