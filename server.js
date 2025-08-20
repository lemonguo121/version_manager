const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3001;

// 文件存储路径
const dataDir = path.join(__dirname, 'data');
const configFile = path.join(dataDir, 'version.json');

// 确保 data 目录存在
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// 初始化默认配置
const defaultConfig = {
  versionName: "1.0.18",
  versionCode: 1018,
  downLoadUrl: "https://wwym.lanzouq.com/LMPlayer",
  updateDes: "1、新增小说、漫画资源\n2、优化切换站点交互\n3、修复部分小说、漫画获取资源失败后导致后面内容无法获取",
  isMust: false
};

// 加载配置
function loadConfig() {
  if (fs.existsSync(configFile)) {
    try {
      const content = fs.readFileSync(configFile, 'utf-8');
      return JSON.parse(content);
    } catch (e) {
      console.error('读取配置文件失败，使用默认配置', e);
      return {...defaultConfig};
    }
  } else {
    // 文件不存在就写入默认配置
    fs.writeFileSync(configFile, JSON.stringify(defaultConfig, null, 2), 'utf-8');
    return {...defaultConfig};
  }
}

// 保存配置
function saveConfig(newConfig) {
  fs.writeFileSync(configFile, JSON.stringify(newConfig, null, 2), 'utf-8');
}

// Express 配置
app.use(cors());
app.use(express.json());

// GET 获取版本配置
app.get('/api/version', (req, res) => {
  const config = loadConfig();
  res.json(config);
});

// POST 更新版本配置
app.post('/api/version', (req, res) => {
  const { versionName, versionCode, downLoadUrl, updateDes, isMust } = req.body;

  if (!versionName || !versionCode || !downLoadUrl || !updateDes || typeof isMust !== 'boolean') {
    return res.status(400).json({ error: '缺少必要字段或格式错误' });
  }

  const newConfig = { versionName, versionCode, downLoadUrl, updateDes, isMust };
  saveConfig(newConfig);

  res.json({ success: true });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});