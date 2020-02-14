const Router = require('../../../lib/router');
const authService = require('../../../lib/auth');
const { authAdmin, adminPermissionsMiddleWare } = require('../../../lib/auth/admin');

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
    userId: process.env.ADMIN_USER_ID,
  });

  return res.json({
    token,
    status: 'SUCCESS',
  });
});


router.use('/users', adminPermissionsMiddleWare, require('./users'));

module.exports = router;
