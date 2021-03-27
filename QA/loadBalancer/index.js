const express = require("express");
const http = require("http");
const secrets = require("../config.js");

const app = express();
const apiUrls = [
  "ec2-3-21-129-111.us-east-2.compute.amazonaws.com",
  "ec2-3-142-49-185.us-east-2.compute.amazonaws.com",
];

app.use(express.json());

const port = 3000;

app.get(`/${secrets.loaderRoute}`, (req, res) => {
  res.status(200).send(secrets.loaderResponse);
});

// Route for get balancer.
let currentUrl = 0;

// cache
const cache = {};
// counter to make sure the cache doesn't get out of hand.
let counter = 0;
// array storing cache keys we want to remove the key at the front since it's the last accessed.
const keys = [];

app.get("/*", (req, res) => {
  currentUrl += 1;
  if (currentUrl > apiUrls.length - 1) {
    currentUrl = 0;
  }

  if (cache[req.originalUrl]) {
    res.status(200).send(cache[req.originalUrl]).end();
  }

  console.log(`Sending to ${apiUrls[currentUrl]}`);
  const url = apiUrls[currentUrl];
  // Logic to round robin.
  const requestOptions = {
    port: 3000,
    path: req.originalUrl,
    method: req.method,
    headers: req.headers,
  };

  http.get(`http://${url}:3000${req.originalUrl}`, (resp) => {
    let data;
    resp.setEncoding("utf8");
    resp.on("data", (chunk) => {
      data += chunk;
    });
    resp.on("end", () => {
      data = JSON.parse(data.slice(9));
      if (!cache[req.originalUrl]) {
        cache[req.originalUrl] = data;
        keys.push(req.originalUrl);
      }
      counter += 1;
      if (counter > 100) {
        delete cache[keys.shift()];
      }
      res.send(data);
    });
  });
});

app.listen(port, () => {
  console.log(`Load balancer listening on http://localhost:${port}`);
});
