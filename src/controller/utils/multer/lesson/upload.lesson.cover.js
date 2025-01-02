const multer = require("multer");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: "../../../../config/.env" });

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, path.join(__dirname, "../../../../../public/lesson"));
  },
  filename: function (req, file, callback) {
    callback(
      null,
      new Date().toISOString().replace(/:/g, "-") + file.originalname
    );
  },
});

const upload_lesson_cover = multer({
  storage,
  fileFilter: function (req, file, callback) {
    const allowedMimes = [
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
              "Sorry, Invalid file type. Only Image files are allowed ...",
            arabic: "... عذرا خطأ في صيغة الملف , فقط ملفات الصور",
          })
        )
      );
    }
  },
}).array("cover");

module.exports = upload_lesson_cover;
