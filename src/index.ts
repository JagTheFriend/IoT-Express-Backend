import bodyParser from "body-parser";
import express, { NextFunction, Request, Response } from "express";
import { deleteUser, getUser, newUser } from "./routes/user";

const app = express();

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/user/new", newUser);
app.get("/user", getUser);
app.post("/user/delete", deleteUser);
app.delete("/user", deleteUser);

// Error handling middleware to catch all errors
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err) {
    res.status(500).json({ message: "Internal Server Error" });
  } else {
    next();
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
