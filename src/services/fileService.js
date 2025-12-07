// src/services/fileService.js

const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../../data');

// 确保 data 目录存在
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

const services = {
  /**
   * 读取指定数据文件的内容
   * @param {string} fileName - e.g., 'version.json'
   * @param {object} defaultConfig - 如果文件不存在，使用的默认配置
   * @returns {object}
   */
  loadData: (fileName, defaultConfig = {}) => {
    const filePath = path.join(dataDir, fileName);
    if (fs.existsSync(filePath)) {
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(content);
      } catch (e) {
        console.error(`读取文件 ${fileName} 失败，使用默认配置`, e);
        return defaultConfig;
      }
    } else {
      // 文件不存在，写入默认配置并返回
      fs.writeFileSync(filePath, JSON.stringify(defaultConfig, null, 2), 'utf-8');
      return defaultConfig;
    }
  },

  /**
   * 保存数据到指定文件
   * @param {string} fileName - e.g., 'version.json'
   * @param {object} data - 要保存的数据
   */
  saveData: (fileName, data) => {
    const filePath = path.join(dataDir, fileName);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  }
};

module.exports = services;
