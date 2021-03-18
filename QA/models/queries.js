const pool = require("./pg.js");

const getQuestions = (productId, queryObj, cb) => {};
const getAnswers = (questionId, queryObj, cb) => {
  // Check if the
  pool.query("SELECT * FROM answers WHERE question_id=$1");
};

const postNewQuestion = (questionId, queryObj, cb) => {};
const postNewAnswer = (questionId, queryObj, cb) => {
  // CURRENT_DATE gives us the format we need.
  const { question_id, body, name, email, photos } = queryObj;
  const answerInsert = [question_id, body, name, email];
  pool.query(
    "INSERT INTO answers (question_id, body, date_written, answerer_name, answerer_email) VALUES($1, $2, CURRENT_DATE, $3, $4",
    answerInsert,
    (err, result) => {
      if (err) {
        cb(err, null);
      }
      // else if (photos !== null) {
      //   // If there are photos we're not done. We need to insert them as well.
      //   photos.forEach((photo)=>{

      //   });
      // }
      else {
        cb(null, result);
      }
    }
  );
};

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
  postNewAnswer,
  postNewQuestion,
  getAnswers,
  getQuestions,
};
