const multer = require("multer");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: "../../../../config/.env" });

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, path.join(__dirname, "../../../../../public/skill"));
  },
  filename: function (req, file, callback) {
    callback(
      null,
      new Date().toISOString().replace(/:/g, "-") + file.originalname
    );
  },
});

const upload_icon = multer({
  storage,
  fileFilter: function (req, file, callback) {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpeg") {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
}).array("icon");

module.exports = upload_icon;
