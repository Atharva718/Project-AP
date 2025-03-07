const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  comment: {
    type: String, // Ensure the field is named 'comment' here
    
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    // required: true, // Optional: Make rating mandatory
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Review", reviewSchema);
