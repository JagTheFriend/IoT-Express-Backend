import bodyParser from "body-parser";
import express from "express";
import { deleteUser, getUser, newUser, updateUser } from "./routes/user";

const app = express();

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/user/new", newUser);
app.get("/user", getUser);
app.post("/user/edit", updateUser);
app.delete("/user", deleteUser);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
