const settingsDefaults = require('./defaults');
const { Setting } = require('../../models');

const parseValue = (value, type) => {
  if (type === 'number') {
    return parseFloat(value);
  } else if (type === 'json') {
    return JSON.parse(value);
  } else if (type === 'boolean') {
    return value === 'true';
  }

  return value;
};

const getSettingByKeyFromDb = async (settingKey) => {
  const foundSetting = await Setting.findOne({
    where: {
      key: settingKey,
    },
  });

  const simpleSetting = foundSetting ? foundSetting.get() : {};
  const parsedValue = parseValue(simpleSetting.value, simpleSetting.type);
  return {
    ...simpleSetting,
    value: parsedValue,
  };
};

const getAllSettingFromDb = async () => {
  const foundSettings = await Setting.findAll({});
  const settingsList = [];
  foundSettings.map((foundSetting) => {
    const parsedValue = parseValue(foundSetting.value, foundSetting.type);
    settingsList.push({
      ...foundSetting.get(),
      value: parsedValue,
    });
  });
  return settingsList;
};

const getSettingValueType = (settingValue) => {
  switch (typeof settingValue) {
    case "string":
      return "string"
    case "bigint":
    case "number":
      return "number"
    case "object":
      return "json"
    case "boolean":
      return "boolean"
    default:
      console.warn(`unsupported SettingValueType('${typeof settingValue}'), fallbacks to 'string'`)
      return "string"
  }
};

module.exports = {
  getSettingByKeyFromDb,
  getSettingsList: async () => {
    const settings = await getAllSettingFromDb();
    const settingsList = {...settingsDefaults};

    let settingsToInsert = []

    Object.keys(settingsList).map((defaultSettingKey) => {
      if (settings.map((s) => s.key).includes(defaultSettingKey)) {
        settingsList[defaultSettingKey] = settings.filter(s => s.key === defaultSettingKey)[0].value;
      } else {
        const defaultSettingToStore = {
            key: defaultSettingKey,
            value: settingsList[defaultSettingKey].toString(),
            type: getSettingValueType(settingsList[defaultSettingKey])
        };
        settingsToInsert.push(defaultSettingToStore);
      }
    });

    if (settingsToInsert.length > 0) {
      await Setting.bulkCreate(settingsToInsert);
    }

    return settingsList;
  },
  updateByKey(settingKey, payload) {
    return Setting.update(payload, { where: { key: settingKey } });
  },
  patch(settingId, payload) {
    return Setting.update(payload, { where: { id: settingId } });
  },
  async get(settingId) {
    let foundSetting = await Setting.findByPk(settingId);
    if (foundSetting) {
      foundSetting = foundSetting.get();
      foundSetting.value = parseValue(foundSetting.value, foundSetting.type);
    } else {
      foundSetting = null;
    }

    return foundSetting;
  },
  delete(settingId) {
    return Setting.destroy({ where: { id: settingId } });
  },
};
