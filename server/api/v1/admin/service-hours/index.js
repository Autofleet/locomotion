const Router = require('../../../../lib/router');
const timeSlots = require('../../../../lib/time-slots');
const logger = require('../../../../logger');


const router = Router();

router.get('/', async (req, res) => {
  const workinHours = [];
  let slots = [];
  try {
    slots = await timeSlots.getTimeSlots();
  } catch (e) {
    logger.error('Error while gettig all settings', e);
  }
  res.json(slots);
});

router.post('/', async (req, res) => {
  let createdSlot = null;
  try {
    createdSlot = await timeSlots.createTimeSlot(req.body);
  } catch (e) {
    logger.error('Error while gettig all settings', e);
  }
  res.json(createdSlot);
});


router.delete('/:slotId', async (req, res) => {
  const { slotId } = req.params;
  let slots = [];

  try {
    slots = await timeSlots.deleteTimeSlot(slotId);
  } catch (e) {
    logger.error('Error while gettig all settings', e);
  }
  res.json(slots);
});

module.exports = router;
