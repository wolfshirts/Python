const query = require("./queries");

const filterQuestions = (dataRows, productId, cb) => {
  // FIXME: this currently returns reported answers.
  const responseObject = {
    product_id: productId.toString(),
    results: [],
  };

  const seenAnswers = {};
  const seenQuestions = {};
  dataRows.forEach((obj) => {
    // Create the results obj.
    // Destructure for easier building
    const {
      question_id,
      question_body,
      question_date,
      asker_name,
      question_helpfulness,
      answer_id,
      answer_reported,
      answerer_email,
      answerer_name,
      body,
      helpfulness,
      photo_id,
      photos_answer_id,
      date,
      url,
    } = obj;
    // If we haven't seen this question, put it in seen questions. But we also have data pertaining to answers in this row.

    if (!seenQuestions[question_id]) {
      const resultObj = {
        question_id,
        question_body,
        question_date: question_date.toISOString(),
        asker_name,
        question_helpfulness,
        reported: false,
        answers: {},
      };
      seenQuestions[question_id] = resultObj;
    }

    // If we haven't seen this answer, put it in answers.
    if (!seenAnswers[answer_id]) {
      const answerObj = {
        id: answer_id,
        body,
        date: date.toISOString(),
        answerer_name,
        helpfulness,
        photos: [],
      };
      seenAnswers[answer_id] = answerObj;
      // If we have photos on this answer row, attach them to this obj photos
      if (url !== undefined) {
        const photoObj = {
          id: photo_id,
          url,
        };
        seenAnswers[answer_id].photos.push(photoObj);
      }
      // Then we want to attach it to the appropriate question, so we do that by doing
    } else {
      // If we've seen this answer already, we're seeing it again because it has to do with photos
      if (url !== undefined) {
        const photoObj = {
          id: photo_id,
          url,
        };
        seenAnswers[answer_id].photos.push(photoObj);
      }
    }
    if (seenQuestions[question_id] && seenAnswers[answer_id]) {
      seenQuestions[question_id].answers[answer_id] = seenAnswers[answer_id];
    }
  });
  // Another loop theres probably a way around this but i'm beat.
  Object.values(seenQuestions).forEach((obj) => {
    responseObject.results.push(obj);
  });
  cb(null, responseObject);
};

const answerParser = (data, withIDAsKey = true) => {
  // Create the object

  // Ayyyy! To do this in constant time we just push our objects into an array as well.

  // The bug was when I push to the array, I push the object. But I need to be pushing the reference.
  const objArray = [];
  const seenObjects = {};
  // Object is converted

  data.forEach((obj) => {
    // We should only ever have one instance of the obj id in our seen objects.
    obj.answer_id = obj.id;
    delete obj.id;
    obj.date = obj.date_written.toISOString();
    delete obj.date_written;
    obj.helpfulness = obj.helpful;
    delete obj.helpful;
    delete obj.reported;
    obj.photos = [];
    // If i'm right here, we can just push the obj to the array too it should act as a reference.

    //Here we're pushing to the obj array early
    if (obj.url === null) {
      delete obj.url;
      delete obj.photos_id;
      seenObjects[obj.answer_id] = obj;
      objArray.push(obj);
    }

    if (withIDAsKey) {
      delete obj.question_id;
    }

    if (obj.url) {
      // If we have a url we might have more.

      // So we put the obj in our seen objects with the key being its answer id to look it up.
      if (!seenObjects[obj.answer_id]) {
        // This is our first encounter, so we setup the array
        obj.photos = [];
        // Then we push the info we need into the array as an object.
        const photoObj = {
          id: obj.photos_id,
          url: obj.url,
        };
        obj.photos.push(photoObj);
        // Should be safe to delete info now
        delete obj.url;
        delete obj.photos_id;
        seenObjects[obj.answer_id] = obj;
        objArray.push(obj);
      } else {
        // If we've seen the object already we can push a photo obj to its array.
        // These should all be stored by reference, so at the end of this we can clear the
        // extra data.
        const photoObj = {
          id: obj.photos_id,
          url: obj.url,
        };
        seenObjects[obj.answer_id].photos.push(photoObj);
      }
    }
  });

  if (withIDAsKey) {
    return objArray;
  }

  return seenObjects;
};

// FIXME: This has issues. It's very slow.
const questionParser = (dataRows, cb) => {
  // Initial parse through just clean up the data a bit.
  const max = dataRows.length;
  let counter = 0;
  dataRows.forEach((obj) => {
    obj.question_id = obj.id;
    obj.question_body = obj.body;
    obj.question_date = obj.date_written.toISOString();
    obj.reported = obj.reported !== 0;
    obj.question_helpfulness = obj.helpful;
    delete obj.asker_email;
    delete obj.id;
    delete obj.body;
    delete obj.date_written;
    delete obj.helpful;
    delete obj.product_id;
    // Need to attach an answers obj try it with promises?
    const defaultQueryObj = {
      page: 1,
      count: 5,
      workingObjReference: obj,
    };
    query.getAnswers(obj.question_id, defaultQueryObj, (err, result) => {
      if (err) {
        cb(err, null);
      } else {
        const queryObj = defaultQueryObj;
        counter += 1;
        if (result.length > 0) {
          // Let's write to our dataRows.
          for (let h = 0; h < result.length; h++) {
            const formattedResult = answerParser(result, false);
            for (let i = 0; i < dataRows.length; i += 1) {
              if (dataRows[i].question_id === result[h].question_id) {
                const exist = dataRows[i].answers || {};
                delete formattedResult.questionId;
                const copy = { ...exist, ...formattedResult };
                dataRows[i].answers = copy;
              }
            }
          }
          if (counter === max) {
            cb(null, dataRows);
          }
        }
      }
    });
  });
};

module.exports = {
  answerParser,
  questionParser,
  filterQuestions,
};
