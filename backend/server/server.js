import dotenv from "dotenv";
dotenv.config();
import express from "express"; //create server with express
import authRouter from "./router/auth-router.js";
import contactRouter from "./router/contact-router.js";
import adminRouter from "./router/admin-router.js";
import connection from "./utils/db.js";
import errorMiddleware from "./middleware/error-middleware.js";
import cors from "cors";
const app = express();

const corsOptions = {
  origin: [
    "http://localhost:5173", // local
    "https://ecoomerce-website-427e.vercel.app", // production
  ],

  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, //access-control-allow-credentials:true
};

app.use(cors(corsOptions)); //cors stands for Cross-Origin Resource Sharing. It is used to allow your frontend (React app) to talk to your backend (Node/Express API) when they are running on different origins (URLs/ports).

app.use(express.json());
//middleware help for parsing json data from the request body and sending it to the server Whenever a request comes in with JSON data

app.use("/api/auth", authRouter); //use router

app.use("/api/form", contactRouter);
app.use("/api/admin", adminRouter);

app.use(errorMiddleware); //use error middleware

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// }); //create route and send response

// app.get("/register", (req, res) => {
//   res.send("Hello Register!");
// });

const PORT = process.env.PORT || 8000;

connection().then(() => {
  app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
  }); //start server
});
