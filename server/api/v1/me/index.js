const Router = require('../../../lib/router');
const userService = require('../../../lib/user');
const SettingsService = require('../../../lib/settings');

const router = Router();

router.use('/rides', require('./rides'));
router.use('/places', require('./places'));
router.use('/image-upload', require('./upload-image'));

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


module.exports = router;
