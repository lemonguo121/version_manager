// app.js

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// 导入路由模块
const versionRoutes = require('./src/api/versionRoutes');
const adRoutes = require('./src/api/adRoutes');

const app = express();
const port = 3004;

// --- 1. 基础中间件 ---
app.use(cors());
app.use(express.json()); // 用于解析 application/json

// --- 2. 静态资源下载服务 (新增功能) ---
// 定义下载目录路径
const downloadDir = path.join(__dirname, 'download');

// 如果下载目录不存在，自动创建一个，防止报错
if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir);
  console.log(`Created download directory at: ${downloadDir}`);
}

// 挂载静态文件服务
// 访问方式: http://localhost:3001/download/你的文件名.apk
app.use('/download', express.static(downloadDir));


// --- 3. 注册 API 路由 ---
// 所有 /api/version 的请求都由 versionRoutes 处理
app.use('/api/version', versionRoutes);

// 所有 /api/ads 的请求都由 adRoutes 处理
app.use('/api/ads', adRoutes);


// --- 4. 兜底路由 ---
app.get('/', (req, res) => {
  res.send('API服务正在运行。可用路径: /api/version, /api/ads, /download');
});

// --- 5. 启动服务器 ---
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  console.log('--------------------------------------------------');
  console.log('服务清单:');
  console.log(`[版本] GET  http://localhost:${port}/api/version`);
  console.log(`[广告] GET  http://localhost:${port}/api/ads/fetch?position=splash`);
  console.log(`[下载] GET  http://localhost:${port}/download/<文件名>`);
  console.log('--------------------------------------------------');
});
