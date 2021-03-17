const pool = require("./pg.js");

const markAnswerAsHelpful = (answerId, cb) => {
  pool.query(
    "UPDATE answers SET helpful=(helpful+1) WHERE id=$1",
    [answerId],
    (err, result) => {
      if (err) {
        cb(err, null);
      } else {
        cb(null, result);
      }
    }
  );
};

const reportAnswer = (answerId, cb) => {
  pool.query(
    "UPDATE answers SET reported=(reported+1) WHERE id=$1",
    [answerId],
    (err, result) => {
      if (err) {
        cb(err, null);
      } else {
        cb(null, result);
      }
    }
  );
};

const markQuestionAsHelpful = (questionId, cb) => {
  pool.query(
    "UPDATE questions SET helpful=(helpful+1) WHERE id=$1",
    [questionId],
    (err, result) => {
      if (err) {
        cb(err, null);
      } else {
        cb(null, result);
      }
    }
  );
};

const reportQuestion = (questionId, cb) => {
  pool.query(
    "UPDATE questions SET reported=(reported+1) WHERE id=$1",
    [questionId],
    (err, result) => {
      if (err) {
        cb(err, null);
      } else {
        cb(null, result);
      }
    }
  );
};

module.exports = {
  markQuestionAsHelpful,
  reportQuestion,
  markAnswerAsHelpful,
  reportAnswer,
};
