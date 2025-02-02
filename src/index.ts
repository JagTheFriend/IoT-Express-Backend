import bodyParser from "body-parser";
import express from "express";

import { deleteCard, getCard, newCard, updateCard } from "./routes/card";
import {
  getTransaction,
  newTransaction,
  updateTransaction,
} from "./routes/transaction";
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

app.post("/card/new", newCard);
app.get("/card", getCard);
app.post("/card/edit", updateCard);
app.delete("/card", deleteCard);

app.post("/transaction/new", newTransaction);
app.get("/transaction", getTransaction);
app.post("/transaction/edit", updateTransaction);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
