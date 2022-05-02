const Router = require('../../../../lib/router');
const userService = require('../../../../lib/user');

const router = Router();

router.post('/', async (req, res) => {
  const userData = req.body;
  const response = await userService.create(userData);
  res.json(response);
});

router.get('/', async (req, res) => {
  const response = await userService.list();
  res.json(response);
});

router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  const response = await userService.find(userId);
  res.json(response);
});

router.patch('/:userId', async (req, res) => {
  const { userId } = req.params;
  const userData = req.body;
  const response = await userService.update(userId, userData);
  res.json(response);
});

router.delete('/:userId', async (req, res) => {
  const { userId } = req.params;
  const response = await userService.destroy(userId);
  res.json(response);
});

module.exports = router;
