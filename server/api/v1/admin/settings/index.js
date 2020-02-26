const Router = require('../../../../lib/router');
const settingLib = require('../../../../lib/settings');
const logger = require('../../../../logger');
const { Setting } = require('../../../../models');
const _ = require('lodash');

const router = Router();

router.get('/', async (req, res) => {
  let foundSettings = [];

  try {
    foundSettings = await settingLib.getAllSettingFromDb();
  } catch (e) {
    logger.error('Error while gettig all settings', e);
  }
  res.json(foundSettings);
});

router.get('/get-setting/:settingKey', async (req, res) => {
  const { settingKey } = req.params;
  let foundSetting = {};

  try {
    foundSetting = await settingLib.getSettingByKeyFromDb(settingKey);
  } catch (e) {
    logger.error('Error while gettig a setting by key', e);
  }
  res.json({
    id: foundSetting.id,
    key: foundSetting.key,
    value: foundSetting.value,
    type: foundSetting.type,
  });
});

router.post('/', async (req, res) => {
  const payload = req.body;
  let createsSetting = {};

  try {
    createsSetting = await Setting.create(payload);
  } catch (e) {
    logger.error('Error while adding a setting', e);
  }
  res.json(createsSetting);
});

router.get('/:settingId', async (req, res) => {
  const { settingId } = req.params;
  let foundSettings = [];

  try {
    foundSettings = await settingLib.get(settingId);
  } catch (e) {
    logger.error('Error while gettig all settings', e);
  }
  res.json(foundSettings);
});

router.patch('/:settingId', async (req, res) => {
  const { settingId } = req.params;
  const payload = req.body;
  let updatedSetting = {};

  try {
    updatedSetting = await settingLib.patch(settingId, payload);
  } catch (e) {
    logger.error('Error updating a setting');
    res.json(500, { status: 'ERROR', error: e });
    throw e;
  }
  res.json(updatedSetting);
});

router.delete('/:settingId', async (req, res) => {
  const { settingId } = req.params;

  try {
    await settingLib.delete(settingId);
    res.json({ status: 'OK' });
  } catch (e) {
    logger.error('Error deleting a setting');
    res.json(500, { status: 'ERROR', error: e });
    throw e;
  }
});

module.exports = router;
