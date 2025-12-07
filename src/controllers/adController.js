// src/controllers/adController.js

const fileService = require('../services/fileService');
const ADS_FILE = 'ads.json';

// 获取所有广告的默认数据
const defaultAds = {
  "splash": [],
  "home_banner": []
};

// GET /api/ads/fetch?position=splash
// (给 App 端用) 根据位置获取可用的广告
exports.fetchAdsByPosition = (req, res) => {
  const { position } = req.query;
  if (!position) {
    return res.status(400).json({ error: '必须提供广告位 (position)' });
  }

  const allAds = fileService.loadData(ADS_FILE, defaultAds);
  const adsForPosition = allAds[position] || [];

  // 只返回状态为 1 (上线) 的广告
  const activeAds = adsForPosition.filter(ad => ad.status === 1);

  res.json({ data: activeAds });
};

// GET /api/ads/manage/list
// (给后台管理用) 获取所有广告配置
exports.getAllAds = (req, res) => {
  const allAds = fileService.loadData(ADS_FILE, defaultAds);
  res.json({ data: allAds });
};

// POST /api/ads/manage/save
// (给后台管理用) 保存所有广告配置
exports.saveAllAds = (req, res) => {
  const newAdsConfig = req.body;
  if (typeof newAdsConfig !== 'object' || newAdsConfig === null) {
      return res.status(400).json({ error: '请求体必须是JSON对象' });
  }
  fileService.saveData(ADS_FILE, newAdsConfig);
  res.json({ success: true, message: '广告配置已更新' });
};
