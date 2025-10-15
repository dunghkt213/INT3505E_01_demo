// v3_app.js
import express from "express";
const app = express();
app.use(express.json());

// Giả lập “database”
let books = [
  { id: 1, title: "Lập trình Node.js", borrowed: false, borrowedBy: null },
  { id: 2, title: "Cơ sở dữ liệu", borrowed: true, borrowedBy: "user1" }
];

// Middleware kiểm tra token (Stateless)
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "Thiếu Authorization header" });

  // Giả lập xác thực token: “Bearer user1”
  const [type, token] = auth.split(" ");
  if (type !== "Bearer" || !token) return res.status(400).json({ error: "Token không hợp lệ" });

  // Không lưu state! Gắn tạm user vào req để xử lý request này thôi
  req.user = token;
  next();
}

// (1) Identification of Resources: tài nguyên rõ ràng
app.get("/api/books", authMiddleware, (req, res) => {
  // (4) HATEOAS + (Stateless): phản hồi phụ thuộc hoàn toàn vào dữ liệu, không cần nhớ session
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

// (1) GET /api/books/:id
app.get("/api/books/:id", authMiddleware, (req, res) => {
  const book = books.find(b => b.id == req.params.id);
  if (!book) return res.status(404).json({ error: "Không tìm thấy sách" });

  res.json({
    ...book,
    links: [
      { rel: "self", href: `/api/books/${book.id}` },
      { rel: "borrow", href: `/api/books/${book.id}/borrow`, method: "POST" },
      { rel: "return", href: `/api/books/${book.id}/return`, method: "POST" }
    ]
  });
});

// (2) Manipulation through representation (POST)
app.post("/api/books/:id/borrow", authMiddleware, (req, res) => {
  const book = books.find(b => b.id == req.params.id);
  if (!book) return res.status(404).json({ error: "Không tìm thấy sách" });
  if (book.borrowed) return res.status(400).json({ error: "Sách đã được mượn" });

  // Ghi nhận người mượn theo token
  book.borrowed = true;
  book.borrowedBy = req.user;

  res.status(200).json({
    message: `Mượn thành công bởi ${req.user}`,
    book,
    links: [{ rel: "return", href: `/api/books/${book.id}/return`, method: "POST" }]
  });
});

app.post("/api/books/:id/return", authMiddleware, (req, res) => {
  const book = books.find(b => b.id == req.params.id);
  if (!book) return res.status(404).json({ error: "Không tìm thấy sách" });
  if (!book.borrowed) return res.status(400).json({ error: "Sách chưa được mượn" });
  if (book.borrowedBy !== req.user) return res.status(403).json({ error: "Bạn không mượn sách này" });

  book.borrowed = false;
  book.borrowedBy = null;

  res.status(200).json({
    message: "Trả thành công",
    book,
    links: [{ rel: "borrow", href: `/api/books/${book.id}/borrow`, method: "POST" }]
  });
});

app.listen(3000, () => console.log("Server API (v3) chạy tại http://localhost:3000"));
