const express = require("express");
const queries = require("../models/queries");
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
    count: req.query.count || 1,
  };
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
  const queryObj = {
    question_id: req.params.question_id,
    body: req.body.body,
    name: req.body.name,
    email: req.body.email,
    photos: [req.body.photos] || null,
  };
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
  // use answer_id to helpful.
});

app.put("/qa/answers/:answer_id/report", (req, res) => {
  // needs answer_id
  // status 204
  if (!req.params.answer_id) {
    res.status(400).send("Missing answer_id");
  }
  //use answer id to report.
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
