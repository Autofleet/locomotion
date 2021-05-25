import { TimeSlot } from '../models';


const TimeSlotsService = {
  getTimeSlots: async () => {
    const timeSlotsData = await TimeSlot.findAll({
      order: [
        ['dayInWeek', 'ASC'],
        ['startTime', 'ASC'],
      ],
    });

    return timeSlotsData;
  },

  createTimeSlot: async (slotData) => {
    const createdSlot = await TimeSlot.create(slotData);
    return createdSlot;
  },

  deleteTimeSlot: async (slotId) => {
    const deleteTimeSlot = await TimeSlot.destroy({ where: { id: slotId } });
    return deleteTimeSlot;
  },
};
export default TimeSlotsService;
