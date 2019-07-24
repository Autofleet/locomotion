const Router = require('../../../lib/router');
const authService = require('../../../lib/auth');
const userService = require('../../../lib/user');

const router = Router();

router.post('/', async (req, res) => {
  const { phoneNumber } = req.body;
  const response = await authService.createVerificationCode(phoneNumber);
  res.json({
    success: !!response,
  });
});

router.post('/vert', async (req, res) => {
  const { phoneNumber, code } = req.body;
  try {
    const response = await authService.checkVerificationCode(phoneNumber, code);
    let userProfile;

    if (response) {
      [userProfile] = await userService.findByPhoneNumber(phoneNumber);
    } else {
      return res.json({ status: 'FAIL' });
    }

    const { token: accessToken } = await authService.createToken({
      userId: userProfile.id,
    });

    const { token: refreshToken, jwtid } = await authService.createToken({
      userId: userProfile.id,
    }, 'refreshToken');

    await userProfile.update({
      refreshTokenId: jwtid,
    });

    return res.json({
      status: 'OK',
      userProfile,
      accessToken,
      refreshToken,
    });
  } catch (e) {
    return res.json({ status: 'FAIL' });
  }
});

router.post('/refresh', async (req, res) => {
  let result = {};
  const { refreshToken } = req.body;
  try {
    const userProfile = await authService.refreshValidator(refreshToken);
    let accessToken = null;
    if (userProfile) {
      const { token } = await authService.createToken({
        userId: userProfile.id,
      });
      accessToken = token;
    }

    result = { status: userProfile ? 'OK' : 'FAIL', accessToken };
  } catch (e) {
    result = {
      status: 'ERROR',
      msg: e.message,
    };
  }
  res.json(result);
});

module.exports = router;
