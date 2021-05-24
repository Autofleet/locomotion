import Router from '../../../../lib/router';
import timeSlots from '../../../../lib/time-slots';
import logger from '../../../../logger';


const router = Router();

router.get('/', async (req, res) => {
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

export default router;
