// server.js
import express from "express";
const app = express();

let books = [
  { id: 1, title: "Lập trình Node.js", borrowed: false },
  { id: 2, title: "Cơ sở dữ liệu", borrowed: true }
];

// API trả JSON thay vì HTML
app.get("/api/books", (req, res) => res.json(books));

app.listen(3000, () => console.log("Server API tại http://localhost:3000"));
