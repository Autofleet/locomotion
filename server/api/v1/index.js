const Router = require('../../lib/router');
const authMiddleware = require('../../middlewares/auth');

const router = Router();

router.use('/login', require('./login'));
router.use('/me', authMiddleware.permissionsMiddleWare, require('./me'));
router.use('/ride-webhook', require('./webhook'));

module.exports = router;
