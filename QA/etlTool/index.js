const fs = require("fs");
const path = require("path");
const readLine = require("readline");

const pool = require("../models/pg");

const files = [
  path.join(__dirname, "../rawData", "answers_photos.csv"),
  path.join(__dirname, "../rawData", "answers.csv"),
  path.join(__dirname, "../rawData", "questions.csv"),
];

const fileObject = {
  photos: files[0],
  answers: files[1],
  questions: files[2],
};

const readInData = (table) => {
  if (!fileObject[table]) {
    return;
  }

  const rawData = fileObject[table];
  const stream = fs.createReadStream(rawData, "utf8");

  const line = readLine.createInterface({
    input: stream,
  });

  let currentLineCount = 0;
  let dataObjects = [];
  let values = [];

  line.on("line", (data) => {
    let dataObj = {};
    if (currentLineCount === 0) {
      values = data.toString().split(",");
      currentLineCount += 1;
    } else {
      let dataValues = data.split(",");
      pool.query(
        "INSERT INTO photos(id, answer_id, url) VALUES($1, $2, $3)",
        dataValues,
        (err, result) => {
          if (err) {
            return console.error("Error on query.", err.stack);
          }

          console.log("Processing: ", currentLineCount);
        }
      );
      currentLineCount += 1;
    }
  });
};
readInData("answers");
