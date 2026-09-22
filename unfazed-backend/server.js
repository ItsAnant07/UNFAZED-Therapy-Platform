require("dotenv").config();
const http = require("http");
const app = require("./app");
const connectDB = require("./src/config/db");
const { initSocket } = require("./src/sockets/chatSocket");

const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB();
  const server = http.createServer(app);
  initSocket(server);
  server.listen(PORT, () => console.log(`Unfazed API running on http://localhost:${PORT}`));
})();
