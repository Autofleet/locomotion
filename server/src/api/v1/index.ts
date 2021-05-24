import Router from '../../lib/router';
import authMiddleware from '../../middlewares/auth';
import login from './login'
import me from './me'
import rideWebhook from './webhook'
import admin from './admin'

const router = Router();

router.use('/login', login);
router.use('/me', authMiddleware.permissionsMiddleWare, me);
router.use('/ride-webhook', rideWebhook);
router.use('/admin', admin);

export default router;
