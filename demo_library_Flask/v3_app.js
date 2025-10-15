// v4_app_jwt.js
import express from "express";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());

// Giả lập "cơ sở dữ liệu"
let users = [{ username: "user1", password: "123" }];
let books = [
  { id: 1, title: "Lập trình Node.js", borrowed: false, borrowedBy: null },
  { id: 2, title: "Cơ sở dữ liệu", borrowed: true, borrowedBy: "user1" }
];

// Khóa bí mật để ký JWT (thật thì để trong biến môi trường)
const SECRET_KEY = "MY_SECRET_KEY_JWT";

// (A) Đăng nhập để lấy JWT
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ error: "Sai tài khoản hoặc mật khẩu" });

  // Tạo token có hạn 1h
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ message: "Đăng nhập thành công", token });
});

// Middleware xác thực JWT (Stateless)
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "Thiếu Authorization header" });

  const token = auth.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded.username; // Gắn user cho request hiện tại
    next();
  } catch (err) {
    res.status(401).json({ error: "Token không hợp lệ hoặc hết hạn" });
  }
}

// (1) Lấy danh sách sách
app.get("/api/books", authMiddleware, (req, res) => {
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

// (2) Lấy 1 quyển sách
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

// (3) Mượn sách
app.post("/api/books/:id/borrow", authMiddleware, (req, res) => {
  const book = books.find(b => b.id == req.params.id);
  if (!book) return res.status(404).json({ error: "Không tìm thấy sách" });
  if (book.borrowed) return res.status(400).json({ error: "Sách đã được mượn" });

  book.borrowed = true;
  book.borrowedBy = req.user;

  res.status(200).json({
    message: `Mượn thành công bởi ${req.user}`,
    book,
    links: [{ rel: "return", href: `/api/books/${book.id}/return`, method: "POST" }]
  });
});

// (4) Trả sách
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

app.listen(3000, () => console.log("Server JWT API tại http://localhost:3000"));
