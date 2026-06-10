const http = require("http");
const fs = require("fs");
const os = require("os");
const path = require("path");

const root = __dirname;
const port = 4173;

const getArgument = (name) => {
  let value;

  process.argv.slice(2).forEach((argument, index, argumentsList) => {
    if (argument === name && argumentsList[index + 1]) {
      value = argumentsList[index + 1];
    } else if (argument.startsWith(`${name}=`)) {
      value = argument.slice(name.length + 1);
    }
  });

  return value;
};

const host = getArgument("--host") || process.env.HOST || "0.0.0.0";
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

const server = http.createServer((request, response) => {
  const requestPath = decodeURIComponent(request.url.split("?")[0]);
  const relativePath = requestPath === "/" ? "index.html" : requestPath.slice(1);
  const filePath = path.resolve(root, relativePath);

  if (!filePath.startsWith(root)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.writeHead(error.code === "ENOENT" ? 404 : 500);
      response.end(error.code === "ENOENT" ? "Not found" : "Server error");
      return;
    }

    response.writeHead(200, {
      "Content-Type": contentTypes[path.extname(filePath)] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    response.end(content);
  });
});

server.listen(port, host, () => {
  const urls = new Set();

  if (host === "0.0.0.0" || host === "::") {
    urls.add(`http://localhost:${port}`);

    Object.values(os.networkInterfaces())
      .flat()
      .filter((network) => network && network.family === "IPv4" && !network.internal)
      .forEach((network) => urls.add(`http://${network.address}:${port}`));
  } else {
    urls.add(`http://${host}:${port}`);
  }

  console.log(`Playground site listening on ${host}:${port}`);
  console.log("Available URLs:");
  urls.forEach((url) => console.log(`  ${url}`));
});
