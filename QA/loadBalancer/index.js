const express = require("express");
const http = require("http");
const secrets = require("../config.js");

const app = express();
const apiUrls = [
  "ec2-18-217-79-188.us-east-2.compute.amazonaws.com",
  "ec2-18-222-227-211.us-east-2.compute.amazonaws.com",
];

app.use(express.json());

const port = 3000;

app.get(`/${secrets.loaderRoute}`, (req, res) => {
  res.status(200).send(secrets.loaderResponse);
});

// Route for get balancer.
let currentUrl = 0;
app.get("/*", (req, res) => {
  currentUrl += 1;
  if (currentUrl > apiUrls.length - 1) {
    currentUrl = 0;
  }
  debugger;
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
      res.send(data);
    });
  });
});

app.listen(port, () => {
  console.log(`Load balancer listening on http://localhost:${port}`);
});
