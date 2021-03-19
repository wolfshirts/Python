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
  debugger;
  if (withIDAsKey) {
    return objArray;
  }

  return seenObjects;
};

module.exports = {
  answerParser,
};
