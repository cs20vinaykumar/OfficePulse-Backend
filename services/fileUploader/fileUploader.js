//use this when you want to upload profile imagea and multiple documents with unknown field names
export const processUploadedFiles = (
  files = [],
  mainImageField = "profileImage"
) => {
  let mainImagePath = "";
  let documentsMap = {};

  if (files && files.length > 0) {
    const mainImageFile = files.find((f) => f.fieldname === mainImageField);
    mainImagePath = mainImageFile ? `/assets/${mainImageFile.filename}` : "";

    files
      .filter((f) => f.fieldname !== mainImageField)
      .forEach((f) => {
        documentsMap[f.fieldname] = `/assets/${f.filename}`;
      });
  }

  return { mainImagePath, documentsMap };
};
