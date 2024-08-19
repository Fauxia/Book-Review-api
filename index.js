import express from "express";
import mongoose from "mongoose";
import { rom, router, tom } from "./routes/route.js";
import authentication from "./controller/auth.js";
import { asyncRouter } from "./routes/general.js";

const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/bookReviewApplication")
  .then(() => console.log("Mongodb connected"))
  .catch(() => console.log("Error in mongodb"));

const PORT = 5001;

app.use(express.json());

//For task 1-5
app.use("/books", rom);

//For post reviews and update reviews
app.use("/book", authentication, tom);

//for register and signUp
app.use("/auth", router);

//async callbacks and promises
app.use("/book", asyncRouter);

app.listen(PORT, () => {
  console.log(`Server running at Port ${PORT}`);
});
