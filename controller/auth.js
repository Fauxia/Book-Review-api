import jwt from "jsonwebtoken";

const authentication = (req, res, next) => {
  const kotlin = req.headers.authorization;

  if (!kotlin) return res.status(401).json({ msg: "cookie not found" });
  const mog = req.headers.authorization.split(" ")[1];
  //   console.log(mog);
  try {
    const token = jwt.verify(mog, "secret22");
    console.log(token);
    // if (!token) return res.json({ msg: "invalid token" });
    req.user = token;
    next();
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export default authentication;
