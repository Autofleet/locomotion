const Router = require('../../../lib/router');
const authService = require('../../../lib/auth');
const userService = require('../../../lib/user');
const settingService = require('../../../lib/settings');
const logger = require('../../../logger');

const router = Router();

router.post('/', async (req, res) => {
  const { phoneNumber } = req.body;
  const { headerOperationId } = req;
  const response = await authService.createVerificationCode(phoneNumber, headerOperationId);
  res.json({
    success: !!response,
  });
});

router.post('/vert', async (req, res) => {
  const { phoneNumber, code } = req.body;
  const { headerOperationId } = req;
  try {
    const response = await authService.checkVerificationCode(phoneNumber, code, headerOperationId);
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
      headerOperationId,
      userId: userProfile.id,
    }, 'refreshToken');

    const additionalUpdateData = {};
    if (userProfile.active === null) {
      try {
        const foundSetting = await settingService.getSettingByKeyFromDb('MANUAL_APPROVAL');
        additionalUpdateData.active = !foundSetting.value;
      } catch (e) {
        logger.error('Error while getting a setting by key', e);
      }
    }
    await userProfile.update({
      refreshTokenId: jwtid,
      ...additionalUpdateData,
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
    res.status(401);
  }
  res.json(result);
});

router.get('/settings', async (req, res) => {
  const settingsUrls = await Promise.all([
    settingService.getSettingByKeyFromDb('TERMS_URL'),
    settingService.getSettingByKeyFromDb('PRIVACY_URL'),
    settingService.getSettingByKeyFromDb('CONTACT_US_URL'),
  ]);

  res.json({
    termsUrl: settingsUrls[0].value,
    privacyUrl: settingsUrls[1].value,
    contactUsUrl: settingsUrls[2].value,
  });
});

module.exports = router;
