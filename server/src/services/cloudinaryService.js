import cloudinary from "../config/cloudinary.js";

const hasCloudinaryConfig = () =>
  Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );

export const uploadImagesToCloudinary = async (files = [], folder = null) => {
  if (!files.length) {
    return [];
  }

  if (!hasCloudinaryConfig()) {
    throw new Error(
      "Cloudinary credentials are missing. Add them to your server environment before uploading files."
    );
  }

  const targetFolder =
    folder || process.env.CLOUDINARY_FOLDER || "college-marketplace";

  const uploads = files.map(
    (file) =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: targetFolder,
            resource_type: "image"
          },
          (error, result) => {
            if (error) {
              reject(error);
              return;
            }

            resolve({
              url: result.secure_url,
              publicId: result.public_id
            });
          }
        );

        stream.end(file.buffer);
      })
  );

  return Promise.all(uploads);
};

export const deleteCloudinaryAssets = async (images = []) => {
  if (!images.length || !hasCloudinaryConfig()) {
    return;
  }

  await Promise.all(
    images
      .filter((image) => image.publicId)
      .map((image) =>
        cloudinary.uploader.destroy(image.publicId, { resource_type: "image" })
      )
  );
};
