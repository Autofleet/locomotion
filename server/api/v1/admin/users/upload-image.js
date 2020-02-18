const Router = require('../../../../lib/router');
const multer = require('multer');
const userService = require('../../../../lib/user');
const Image = require('../../../../lib/cloudinary');

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();


router.post('/', upload.single('avatar'), async (req, res) => {
  let result = {};
  const { userId } = req;

  try {
    const uploadResult = await Image.upload(req.file.buffer);
    if (!uploadResult.secure_url) {
      throw new Error('could not upload image');
    }

    if (userId) {
      const user = await userService.find(userId);
      if (!user.id) {
        throw new Error('could not find user');
      }
      user.avatar = uploadResult.secure_url;
      await user.save();
    }

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

module.exports = router;
