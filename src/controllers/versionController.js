// src/controllers/versionController.js

const fileService = require('../services/fileService');
const fs = require('fs');
const path = require('path');

const OLD_VERSION_FILE = 'version.json';  // 老的单应用文件
const NEW_VERSIONS_FILE = 'versions.json'; // 新的多应用文件
const DEFAULT_APP_ID = 'clickmate'; // 默认应用ID，用于兼容老接口

// 默认的多应用配置
const defaultVersionsConfig = {
  "clickmate": {
    versionName: "1.0.0",
    versionCode: 1,
    downloadType: "direct", // 新增字段：direct(直接下载) / web(浏览器打开)
    downLoadUrl: "https://example.com/app.apk",
    updateDes: "首次发布",
    isMust: false
  }
};

/**
 * 数据迁移：从 version.json 迁移到 versions.json
 * 只在 versions.json 不存在时执行一次
 */
const migrateOldData = () => {
  const dataDir = path.join(__dirname, '../../data');
  const oldFilePath = path.join(dataDir, OLD_VERSION_FILE);
  const newFilePath = path.join(dataDir, NEW_VERSIONS_FILE);

  // 如果新文件已存在，不需要迁移
  if (fs.existsSync(newFilePath)) {
    return;
  }

  // 尝试读取老文件
  if (fs.existsSync(oldFilePath)) {
    try {
      const oldData = JSON.parse(fs.readFileSync(oldFilePath, 'utf-8'));
      // 将老数据迁移到 clickmate 应用下，并添加默认的 downloadType
      const migratedData = {
        [DEFAULT_APP_ID]: {
          ...oldData,
          downloadType: oldData.downloadType || 'web' // 兼容老数据，默认浏览器打开
        }
      };
      fileService.saveData(NEW_VERSIONS_FILE, migratedData);
      console.log('✅ 数据迁移完成：version.json → versions.json');
    } catch (e) {
      console.error('❌ 数据迁移失败，使用默认配置', e);
      fileService.saveData(NEW_VERSIONS_FILE, defaultVersionsConfig);
    }
  } else {
    // 老文件也不存在，创建默认配置
    fileService.saveData(NEW_VERSIONS_FILE, defaultVersionsConfig);
  }
};

// 初始化时执行数据迁移
migrateOldData();

/**
 * GET /api/version?appId=xxx
 * 获取指定应用的版本配置（App端使用）
 * 兼容老接口：不传 appId 时返回默认应用 clickmate
 */
exports.getVersion = (req, res) => {
  const { appId = DEFAULT_APP_ID } = req.query;
  const allVersions = fileService.loadData(NEW_VERSIONS_FILE, defaultVersionsConfig);

  const versionConfig = allVersions[appId];

  if (!versionConfig) {
    return res.status(404).json({ error: `应用 ${appId} 不存在` });
  }

  res.json(versionConfig);
};

/**
 * POST /api/version
 * 更新单个应用的版本配置（保留老接口，用于兼容）
 */
exports.updateVersion = (req, res) => {
  const { appId = DEFAULT_APP_ID } = req.query;
  const { versionName, versionCode, downloadType, downLoadUrl, updateDes, isMust } = req.body;

  if (!versionName || !versionCode || !downLoadUrl || !updateDes || typeof isMust !== 'boolean') {
    return res.status(400).json({ error: '缺少必要字段或格式错误' });
  }

  // 读取所有应用配置
  const allVersions = fileService.loadData(NEW_VERSIONS_FILE, defaultVersionsConfig);

  // 更新指定应用
  allVersions[appId] = {
    versionName,
    versionCode,
    downloadType: downloadType || 'web',
    downLoadUrl,
    updateDes,
    isMust
  };

  // 保存
  fileService.saveData(NEW_VERSIONS_FILE, allVersions);

  res.json({ success: true });
};

/**
 * GET /api/version/manage/list
 * 获取所有应用的版本配置（后台管理使用）
 */
exports.getAllVersions = (req, res) => {
  const allVersions = fileService.loadData(NEW_VERSIONS_FILE, defaultVersionsConfig);
  res.json({ data: allVersions });
};

/**
 * POST /api/version/manage/save
 * 保存所有应用的版本配置（后台管理使用）
 */
exports.saveAllVersions = (req, res) => {
  const newVersionsConfig = req.body;

  if (typeof newVersionsConfig !== 'object' || newVersionsConfig === null) {
    return res.status(400).json({ error: '请求体必须是JSON对象' });
  }

  // 验证每个应用的数据格式
  for (const appId in newVersionsConfig) {
    const config = newVersionsConfig[appId];
    if (!config.versionName || !config.versionCode || !config.downLoadUrl) {
      return res.status(400).json({ error: `应用 ${appId} 缺少必要字段` });
    }
  }

  fileService.saveData(NEW_VERSIONS_FILE, newVersionsConfig);
  res.json({ success: true, message: '版本配置已更新' });
};
