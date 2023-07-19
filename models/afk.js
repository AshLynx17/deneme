const { Schema, model } = require("mongoose");

const schema = Schema({
  userID: { type: String },
  reason: { type: String, default: null },
  date: { type: Number, default: Date.now() },
});

module.exports = model("afks", schema);