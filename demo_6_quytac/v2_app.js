// server.js
import express from "express";
const app = express();
app.use(express.json());

let books = [
  { id: 1, title: "Lập trình Node.js", borrowed: false },
  { id: 2, title: "Cơ sở dữ liệu", borrowed: true }
];

// (1) Identification of Resources: tài nguyên có URL rõ ràng
app.get("/api/books", (req, res) => {
  // (4) HATEOAS: thêm link cho từng tài nguyên
  const withLinks = books.map(b => ({
    ...b,
    links: [
      { rel: "self", href: `/api/books/${b.id}` },
      { rel: "borrow", href: `/api/books/${b.id}/borrow`, method: "POST" },
      { rel: "return", href: `/api/books/${b.id}/return`, method: "POST" }
    ]
  }));
  res.status(200).json(withLinks);
});

// (1) GET /api/books/:id - lấy 1 tài nguyên
app.get("/api/books/:id", (req, res) => {
  const book = books.find(b => b.id == req.params.id);
  if (!book) {
    // (3) Self-descriptive message: status code + body + content-type
    return res.status(404).json({ error: "Không tìm thấy sách" });
  }
  res.json({
    ...book,
    links: [
      { rel: "self", href: `/api/books/${book.id}` },
      { rel: "borrow", href: `/api/books/${book.id}/borrow`, method: "POST" },
      { rel: "return", href: `/api/books/${book.id}/return`, method: "POST" }
    ]
  });
});

// (2) Manipulation through representation: thao tác qua JSON (POST)
app.post("/api/books/:id/borrow", (req, res) => {
  const book = books.find(b => b.id == req.params.id);
  if (!book) return res.status(404).json({ error: "Không tìm thấy sách" });
  if (book.borrowed) return res.status(400).json({ error: "Sách đã được mượn" });
  book.borrowed = true;
  res.status(200).json({
    message: "Mượn thành công",
    book,
    links: [{ rel: "return", href: `/api/books/${book.id}/return`, method: "POST" }]
  });
});

app.post("/api/books/:id/return", (req, res) => {
  const book = books.find(b => b.id == req.params.id);
  if (!book) return res.status(404).json({ error: "Không tìm thấy sách" });
  if (!book.borrowed) return res.status(400).json({ error: "Sách chưa được mượn" });
  book.borrowed = false;
  res.status(200).json({
    message: "Trả thành công",
    book,
    links: [{ rel: "borrow", href: `/api/books/${book.id}/borrow`, method: "POST" }]
  });
});

app.listen(3000, () => console.log("Server API tại http://localhost:3000"));
