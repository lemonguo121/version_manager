// src/controllers/versionController.js

const fileService = require('../services/fileService');
const VERSION_FILE = 'version.json';

// 默认配置
const defaultConfig = {
  versionName: "1.0.19",
  versionCode: 1019,
  downLoadUrl: "https://wwym.lanzouq.com/LMPlayer",
  updateDes: "1、新增小说、漫画资源\n2、优化切换站点交互\n3、修复部分小说、漫画获取资源失败后导致后面内容无法获取",
  isMust: false
};

// GET 获取版本配置
exports.getVersion = (req, res) => {
  const config = fileService.loadData(VERSION_FILE, defaultConfig);
  res.json(config);
};

// POST 更新版本配置
exports.updateVersion = (req, res) => {
  const { versionName, versionCode, downLoadUrl, updateDes, isMust } = req.body;

  if (!versionName || !versionCode || !downLoadUrl || !updateDes || typeof isMust !== 'boolean') {
    return res.status(400).json({ error: '缺少必要字段或格式错误' });
  }

  const newConfig = { versionName, versionCode, downLoadUrl, updateDes, isMust };
  fileService.saveData(VERSION_FILE, newConfig);

  res.json({ success: true });
};
