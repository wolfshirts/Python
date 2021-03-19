const pool = require("./pg.js");

const getQuestions = (productId, queryObj, cb) => {};
const getAnswers = (questionId, queryObj, cb) => {
  // FIXME: THIS QUERY IS VERY SLOW THE DATA WE WANT IS AT THE END OF THE TABLE.

  // This is a somewhat challenging query to write. I want to select from answers where the id is the lowest possible not reported, and the limit is number of results;

  // SELECT * FROM answers where reported=0 ORDER BY id ASC LIMIT $LIMIT OFFSET $offset;
  const { page, count } = queryObj;
  let offset = 0;
  if (page > 1) {
    // Adjust offset
    offset = page * count;
  }
  const queryArray = [questionId, count, offset];
  // FIXME:  need to get back photos too. Ooops.
  pool.query(
    // "SELECT * FROM answers LEFT OUTER JOIN photos ON answers.id=photos.answer_id WHERE reported=0 AND question_id=$1 ORDER BY answers.id ASC LIMIT $2 OFFSET $3",
    "select answers.*, photos.url, photos.id as photos_id from answers LEFT OUTER JOIN photos ON answers.id = photos.answer_id where reported=0 and question_id=$1 ORDER BY answers.id ASC LIMIT $2 OFFSET $3",
    queryArray,
    (err, result) => {
      if (err) {
        cb(err, null);
      } else {
        cb(null, result.rows);
      }
    }
  );
};

const postNewQuestion = (productId, queryObj, cb) => {
  const { body, name, email } = queryObj;
  const queryArray = [productId, body, name, email];
  pool.query(
    "INSERT INTO questions (product_id, body, date_written, asker_name, asker_email) VALUES ($1, $2, CURRENT_DATE, $3, $4)",
    queryArray,
    (err, res) => {
      if (err) {
        cb(err, null);
      } else {
        cb(null, res);
      }
    }
  );
};

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
