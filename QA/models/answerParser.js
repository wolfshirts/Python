const answerParser = (data, withID = true) => {
  // Create the object
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

    if (obj.url === null) {
      delete obj.url;
      delete obj.photos_id;
      seenObjects[obj.answer_id] = obj;
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
  return seenObjects;
};

module.exports = {
  answerParser,
};
