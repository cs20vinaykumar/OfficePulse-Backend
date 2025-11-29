export const handleSingleImages = (req, imageField, previousImage) => {
  let updatedImage = previousImage || "";

  if (req.files && req.files.length > 0) {
    const file = req.files.find((f) => f.fieldname === imageField);
    if (file) {
      updatedImage = `/assets/${file.filename}`;
      console.log(`New image uploaded: ${updatedImage}`);
    }
  }
  return updatedImage;
};

export const handleDocumentImages = (req, previousDocuments = {}) => {
  let updatedDocuments = { ...previousDocuments };

  if (!req.files || req.files.length === 0) {
    return updatedDocuments;
  }

  req.files.forEach((file) => {
    // Ignore profile image
    if (file.fieldname === "profileImage") return;

    // Every file has a dynamic fieldname (ex: banner, coverImage, aboutImage)
    updatedDocuments[file.fieldname] = `/assets/${file.filename}`;
  });

  return updatedDocuments;
};

export const handleMultipleImages = (
  req,
  previousImages,
  fieldName = "productImages"
) => {
  const parsedPreviousImages = Array.isArray(previousImages)
    ? previousImages
    : previousImages
    ? JSON.parse(previousImages)
    : [];

  const newImages = req.files
    ? req.files.filter((f) => f.fieldname === fieldName)
    : [];

  const newImagePaths = newImages.map((file) => `/assets/${file.filename}`);

  return [...parsedPreviousImages, ...newImagePaths];
};
