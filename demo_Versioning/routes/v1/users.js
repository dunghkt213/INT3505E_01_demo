const express = require('express');
const router = express.Router();

// Phiên bản 1: chỉ có id và name
router.get('/', (req, res) => {
  res.json([
    { id: 1, name: 'Nguyen Van A' },
    { id: 2, name: 'Tran Thi B' }
  ]);
});

module.exports = router;
