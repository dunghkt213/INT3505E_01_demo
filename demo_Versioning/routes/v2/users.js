const express = require('express');
const router = express.Router();

// Phiên bản 2: đổi name → fullName, thêm email
router.get('/', (req, res) => {
  res.json([
    { id: 1, fullName: 'Nguyen Van A', email: 'a@example.com' },
    { id: 2, fullName: 'Tran Thi B', email: 'b@example.com' }
  ]);
});

module.exports = router;
