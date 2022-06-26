import { merge } from 'lodash';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

const isExpired = expireAt => moment().isAfter(expireAt);


const deviceStorage = {
  getValueFromObject(key, obj) {
    if (obj) {
      const {
        value,
        expireAt,
      } = JSON.parse(obj);

      if (!expireAt) {
        if (isExpired(expireAt)) {
          this.delete(key);
        } else {
          return value;
        }
      }
    }

    return undefined;
  },
  async get(key) {
    if (!Array.isArray(key)) {
      return this.getValueFromObject(key, AsyncStorage.getItem(key));
    }
    const values = await AsyncStorage.multiGet(key);
    const result = {};
    values.forEach((value) => {
      const [valueKey, valueObj] = value;
      result[valueKey] = this.getValueFromObject(valueKey, valueObj);
    });
    return result;
  },

  save(object, ttlInSeconds = 0) {
    const pairs = Object.keys(object).map(pKey => [pKey, JSON.stringify({
      value: object[pKey],
      ...(ttlInSeconds !== 0 && { expireAt: moment().add(ttlInSeconds, 'seconds') }),
    })]);
    return AsyncStorage.multiSet(pairs);
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
