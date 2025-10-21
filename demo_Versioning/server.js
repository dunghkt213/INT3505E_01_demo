const express = require('express');
const app = express();

// Import routes
const usersV1 = require('./routes/v1/users');
const usersV2 = require('./routes/v2/users');

// Middleware cho JSON
app.use(express.json());

// Sử dụng routes theo version
app.use('/api/:version/users', (req, res, next) => {
  const { version } = req.params;
  if (version === 'v1') return usersV1(req, res, next);
  if (version === 'v2') return usersV2(req, res, next);
  res.status(404).send('Version not supported');
});

// Cổng chạy server
const PORT = 3000;

// Lệnh chạy server — phần quan trọng nhất!
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
