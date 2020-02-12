import { merge } from 'lodash';
import AsyncStorage from '@react-native-community/async-storage';

const deviceStorage = {
  get(key) {
    if (!Array.isArray(key)) {
      return AsyncStorage.getItem(key).then(value => JSON.parse(value));
    }
    return AsyncStorage.multiGet(key).then((values) => {
      const result = {};
      values.forEach((value) => {
        result[value[0]] = JSON.parse(value[1]);
      });
      return result;
    });
  },

  save(object) {
    const pairs = Object.keys(object).map(pKey => [pKey, JSON.stringify(object[pKey])]);
    return AsyncStorage.multiSet(pairs);
  },

  update(object) {
    const keys = Object.keys(object);
    return deviceStorage.get(keys).then((items) => {
      const newItems = merge({}, Object.assign(items), object);
      // stringify for all values
      return deviceStorage.save(newItems);
    });
  },

  delete(key) {
    if (Array.isArray(key)) {
      return AsyncStorage.multiRemove(key);
    }
    return AsyncStorage.removeItem(key);
  },

  keys() {
    return AsyncStorage.getAllKeys();
  },

  clear() {
    return AsyncStorage.clear();
  },
};

module.exports = deviceStorage;
