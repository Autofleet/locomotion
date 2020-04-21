const { TimeSlot } = require('../models');


const TimeSlotsService = {
  getTimeSlots: async () => {
    const timeSlotsData = await TimeSlot.findAll();
    return timeSlotsData;
  },

};
module.exports = TimeSlotsService;
