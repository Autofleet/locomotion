const OneSignal = require('onesignal-node');

const oneSignal = new OneSignal.Client({
  app: {
    appAuthKey: process.env.ONE_SIGNAL_KEY,
    appId: process.env.ONE_SIGNAL_APP_ID,
  },
});

const sendNotification = (targetIdsRaw, notificationId, contents, headings, { ttl = (60 * 60) } = {}) => {
  const targetIds = targetIdsRaw.filter(id => typeof id === 'string');

  if (targetIds.length === 0) {
    return true;
  }

  const firstNotification = new OneSignal.Notification({
    contents,
    headings,
    notificationId,
    ttl,
  });
  firstNotification.postBody.android_channel_id = process.env.ANDROID_CHANNEL_ID;

  firstNotification.setTargetDevices(targetIds);

  return new Promise((reolvse, reject) => {
    oneSignal.sendNotification(firstNotification, (err, httpResponse, data) => {
      if (err) {
        reject(err);
      } else {
        reolvse(data);
      }
    });
  });
};

module.exports = sendNotification;
