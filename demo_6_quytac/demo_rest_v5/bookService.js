// bookService.js
import express from "express";
export const bookService = express.Router();

let books = [
  { id: 1, title: "Lập trình Node.js", borrowed: false, borrowedBy: null },
  { id: 2, title: "Cơ sở dữ liệu", borrowed: true, borrowedBy: "user1" }
];

// Các API xử lý logic chính
bookService.get("/books", (req, res) => {
  const withLinks = books.map(b => ({
    ...b,
    links: [
      { rel: "self", href: `/api/books/${b.id}` },
      { rel: "borrow", href: `/api/books/${b.id}/borrow`, method: "POST" },
      { rel: "return", href: `/api/books/${b.id}/return`, method: "POST" }
    ]
  }));
  res.status(200).json({ user: req.user, books: withLinks });
});

bookService.get("/books/:id", (req, res) => {
  const book = books.find(b => b.id == req.params.id);
  if (!book) return res.status(404).json({ error: "Không tìm thấy sách" });
  res.json(book);
});

bookService.post("/books/:id/borrow", (req, res) => {
  const book = books.find(b => b.id == req.params.id);
  if (!book) return res.status(404).json({ error: "Không tìm thấy sách" });
  if (book.borrowed) return res.status(400).json({ error: "Sách đã được mượn" });

  book.borrowed = true;
  book.borrowedBy = req.user;
  res.status(200).json({ message: `Mượn thành công bởi ${req.user}`, book });
});

bookService.post("/books/:id/return", (req, res) => {
  const book = books.find(b => b.id == req.params.id);
  if (!book) return res.status(404).json({ error: "Không tìm thấy sách" });
  if (!book.borrowed) return res.status(400).json({ error: "Sách chưa được mượn" });
  if (book.borrowedBy !== req.user) return res.status(403).json({ error: "Bạn không mượn sách này" });

  book.borrowed = false;
  book.borrowedBy = null;
  res.status(200).json({ message: "Trả thành công", book });
});
