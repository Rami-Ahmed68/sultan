const multer = require("multer");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: "../../../../config/.env" });

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, path.join(__dirname, "../../../../../public/avatar"));
  },
  filename: function (req, file, callback) {
    callback(
      null,
      new Date().toISOString().replace(/:/g, "-") + file.originalname
    );
  },
});

const upload_avatar = multer({
  storage,
  fileFilter: function (req, file, callback) {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpeg") {
      callback(null, true);
    } else {
      new Error(
        JSON.stringify({
          english: "Sorry, Invalid file type. Only Image files are allowed ...",
          arabic: "... عذرا خطأ في صيغة الملف , فقط ملفات الصور",
        })
      );
    }
  },
}).array("avatar");

module.exports = upload_avatar;
