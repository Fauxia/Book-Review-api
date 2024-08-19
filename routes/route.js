import express from "express";
import Book from "../models/books.js";
import Review from "../models/review.js";
import User from "../models/user.js";
import jwt from "jsonwebtoken";

const router = express.Router();

const rom = express.Router();

const tom = express.Router();

rom.post("/", async (req, res) => {
  const { isbn, title, author } = req.body;
  try {
    const newBook = new Book({
      isbn,
      title,
      author,
    });
    await newBook.save();
    return res.status(201).json({ msg: "Book created" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

//?TASK 1

rom.get("/", async (req, res) => {
  try {
    const books = await Book.find({});
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ msg: "hy" });
  }
});

//?TASK 2

rom.get("/isbn/:isbn", async (req, res) => {
  try {
    const findBook = await Book.findOne({ isbn: req.params.isbn });
    if (!findBook) return res.json({ msg: "no book found" });
    return res.json({ findBook });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});

//TASK 3

rom.get("/author/:author", async (req, res) => {
  try {
    const findBook = await Book.find({ author: req.params.author });
    return res.json({ findBook });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});

rom.get("/title/:title", async (req, res) => {
  try {
    const findBook = await Book.find({ title: req.params.title });
    return res.json({ findBook });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});

rom.get("/review/:isbn", async (req, res) => {
  try {
    const findReview = await Book.findOne({ isbn: req.params.isbn });
    console.log(findReview);
    if (!findReview) return res.json({ msg: "book not found" });
    const ff = await Review.findOne({ book: findReview._id });
    return res.status(200).json({ ff });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const newUser = new User({
      username,
      email,
      password,
    });
    await newUser.save();
    return res.status(201).json({ msg: "user registered" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const find = await User.findOne({ username });
    if (!find)
      return res.status(401).json({ msg: "username or password incorrect" });
    const hashedPassword = find.comparePassword(find.password, password);
    if (!hashedPassword)
      return res.status(401).json({ msg: "username or password incorrect" });
    const token = jwt.sign({ id: find._id }, "secret22");
    res.cookie("cook", token);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

tom.post("/review/:bookId", async (req, res) => {
  const bookId = req.params.bookId;
  const { rating, content } = req.body;
  const userId = req.user.id;
  try {
    const gem = await Book.findById(bookId);
    if (!gem) return res.json({ msg: "Book not found" });
    const newReview = new Review({
      book: gem.id,
      user: userId,
      rating,
      content,
    });
    await newReview.save();
    res.status(201).json({ msg: "Review added successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

tom.put("/review/:bookId/reviewId/:reviewId", async (req, res) => {
  const { bookId, reviewId } = req.params;
  const { rating, content } = req.body;
  const userId = req.user.id; // Extracted from JWT after authentication

  console.log({ bookId, reviewId, userId });

  try {
    const review = await Review.findOne({
      _id: reviewId,
      book: bookId,
      user: userId,
    });
    console.log(review);
    if (!review) {
      return res.status(404).json({
        message: "Review not found or not authorized to modify this review",
      });
    }

    // Update the review fields
    review.rating = rating;
    review.content = content;
    await review.save();

    res.status(200).json({ message: "Review updated successfully", review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

tom.delete("/review/:bookId/reviewId/:reviewId", async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({
      _id: req.params.reviewId,
      user: req.user.id,
    });
    if (!review) return res.status(404).json({ message: "Review not found" });

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export { router, rom, tom };
