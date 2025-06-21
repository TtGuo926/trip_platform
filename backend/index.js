const express = require('express');
const app = express();
const PORT = 5000;

app.get('/', (req, res) => {
  res.send('后端启动成功！');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
