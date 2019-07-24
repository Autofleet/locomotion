const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.AUTH_ACCESS_SECRET_KEY;

const getTokenFromHeaders = (headers) => {
  if (headers.authorization && headers.authorization.split(' ')[0] === 'Bearer') {
    return headers.authorization.split(' ')[1];
  }

  return false;
};

module.exports = {
  permissionsMiddleWare: async (req, res, next) => {
    const accessToken = getTokenFromHeaders(req.headers);

    if (!accessToken) {
      return res.status(403).send({ auth: false, message: 'No token provided.' });
    }

    let userPayload;
    try {
      userPayload = jwt.verify(accessToken, SECRET_KEY);
      req.userId = userPayload.userId;
    } catch (e) {
      return res.status(403).send({ auth: false, message: 'You dont have permission for load this page' });
    }

    return next();
  },
};
