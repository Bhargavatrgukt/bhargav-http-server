const http = require("http");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const myServer = http.createServer((req, res) => {
  //   console.log(req.url.startsWith("/status/") === true);
  //   let urlForStausCode = [req.url];
  //   console.log(urlForStausCode);
  //   console.log(urlForStausCode[0].startsWith("/status/"));
  if (req.url == "/") {
    res.write("try paths with html,json,status,delay");
    res.end(`\n This is a home page`);
    return;
  }
  if (req.url.startsWith("/status/")) {
    console.log("Status response detected");
    const statusCode = parseInt(req.url.split("/")[2], 10);

    if (statusCode >= 100 && statusCode < 600) {
      res.writeHead(statusCode, { "Content-Type": "text/plain" });
      res.write(`status code Message :${http.STATUS_CODES[statusCode]} \n`);
      res.end(`Response with status code: ${statusCode}`);
    } else {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end(
        "Invalid status code. Please provide a valid HTTP status code (100-599)."
      );
    }
    return; // Ensure no further code runs
  }

  if (req.url.startsWith("/delay/")) {
    const delayInSeconds = parseInt(req.url.split("/")[2], 10); // Extract delay in seconds

    if (isNaN(delayInSeconds) || delayInSeconds < 0) {
      // Invalid delay parameter
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("Invalid delay parameter. Please provide a non-negative number.");
      return;
    }

    console.log(`Delaying response for ${delayInSeconds} seconds...`);

    // Wait for the specified delay before responding
    setTimeout(() => {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(`Success! Delayed response for ${delayInSeconds} seconds.`);
    }, delayInSeconds * 1000); // Delay in milliseconds
    return; // Prevent further processing for other routes
  }

  switch (req.url) {
    case "/html":
      console.log("html response");
      res.writeHead(200, { "content-type": "text/html" });
      fs.readFile("./index.html", (err, data) => {
        err ? res.write("error in handling html case") : res.write(data);
        res.end();
      });
      break;
    case "/json":
      res.writeHead(200, { "content-type": "application/json" });
      fs.readFile("./random.json", (err, data) => {
        err ? res.write("error in handling json case ") : res.write(data);
        res.end();
      });
      break;
    case "/uuid":
      res.writeHead(200, { "content-type": "application/json" });
      const uuid = uuidv4(); // Generating UUID version 4
      res.write(JSON.stringify({ uuid })); // Send the UUID in JSON format as response
      res.end();
      break;
    default:
      res.write("Not Found");
      res.end();
      break;
  }
});

myServer.listen(5000, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`server is started and listening on these ports, ${5000}`);
  }
});
