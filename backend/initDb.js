// backend/initDb.js
const pool = require('./db');

const createTable = async () => {
  try {
    const connection = await pool.getConnection();

    await connection.query(`
      CREATE TABLE IF NOT EXISTS checkins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        latitude DOUBLE NOT NULL,
        longitude DOUBLE NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ 数据表 checkins 创建成功');
    connection.release();
    process.exit();
  } catch (err) {
    console.error('❌ 创建失败:', err.message);
    process.exit(1);
  }
};

createTable();
