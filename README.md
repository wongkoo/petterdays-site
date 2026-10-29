# Petter Days 官网

官网提供五种语言的产品介绍、隐私政策、隐私选择、使用条款和支持页。唯一开发源码在 App 仓库的 `projects/website/`，通过 NAS Git 协作；GitHub `wongkoo/petterdays-site` 是 Cloudflare Pages 的发布镜像。

## 本地开发

官网使用猫狗角色时先读 [IP 使用规范](../../docs/policies/IP_GUIDE.md)。在仓库根目录运行 `python3 scripts/assets/ip_assets.py resolve --scene companion --channel website` 获取主用原稿；按内容选择 `diary`、`care-plan` 等场景。正式引用前将选定素材复制或导出到 `static/` 并保留来源 ID；不直接引用历史归档、本机路径或仓库外文件。此取用流程不自动发布官网。

另一台电脑拉取 NAS 的 App 仓库后，在 `projects/website/` 修改即可。需要 Node.js 22 和 npm；当前没有外部 npm 依赖，无需 `npm install`。

在 `projects/website/` 运行：

```sh
npm run build
npm run check
npm run preview
```

构建产物在 `dist/`，预览默认使用 `http://localhost:4173`（预览命令还需要 Python 3）。提交源码和资源到 NAS；`dist/`、依赖、凭据和旧站 `.git` 不入库。

首页以实际 App 画面和功能示意介绍记录、自定义类型、照护、用品与 NFC；不展示套餐和价格。五语首页文案在 `scripts/home-content.mjs`，结构在 `scripts/home-render.mjs`，样式在 `static/assets/home.css`。法律内容保留在 `scripts/build.mjs`，支持文案在 `scripts/support-content.mjs`；发布检查在 `scripts/check.mjs`。首页仅使用第一方脚本切换记录画面，支持鼠标、键盘方向键和辅助功能。

首页采用已确认的猫狗 IP 方案：双角色陪伴首屏、三种 App 画面切换、功能章节导航、记录与自定义、照护与用品、NFC、独立 iPad 展示、数据与备份，最后以猫狗写日记收尾。手机端保留双角色、完整导航和语言切换；照护与用品纵向排列，主要按钮点按区域至少 44px。截图沿用现有官网素材，未表示重新采集当前 App 版本。

`static/assets/home/ip/` 的三张 PNG 是素材库原稿的逐字节副本，来源 ID、仓库路径与 SHA-256 记录在 `ip-assets.json`。更新时先用 `ip_assets.py resolve` 选稿，再复制、更新回执；`npm run check` 核对发布资源哈希。不要直接重绘或仅替换图片而遗漏来源记录。

保留 `static/.well-known/apple-app-site-association`、`_headers`、`_redirects`、链接回退页面和 NFC 解析脚本；它们支持现有 `/1/*`、`/2/*` App 打开链接。协议变更需同步 App 的外部链接规范。

首页首屏、页尾下载区和 NFC 链接回退页直接打开 App Store。商店地址由 `product.json` 中的 Apple ID 拼接，来源是 `AppStore/metadata.json`；网站不自行判断或宣称苹果的审核状态。

图标使用 `projects/iOS/project.yml` 指定的正式 AppIcon，不能从旧官网或备用图标复制。`scripts/prepare-brand.py` 导出网站图标、32px favicon 和 180px Apple Touch Icon，并为文件名加入源图摘要，避免旧缓存。页眉、页尾、分享卡片和链接回退页统一引用这些资源。根路径 `app-icon.png` 保留为兼容入口，内容也同步为当前图标。

## 产品指南与搜索识别

五语产品介绍位于 `/guide/`、`/zh-Hant/guide/`、`/en/guide/`、`/ja/guide/` 和 `/ko/guide/`，以六个图文章节说明能力，包含三张本地化实际 App 截图、照护插画、NFC 图解、数据说明和猫狗角色，再附日常记录与 NFC 教程入口。结构在 `scripts/guide-render.mjs`，补充文案在 `scripts/guide-visual-content.mjs`，独立样式为 `static/assets/guide.css`；手机端改为纵向阅读。简中、英文文案源为 `scripts/guides.mjs`，繁中、日语、韩语在 `scripts/guide-translations.mjs`；产品介绍、日常记录指南、NFC 指南和开发者故事均提供五语版本，并生成对应 alternate 链接。支持页内容集中在 `scripts/support-content.mjs`：四个按需展开的问题，加一个邮件入口；不重复产品介绍、法律导航和公开报障提醒。构建时自动加入 sitemap，更新正文时同步维护指南的更新日期。

顶部导航对应首页、产品介绍、开发者故事和支持四个独立页面，简体中文文案为「初次见面 / 探索功能 / 开发者故事 / 需要帮忙？」；在手机端完整显示并标识当前位置。页内锚点只放在正文和目录里；隐私与条款保留在页尾。首页维持简短的特色展示，不新增长篇指南介绍区。产品介绍、开发者故事和两篇指南的导航、相关链接、隐私与数据管理入口保持当前语言；语言菜单在相同页面之间切换，不退回英文。

开发者故事位于各语言的 `/guide/our-story/`，从全站顶部独立入口和页尾进入；产品功能正文与相关教程不再混入故事预告或工作照片，文案集中在 `scripts/story-content.mjs`。采用用户确认的「猫狗联合开发 App，给主人使用」正文，由乔治 George 以第一人称讲述，与饼干 Biscuit 共同署名 `George & Biscuit`。七个短章节配六张插画，页面按用户要求不展示虚构叙事提示；创作属性和图像来源保留在素材库回执，不改变真实开发者的结构化身份信息。

两张既有工作插画及四张趣味场景插画来自 `design-assets/` 的 `developer-story` 场景，既有素材 ID 为 `cat-at-work`、`dog-at-work`；新增场景为 `story-midnight-build`、`story-bath-debate`、`story-snack-mystery`、`story-off-duty`。原始 PNG、原图参照及生成提示词留在素材库，官网只发布优化后的 WebP。`guide-assets.json` 记录网站资源来源与 SHA-256；构建检查核验图片哈希、五语路由、截图语言、故事署名及插画完整性。

所有正式页面共用 `styles.css` 的浅色画布和导航尺寸、字体、图标，不在 `home.css` 单独覆盖导航。预留滚动条空间并预加载当前语言字体，减少页面切换时的水平位移和字体重排。

首页和指南包含静态 JSON-LD，关联网站、应用、开发者与 App Store。它仅提供产品事实，不添加未经证实的评分、评论、价格或医疗效果。JSON-LD 是不可执行的数据块，原有严格 CSP 不变。检查程序验证 JSON、品牌身份、站内链接、目录锚点和站点地图。

`robots.txt` 已允许抓取；无需重复列出每个爬虫。Cloudflare 实际访问权限、Google/Bing 站点验证、提交 sitemap 和索引状态属于部署后的独立步骤，源码检查不代表已收录。站点验证使用平台提供的文件，不凭空生成验证令牌。

Google Search Console 使用 `static/google044d9f950647aca5.html` 验证 URL 前缀属性；文件由站长平台提供，发布后仍需保留。检查程序单独核对其内容，不将验证文件加入页面数量或 sitemap。

Bing Webmaster Tools 使用平台生成的 `static/BingSiteAuth.xml` 单独验证，不需要授予 Bing 访问 Google Search Console 的权限；检查程序核对该文件内容。

只修改文字时，在 build 后运行 `.local/website-asset-tools/bin/python projects/website/scripts/prepare-assets.py --fonts-only`（从 App 仓库根目录），再重新 build/check，即可更新字体而不重导出截图。

## 更换画面和更新字体

首页引用 `static/assets/home/<语言>/` 中的 PNG 原生画面和 SVG 示意。原生截图和 NFC 构图来自显式指定的 NAS 商店版本包；`--fonts-only` 只读取 Git 字体与官网文本，不连接 NAS。更换源截图后，在 App 仓库根目录运行：

```sh
python3 -m venv .local/website-asset-tools
.local/website-asset-tools/bin/python -m pip install fonttools brotli pillow
.local/website-asset-tools/bin/python projects/website/scripts/prepare-brand.py
node projects/website/scripts/build.mjs
.local/website-asset-tools/bin/python projects/website/scripts/prepare-assets.py --version <版本> --revision <修订>
node projects/website/scripts/build.mjs
node projects/website/scripts/check.mjs
```

工具环境已存在时可跳过前两步。通常构建直接使用已入库的资源，不需要安装 Python 包。文案增加新字后也应运行资源准备脚本，重新生成四种地区字形的 WOFF2 子集。字体基于 App 已使用的 Resource Han Rounded，修改后的字体命名为 Petter Days Web Rounded，并随 `static/assets/fonts/OFL.txt` 保留 SIL Open Font License。字体由本站提供，不访问第三方字体服务。

保持原生截图完整；设备外框、排版与装饰由 CSS 实现。示意图与示例数据在页面中标注，不能写成未经验证的自动测量或诊断能力。

审核演示视频可以放在 `static/app-review/videos/`，由现有 Cloudflare Pages 提供 MP4 直链，地址为 `https://petterdays.wongkoo.group/app-review/videos/<文件名>.mp4`。每个文件必须小于 25 MiB；先核对压缩版的完整时长、文字清晰度和法律网页跳转，原视频保留在本地产物目录。视频不加入首页或站点地图，响应带 `noindex, nofollow`；直链仍然公开可访问，只发布已获用户授权且不含私人资料的演示。文件名标明版本和模拟器来源，不把模拟器录屏用作 NFC 实机证据。

## 手动同步后自动部署

NAS 推送只共享源码。需要发布时，告诉助手“同步官网到 GitHub 并部署”，或在能访问 GitHub 的电脑上，先拉取并确认要发布的 NAS 提交，再从 App 仓库根目录运行：

```sh
# 查看差异并检查，不推送
python3 scripts/release/sync_website_to_github.py

# 明确发布：检查通过后提交并推送 GitHub main
python3 scripts/release/sync_website_to_github.py --push
```

同步入口只导出 App 已提交版本的 `projects/website/`，不会导出 App 其他目录；官网有未提交改动时会停止。脚本在临时克隆中保留原 GitHub 历史并同步新增、修改和删除，运行 build/check 后推送。旧的 `../petterdays-site` 工作区及其未提交文件不会被覆盖，以后不再在那里开发。

默认发布当前 `HEAD` 的官网；需要指定已审查版本时，可加 `--ref <App提交>`。以后新增 npm 依赖，需要将 `package-lock.json` 一起提交，同步脚本会在临时目录使用 `npm ci` 安装。

GitHub `main` 更新后，现有 Cloudflare Pages 自动运行 `npm run build` 并发布 `dist`。确认构建成功后，再核对官网、隐私链接、AASA 和 App 打开链接；GitHub 推送成功不代表线上部署已经成功。

## 网站边界

公开内容页面使用 Cloudflare Web Analytics 统计访问量、页面浏览、来源和加载性能，不使用 Cookie 或跨网站个人追踪。统计由既有 Pages 项目的 Metrics → Web Analytics 启用，在部署时自动加入脚本；不要在生成器重复加入 beacon。`_headers` 仅额外允许 Cloudflare 的脚本来源及统计连接，继续禁止内联脚本与 eval。五语隐私政策说明该处理方式，页尾不再展示旧的“无分析统计”声明。

NFC 回退页和 404 页在所有脚本前设置更严格的页面 CSP（`script-src 'self'; connect-src 'none'`）及 `no-referrer`，阻止自动注入的统计脚本执行，并避免后续导航传递载荷 URL。该限制随回退 HTML 一同应用于 `/1/*`、`/2/*` 和直接 `/link/` 请求。部署验收须确认公开页可加载统计、回退页被 CSP 阻止；不能把 Functions 请求数当作静态官网访问量。

本站无广告、表单后端或第三方字体。第一方语言脚本根据浏览器语言选择初始首页，仅在用户主动切换语言时保存偏好；NFC 回退解析在本机完成，不发送额外数据请求。
