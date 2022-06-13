import Router from '../../../lib/router';
import userService from '../../../lib/user';
import SettingsService from '../../../lib/settings';
import TimeSlotsService from '../../../lib/time-slots';
import afSdk from '../../../sdk';

import rides from './rides';
import places from './places';
import uploadImage from './upload-image';
import payments from './payments';

const router = Router();

router.use('/rides', rides);
router.use('/places', places);
router.use('/image-upload', uploadImage);
router.use('/payments', payments);

router.get('/', async (req, res) => {
  const userProfile = await userService.find(req.userId);
  res.json(userProfile);
});

router.get('/territories', async (req, res) => {
  const { data: territories } = await afSdk.Rides.getTerritories();
  res.json(territories);
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
