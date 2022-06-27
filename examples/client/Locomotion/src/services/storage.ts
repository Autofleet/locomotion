import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import bluebird from 'bluebird';

const isExpired = (expireAt: Date) => moment().isAfter(expireAt);

const deviceStorage = {
  getValueFromObject(key: string, obj: any) {
    if (obj) {
      const {
        value,
        expireAt,
      } = JSON.parse(obj);

      if (expireAt) {
        if (isExpired(expireAt)) {
          this.delete(key);
        } else {
          return value;
        }
      } else {
        return value;
      }
    }

    return undefined;
  },
  async get(key: string) {
    if (!Array.isArray(key)) {
      const item = await AsyncStorage.getItem(key);
      return this.getValueFromObject(key, item);
    }
    const values = await AsyncStorage.multiGet(key);
    const result: any = {};
    await bluebird.map(values, async (value) => {
      const [valueKey, valueObj] = value;
      result[valueKey] = await this.getValueFromObject(valueKey, valueObj);
    });
    return result;
  },
  save(object: any, ttlInSeconds = 0) {
    const pairs: any[] = Object.keys(object).map(pKey => [pKey, JSON.stringify({
      value: object[pKey],
      ...(ttlInSeconds !== 0 && { expireAt: moment().add(ttlInSeconds, 'seconds') }),
    })]);
    return AsyncStorage.multiSet(pairs);
  },
  delete(key: string) {
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

export default deviceStorage;
