const http = require("http");

const PORT = 3002;
const serverHandle = require("../app");

const server = http.createServer(serverHandle);
server.listen(PORT);
