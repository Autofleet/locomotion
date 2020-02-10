const Router = require('../../../lib/router');
const userService = require('../../../lib/user');


const router = Router();

router.post('/', async (req, res) => {
  const { user } = req.body;
  const response = await userService.create(user);
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

module.exports = router;
