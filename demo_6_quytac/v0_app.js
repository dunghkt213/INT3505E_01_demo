// library.js
import express from "express";
const app = express();

let books = [
  { id: 1, title: "Lập trình Node.js", borrowed: false },
  { id: 2, title: "Cơ sở dữ liệu", borrowed: true }
];

// Trang hiển thị HTML
app.get("/", (req, res) => {
  const list = books.map(
    b => `<li>${b.title} - ${b.borrowed ? "Đã mượn" : "Còn"}</li>`
  ).join("");
  const html = `
    <html>
      <head><title>Thư viện</title></head>
      <body>
        <h1>📚 Danh sách sách</h1>
        <ul>${list}</ul>
      </body>
    </html>
  `;
  res.send(html);
});

app.listen(3000, () => console.log("Server tại http://localhost:3000"));
