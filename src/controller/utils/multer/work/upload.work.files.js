const multer = require("multer");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: "../../../../config/.env" });

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, path.join(__dirname, "../../../../../public/work"));
  },
  filename: function (req, file, callback) {
    callback(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
  },
});

const upload_files = multer({
  storage,
  fileFilter: function (req, file, callback) {
    const allowedMimes = [
      "video/mp4",
      "video/webm",
      "video/avi",
      "image/png",
      "image/jpeg",
      // Add other allowed video mime types here
    ];

    if (allowedMimes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(
        new Error(
          JSON.stringify({
            english:
              "Sorry, Invalid file type. Only video files are allowed ...",
            arabic: "... عذرا خطأ في صيغة الملف , فقط ملفات الفيديو",
          })
        )
      );
    }
  },
}).array("files"); // Use .single() for uploading a single video

module.exports = upload_files;
