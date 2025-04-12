const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const subSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true, //user entering name with spaces in beg or end so trim the spaces
      required: "Name is Required",
      minlength: [1, "Too short"],
      maxlength: [32, "Too Long"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    parent: {
      type: ObjectId,
      ref: "Category",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Sub", subSchema);
