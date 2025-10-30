// pagination_demo.js
import express from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

const app = express();
app.use(express.json());

// === Swagger setup ===
const swaggerDocument = YAML.load("./pagination_demo.yaml");
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// === MOCK DATA ===
let books = [
  { id: 1, title: "Book A" },
  { id: 2, title: "Book B" },
  { id: 3, title: "Book C" },
  { id: 4, title: "Book D" },
  { id: 5, title: "Book E" },
  { id: 6, title: "Book F" },
  { id: 7, title: "Book G" },
  { id: 8, title: "Book H" },
  { id: 9, title: "Book I" },
  { id: 10, title: "Book J" }
];

// (1) Page-based
app.get("/api/books/page", (req, res) => {
  const { page = 1, pageSize = 3 } = req.query;
  const p = parseInt(page);
  const size = parseInt(pageSize);
  const start = (p - 1) * size;
  const end = start + size;
  const result = books.slice(start, end);

  res.json({
    pagination: {
      method: "page-based",
      page: p,
      pageSize: size,
      total: books.length,
      totalPages: Math.ceil(books.length / size)
    },
    data: result
  });
});

// (2) Offset/limit
app.get("/api/books/offset", (req, res) => {
  const { offset = 0, limit = 3 } = req.query;  
  const start = parseInt(offset);
  const lim = parseInt(limit);
  const result = books.slice(start, start + lim);

  res.json({
    pagination: {
      method: "offset-limit",
      offset: start,
      limit: lim,
      total: books.length
    },
    data: result
  });
});

// (3) Cursor-based
app.get("/api/books/cursor", (req, res) => {
  const { cursor, limit = 3 } = req.query;
  const lim = parseInt(limit);
  let start = 0;

  if (cursor) {
    const idx = books.findIndex(b => b.id == cursor);
    start = idx >= 0 ? idx + 1 : 0;
  }

  const result = books.slice(start, start + lim);
  const last = result[result.length - 1];
  const nextCursor = last ? last.id : null;

  res.json({
    pagination: {
      method: "cursor-based",
      limit: lim,
      current_cursor: cursor || null,
      next_cursor: nextCursor
    },
    data: result
  });
});

// (4) Add mock book (dynamic data simulation)
app.post("/api/books/add", (req, res) => {
  const { title, author, year, category } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Thiếu tiêu đề sách (title)" });
  }

  const newId = books.length ? Math.max(...books.map(b => b.id)) + 1 : 1;
  const newBook = {
    id: newId,
    title,
    author: author || "Không rõ",
    year: year || 2025,
    category: category || "Chưa phân loại"
  };

  books.unshift(newBook); // thêm vào đầu danh sách

  res.status(201).json({
    message: "📚 Thêm sách thành công",
    newBook
  });
});


// === Start server ===
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
  console.log(`📘 Swagger Docs: http://localhost:${PORT}/docs`);
});
