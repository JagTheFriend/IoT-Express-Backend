import bodyParser from "body-parser";
import express from "express";

const app = express();

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/user/new", (req, res) => {});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
