const { Storage } = require('@google-cloud/storage');

const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
});


const gcsGetFile = (fileName, bucketName) => new Promise((resolve) => {
  const bucket = storage.bucket(process.env.GCP_STORAGE_BUCKET_NAME);
  let currentBucket = bucket;
  if (bucketName) {
    currentBucket = storage.bucket(bucketName);
  }
  const fileStream = currentBucket.file(fileName).createReadStream();
  let jsonBuffer = '';
  fileStream.on('data', (data) => {
    jsonBuffer += data;
  }).on('end', () => {
    resolve(jsonBuffer);
  });
});

module.exports = {
  gcsGetFile,
};
