import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import {
  infoLog,
  successLog,
  warningLog,
  errorLog,
  debugLog,
} from "../../utils/logger.js";
import ServerErrorResponse from "../../utils/classes/ServerErrorResponse.js";
import { generateFileId } from "../../utils/basic.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../..", "public/uploads/");

    infoLog("Upload Directory Path: ", uploadDir);

    // Check if the directory exists, if not create it
    if (!fs.existsSync(uploadDir)) {
      warningLog("Directory doesn't exist. Creating new directory.");
      fs.mkdirSync(uploadDir, {
        recursive: true,
      });
    } else {
      successLog("Directory already exists.");
    }

    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    infoLog("Received file: ", file.originalname);

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];
    const originalFilename = path
      .parse(file.originalname)
      .name.replace(/\s/g, "_");
    const uniqueID = generateFileId();

    debugLog("Generated unique file ID: ", uniqueID);

    const fileExt = path.extname(file.originalname).toLowerCase();
    const filename = `${formattedDate}-${uniqueID}-${originalFilename}${fileExt}`;

    successLog("Final filename: ", filename);

    cb(null, filename);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, callback) => {
    infoLog("File MIME type: ", file.mimetype);

    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg"
    ) {
      successLog("File type is valid. Proceeding with upload.");
      callback(null, true);
    } else {
      errorLog("Invalid file type detected. Rejecting file.");
      const errorResponse = new ServerErrorResponse(
        false,
        400,
        "FAILED",
        "Not an image file! Please upload only image files.",
        null
      );
      return callback(errorResponse, false);
    }
  },
}).any();

export default upload;
