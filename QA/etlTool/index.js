const fs = require("fs");
const path = require("path");
const readLine = require("readline");

const files = [
  path.join(__dirname, "../rawData", "answers_photos.csv"),
  path.join(__dirname, "rawData", "answers.csv"),
  path.join(__dirname, "rawData", "questions.csv"),
];

const getDataObjects = (dataObjects) => {
  console.log(dataObjects);
  return dataObjects;
};

const readInData = (lines, table = 0) => {
  const rawData = files[table];
  const stream = fs.createReadStream(rawData, "utf8");
  // Read first line, so that I have my column names
  // Ignore first line of data.
  const line = readLine.createInterface({
    input: stream,
  });
  let currentLineCount = 0;
  let dataObjects = [];
  let values = [];
  callback = getDataObjects;
  line.on("line", (data) => {
    if (currentLineCount > lines) {
      stream.destroy();
      line.close();
      return callback(dataObjects);
    }
    let dataObj = {};
    if (currentLineCount === 0) {
      values = data.toString().split(",");
      currentLineCount += 1;
    } else {
      let dataValues = data.split(",");
      for (let i = 0; i < values.length; i++) {
        dataObj[values[i]] = dataValues[i];
      }
      dataObjects.push(dataObj);
      currentLineCount += 1;
    }
  });
};

readInData(3);
