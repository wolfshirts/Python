const express = require("express");
const queries = require("../models/queries");
const parser = require("../models/parsers");

const app = express();

app.use(express.json());
const port = 3000;

// Basic routes.

app.get("/qa/questions", (req, res) => {
  // query product_id mandatory
  // param page default 1
  // param count default 5
  // status 200

  if (!req.query.product_id) {
    res.status(400).send("Product ID is required.");
  }
  const queryObj = {
    product_id: req.query.product_id,
    page: req.query.page || 1,
    count: req.query.count || 5,
  };
  // First I get all the questions that the client is looking for.
  // Then I store those questions, and run a check for answers.

  queries.getQuestions(queryObj.product_id, queryObj, (err, result) => {
    if (err) {
      res.status(400).send(err);
    } else {
      parser.filterQuestions(result.rows, queryObj.product_id, (e, ressie) => {
        res.status(200).send(ressie);
      });
    }
  });
  // Send the query object to our get questions pool.
});

app.get("/qa/questions/:question_id/answers", (req, res) => {
  // param question_id mandatory
  // page default 1
  // count default 5
  // status 200
  if (!req.params.question_id) {
    res.status(400).send("Question ID is required.");
  }
  const queryObj = {
    question_id: req.params.question_id,
    page: req.query.page || 1,
    count: req.query.count || 5,
  };
  queries.getAnswers(req.params.question_id, queryObj, (err, result) => {
    if (err) {
      res.status(400).send(err);
    } else {
      // Create the object
      //const seenObjects = {};

      // Object is converted
      const parsedData = parser.answerParser(result);
      // result.forEach((obj) => {
      //   // We should only ever have one instance of the obj id in our seen objects.
      //   obj.answer_id = obj.id;
      //   delete obj.id;
      //   obj.date = obj.date_written.toISOString();
      //   delete obj.date_written;
      //   obj.helpfulness = obj.helpful;
      //   delete obj.helpful;
      //   delete obj.reported;

      //   if (obj.url === null) {
      //     delete obj.url;
      //     delete obj.photos_id;
      //     seenObjects[obj.answer_id] = obj;
      //   }

      //   if (obj.url) {
      //     // If we have a url we might have more.

      //     // So we put the obj in our seen objects with the key being its answer id to look it up.
      //     if (!seenObjects[obj.answer_id]) {
      //       // This is our first encounter, so we setup the array
      //       obj.photos = [];
      //       // Then we push the info we need into the array as an object.
      //       const photoObj = {
      //         id: obj.photos_id,
      //         url: obj.url,
      //       };
      //       obj.photos.push(photoObj);
      //       // Should be safe to delete info now
      //       delete obj.url;
      //       delete obj.photos_id;
      //       seenObjects[obj.answer_id] = obj;
      //     } else {
      //       // If we've seen the object already we can push a photo obj to its array.
      //       // These should all be stored by reference, so at the end of this we can clear the
      //       // extra data.
      //       const photoObj = {
      //         id: obj.photos_id,
      //         url: obj.url,
      //       };
      //       seenObjects[obj.answer_id].photos.push(photoObj);
      //     }
      //   }
      // });

      // Get the urls attached with id.
      const responseJson = {
        question: `${req.params.question_id}`,
        page: req.query.page || 1,
        count: req.query.count || 5,
        results: parsedData,
      };
      res.status(200).send(responseJson);
    }
  });
});

app.post("/qa/questions", (req, res) => {
  // Needs a body, body must have:
  // body, name, email, product_id
  // status 201
  // pre parse the incoming data.
  if (
    !req.body.body ||
    !req.body.name ||
    !req.body.email ||
    !req.body.product_id
  ) {
    res.status(400).send("Missing required parameters.");
  }
  const queryObj = {
    product_id: req.body.product_id,
    name: req.body.name,
    body: req.body.body,
    email: req.body.email,
  };
  queries.postNewQuestion(req.body.product_id, queryObj, (err, result) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.send(201);
    }
  });
});

app.post("/qa/questions/:question_id/answers", (req, res) => {
  // question_id is mandatory.
  // must have: body, name, email
  // might have: photos
  // status 201
  if (
    !req.params.question_id ||
    !req.body.name ||
    !req.body.email ||
    !req.body.body
  ) {
    res.status(400).send("Missing required parameters.");
  }
  // Hopefully they send photos as a string, and not as a blob or something.
  if (req.body.photos && !Array.isArray(req.body.photos)) {
    res.status(400).send("Photos must be array.");
  }
  const queryObj = {
    question_id: req.params.question_id,
    body: req.body.body,
    name: req.body.name,
    email: req.body.email,
    photos: req.body.photos || null,
  };
  queries.postNewAnswer(req.params.question_id, queryObj, (err) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.send(201);
    }
  });
});

app.put("/qa/questions/:question_id/helpful", (req, res) => {
  // needs that id.
  // status 204
  if (!req.params.question_id) {
    res.status(400).send("Missing question_id");
  }
  // use questionId to mark helpful.
  queries.markQuestionAsHelpful(req.params.question_id, (err, result) => {
    if (err) {
      console.error(err);
      res.status(400).send(err);
    } else {
      res.status(204);
    }
  });
});

app.put("/qa/questions/:question_id/report", (req, res) => {
  // needs question id.
  // status 204
  if (!req.params.question_id) {
    res.status(400).send("Missing question_id");
  }
  // user question_id to report.
  queries.reportQuestion(req.params.question_id, (err, result) => {
    if (err) {
      console.error(err);
      res.status(400).send(err);
    } else {
      res.status(204);
    }
  });
});

app.put("/qa/answers/:answer_id/helpful", (req, res) => {
  // needs answer_id
  // status 204
  if (!req.params.answer_id) {
    res.status(400).send("Missing answer_id");
  }
  queries.markAnswerAsHelpful(req.params.answer_id, (err, result) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(204);
    }
  });
});

app.put("/qa/answers/:answer_id/report", (req, res) => {
  // needs answer_id
  // status 204
  if (!req.params.answer_id) {
    res.status(400).send("Missing answer_id");
  }
  queries.reportAnswer(req.params.answer_id, (err, result) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(204);
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
