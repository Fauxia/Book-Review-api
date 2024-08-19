import express from "express";
import Book from "../models/books.js";

const asyncRouter = express.Router();

//?Task 10

asyncRouter.get("/", (req, res) => {
  Book.find({}, (err, book) => {
    if (err) return res.status(404).json({ msg: "book not found" });
    return res.json({ book });
  });
});

//?Task 11

asyncRouter.get("/isbn/:isbn", (req, res) => {
  Book.findOne({ isbn: req.params.isbn })
    .then((book) => {
      if (!book) return res.json({ msg: "book not found" });
      return res.status(200).json({ book });
    })
    .catch((err) => res.status(500).json({ err: err.message }));
});

//?Task 12

asyncRouter.get("/author/:author", (req, res) => {
  Book.findOne({ author: req.params.author })
    .then((book) => {
      if (!book) return res.json({ msg: "book not found" });
      return res.status(200).json({ book });
    })
    .catch((err) => res.status(500).json({ err: err.message }));
});

//?Task 13s

asyncRouter.get("/title/:title", (req, res) => {
  Book.findOne({ title: req.params.title })
    .then((book) => {
      if (!book) return res.json({ msg: "book not found" });
      return res.status(200).json({ book });
    })
    .catch((err) => res.status(500).json({ err: err.message }));
});

export { asyncRouter };
