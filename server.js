const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');

const app = express();
const port = 3001;

// 初始化 SQLite 数据库
const db = new Database('version.db');

// 建表（字段和你之前 JSON 一致）
db.prepare(`
  CREATE TABLE IF NOT EXISTS version (
    id INTEGER PRIMARY KEY CHECK (id = 1),  -- 永远只有一条记录
    versionName TEXT NOT NULL,
    versionCode INTEGER NOT NULL,
    downLoadUrl TEXT NOT NULL,
    updateDes TEXT NOT NULL,
    isMust INTEGER NOT NULL
  )
`).run();

app.use(cors());
app.use(express.json());

// 获取版本配置
app.get('/api/version', (req, res) => {
  const row = db.prepare('SELECT * FROM version WHERE id = 1').get();
  if (!row) {
    return res.json({
      versionName: "1.0.0",
      versionCode: 100,
      downLoadUrl: "",
      updateDes: "",
      isMust: false
    });
  }
  row.isMust = !!row.isMust; // 转换 0/1 为 true/false
  res.json(row);
});

// 更新版本配置
app.post('/api/version', (req, res) => {
  const { versionName, versionCode, downLoadUrl, updateDes, isMust } = req.body;

  if (!versionName || !versionCode || !downLoadUrl || !updateDes || typeof isMust !== 'boolean') {
    return res.status(400).json({ error: '缺少必要字段或格式错误' });
  }

  db.prepare(`
    INSERT INTO version (id, versionName, versionCode, downLoadUrl, updateDes, isMust)
    VALUES (1, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      versionName=excluded.versionName,
      versionCode=excluded.versionCode,
      downLoadUrl=excluded.downLoadUrl,
      updateDes=excluded.updateDes,
      isMust=excluded.isMust
  `).run(versionName, versionCode, downLoadUrl, updateDes, isMust ? 1 : 0);

  res.json({ success: true });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});