const OneSignal = require('onesignal-node');

const oneSignal = new OneSignal.Client(
  process.env.ONE_SIGNAL_APP_ID,
  process.env.ONE_SIGNAL_KEY,
);

const sendNotification = (targetIdsRaw, notificationId, contents, headings, { ttl = (60 * 60), data = {} } = {}) => {
  const targetIds = targetIdsRaw.filter((id) => typeof id === 'string');

  if (targetIds.length === 0) {
    return true;
  }

  return oneSignal.createNotification({
    contents,
    android_channel_id: process.env.ANDROID_CHANNEL_ID,
    include_player_ids: targetIds,
    headings,
    notificationId,
    ttl,
    data,
  });
};

module.exports = sendNotification;
