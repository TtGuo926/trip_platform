const express = require('express');
const cors = require('cors');
const pool = require('./db'); // 确保同目录有 db.js

const app = express();
const PORT = 5000;

// 允许 localhost:3000 的跨域请求
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // 处理预检请求
app.use(express.json());

app.post('/api/checkin', async (req, res) => {
  const { latitude, longitude, description } = req.body;
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO checkins (latitude, longitude, description) VALUES (?, ?, ?)',
      [latitude, longitude, description]
    );
    connection.release();
    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error('打卡失败:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
