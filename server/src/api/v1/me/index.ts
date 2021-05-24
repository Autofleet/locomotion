const Router = require('../../../lib/router');
const userService = require('../../../lib/user');
const SettingsService = require('../../../lib/settings');
const TimeSlotsService = require('../../../lib/time-slots');

import rides from './rides';
import places from './places';
import uploadImage from './upload-image';
const router = Router();

router.use('/rides', rides);
router.use('/places', places);
router.use('/image-upload', uploadImage);

router.get('/', async (req, res) => {
  const userProfile = await userService.find(req.userId);
  res.json(userProfile);
});

router.patch('/', async (req, res) => {
  const userProfile = await userService.update(req.userId, req.body);
  res.json(userProfile);
});

router.post('/logout', async (req, res) => {
  const userProfile = await userService.update(req.userId, { refreshTokenId: null });
  res.json({
    status: userProfile ? 'OK' : 'FAIL',
  });
});

router.get('/app-settings', async (req, res) => {
  const settingsList = await SettingsService.getSettingsList();
  res.json(settingsList);
});

router.get('/app-settings/working-hours', async (req, res) => {
  const settingsList = await TimeSlotsService.getTimeSlots();
  res.json(settingsList);
});

export default router;
