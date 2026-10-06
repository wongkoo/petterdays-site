# Petter Days 官网

官网提供五种语言的产品介绍、隐私政策、隐私选择、使用条款和支持页。唯一开发源码在 App 仓库的 `website/`，通过 NAS Git 协作；GitHub `wongkoo/petterdays-site` 是 Cloudflare Pages 的发布镜像。

## 本地开发

另一台电脑拉取 NAS 的 App 仓库后，在 `website/` 修改即可。需要 Node.js 22 和 npm；当前没有外部 npm 依赖，无需 `npm install`。

在 `website/` 运行：

```sh
npm run build
npm run check
npm run preview
```

构建产物在 `dist/`，预览默认使用 `http://localhost:4173`（预览命令还需要 Python 3）。提交源码和资源到 NAS；`dist/`、依赖、凭据和旧站 `.git` 不入库。

首页以实际 App 画面和功能示意介绍记录、自定义类型、照护、用品与 NFC；不展示套餐和价格。五语首页文案在 `scripts/home-content.mjs`，结构在 `scripts/home-render.mjs`，样式在 `static/assets/home.css`。法律和支持内容保留在 `scripts/build.mjs`；发布检查在 `scripts/check.mjs`。首页仅使用第一方脚本切换记录画面，支持鼠标、键盘方向键和辅助功能。

保留 `static/.well-known/apple-app-site-association`、`_headers`、`_redirects`、链接回退页面和 NFC 解析脚本；它们支持现有 `/1/*`、`/2/*` App 打开链接。协议变更需同步 App 的外部链接规范。

首页首屏、页尾下载区和 NFC 链接回退页直接打开 App Store。商店地址由 `product.json` 中的 Apple ID 拼接，来源是 `AppStore/metadata.json`；网站不自行判断或宣称苹果的审核状态。

图标使用 `project.yml` 指定的正式 AppIcon，不能从旧官网或备用图标复制。`scripts/prepare-brand.py` 导出网站图标、32px favicon 和 180px Apple Touch Icon，并为文件名加入源图摘要，避免旧缓存。页眉、页尾、分享卡片和链接回退页统一引用这些资源。根路径 `app-icon.png` 保留为兼容入口，内容也同步为当前图标。

## 更换画面和更新字体

首页引用 `static/assets/home/<语言>/` 中的 PNG 原生画面和 SVG 示意。原生截图来源为同一 App 仓库的 `AppStore/raw-screenshots/`，NFC 构图来源为已确认的 `AppStore/artwork/nfc-quick-record.svg`。更换源截图后，在 App 仓库根目录运行：

```sh
python3 -m venv .local/website-asset-tools
.local/website-asset-tools/bin/python -m pip install fonttools brotli pillow
.local/website-asset-tools/bin/python website/scripts/prepare-brand.py
node website/scripts/build.mjs
.local/website-asset-tools/bin/python website/scripts/prepare-assets.py
node website/scripts/build.mjs
node website/scripts/check.mjs
```

工具环境已存在时可跳过前两步。通常构建直接使用已入库的资源，不需要安装 Python 包。文案增加新字后也应运行资源准备脚本，重新生成四种地区字形的 WOFF2 子集。字体基于 App 已使用的 Resource Han Rounded，修改后的字体命名为 Petter Days Web Rounded，并随 `static/assets/fonts/OFL.txt` 保留 SIL Open Font License。字体由本站提供，不访问第三方字体服务。

保持原生截图完整；设备外框、排版与装饰由 CSS 实现。示意图与示例数据在页面中标注，不能写成未经验证的自动测量或诊断能力。

审核演示视频可以放在 `static/app-review/videos/`，由现有 Cloudflare Pages 提供 MP4 直链，地址为 `https://petterdays.wongkoo.group/app-review/videos/<文件名>.mp4`。每个文件必须小于 25 MiB；先核对压缩版的完整时长、文字清晰度和法律网页跳转，原视频保留在本地产物目录。视频不加入首页或站点地图，响应带 `noindex, nofollow`；直链仍然公开可访问，只发布已获用户授权且不含私人资料的演示。文件名标明版本和模拟器来源，不把模拟器录屏用作 NFC 实机证据。

## 手动同步后自动部署

NAS 推送只共享源码。需要发布时，告诉助手“同步官网到 GitHub 并部署”，或在能访问 GitHub 的电脑上，先拉取并确认要发布的 NAS 提交，再从 App 仓库根目录运行：

```sh
# 查看差异并检查，不推送
python3 scripts/sync_website_to_github.py

# 明确发布：检查通过后提交并推送 GitHub main
python3 scripts/sync_website_to_github.py --push
```

同步入口只导出 App 已提交版本的 `website/`，不会导出 App 其他目录；官网有未提交改动时会停止。脚本在临时克隆中保留原 GitHub 历史并同步新增、修改和删除，运行 build/check 后推送。旧的 `../petterdays-site` 工作区及其未提交文件不会被覆盖，以后不再在那里开发。

默认发布当前 `HEAD` 的官网；需要指定已审查版本时，可加 `--ref <App提交>`。以后新增 npm 依赖，需要将 `package-lock.json` 一起提交，同步脚本会在临时目录使用 `npm ci` 安装。

GitHub `main` 更新后，现有 Cloudflare Pages 自动运行 `npm run build` 并发布 `dist`。确认构建成功后，再核对官网、隐私链接、AASA 和 App 打开链接；GitHub 推送成功不代表线上部署已经成功。

## 网站边界

本站无统计、Cookie、表单后端、第三方字体或运行时依赖。第一方语言脚本根据浏览器语言选择初始首页，仅在用户主动切换语言时保存偏好；NFC 回退解析在本机完成，不发送额外数据请求。
