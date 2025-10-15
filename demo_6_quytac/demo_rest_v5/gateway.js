// gateway.js
import express from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { bookService } from "./bookService.js";

const app = express();
app.use(express.json());

const SECRET_KEY = "MY_SECRET_KEY_JWT";

// Giả lập user
const users = [{ username: "user1", password: "123" }];

// ✅ Đăng nhập để lấy token
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ error: "Sai tài khoản hoặc mật khẩu" });

  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ message: "Đăng nhập thành công", token });
});

// ✅ Middleware xác thực + cache + logging
app.use((req, res, next) => {
  console.log(`[Gateway] ${req.method} ${req.url}`);
  next();
});

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "Thiếu Authorization header" });

  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded.username;
    next();
  } catch {
    res.status(401).json({ error: "Token không hợp lệ hoặc hết hạn" });
  }
}

// ✅ Middleware cache ETag
app.use((req, res, next) => {
  const send = res.send;
  res.send = function (body) {
    if (typeof body === "string" && body.trim().startsWith("{")) {
      const etag = crypto.createHash("md5").update(body).digest("hex");
      res.set("Cache-Control", "public, max-age=30");
      res.set("ETag", etag);
    }
    send.call(this, body);
  };
  next();
});

// ✅ Chuyển tiếp xuống Service Layer
app.use("/api", authMiddleware, bookService);

// ✅ Layered System hoạt động
app.listen(3000, () => console.log("Gateway Layer tại http://localhost:3000"));
