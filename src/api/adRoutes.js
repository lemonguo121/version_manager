// src/api/adRoutes.js

const express = require('express');
const router = express.Router();
const adController = require('../controllers/adController');

// === 提供给 App 端的接口 ===
// e.g., GET /api/ads/fetch?position=splash
router.get('/fetch', adController.fetchAdsByPosition);


// === 提供给后台管理的接口 (CRUD) ===
// 获取所有广告
router.get('/manage/list', adController.getAllAds);

// 保存所有广告（后台编辑后整体提交）
router.post('/manage/save', adController.saveAllAds);


module.exports = router;
