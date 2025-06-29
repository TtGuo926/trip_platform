const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
const PORT = 5000;

// 安全、简洁的 CORS 配置
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// 允许处理 JSON 请求体
app.use(express.json());

// POST 接口：添加打卡记录
app.post('/api/checkin', async (req, res) => {
  const { latitude, longitude, description } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).json({ error: '缺少坐标信息' });
  }

  try {
    const conn = await pool.getConnection();

    const [result] = await conn.query(
      'INSERT INTO checkins (latitude, longitude, description) VALUES (?, ?, ?)',
      [latitude, longitude, description || null]
    );

    conn.release();

    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error('❌ 打卡失败:', err.message);
    res.status(500).json({ error: '数据库错误' });
  }
});

// GET 接口：获取所有打卡记录
app.get('/api/checkins', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.query(
      'SELECT id, latitude, longitude, description, created_at FROM checkins ORDER BY created_at DESC'
    );
    conn.release();

    res.json(rows);
  } catch (err) {
    console.error('❌ 查询打卡点失败:', err.message);
    res.status(500).json({ error: '数据库查询失败' });
  }
});

// 启动服务
app.listen(PORT, () => {
  console.log(`✅ 后端服务运行在 http://localhost:${PORT}`);
});
