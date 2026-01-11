// src/api/versionRoutes.js

const express = require('express');
const router = express.Router();
const versionController = require('../controllers/versionController');

// === 提供给 App 端的接口 ===
// GET /api/version?appId=xxx (不传 appId 默认返回 clickmate，兼容老版本)
router.get('/', versionController.getVersion);

// POST /api/version?appId=xxx (保留，用于兼容老接口)
router.post('/', versionController.updateVersion);

// === 提供给后台管理的接口 (CRUD) ===
// 获取所有应用的版本配置
router.get('/manage/list', versionController.getAllVersions);

// 保存所有应用的版本配置（后台编辑后整体提交）
router.post('/manage/save', versionController.saveAllVersions);

module.exports = router;
