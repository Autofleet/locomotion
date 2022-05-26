import multer from 'multer';
import Image from '../../../lib/cloudinary';
import { userRepo } from '../../../repositories';
import authMiddleware from '../../../middlewares/auth';
import Router from '../../../lib/router';

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.post('/', authMiddleware.permissionsMiddleWare, upload.single('avatar'), async (req, res) => {
  let result = {};
  const { userId } = req;

  try {
    const user = await userRepo.find(userId);
    if (!user.id) {
      throw new Error('could not find user');
    }

    const uploadResult: any = await Image.upload(req.file.buffer);
    if (!uploadResult.secure_url) {
      throw new Error('could not upload image');
    }

    user.avatar = uploadResult.secure_url;
    await user.save();

    result = {
      status: 'ok',
      url: uploadResult.secure_url,
    };
  } catch (e) {
    result = {
      status: 'error',
      msg: e,
    };
  }

  res.json(result);
});

export default router;
