const express = require('express');
const app = express();

const usersV1 = require('./routes/v1/users');
const usersV2 = require('./routes/v2/users');

app.use(express.json());

app.use('/api/:version/users', (req, res, next) => {
  const { version } = req.params;
  if (version === 'v1') return usersV1(req, res, next);
  if (version === 'v2') return usersV2(req, res, next);
  res.status(404).send('Version not supported');
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
