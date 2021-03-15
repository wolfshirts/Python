const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/sdc", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.once("open", function () {
  const answersSchema = new mongoose.Schema({
    product_id: Number,
    answer_id: Number,
    question_id: Number,
    body: String,
    date: Date,
    helpfulness: Number,
    photos: [String],
  });
  const questionsSchema = new mongoose.Schema({
    product_id: Number,
    questions_id: Number,
    question_body: String,
    question_date: Date,
    asker_name: String,
    question_helpfulness: Number,
    reported: Boolean,
  });
});
