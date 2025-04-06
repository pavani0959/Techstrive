const mongoose = require("mongoose");

const DoubtSchema = new mongoose.Schema({
  studentId: String,
  question: String,
  answer: String, // Empty initially, teacher will provide it later
  status: { type: String, default: "Pending" }, // "Pending" or "Answered"
});

const Doubt = mongoose.model("Doubt", DoubtSchema);

module.exports = Doubt;
