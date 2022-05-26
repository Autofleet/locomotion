import { userRepo } from '../../../repositories';
import Router from '../../../lib/router';
import {
  verify, send, createToken, refreshValidator,
} from '../../../lib/auth';
import settingService from '../../../lib/settings';
import logger from '../../../logger';

const router = Router();

router.post('/', async (req, res) => {
  const { phoneNumber } = req.body;
  const { headerOperationId } = req;
  const response = await send(phoneNumber, headerOperationId);
  res.json({
    success: !!response,
  });
});

router.post('/vert', async (req, res) => {
  const { phoneNumber, code } = req.body;
  const { headerOperationId } = req;
  try {
    const response = await verify(phoneNumber, code);
    let userProfile;

    if (response) {
      userProfile = await userRepo.findByPhoneNumber(phoneNumber);
    } else {
      return res.json({ status: 'FAIL' });
    }

    const { token: accessToken } = await createToken({
      userId: userProfile.id,
      operationId: userProfile.operationId,
    });

    const { token: refreshToken, jwtid } = await createToken({
      headerOperationId,
      userId: userProfile.id,
    }, 'refreshToken');

    const additionalUpdateData = { active: true };
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
    const userProfile = await refreshValidator(refreshToken);
    let accessToken = null;
    if (userProfile) {
      const { token } = await createToken({
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

export default router;
