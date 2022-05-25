import logger from '../../../logger';
import Router from '../../../lib/router';
import userService from '../../../lib/user';
import afSdk from '../../../sdk';

const router = Router();

router.get('/customer', async (req, res) => {
  const { userId } = req;
  let isExist = false;
  let customer = null;
  try {
    const { data: afCustomer } = await afSdk.Payments.getCustomer(userId);
    customer = afCustomer;
    isExist = true;
  } catch (e) {
    logger.error(`getCustomer ${e}`, e.response.data);
  }

  return res.json({ isExist, customer });
});

router.post('/customer', async (req, res) => {
  const customerData = await userService.find(req.userId);
  if (!customerData) {
    logger.info(`Error - user not found ${req.userId}`);
  }

  const data = {
    userId: req.userId,
    businessModelId: process.env.BUSINESS_MODEL_ID,
    name: `${customerData.firstName} ${customerData.lastName}`,
    email: customerData.email,
    phone: customerData.phoneNumber,
  };

  const { data: afCustomer } = await afSdk.Payments.createCustomer(data);

  res.json({ customer: afCustomer });
});

router.post('/intent', async (req, res) => {
  try {
    const { data: setupIntent } = await afSdk.Payments.createPaymentIntent({
      userId: req.userId,
      businessModelId: process.env.BUSINESS_MODEL_ID,
    });
    return res.json({ clientSecret: setupIntent.client_secret });
  } catch (e) {
    logger.error('createPaymentIntent', e);
  }

  return res.json({ status: 'ERROR' });
});

router.post('/detach', async (req, res) => {
  const { paymentMethodId } = req.body;
  try {
    const paymentMethods = await afSdk.Payments.detachPaymentMethod({
      paymentMethodId,
      businessModelId: process.env.BUSINESS_MODEL_ID,
    });
    return res.json(paymentMethods.data);
  } catch (e) {
    logger.error('detachPaymentMethod', e);
  }

  return res.json({ status: 'ERROR' });
});

router.get('/methods', async (req, res) => {
  try {
    const { data: methods } = await afSdk.Payments.listMethods(req.userId);
    return res.json(methods.data);
  } catch (e) {
    logger.error(`listMethods ${e}`, e?.response?.data);
  }
  return res.status(500).json({ status: 'ERROR' });
});

export default router;
