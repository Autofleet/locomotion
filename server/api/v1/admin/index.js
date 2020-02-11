const jwt = require('jsonwebtoken');
const Router = require('../../../lib/router');
const authService = require('../../../lib/auth');

const router = Router();

const ADMIN_USER_ID = 1;
const SECRET_KEY = process.env.AUTH_ACCESS_SECRET_KEY || '1234';
const ADMIN_LOGIN_USER = process.env.ADMIN_LOGIN_USER || 'admin';
const ADMIN_LOGIN_PASS = process.env.ADMIN_LOGIN_PASS || '1234';

async function authAdmin(userName, password) {
  return (userName === ADMIN_LOGIN_USER) && (password === ADMIN_LOGIN_PASS);
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

const adminPermissionsMiddleWare = async (req, res, next) => {
  const respUnAuthorizationError = message => res.status(403).send({ auth: false, message });

  const { headers } = req;
  let accessToken;
  if (headers.authorization && headers.authorization.split(' ')[0] === 'Bearer') {
    accessToken = headers.authorization.split(' ')[1];
  } else {
    accessToken = false;
  }

  if (!accessToken) {
    return respUnAuthorizationError('No token provided.');
  }

  let userPayload;
  try {
    userPayload = jwt.verify(accessToken, SECRET_KEY);
    req.userId = userPayload.userId;
  } catch (e) {
    return respUnAuthorizationError('You dont have permission for load this page');
  }

  if (userPayload.userId !== ADMIN_USER_ID) {
    return respUnAuthorizationError('Only admins have permission for load this page');
  }

  return next();
};

router.use('/users', adminPermissionsMiddleWare, require('./users'));

module.exports = router;
