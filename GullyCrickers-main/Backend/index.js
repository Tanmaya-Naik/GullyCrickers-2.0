require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { initSocket } = require("./socket")

const app = express();
const server = http.createServer(app);
// Middleware
app.use(cors());
app.use(express.json());

// const io = new Server(server, {
//   cors:{
//     origin:"*"
//   }
// });


//INITIALIZE SOCKET
initSocket(server);

// DB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.error("DB Connection Error:", err);
  });

//   console.log("ENV:", process.env.MONGO_URI);

const authRoutes = require("./routes/authroutes");
app.use("/api/auth", authRoutes);

const matchRoutes = require("./routes/matchroutes");
// const { initSocket } = require("./socket");
app.use("/api/match", matchRoutes);
// Test Route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Server Start
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



// require("dotenv").config();

// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");

// const app = express();

// app.use(cors());
// app.use(express.json());

// //connect to the mongodb 
// mongoose.connect(process.env.MONGO_URI)
// .then(()=>{
//   console.log("Mongodb Connected successfull");
// }).catch((err)=>{

//   console.log("Connection to mongodb failed ",err);

// });


// //test routes
// app.get("/",(req, res)=>{
//   res.send("Server is running");
// });


// const PORT = process.env.PORT || 3000;
// app.listen(PORT, ()=>{
//   console.log(`Server running on port ${PORT}`);
// });