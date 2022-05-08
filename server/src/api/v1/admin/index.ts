import Router from '../../../lib/router';
import authService from '../../../lib/auth';
import { authAdmin, adminPermissionsMiddleWare } from '../../../lib/auth/admin';
import users from './users';
import settings from './settings';
import serviceHours from './service-hours';

const router = Router();

router.post('/auth', async (req, res) => {
  const { password, userName } = req.body;

  const result = await authAdmin(userName, password);
  if (!result) {
    return res.json({
      status: 'FAIL',
    });
  }

  const { token } = await authService.createToken({
    userId: process.env.ADMIN_USER_ID || '1',
  });

  return res.json({
    token,
    status: 'SUCCESS',
  });
});

router.use('/users', adminPermissionsMiddleWare, users);
router.use('/settings', adminPermissionsMiddleWare, settings);
router.use('/service-hours', adminPermissionsMiddleWare, serviceHours);

export default router;
