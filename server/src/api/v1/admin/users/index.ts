import Router from '../../../../lib/router';
import { userRepo } from '../../../../repositories';

const router = Router();

router.post('/', async (req, res) => {
  const userData = req.body;
  const response = await userRepo.create(userData);
  res.json(response);
});

router.get('/', async (req, res) => {
  const response = await userRepo.findAll();
  res.json(response);
});

router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  const response = await userRepo.find(userId);
  res.json(response);
});

router.patch('/:userId', async (req, res) => {
  const { userId } = req.params;
  const userData = req.body;
  const response = await userRepo.update(userId, userData);
  res.json(response);
});

router.delete('/:userId', async (req, res) => {
  const { userId } = req.params;
  const response = await userRepo.destroy(userId);
  res.json(response);
});

export default router;
