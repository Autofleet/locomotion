import Router from '../../../lib/router';
import { userRepo } from '../../../repositories';
import SettingsService from '../../../lib/settings';
import TimeSlotsService from '../../../lib/time-slots';

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
  const userProfile = await userRepo.find(req.userId);
  res.json(userProfile);
});

router.patch('/', async (req, res) => {
  const userProfile = await userRepo.update(req.userId, req.body);
  res.json(userProfile);
});

router.post('/logout', async (req, res) => {
  const userProfile = await userRepo.update(req.userId, { refreshTokenId: null });
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
