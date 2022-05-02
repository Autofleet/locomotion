const cloudinary = require('cloudinary').v2;

const { env } = process;

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

class Image {
  static upload(imageBuffer) {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {},
        (err, result) => {
          if (err) {
            reject(err);
          }

          if (result) {
            resolve(result);
          }
        },
      ).end(imageBuffer);
    });
  }
}

module.exports = Image;
