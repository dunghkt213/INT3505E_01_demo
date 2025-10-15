// v6_app_code_on_demand.js
import express from "express";
const app = express();

// Dữ liệu “database” đơn giản
let books = [
  { id: 1, title: "Lập trình Node.js", borrowed: false },
  { id: 2, title: "Thiết kế REST API", borrowed: true },
  { id: 3, title: "Cấu trúc dữ liệu", borrowed: false },
];

// 🧠 1️⃣ API trả JSON (data)
app.get("/api/books", (req, res) => {
  res.json(books);
});

// 🧠 2️⃣ Server gửi code động cho client (Code on Demand)
app.get("/client-script.js", (req, res) => {
  res.type("application/javascript");
  res.send(`
    // Code này do server gửi — client chỉ việc chạy
    function renderBooks(books) {
      const list = document.getElementById("book-list");
      list.innerHTML = "";
      books.forEach(book => {
        const li = document.createElement("li");
        li.textContent = book.title + " - " + (book.borrowed ? "Đã mượn" : "Còn");
        
        // Nút hành động
        const btn = document.createElement("button");
        btn.textContent = book.borrowed ? "Trả sách" : "Mượn";
        btn.onclick = async () => {
          const url = '/api/books/' + book.id + (book.borrowed ? '/return' : '/borrow');
          await fetch(url, { method: 'POST' });
          const res = await fetch('/api/books');
          const updated = await res.json();
          renderBooks(updated);
        };
        li.appendChild(btn);
        list.appendChild(li);
      });
    }
  `);
});

// 🧠 3️⃣ Các API hành động (mượn / trả)
app.post("/api/books/:id/borrow", (req, res) => {
  const book = books.find(b => b.id == req.params.id);
  if (!book) return res.status(404).json({ error: "Không tìm thấy sách" });
  if (book.borrowed) return res.status(400).json({ error: "Sách đã được mượn" });
  book.borrowed = true;
  res.json({ message: "Đã mượn sách" });
});

app.post("/api/books/:id/return", (req, res) => {
  const book = books.find(b => b.id == req.params.id);
  if (!book) return res.status(404).json({ error: "Không tìm thấy sách" });
  if (!book.borrowed) return res.status(400).json({ error: "Sách chưa được mượn" });
  book.borrowed = false;
  res.json({ message: "Đã trả sách" });
});

// 🧠 4️⃣ Trang HTML gốc chỉ đơn giản load script server gửi
app.get("/", (req, res) => {
  res.send(`
    <html>
      <body>
        <h1>📚 Thư viện thông minh (Code on Demand)</h1>
        <ul id="book-list"></ul>
        <script src="/client-script.js"></script>
        <script>
          // Gọi API lấy danh sách và để code server xử lý hiển thị
          fetch("/api/books")
            .then(res => res.json())
            .then(data => renderBooks(data));
        </script>
      </body>
    </html>
  `);
});

app.listen(3000, () => console.log("Server Code on Demand tại http://localhost:3000"));
