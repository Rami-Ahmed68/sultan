const mongoose = require("mongoose");

const work = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: [
    {
      type: String,
    },
  ],
  video: {
    type: String,
  },
  video_cover: {
    type: String,
    default: "",
  },
  link: {
    type: String,
    required: false,
  },
  created_at: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    enum: [
      "Adobe Photoshop",
      "Adobe Illustrator",
      "Adobe xd",
      "Adobe After Effects",
      "Adobe Premiere",
      "Adobe Audition",
      "Figma",
      "Manipulation",
      "Brand Design",
      "Logo Design",
      "Social Media Design",
      "Manipulation",
      "UI/UX",
      "Motion Graphic",
      "Montage",
    ],
  },
});

const Work = mongoose.model("work", work);
module.exports = Work;
