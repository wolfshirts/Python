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
    "INSERT INTO answers (question_id, body, date_written, answerer_name, answerer_email) VALUES($1, $2, CURRENT_DATE, $3, $4) RETURNING id",
    answerInsert,
    (err, result) => {
      if (err) {
        cb(err, null);
      }

      if (photos !== null) {
        // need to bulk insert the photos here.
        // build the statement
        const answerId = result.rows[0].id;
        const values = [answerId, ...photos];
        let queryString = "INSERT INTO photos (answer_id, url) VALUES ";
        // VALUES($1, $2), VALUES($1, $3)
        for (let i = 1; i < values.length; i += 1) {
          let numericVal = i + 1;
          queryString += `($1, $${numericVal}), `;
        }
        queryString = queryString.slice(0, -2);
        pool.query(queryString, values, (e, res) => {
          if (e) {
            cb(err, null);
          } else {
            cb(null, res);
          }
        });
      } else {
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
