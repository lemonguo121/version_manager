# 版本管理服务 (Version Server)

多应用版本管理 API 服务，支持版本检查、广告配置、文件下载等功能。

## 📦 技术栈

- Node.js + Express
- better-sqlite3 (数据库)
- CORS 跨域支持

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动服务

```bash
npm start
# 或者
node app.js
```

服务启动后访问：`http://localhost:3004`

### 端口配置

默认端口：`3004`
修改端口：编辑 `app.js` 中的 `port` 变量

---

## 📖 API 文档

### 基础URL

```
http://localhost:3004
```

---

## 1️⃣ 版本管理 API

### 1.1 获取应用版本信息（App端使用）

**接口地址**：`GET /api/version`

**Query参数**：
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| appId | string | 否 | 应用ID，不传默认返回 `clickmate` |

**请求示例**：
```bash
# 获取默认应用（兼容老版本）
GET /api/version

# 获取指定应用
GET /api/version?appId=clickmate
GET /api/version?appId=testapp
```

**返回示例**：
```json
{
  "versionName": "1.0.19",
  "versionCode": 1019,
  "downloadType": "web",
  "downLoadUrl": "https://wwym.lanzouq.com/LMPlayer",
  "updateDes": "1、新增小说、漫画资源\n2、优化切换站点交互",
  "isMust": false
}
```

**字段说明**：
- `versionName`: 版本号（如 1.0.0）
- `versionCode`: 版本代码（数字，用于比较）
- `downloadType`: 下载方式
  - `direct`: 应用内直接下载
  - `web`: 跳转浏览器下载
- `downLoadUrl`: 下载地址
- `updateDes`: 更新说明
- `isMust`: 是否强制更新

---

### 1.2 更新应用版本（保留接口，兼容老版本）

**接口地址**：`POST /api/version`

**Query参数**：
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| appId | string | 否 | 应用ID，不传默认更新 `clickmate` |

**请求体**：
```json
{
  "versionName": "1.0.20",
  "versionCode": 1020,
  "downloadType": "direct",
  "downLoadUrl": "https://example.com/app.apk",
  "updateDes": "修复若干bug",
  "isMust": true
}
```

**返回示例**：
```json
{
  "success": true
}
```

---

### 1.3 获取所有应用版本配置（后台管理使用）

**接口地址**：`GET /api/version/manage/list`

**请求示例**：
```bash
GET /api/version/manage/list
```

**返回示例**：
```json
{
  "data": {
    "clickmate": {
      "versionName": "1.0.19",
      "versionCode": 1019,
      "downloadType": "web",
      "downLoadUrl": "https://wwym.lanzouq.com/LMPlayer",
      "updateDes": "更新说明",
      "isMust": false
    },
    "testapp": {
      "versionName": "2.0.0",
      "versionCode": 200,
      "downloadType": "direct",
      "downLoadUrl": "https://example.com/test.apk",
      "updateDes": "测试应用",
      "isMust": true
    }
  }
}
```

---

### 1.4 保存所有应用版本配置（后台管理使用）

**接口地址**：`POST /api/version/manage/save`

**请求体**：
```json
{
  "clickmate": {
    "versionName": "1.0.19",
    "versionCode": 1019,
    "downloadType": "web",
    "downLoadUrl": "https://...",
    "updateDes": "更新说明",
    "isMust": false
  },
  "otherapp": {
    "versionName": "1.0.0",
    "versionCode": 1,
    "downloadType": "direct",
    "downLoadUrl": "https://...",
    "updateDes": "首次发布",
    "isMust": false
  }
}
```

**返回示例**：
```json
{
  "success": true,
  "message": "版本配置已更新"
}
```

---

## 2️⃣ 广告管理 API

### 2.1 获取广告（App端使用）

**接口地址**：`GET /api/ads/fetch`

**Query参数**：
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| position | string | 是 | 广告位置（splash, home_banner, popup等） |

**请求示例**：
```bash
GET /api/ads/fetch?position=splash
GET /api/ads/fetch?position=home_banner
```

**返回示例**：
```json
{
  "data": [
    {
      "id": 1,
      "title": "开屏广告示例",
      "imageUrl": "https://picsum.photos/seed/splash/1600/900",
      "linkUrl": "https://www.baidu.com",
      "status": 1
    }
  ]
}
```

**说明**：只返回 `status: 1`（上线）的广告

---

### 2.2 获取所有广告配置（后台管理使用）

**接口地址**：`GET /api/ads/manage/list`

**返回示例**：
```json
{
  "data": {
    "splash": [...],
    "home_banner": [...],
    "popup": [...]
  }
}
```

---

### 2.3 保存所有广告配置（后台管理使用）

**接口地址**：`POST /api/ads/manage/save`

**请求体**：
```json
{
  "splash": [
    {
      "id": 1,
      "title": "开屏广告",
      "imageUrl": "https://...",
      "linkUrl": "https://...",
      "status": 1
    }
  ],
  "home_banner": [...]
}
```

**返回示例**：
```json
{
  "success": true,
  "message": "广告配置已更新"
}
```

---

## 3️⃣ 文件下载服务

### 3.1 下载静态文件

**接口地址**：`GET /download/:filename`

**请求示例**：
```bash
GET /download/app-v1.0.0.apk
```

**说明**：
- 文件存放目录：`./download/`
- 支持任意文件类型
- 自动设置正确的 Content-Type

---

## 📂 目录结构

```
version_server/
├── app.js                    # 入口文件
├── package.json              # 依赖配置
├── data/                     # 数据存储目录
│   ├── versions.json         # 多应用版本配置（新）
│   ├── version.json          # 单应用版本配置（老，已废弃）
│   └── ads.json              # 广告配置
├── download/                 # 静态文件下载目录
├── src/
│   ├── api/                  # 路由层
│   │   ├── versionRoutes.js  # 版本管理路由
│   │   └── adRoutes.js       # 广告管理路由
│   ├── controllers/          # 控制器层
│   │   ├── versionController.js  # 版本管理逻辑
│   │   └── adController.js       # 广告管理逻辑
│   └── services/             # 服务层
│       └── fileService.js    # 文件读写服务
└── README.md                 # 本文档
```

---

## 🔄 数据迁移

### 自动迁移机制

首次启动时，系统会自动检测：

1. 如果 `versions.json` 不存在，但 `version.json` 存在
2. 自动将 `version.json` 迁移到 `versions.json`，应用ID为 `clickmate`
3. 自动添加 `downloadType: "web"` 字段
4. 控制台输出：`✅ 数据迁移完成：version.json → versions.json`

**迁移前**（version.json）：
```json
{
  "versionName": "1.0.19",
  "versionCode": 1019,
  "downLoadUrl": "https://...",
  "updateDes": "更新说明",
  "isMust": false
}
```

**迁移后**（versions.json）：
```json
{
  "clickmate": {
    "versionName": "1.0.19",
    "versionCode": 1019,
    "downloadType": "web",
    "downLoadUrl": "https://...",
    "updateDes": "更新说明",
    "isMust": false
  }
}
```

---

## 🔧 配置说明

### 1. 端口配置

修改 `app.js` 中的端口：
```javascript
const port = 3004; // 修改为你需要的端口
```

### 2. CORS 配置

默认允许所有跨域请求，如需限制请修改 `app.js`：
```javascript
app.use(cors({
  origin: 'http://localhost:5173', // 只允许前端地址
  credentials: true
}));
```

### 3. 下载目录配置

修改 `app.js` 中的下载目录：
```javascript
const downloadDir = path.join(__dirname, 'download'); // 修改路径
```

---

## 🛡️ 兼容性保证

### 老接口完全兼容

- ✅ `GET /api/version` 不传参数，默认返回 `clickmate` 应用
- ✅ 老应用无需任何改动，继续正常使用
- ✅ 数据自动迁移，无需手动操作

### 新老对比

| 功能 | 老版本 | 新版本 |
|------|--------|--------|
| 应用数量 | 单应用 | 多应用 |
| 数据文件 | version.json | versions.json |
| 下载方式 | 仅链接 | 支持 direct/web |
| 管理接口 | 无 | /manage/list + /manage/save |
| 老接口兼容 | - | ✅ 完全兼容 |

---

## 📝 开发建议

### App端集成示例（Android Kotlin）

```kotlin
// 获取版本信息
suspend fun checkVersion(): Result<VersionResponse> {
    return try {
        val response = RetrofitClient.apiService.checkVersion()
        Result.success(response)
    } catch (e: Exception) {
        Result.failure(e)
    }
}

// ApiService 定义
interface ApiService {
    @GET("/api/version")
    suspend fun checkVersion(
        @Query("appId") appId: String = "clickmate"
    ): VersionResponse
}

// 数据模型
data class VersionResponse(
    val versionName: String,
    val versionCode: Int,
    val downloadType: String,  // "direct" 或 "web"
    val downLoadUrl: String,
    val updateDes: String,
    val isMust: Boolean
)

// 根据 downloadType 处理下载
when (versionData.downloadType) {
    "direct" -> {
        // 应用内直接下载
        downloadManager.downloadApk(versionData.downLoadUrl)
    }
    "web" -> {
        // 跳转浏览器
        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(versionData.downLoadUrl))
        startActivity(intent)
    }
}
```

---

## 🐛 常见问题

### Q1: 端口被占用怎么办？

**方法1**：修改端口（推荐）
```javascript
// 修改 app.js
const port = 3005; // 改成其他端口
```

**方法2**：杀掉占用端口的进程
```bash
lsof -ti:3004 | xargs kill -9
```

### Q2: 数据文件在哪里？

所有数据存储在 `data/` 目录：
- `versions.json` - 版本配置
- `ads.json` - 广告配置

### Q3: 如何添加新应用？

**方法1**：通过后台管理界面（推荐）

**方法2**：直接调用 API
```bash
curl -X POST http://localhost:3004/api/version/manage/save \
  -H "Content-Type: application/json" \
  -d '{
    "myapp": {
      "versionName": "1.0.0",
      "versionCode": 1,
      "downloadType": "direct",
      "downLoadUrl": "https://...",
      "updateDes": "首次发布",
      "isMust": false
    }
  }'
```

### Q4: 如何备份数据？

备份 `data/` 目录即可：
```bash
cp -r data/ data_backup_$(date +%Y%m%d)/
```

---

## 📄 License

ISC

---

## 👨‍💻 作者

lemonguo121

---

## 📮 相关链接

- GitHub: https://github.com/lemonguo121/version_manager
- 前端管理后台: [vue_app](../vue_app)
