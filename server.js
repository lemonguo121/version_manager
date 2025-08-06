const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3001;

const versionFilePath = path.join(__dirname, 'version.json'); // 放在项目根目录

app.use(cors());
app.use(bodyParser.json());

// 获取版本配置
app.get('/api/version', (req, res) => {
  fs.readFile(versionFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('读取 version.json 出错:', err);
      return res.status(500).json({ error: '读取版本配置失败' });
    }
    try {
      const json = JSON.parse(data);
      res.json(json);
    } catch (parseErr) {
      res.status(500).json({ error: 'JSON 格式错误' });
    }
  });
});

// 更新版本配置
app.post('/api/version', (req, res) => {
  const { versionName, versionCode, downLoadUrl, updateDes, isMust } = req.body;

  if (!versionName || !versionCode || !downLoadUrl || !updateDes || typeof isMust !== 'boolean') {
    return res.status(400).json({ error: '缺少必要字段或格式错误' });
  }

  const newVersionData = {
    versionName,
    versionCode,
    downLoadUrl,
    updateDes,
    isMust
  };

  fs.writeFile(versionFilePath, JSON.stringify(newVersionData, null, 2), err => {
    if (err) {
      console.error('写入 version.json 出错:', err);
      return res.status(500).json({ error: '写入失败' });
    }
    res.json({ success: true, data: newVersionData });
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});