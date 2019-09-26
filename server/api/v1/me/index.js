const { Router } = require('@autofleet/node-common');
const userService = require('../../../lib/user');

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


module.exports = router;
