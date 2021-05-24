import jwt from 'jsonwebtoken';

const ADMIN_USER_ID = process.env.ADMIN_USER_ID || '1';
const SECRET_KEY = process.env.AUTH_ACCESS_SECRET_KEY || '1234';
const ADMIN_LOGIN_USER = process.env.ADMIN_LOGIN_USER || 'admin';
const ADMIN_LOGIN_PASS = process.env.ADMIN_LOGIN_PASS || '1234';

export const authAdmin = (userName, password) => (userName === ADMIN_LOGIN_USER) && (password === ADMIN_LOGIN_PASS);

export const adminPermissionsMiddleWare = async (req, res, next) => {
  const respUnAuthorizationError = message => res.status(403).send({ auth: false, message });

  const { headers } = req;
  let accessToken;
  if (headers.authorization && headers.authorization.split(' ')[0] === 'Bearer') {
    [, accessToken] = headers.authorization.split(' ');
  } else {
    accessToken = false;
  }

  if (!accessToken) {
    console.log('No token provided.');
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