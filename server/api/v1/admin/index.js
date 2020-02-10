const Router = require('../../../lib/router');
const authService = require('../../../lib/auth');

const {
  ADMIN_LOGIN_USER,
  ADMIN_LOGIN_PASS,
} = process.env;

const router = Router();

const ADMIN_USER_ID = 1;
const adminUserName = ADMIN_LOGIN_USER || 'admin';
const adminPass = ADMIN_LOGIN_PASS || '1234';

async function authAdmin(userName, password) {
  return (userName === adminUserName) && (password === adminPass);
}

router.post('/auth', async (req, res) => {
  const { password, userName } = req.body;

  const result = await authAdmin(userName, password);
  if (!result) {
    return res.json({
      status: 'FAIL',
    });
  }

  const { token } = await authService.createToken({
    userId: ADMIN_USER_ID,
  });

  return res.json({
    token,
    status: 'SUCCESS',
  });
});

module.exports = router;
