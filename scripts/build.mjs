import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { homeContent } from "./home-content.mjs";
import { productHome, escape } from "./home-render.mjs";
import { product as productIdentity, appStoreURL } from "./product.mjs";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const out = join(root, "dist");
const origin = "https://petterdays.wongkoo.group";
const effectiveDate = "2026-08-19";
const updatedDate = "2026-10-05";
const homeUpdatedDate = "2026-10-05";
const issueURL = "https://github.com/wongkoo/petterdays-site/issues/new/choose";
const supportEmail = "petterdays.app@gmail.com";
const supportURL = `mailto:${supportEmail}`;

const locales = {
  "zh-Hans": {
    prefix: "",
    language: "简体中文",
    nav: { home: "首页", privacy: "隐私", terms: "条款", support: "支持", language: "语言" },
    common: {
      product: "Petter Days",
      owner: "发布者：ZhenHui Wang",
      effective: `生效日期：${effectiveDate}`,
      updated: `更新日期：${updatedDate}`,
      medical: "Petter Days 是宠物照护记录与辅助观察工具，不提供医疗诊断，也不能替代专业兽医意见。",
      source: "本网站不使用 Cookie、分析、广告或追踪脚本。",
      openApp: "打开 Petter Days",
      learn: "了解隐私设计",
    },
    privacy: {
      "eyebrow": "隐私政策",
      "title": "你的记录，首先属于你。",
      "intro": "本政策说明 Petter Days 的本机处理、可选 iCloud 家庭共享、设备权限、NFC 标签，以及备份和删除方式。",
      "sections": [
        [
          "1. 适用范围与账号",
          [
            "Petter Days 处理你主动创建的宠物资料、健康记录、照护计划、用品库存、附件、备份和手动静息呼吸记录。无需注册 Petter Days 账号，也不使用邮箱、手机号或密码登录。"
          ]
        ],
        [
          "2. 本机保存与家庭共享",
          [
            "免费使用时，资料保存在设备上的本地资料库，不启用 CloudKit 同步。",
            "订阅 Petter Days Pro 并明确启用 iCloud 同步后，记录和附件通过 Apple CloudKit 保存在你自己的私人或共享 iCloud 数据库，并占用你的 iCloud 空间。开发者不建立宠物健康数据后端，也不从私人 CloudKit 读取这些资料。",
            "共享以整个家庭为范围，包含当前及以后新增的全部宠物、记录、计划、附件和用品资料。主人为成员设置只读或可编辑权限；不能只共享某一只宠物。每位共同照护者均需独立订阅 Pro。"
          ]
        ],
        [
          "3. 设备权限",
          [
            "定位：仅在你主动开始遛弯后，用于计算路线、距离和时间；活动期间可在后台继续，结束或放弃后停止。精确路线保存在资料库和你创建的完整备份中，可随已启用的 iCloud 家庭共享同步；兽医资料包和宠物分享图片不包含精确路线坐标。",
            "照片：系统照片选择器只交付你选中的图片，用于头像、贴纸、记录和资料附件及用品图片；App 不浏览整个照片库。你主动将宠物资料卡保存到相册时，才请求仅添加照片的权限。",
            "文件：通过系统文件选择器导入你选中的材料，或导出资料、创建和恢复备份。通知：仅在你开启照护提醒后申请，用于系统本地通知。",
            "NFC：仅在你主动读取、写入或核验标签时开启系统扫描会话。系统后台识别标签后，你也可以点击通知打开 App。"
          ]
        ],
        [
          "4. 购买、备份与删除",
          [
            "购买、续费、恢复、退款和权益验证由 Apple App Store 与 StoreKit 处理。Petter Days 不取得支付卡信息；价格和周期以购买页面为准。",
            "你可创建包含记录、修改历史和附件的完整备份，并自行选择保存位置或接收方。备份含有私人资料，应保存在你掌控的位置。",
            "订阅到期会暂停新的 CloudKit 读写和共享管理，不删除已下载的本地资料、云端区域或仍有效的共享关系。查看、备份、恢复和导出仍然可用。",
            "普通记录可删除和恢复；永久删除整个家庭需要另行确认。退出共享或被移除后，CloudKit 按权限规则清理参与者的共享副本，主人的原资料不会因此删除。App 无法远程删除你已导出的备份或分享副本。"
          ]
        ],
        [
          "5. 静息呼吸与健康信息",
          [
            "当前提供人工录入和默认 30 秒的手动点击计数。你观察一次完整胸腹起伏并点击，App 根据点击次数和时间换算频率；提前完成的结果标为估算。结果回填表单后，仍由你确认保存。",
            "点击与计时在本机处理，不使用相机、麦克风或运动传感器进行自动测量。历史自动测量记录继续保留原来源和复核信息。手动记录、估算和兽医结论不是同一种证据。",
            "这些工具只辅助观察，不提供医疗诊断。出现呼吸困难等紧急情况，或对宠物健康有疑问时，请联系兽医。"
          ]
        ],
        [
          "6. NFC 标签与本设备统计",
          [
            "标签可包含记录类型、宠物识别信息，以及你选择写入的预填值；预填值可能包含健康信息。标签内容不是加密数据，其他设备可以读取和复制。标签不含账号凭证或共享权限，也不会授权他人访问你的资料库。",
            "快捷配置保存在家庭资料库，可随已启用的 iCloud 同步并进入完整备份。标签核验信息、打开次数和最近打开时间只保存在本设备，不进入 iCloud 或完整备份，也不用于开发者分析；次数不等同于已保存记录数。永久删除家庭时清理对应设备统计。",
            "在浏览器打开标签链接时，网站托管及 CDN 服务会接触完整链接，其中可能包含标签预填值。回退页面在本机解析，不为解析额外发送数据请求；健康详情需主动展开，成功解析后从地址栏移除载荷。请仅在可信设备上打开和展示标签详情。"
          ]
        ],
        [
          "7. 开发者收集与网站",
          [
            "当前 App 不含开发者账号系统、AI 服务、第三方分析、广告 SDK 或跨 App/网站追踪。Apple 按其自身政策处理 StoreKit、CloudKit、MapKit 地图等系统服务数据。你主动导出、分享或在浏览器打开链接时，接收方或网站服务可接触你交付的内容。",
            "本网站不使用 Cookie、分析、广告、在线表单或第三方字体服务。第一方脚本根据浏览器语言选择首页，仅在你主动切换语言时将偏好保存在浏览器本地。NFC 网页处理方式见上一节。"
          ]
        ],
        [
          "8. 儿童、更新与联系",
          [
            "Petter Days 面向宠物照护，不主动收集年龄或身份证明。功能或数据处理方式变化时，我们会更新本政策及页面日期。",
            `隐私或支持问题请发邮件至 <a href="${supportURL}">${supportEmail}</a>。一般问题也可通过 <a href="${issueURL}">GitHub Issues</a> 提交；该渠道公开，请勿发布病历、联系方式、备份、精确位置或其他私人资料。`
          ]
        ]
      ]
    },
    choices: {
      eyebrow: "隐私选择与数据管理",
      title: "查看、带走、恢复或删除你的资料。",
      intro: "这些核心数据能力不受订阅限制。进行不可逆操作前，请先创建一份经过验证的完整备份。",
      sections: [
        ["备份与兽医资料包", ["在“档案 → 数据与备份 → 导入与导出”中导出完整备份；也可按宠物生成包含趋势图、明细表格和所选附件的兽医资料包。"]],
        ["创建完整备份", ["可创建包含完整记录、修订、删除状态和附件的 .petterdaysbackup。该文件包含私人资料，请保存到由你掌控的位置，并完成一次恢复演练。"]],
        ["恢复备份", ["恢复会完整检查备份结构和数据关系。免费用户也可以恢复包含超过两只宠物的备份：所有数据都会恢复，最多两只宠物可继续编辑，其余保持可查看、可导出但只读；订阅后恢复编辑。"]],
        ["删除与恢复记录", ["普通删除进入“最近删除”，可在保留期内恢复；修改、删除和恢复均保留审计信息。永久删除整个家庭资料是独立的高风险操作，确认后从当前资料库移除。"]],
        ["iCloud 与共享", ["只有订阅 Petter Days Pro 并明确启用 iCloud 同步后才同步。可在共享管理中查看成员与权限、退出共享或由主人移除成员。关闭订阅会暂停新的同步与共享操作，不会自动删除云端资料或 CKShare 关系。"]],
        ["需要帮助", [`打开 <a href="${supportURL}">${supportEmail}</a> 描述问题和 App 版本。不要公开提交备份、病历、精确位置或其他私人资料；我们会说明安全的后续处理方式。`]],
      ],
    },
    terms: {
      eyebrow: "使用条款",
      title: "清楚的边界，安心的记录。",
      intro: "使用 Petter Days 即表示你同意以下条款。若不同意，请停止使用 App。",
      sections: [
        ["1. 服务范围", ["Petter Days 提供宠物健康与照护记录、提醒、趋势、附件、备份、手动静息呼吸记录、库存及可选 iCloud 家庭协作能力。服务可能随版本调整，并以 App 内实际功能为准。"]],
        ["2. 非医疗服务", ["Petter Days 不是医疗器械，不进行诊断、预防或治疗，也不替代兽医意见。用户应自行判断何时寻求专业帮助；紧急或持续异常情况应立即联系兽医。"]],
        ["3. 用户责任", ["用户应确保录入内容、附件、共享对象和权限合法、准确且适当，并妥善保管设备、Apple Account 和备份文件。未经许可不得上传或分享他人的私人资料。"]],
        ["4. 订阅", ["Petter Days Pro 是通过 Apple App Store 提供的自动续期订阅。价格、周期、试用、续期、取消、退款和税费以购买页面及 Apple 条款为准。每位 CloudKit 共享参与者需拥有自己的有效订阅。"]],
        ["5. 数据与可用性", ["核心功能按本地优先设计，但设备故障、存储空间、系统服务、网络、iCloud 状态、误操作或不可抗力仍可能影响数据。用户应定期创建并验证完整备份。我们不会以“绝不会丢失”或“永久保管”作保证。"]],
        ["6. 可接受使用", ["不得利用 Petter Days 侵犯他人权益、传播恶意内容、绕过订阅或权限限制、干扰服务、逆向攻击共享机制，或从事违法活动。"]],
        ["7. 变更与终止", ["我们可能为安全、合规、系统兼容或产品改进更新 App 与条款。若用户不再使用，可导出资料、取消订阅并删除本机数据。订阅取消按 Apple 的订阅管理规则生效。"]],
        ["8. 联系", [`条款或支持问题请使用 <a href="${supportURL}">${supportEmail}</a>。请勿在公开问题中提交私人健康资料或备份文件。`]],
      ],
    },
    support: {
      eyebrow: "支持",
      title: "先保住资料，再解决问题。",
      intro: "遇到同步、备份或资料库问题时，不要反复卸载 App。先创建备份并记录提示信息，再按下面的入口处理。",
      cards: [["邮件联系", supportEmail, supportURL], ["管理资料", "查看备份、恢复、导出、删除与共享说明", "/privacy/choices/"], ["隐私政策", "了解本地处理、iCloud 与权限", "/privacy/"], ["使用条款", "了解服务、订阅与责任边界", "/terms/"]],
      sections: [
        ["常见处理顺序", ["1. 不要删除 App，也不要清理资料库文件。", "2. 若 App 仍可打开，进入“档案 → 数据与备份 → 导入与导出”创建完整备份。", "3. 记录 App 版本、iOS 版本、出现问题的时间和完整提示。", "4. 通过支持渠道提交不含私人数据的说明。"]],
        ["订阅与购买", ["购买和恢复由 Apple App Store 处理。请先确认设备登录了购买时使用的 Apple Account，再在 App 中选择“恢复购买”。价格和当前权益以 App Store 与 App 内显示为准。"]],
        ["iCloud 同步与共享", ["确认已订阅 Petter Days Pro、已在 App 中明确启用 iCloud 同步、系统已登录 iCloud、iCloud Drive 可用且空间充足。不要通过卸载重装来强制同步。家庭共享指 CKShare 共同照护，不表示订阅权益由 App Store 家庭共享。"]],
        ["公开渠道隐私提醒", [`一般问题可在 <a href="${issueURL}">GitHub Issues</a> 公开提交。请勿发布宠物病历、备份、照片、联系方式、Apple Account 信息、支付信息或精确位置；隐私问题请使用上方邮箱联系。`]],
      ],
    },
  },
  "zh-Hant": {
    prefix: "/zh-Hant",
    language: "繁體中文",
    nav: { home: "首頁", privacy: "私隱", terms: "條款", support: "支援", language: "語言" },
    common: { product: "Petter Days", owner: "發佈者：ZhenHui Wang", effective: `生效日期：${effectiveDate}`, updated: `更新日期：${updatedDate}`, medical: "Petter Days 是寵物照護記錄與輔助觀察工具，不提供醫療診斷，也不能取代專業獸醫意見。", source: "本網站不使用 Cookie、分析、廣告或追蹤腳本。", openApp: "開啟 Petter Days", learn: "了解私隱設計" },
    privacy: {
      "eyebrow": "私隱政策",
      "title": "你的記錄，首先屬於你。",
      "intro": "本政策說明 Petter Days 的本機處理、選用的 iCloud 家庭共享、裝置權限、NFC 標籤，以及備份和刪除方式。",
      "sections": [
        [
          "1. 適用範圍與帳戶",
          [
            "Petter Days 處理你主動建立的寵物資料、健康記錄、照護計劃、用品庫存、附件、備份及手動靜息呼吸記錄。無需註冊 Petter Days 帳戶，也不使用電郵、電話號碼或密碼登入。"
          ]
        ],
        [
          "2. 本機儲存與家庭共享",
          [
            "免費使用時，資料儲存在裝置的本機資料庫，不會啟用 CloudKit 同步。",
            "訂閱 Petter Days Pro 並明確啟用 iCloud 同步後，記錄及附件透過 Apple CloudKit 儲存在你自己的私人或共享 iCloud 資料庫，並佔用你的 iCloud 空間。開發者不建立寵物健康資料後端，也不從私人 CloudKit 讀取這些資料。",
            "共享範圍是整個家庭，涵蓋目前及日後新增的所有寵物、記錄、計劃、附件和用品資料。主人可為成員設定唯讀或可編輯權限；不能只分享其中一隻寵物。每位共同照護者均須各自訂閱 Pro。"
          ]
        ],
        [
          "3. 裝置權限",
          [
            "位置：只在你主動開始散步後，用於計算路線、距離及時間；活動期間可在背景繼續，結束或放棄後停止。精確路線儲存在資料庫及你建立的完整備份中，可隨已啟用的 iCloud 家庭共享同步；獸醫資料包及寵物分享圖片不包含精確路線座標。",
            "照片：系統照片選擇器只提供你選取的圖片，用於頭像、貼紙、記錄與資料附件及用品圖片；App 不會瀏覽整個照片圖庫。只有當你主動將寵物資料卡儲存至相簿時，才會要求僅新增照片的權限。",
            "檔案：透過系統檔案選擇器匯入你選取的材料，或匯出資料、建立及還原備份。通知：只在你啟用照護提醒後申請，用於系統本機通知。",
            "NFC：只在你主動讀取、寫入或驗證標籤時啟動系統掃描。系統在背景識別標籤後，你亦可點選通知開啟 App。"
          ]
        ],
        [
          "4. 購買、備份與刪除",
          [
            "購買、續訂、恢復購買、退款及資格驗證由 Apple App Store 與 StoreKit 處理。Petter Days 不取得支付卡資料；價格與週期以購買頁面為準。",
            "你可建立包含記錄、修改歷史及附件的完整備份，自行選擇儲存位置或接收者。備份含有私人資料，應儲存在你掌控的位置。",
            "訂閱到期會暫停新的 CloudKit 讀寫及共享管理，不會刪除已下載的本機資料、雲端區域或仍有效的共享關係。檢視、備份、還原及匯出仍可使用。",
            "一般記錄可刪除及還原；永久刪除整個家庭須另行確認。退出共享或被移除後，CloudKit 依權限規則清理參與者的共享副本，不會因此刪除主人的原始資料。App 無法遠端刪除你已匯出或分享的副本。"
          ]
        ],
        [
          "5. 靜息呼吸與健康資訊",
          [
            "目前提供人工輸入及預設 30 秒的手動點按計數。每觀察到一次完整胸腹起伏，你點按一次，App 按次數與時間換算頻率；提前完成的結果會標示為估算。結果填回表單後，仍須由你確認儲存。",
            "點按與計時在本機處理，不使用相機、麥克風或運動感測器自動測量。歷史自動測量記錄保留原有來源及複核資訊。手動記錄、估算與獸醫結論屬不同證據。",
            "這些工具只輔助觀察，不提供醫療診斷。如有呼吸困難等緊急情況，或對寵物健康有疑問，請聯絡獸醫。"
          ]
        ],
        [
          "6. NFC 標籤與本裝置統計",
          [
            "標籤可包含記錄類型、寵物識別資訊，以及你選擇寫入的預填值；預填值可能包含健康資訊。標籤內容並未加密，其他裝置可以讀取及複製。標籤不含帳戶憑證或共享權限，也不授權他人存取你的資料庫。",
            "快捷設定儲存在家庭資料庫，可隨已啟用的 iCloud 同步並納入完整備份。標籤驗證資訊、開啟次數及最近開啟時間只儲存在本裝置，不納入 iCloud 或完整備份，也不用於開發者分析；次數不等於已儲存的記錄數。永久刪除家庭時，亦會清理對應裝置統計。",
            "以瀏覽器開啟標籤連結時，網站託管及 CDN 服務會接觸完整連結，其中可能含有標籤預填值。備援頁面在本機解析，不會為解析額外傳送資料請求；健康詳情須主動展開，成功解析後會從網址列移除載荷。請只在可信任的裝置上開啟及展示標籤詳情。"
          ]
        ],
        [
          "7. 開發者收集與網站",
          [
            "目前 App 不包含開發者帳戶系統、AI 服務、第三方分析、廣告 SDK 或跨 App／網站追蹤。Apple 依自身政策處理 StoreKit、CloudKit、MapKit 地圖等系統服務資料。當你主動匯出、分享或在瀏覽器開啟連結時，接收者或網站服務可接觸你交付的內容。",
            "本網站不使用 Cookie、分析、廣告、線上表單或第三方字型服務。第一方腳本按瀏覽器語言選擇首頁，只有當你主動切換語言時，才將偏好儲存在瀏覽器本機。NFC 網頁的處理方式見上一節。"
          ]
        ],
        [
          "8. 兒童、更新與聯絡",
          [
            "Petter Days 用於寵物照護，不主動收集年齡或身分證明。功能或資料處理方式變更時，我們會更新本政策及頁面日期。",
            `私隱或支援問題請電郵至 <a href="${supportURL}">${supportEmail}</a>。一般問題亦可透過 <a href="${issueURL}">GitHub Issues</a> 提交；該渠道公開，請勿發佈病歷、聯絡方式、備份、精確位置或其他私人資料。`
          ]
        ]
      ]
    },
    choices: { eyebrow: "私隱選擇與資料管理", title: "檢視、帶走、還原或刪除資料。", intro: "這些核心能力不受訂閱限制。不可逆操作前請先建立並驗證完整備份。", sections: [["備份與獸醫資料包", ["在「檔案 → 資料與備份 → 匯入與匯出」匯出完整備份，或按寵物產生含趨勢圖、明細表和所選附件的獸醫資料包。"]], ["完整備份與還原", ["可建立包含完整記錄、修訂、刪除狀態與附件的 .petterdaysbackup。檔案包含私人資料，請只儲存在你掌控的位置。免費用戶也可完整還原超過兩隻寵物的備份；超出兩隻的寵物保持可檢視和匯出但唯讀。"]], ["刪除與共享", ["一般刪除可在最近刪除中還原；永久刪除整個家庭資料是獨立高風險操作。CKShare 成員可按權限退出或被移除，取消訂閱不等於自動刪除分享關係。"]], ["需要協助", [`使用 <a href="${supportURL}">${supportEmail}</a>，但不要公開私人資料或備份。`]]]},
    terms: { eyebrow: "使用條款", title: "清楚的邊界，安心的記錄。", intro: "使用 Petter Days 即表示同意以下條款。", sections: [["服務與醫療邊界", ["Petter Days 提供寵物記錄、提醒、趨勢、附件、備份、手動靜息呼吸記錄、庫存及可選 iCloud 家庭協作。它不是醫療器械，不診斷、預防或治療疾病，也不取代獸醫。"]], ["用戶責任", ["用戶應確保內容與共享合法適當，並妥善保管裝置、Apple Account 及備份檔案。"]], ["訂閱", ["Petter Days Pro 經 Apple App Store 自動續訂；價格、取消、退款及稅項以 Apple 購買頁面和條款為準。每位共享參與者需各自訂閱。"]], ["資料與可用性", ["裝置、儲存空間、網絡、iCloud、誤操作等可能影響資料。請定期建立並驗證備份；我們不作永不遺失或永久保管承諾。"]], ["聯絡", [`條款或支援問題請使用 <a href="${supportURL}">${supportEmail}</a>，不要公開私人健康資料。`]]]},
    support: { eyebrow: "支援", title: "先保住資料，再解決問題。", intro: "遇到同步、備份或資料庫問題時不要反覆卸載。先建立備份並記錄完整提示。", cards: [["電郵聯絡", supportEmail, supportURL], ["管理資料", "備份、還原、匯出、刪除與共享", "/zh-Hant/privacy/choices/"], ["私隱政策", "本機處理、iCloud 與權限", "/zh-Hant/privacy/"], ["使用條款", "服務、訂閱與責任邊界", "/zh-Hant/terms/"]], sections: [["處理順序", ["不要刪除 App。若仍可開啟，先在「檔案 → 資料與備份 → 匯入與匯出」建立完整備份，記錄 App/iOS 版本、時間和提示，再提交不含私人資料的說明。"]], ["訂閱與 iCloud", ["確認登入購買時的 Apple Account，使用恢復購買；確認已訂閱 Petter Days Pro、明確啟用 iCloud 同步、iCloud Drive 可用且空間充足。不要用卸載重裝強制同步。"]], ["私隱提醒", [`一般問題可在 <a href="${issueURL}">GitHub Issues</a> 公開提交。請勿發佈病歷、備份、照片、聯絡方式、支付資料或精確位置；私隱問題請使用上方電郵聯絡。`]]]},
  },
  en: {
    prefix: "/en",
    language: "English",
    nav: { home: "Home", privacy: "Privacy", terms: "Terms", support: "Support", language: "Language" },
    common: { product: "Petter Days", owner: "Publisher: ZhenHui Wang", effective: `Effective: ${effectiveDate}`, updated: `Updated: ${updatedDate}`, medical: "Petter Days is a pet-care record and observation tool. It does not provide a medical diagnosis or replace professional veterinary advice.", source: "This website uses no cookies, analytics, advertising, or tracking scripts.", openApp: "Open Petter Days", learn: "How privacy works" },
    privacy: {
      "eyebrow": "Privacy Policy",
      "title": "Your records belong to you first.",
      "intro": "This policy explains on-device processing, optional iCloud household sharing, device permissions, NFC tags, backups, and deletion in Petter Days.",
      "sections": [
        [
          "1. Scope and accounts",
          [
            "Petter Days handles the pet profiles, health records, care plans, supplies, attachments, backups, and manual resting respiratory records you choose to create. No Petter Days account, email, phone number, or password is required to sign in."
          ]
        ],
        [
          "2. On-device storage and household sharing",
          [
            "On the Free plan, data stays in the local database on your device and CloudKit sync is not enabled.",
            "After you subscribe to Petter Days Pro and explicitly enable iCloud sync, records and attachments are stored through Apple CloudKit in your own private or shared iCloud database and use your iCloud storage. The developer does not operate a pet-health data backend or read these records from your private CloudKit database.",
            "Sharing covers the entire household, including all current and future pets, records, plans, attachments, and supply data. The owner assigns view-only or editing permission to each member. Sharing cannot be restricted to one pet. Each collaborator needs their own Pro subscription."
          ]
        ],
        [
          "3. Device permissions",
          [
            "Location: used only after you start a walk, to calculate its route, distance, and duration. Tracking can continue in the background during the walk and stops when you finish or abandon it. Precise routes stay in the library and complete backups you create; they can also sync through enabled iCloud household sharing. Veterinary briefs and pet share images do not include precise route coordinates.",
            "Photos: the system photo picker provides only images you select for avatars, stickers, record or document attachments, and supply images; the App does not browse your entire library. Add-only photo permission is requested when you choose to save a pet profile card to Photos.",
            "Files: system pickers let you import selected material, export data, and create or restore backups. Notifications: permission is requested only after you enable care reminders, which use local system notifications.",
            "NFC: a system scanning session starts when you choose to read, write, or verify a tag. You can also open the App by tapping a notification after the system detects a tag in the background."
          ]
        ],
        [
          "4. Purchases, backups, and deletion",
          [
            "Apple App Store and StoreKit handle purchases, renewals, restoration, refunds, and entitlement checks. Petter Days does not receive payment-card details. Prices and billing periods are shown on the purchase screen.",
            "You can create complete backups containing records, modification history, and attachments, and choose where to save them or whom to share them with. Backups contain private information; keep them somewhere you control.",
            "When a subscription expires, new CloudKit reads, writes, and sharing management pause. Downloaded local data, cloud zones, and valid sharing relationships are not deleted. Viewing, backup, restore, and export remain available.",
            "Individual records can be deleted and restored. Permanently deleting an entire household requires separate confirmation. When you leave a share or are removed, CloudKit cleans up the participant copy according to its access rules without deleting the owner’s source data. The App cannot remotely delete copies you have already exported or shared."
          ]
        ],
        [
          "5. Resting respiration and health information",
          [
            "The current tools support manual entry and a tap counter that runs for 30 seconds by default. You tap once for each complete rise and fall of the chest or abdomen; the App converts your taps and timing into a rate. Results completed early are marked as estimates. A result fills the form for you to review and save.",
            "Taps and timing are processed on device. The tools do not use the camera, microphone, or motion sensors to measure breathing automatically. Historical automated measurements retain their original source and review information. Manual observations, estimates, and veterinary conclusions remain distinct.",
            "These tools support observation and do not provide a medical diagnosis. Contact a veterinarian for breathing difficulties, another emergency, or concerns about your pet’s health."
          ]
        ],
        [
          "6. NFC tags and statistics on this device",
          [
            "Tags can contain a record type, pet identification information, and prefilled values you choose to write. Those values may include health information. Tag contents are not encrypted and can be read or copied by other devices. A tag contains no account credentials or sharing permissions and does not give others access to your library.",
            "Shortcut configurations are stored in the household library and can be included in enabled iCloud sync and complete backups. Tag verification information, open counts, and last-opened times stay on this device, outside iCloud and complete backups, and are not used for developer analytics. Open counts do not represent saved records. Permanently deleting a household also clears its device statistics.",
            "Opening a tag link in a browser sends the complete link to the website’s hosting and CDN services, potentially including its prefilled values. The fallback page decodes it on device without additional data requests. Health details appear only when you choose to reveal them, and the payload is removed from the address bar after successful decoding. Open and reveal tag details only on a trusted device."
          ]
        ],
        [
          "7. Developer collection and the website",
          [
            "The current App has no developer account system, AI service, third-party analytics, advertising SDK, or cross-app/site tracking. Apple processes StoreKit, CloudKit, MapKit maps, and other system-service data under its own policies. Recipients or website services can access content you deliver when you choose to export, share, or open a link in a browser.",
            "This website has no cookies, analytics, ads, web forms, or third-party font services. A first-party script selects the home page using your browser language and saves a language preference locally in your browser only when you explicitly change languages. NFC page handling is described above."
          ]
        ],
        [
          "8. Children, updates, and contact",
          [
            "Petter Days is designed for pet care and does not actively collect age or identity documents. We will update this policy and its dates when features or data handling change.",
            `For privacy or support questions, email <a href="${supportURL}">${supportEmail}</a>. You can also report general issues through <a href="${issueURL}">GitHub Issues</a>. That channel is public: do not post medical records, contact details, backups, precise locations, or other private information.`
          ]
        ]
      ]
    },
    choices: { eyebrow: "Privacy Choices & Data Management", title: "View, carry, restore, or delete your data.", intro: "These core data tools are not subscription-gated. Before an irreversible action, create and test a complete backup.", sections: [["Backup and veterinary brief", ["Export a complete backup from Profile → Data & Backups → Import & Export, or create a per-pet veterinary brief with trend charts, detail tables, and selected attachments."]], ["Complete backup", ["Create a .petterdaysbackup containing complete records, revisions, deletion status, and attachments. It contains private information, so save it only to a location you control."]], ["Restore", ["Restore validates the package and its relationships. Free users can restore backups with more than two pets without losing data: up to two remain editable and the rest remain visible and exportable in read-only mode until subscribed."]], ["Delete and recover", ["Ordinary deletion goes to Recently Deleted and can be restored during its retention period. Permanently deleting a household is a separate high-risk action that removes it from the current library after confirmation."]], ["iCloud and sharing", ["Sync begins only after subscription and explicit enablement. Sharing management shows members and permissions. Expiring a subscription pauses new cloud operations; it does not claim to remove cloud data or CKShare participation automatically."]], ["Get help", [`Email <a href="${supportURL}">${supportEmail}</a> with the App version and a description of the issue. Do not post backups, medical records, or precise locations.`]]]},
    terms: { eyebrow: "Terms of Use", title: "Clear boundaries for dependable records.", intro: "By using Petter Days, you agree to these terms. If you do not agree, stop using the App.", sections: [["1. Service", ["Petter Days provides pet-care records, reminders, trends, attachments, backups, observation tools, inventory, and optional iCloud collaboration. Features may change with future versions."]], ["2. Not medical care", ["Petter Days is not a medical device and does not diagnose, prevent, monitor, or treat disease. It does not replace a veterinarian. Seek professional help for urgent, persistent, or concerning symptoms."]], ["3. Your responsibilities", ["You are responsible for the legality and accuracy of content, attachments, recipients, and permissions, and for protecting your device, Apple Account, and backup files. Do not upload or share another person’s private data without authority."]], ["4. Subscription", ["Petter Days Pro is an auto-renewable subscription sold through Apple App Store. Price, term, trial, renewal, cancellation, refund, and taxes follow the purchase screen and Apple’s terms. Each shared participant needs a separate subscription."]], ["5. Data and availability", ["A device failure, storage limits, network or iCloud state, user action, or events outside reasonable control may affect data. Keep and test complete backups. We do not promise that data can never be lost or will be stored forever."]], ["6. Acceptable use and changes", ["Do not use Petter Days to violate rights or law, distribute malware, bypass subscription or permission controls, or interfere with service. We may update the App and these terms for security, compliance, compatibility, or product improvements."]], ["7. Contact", [`Email <a href="${supportURL}">${supportEmail}</a> for terms or support questions. Never post private health data or backups publicly.`]]]},
    support: { eyebrow: "Support", title: "Protect the data first. Then solve the problem.", intro: "For a sync, backup, or library problem, do not repeatedly uninstall the App. Create a backup when possible and record the full message first.", cards: [["Email support", supportEmail, supportURL], ["Manage data", "Backup, restore, export, delete, and sharing", "/en/privacy/choices/"], ["Privacy Policy", "On-device processing, iCloud, and permissions", "/en/privacy/"], ["Terms of Use", "Service, subscriptions, and responsibilities", "/en/terms/"]], sections: [["Recommended order", ["Do not delete the App. If it still opens, create a complete backup in Profile → Data & Backups → Import & Export. Note the App version, iOS version, time, and full message, then send a description with no private data."]], ["Purchase and iCloud", ["Sign in with the Apple Account used for purchase and choose Restore Purchases. Confirm an active Petter Days Pro subscription, explicit iCloud sync enablement, available iCloud Drive, and enough storage. Do not uninstall to force synchronization."]], ["Public-channel warning", [`You can report general issues publicly on <a href="${issueURL}">GitHub Issues</a>. Do not post medical records, backups, photos, contact information, Apple Account details, payment data, or precise locations. Use the email above for privacy questions.`]]]},
  },
  ja: {
    prefix: "/ja",
    language: "日本語",
    nav: { home: "ホーム", privacy: "プライバシー", terms: "利用規約", support: "サポート", language: "言語" },
    common: { product: "Petter Days", owner: "提供者：ZhenHui Wang", effective: `発効日：${effectiveDate}`, updated: `更新日：${updatedDate}`, medical: "Petter Days はペットケアの記録と観察を補助するツールです。医療診断を行わず、獣医師の助言に代わるものではありません。", source: "このサイトは Cookie、解析、広告、追跡スクリプトを使用しません。", openApp: "Petter Daysを開く", learn: "プライバシーについて" },
    privacy: {
      "eyebrow": "プライバシーポリシー",
      "title": "記録の持ち主は、まずあなたです。",
      "intro": "Petter Days の端末内処理、任意の iCloud による家族との共有、端末の権限、NFC タグ、バックアップと削除について説明します。",
      "sections": [
        [
          "1. 対象とアカウント",
          [
            "Petter Days は、利用者が作成するペット情報、健康記録、ケアプラン、用品、添付ファイル、バックアップ、手動の安静時呼吸数記録を扱います。Petter Days 独自のアカウント登録や、メールアドレス・電話番号・パスワードによるログインは不要です。"
          ]
        ],
        [
          "2. 端末への保存と家族との共有",
          [
            "無料版のデータは端末内のデータベースに保存され、CloudKit 同期は有効になりません。",
            "Petter Days Pro を購読し、iCloud 同期を明示的に有効にすると、記録と添付ファイルは Apple CloudKit を通じて利用者自身の非公開または共有 iCloud データベースに保存され、そのストレージを使用します。開発者はペットの健康データ用サーバーを運営せず、個人の CloudKit からこれらの記録を読み取りません。",
            "共有対象は家庭全体です。現在のペットに加え、今後追加するすべてのペット、記録、プラン、添付ファイル、用品情報が含まれます。オーナーがメンバーごとに閲覧のみ、または編集可能の権限を設定します。特定のペットだけを共有することはできません。参加者にはそれぞれ Pro の購読が必要です。"
          ]
        ],
        [
          "3. 端末の権限",
          [
            "位置情報：利用者が散歩を開始した後に、経路・距離・時間の計算に使用します。散歩中はバックグラウンドでも継続でき、終了または中止すると停止します。正確な経路はライブラリと利用者が作成した完全バックアップに保存され、有効にした iCloud の家庭共有でも同期されます。獣医師向け資料とペットの共有画像には正確な経路座標を含めません。",
            "写真：システムの写真選択画面で選んだ画像だけを、アバター、ステッカー、記録や資料の添付、用品の画像に使用します。写真ライブラリ全体を閲覧することはありません。ペットのプロフィールカードを「写真」に保存するときだけ、写真の追加権限を求めます。",
            "ファイル：システムの選択画面から選んだ資料を取り込み、データの書き出しやバックアップの作成・復元を行います。通知：ケアのリマインダーを有効にした後に権限を求め、端末のローカル通知を使用します。",
            "NFC：利用者がタグの読み取り、書き込み、確認を選ぶとシステムのスキャンを開始します。システムがバックグラウンドでタグを検出した場合は、通知をタップして App を開くこともできます。"
          ]
        ],
        [
          "4. 購入、バックアップ、削除",
          [
            "購入、更新、購入の復元、返金、利用資格の確認は Apple App Store と StoreKit が処理します。Petter Days は支払いカード情報を取得しません。価格と期間は購入画面に表示されます。",
            "記録、変更履歴、添付ファイルを含む完全バックアップを作成し、保存先や共有相手を選べます。個人情報を含むため、自分で管理できる場所に保管してください。",
            "購読が終了すると、新たな CloudKit の読み書きと共有管理を一時停止します。ダウンロード済みの端末データ、クラウド領域、有効な共有関係は削除しません。閲覧、バックアップ、復元、書き出しは引き続き利用できます。",
            "通常の記録は削除・復元できます。家庭全体の完全削除には別途確認が必要です。共有から退出した場合や削除された場合、CloudKit は権限に従って参加者側のコピーを削除しますが、オーナーの元データは削除しません。書き出し済み、または共有済みのコピーを App が遠隔で削除することはできません。"
          ]
        ],
        [
          "5. 安静時呼吸数と健康情報",
          [
            "現在は手動入力と、標準で 30 秒間のタップカウンターを提供しています。胸やお腹が一度上下するたびにタップすると、回数と時間から呼吸数を換算します。途中で完了した結果には推定値と表示します。結果がフォームに反映された後、利用者が確認して保存します。",
            "タップと時間の処理は端末内で行い、カメラ、マイク、モーションセンサーによる自動測定は行いません。過去の自動測定記録には元の情報源と確認情報を残します。手動の観察、推定値、獣医師の判断は区別して扱います。",
            "これらの機能は観察の補助であり、医療診断ではありません。呼吸困難などの緊急症状や健康上の不安がある場合は、獣医師に相談してください。"
          ]
        ],
        [
          "6. NFC タグと端末内の利用状況",
          [
            "タグには記録の種類、ペットの識別情報、利用者が書き込みを選んだ入力済みの値が含まれる場合があります。値には健康情報が含まれることがあります。タグの内容は暗号化されず、ほかの端末でも読み取りや複製が可能です。アカウントの認証情報や共有権限は含まれず、タグによって他者がライブラリにアクセスできるようになることはありません。",
            "ショートカット設定は家庭のライブラリに保存され、有効にした iCloud 同期や完全バックアップの対象となります。タグの確認情報、開いた回数、最後に開いた日時はこの端末だけに保存し、iCloud や完全バックアップには含めず、開発者の分析にも使用しません。開いた回数は保存した記録数ではありません。家庭を完全に削除すると、その端末内の利用状況も削除します。",
            "タグのリンクをブラウザで開くと、入力済みの値を含む可能性のある完全なリンクが、ウェブサイトのホスティング・CDN サービスに送信されます。案内ページは追加のデータ通信をせず端末内で解析します。健康情報の詳細は利用者が選んだ場合だけ表示し、解析が成功するとアドレスバーからデータ部分を除きます。タグの詳細は信頼できる端末でのみ開いてください。"
          ]
        ],
        [
          "7. 開発者による収集とウェブサイト",
          [
            "現在の App には独自アカウント、AI サービス、第三者による分析、広告 SDK、App やサイトをまたぐ追跡はありません。Apple は StoreKit、CloudKit、MapKit の地図などのシステムサービスのデータを自社の方針に従って処理します。利用者が書き出し、共有、ブラウザでのリンク表示を選んだ場合、受信者やウェブサービスは渡された内容にアクセスできます。",
            "このウェブサイトには Cookie、分析、広告、入力フォーム、第三者のフォントサービスはありません。自サイトのスクリプトがブラウザの言語に合わせてホームページを選び、利用者が言語を切り替えた場合だけ、その設定をブラウザ内に保存します。NFC ページの扱いは前項のとおりです。"
          ]
        ],
        [
          "8. 子ども、更新、お問い合わせ",
          [
            "Petter Days はペットのケアを目的としており、年齢や身分証明書を積極的に収集しません。機能やデータの扱いが変わる場合は、本ポリシーと日付を更新します。",
            `プライバシーや使い方については、<a href="${supportURL}">${supportEmail}</a> へメールでお問い合わせください。一般的な不具合は <a href="${issueURL}">GitHub Issues</a> でも報告できます。公開の窓口ですので、診療記録、連絡先、バックアップ、正確な位置情報などの個人情報は投稿しないでください。`
          ]
        ]
      ]
    },
    choices: { eyebrow: "プライバシー設定とデータ管理", title: "表示、持ち出し、復元、削除。", intro: "これらの基本機能は購読に依存しません。不可逆操作の前に完全バックアップを作成し、確認してください。", sections: [["バックアップと獣医向け資料", ["「プロフィール → データとバックアップ → 読み込みと書き出し」から完全バックアップを書き出すか、傾向グラフ、明細表、選択した添付を含む獣医向け資料を作成します。"]], ["バックアップと復元", ["完全な記録、変更履歴、削除状態、添付ファイルを含む .petterdaysbackup を作成できます。個人情報を含むため、自分で管理できる場所にのみ保存してください。無料版でも3匹以上を失わず復元でき、2匹を超える分は購読まで閲覧・書き出し可能な読み取り専用になります。"]], ["削除と共有", ["通常の削除は「最近削除した項目」から復元可能です。世帯全体の完全削除は別の高リスク操作です。購読終了は CKShare 関係の自動削除を意味しません。"]], ["サポート", [`<a href="${supportURL}">${supportEmail}</a> を利用し、公開ページに個人データやバックアップを投稿しないでください。`]]]},
    terms: { eyebrow: "利用規約", title: "明確な境界で、安心して記録。", intro: "Petter Days の利用により、本規約に同意したものとみなされます。", sections: [["サービスと医療上の境界", ["Petter Days は記録、通知、傾向、添付、バックアップ、観察補助、在庫、任意の iCloud 連携を提供します。医療機器ではなく、診断・予防・治療を行いません。"]], ["利用者の責任", ["内容と共有の適法性、端末、Apple Account、バックアップファイルの管理は利用者の責任です。"]], ["購読", ["Petter Days Pro は Apple App Store の自動更新購読です。価格、期間、解約、返金、税は Apple の購入画面と規約に従います。各共有参加者に個別購読が必要です。"]], ["データと可用性", ["端末故障、容量、ネットワーク、iCloud、誤操作などでデータが影響を受ける場合があります。完全バックアップを定期的に作成・検証してください。永久保存や絶対に失われないことを保証しません。"]], ["連絡", [`<a href="${supportURL}">${supportEmail}</a> を利用し、個人の健康情報を公開しないでください。`]]]},
    support: { eyebrow: "サポート", title: "まずデータを守り、その後で解決します。", intro: "同期、バックアップ、ライブラリの問題で App を何度も削除しないでください。可能なら「プロフィール → データとバックアップ → 読み込みと書き出し」で先にバックアップを作成します。", cards: [["メールで問い合わせ", supportEmail, supportURL], ["データ管理", "バックアップ、復元、書き出し、削除、共有", "/ja/privacy/choices/"], ["プライバシー", "端末処理、iCloud、権限", "/ja/privacy/"], ["利用規約", "サービス、購読、責任", "/ja/terms/"]], sections: [["推奨手順", ["App を削除せず、開ける場合は「プロフィール → データとバックアップ → 読み込みと書き出し」で完全バックアップを作成します。App/iOS バージョン、時刻、完全なメッセージを記録し、個人情報を除いて報告してください。"]], ["購読と iCloud", ["購入時の Apple Account を確認して購入を復元します。Petter Days Pro の有効な購読、iCloud 同期の明示的な有効化、iCloud Drive、空き容量を確認し、再インストールで同期を強制しないでください。"]], ["公開窓口の注意", [`一般的な不具合は <a href="${issueURL}">GitHub Issues</a> でも報告できます。公開されるため、診療記録、バックアップ、写真、連絡先、支払情報、正確な位置情報は投稿しないでください。プライバシーに関するお問い合わせは上記のメールをご利用ください。`]]]},
  },
  ko: {
    prefix: "/ko",
    language: "한국어",
    nav: { home: "홈", privacy: "개인정보", terms: "이용 약관", support: "지원", language: "언어" },
    common: { product: "Petter Days", owner: "게시자: ZhenHui Wang", effective: `시행일: ${effectiveDate}`, updated: `업데이트: ${updatedDate}`, medical: "Petter Days는 반려동물 돌봄 기록과 관찰을 돕는 도구입니다. 의료 진단을 제공하거나 수의사의 조언을 대신하지 않습니다.", source: "이 웹사이트는 쿠키, 분석, 광고 또는 추적 스크립트를 사용하지 않습니다.", openApp: "Petter Days 열기", learn: "개인정보 보호 방식" },
    privacy: {
      "eyebrow": "개인정보 처리방침",
      "title": "기록의 주인은 사용자입니다.",
      "intro": "Petter Days의 기기 내 처리, 선택적 iCloud 가족 공유, 기기 권한, NFC 태그, 백업과 삭제 방식을 설명합니다.",
      "sections": [
        [
          "1. 적용 범위와 계정",
          [
            "Petter Days는 사용자가 직접 만드는 반려동물 정보, 건강 기록, 돌봄 계획, 용품 재고, 첨부 파일, 백업 및 수동 안정 시 호흡수 기록을 처리합니다. 별도의 Petter Days 계정이나 이메일·전화번호·비밀번호를 이용한 로그인이 필요하지 않습니다."
          ]
        ],
        [
          "2. 기기 저장과 가족 공유",
          [
            "무료 버전에서는 데이터를 기기의 로컬 데이터베이스에 저장하며 CloudKit 동기화를 활성화하지 않습니다.",
            "Petter Days Pro를 구독하고 iCloud 동기화를 직접 켜면, 기록과 첨부 파일이 Apple CloudKit을 통해 사용자의 비공개 또는 공유 iCloud 데이터베이스에 저장되며 사용자의 저장 공간을 사용합니다. 개발자는 반려동물 건강 데이터 서버를 운영하거나 개인 CloudKit에서 이러한 기록을 읽지 않습니다.",
            "공유 범위는 가족 자료 전체입니다. 현재 및 이후에 추가하는 모든 반려동물, 기록, 계획, 첨부 파일과 용품 정보가 포함됩니다. 소유자가 구성원별로 읽기 전용 또는 편집 권한을 지정하며, 특정 반려동물만 따로 공유할 수는 없습니다. 함께 돌보는 사람마다 각자의 Pro 구독이 필요합니다."
          ]
        ],
        [
          "3. 기기 권한",
          [
            "위치: 사용자가 산책을 시작한 뒤 경로·거리·시간을 계산하는 데 사용합니다. 산책 중에는 백그라운드에서도 계속될 수 있으며, 종료하거나 취소하면 중지합니다. 정확한 경로는 자료와 사용자가 만든 전체 백업에 저장되며, 활성화한 iCloud 가족 공유를 통해 동기화될 수 있습니다. 수의사 상담용 자료와 반려동물 공유 이미지에는 정확한 경로 좌표를 포함하지 않습니다.",
            "사진: 시스템 사진 선택기는 아바타, 스티커, 기록이나 자료의 첨부 파일, 용품 이미지로 사용할 목적으로 선택한 이미지만 전달합니다. App은 사진 보관함 전체를 탐색하지 않습니다. 반려동물 프로필 카드를 사진에 저장하기로 선택할 때만 사진 추가 권한을 요청합니다.",
            "파일: 시스템 선택기를 통해 선택한 자료를 가져오거나, 데이터를 내보내고 백업을 생성·복원합니다. 알림: 돌봄 알림을 켠 뒤에만 권한을 요청하며 기기의 로컬 알림을 사용합니다.",
            "NFC: 사용자가 태그 읽기·쓰기·확인을 선택하면 시스템 스캔을 시작합니다. 시스템이 백그라운드에서 태그를 감지한 뒤 알림을 누르면 App을 열 수도 있습니다."
          ]
        ],
        [
          "4. 구매, 백업과 삭제",
          [
            "구매, 갱신, 구매 복원, 환불과 이용 자격 확인은 Apple App Store와 StoreKit이 처리합니다. Petter Days는 결제 카드 정보를 받지 않습니다. 가격과 결제 주기는 구매 화면에 표시됩니다.",
            "기록, 수정 이력과 첨부 파일을 포함한 전체 백업을 만들고, 저장 위치나 공유할 상대를 직접 선택할 수 있습니다. 백업에는 개인정보가 포함되므로 직접 관리하는 위치에 보관하세요.",
            "구독이 만료되면 새로운 CloudKit 읽기·쓰기와 공유 관리를 일시 중지합니다. 이미 내려받은 기기 데이터, 클라우드 영역과 유효한 공유 관계는 삭제하지 않습니다. 보기, 백업, 복원과 내보내기는 계속 사용할 수 있습니다.",
            "일반 기록은 삭제하고 복원할 수 있습니다. 가족 자료 전체를 영구 삭제하려면 별도 확인이 필요합니다. 공유에서 나가거나 제외되면 CloudKit이 권한 규칙에 따라 참여자의 공유 사본을 정리하며, 소유자의 원본은 삭제하지 않습니다. App은 이미 내보내거나 공유한 사본을 원격으로 삭제할 수 없습니다."
          ]
        ],
        [
          "5. 안정 시 호흡수와 건강 정보",
          [
            "현재는 직접 입력과 기본 30초의 수동 탭 카운터를 제공합니다. 가슴이나 배가 한 번 오르내릴 때마다 누르면 횟수와 시간으로 호흡수를 환산합니다. 일찍 완료한 결과는 추정값으로 표시됩니다. 결과가 입력 양식에 반영된 후 사용자가 확인하고 저장합니다.",
            "탭과 시간은 기기에서 처리하며 카메라, 마이크 또는 동작 센서로 자동 측정하지 않습니다. 과거 자동 측정 기록에는 원래 출처와 검토 정보를 유지합니다. 수동 관찰, 추정값과 수의사의 판단은 구분하여 취급합니다.",
            "이 도구는 관찰을 도울 뿐 의료 진단을 제공하지 않습니다. 호흡 곤란 등 응급 증상이 있거나 건강이 걱정되면 수의사에게 문의하세요."
          ]
        ],
        [
          "6. NFC 태그와 기기 내 통계",
          [
            "태그에는 기록 종류, 반려동물 식별 정보와 사용자가 쓰기로 선택한 미리 입력된 값이 포함될 수 있습니다. 이 값에는 건강 정보가 포함될 수 있습니다. 태그 내용은 암호화되지 않아 다른 기기에서 읽거나 복사할 수 있습니다. 계정 인증 정보나 공유 권한은 포함하지 않으며, 태그가 다른 사람에게 자료 접근 권한을 부여하지 않습니다.",
            "바로가기 설정은 가족 자료에 저장되며 활성화한 iCloud 동기화와 전체 백업에 포함될 수 있습니다. 태그 확인 정보, 연 횟수와 마지막으로 연 시간은 이 기기에만 저장되고 iCloud나 전체 백업에는 포함되지 않으며 개발자 분석에도 사용하지 않습니다. 연 횟수는 저장한 기록 수를 뜻하지 않습니다. 가족 자료를 영구 삭제하면 해당 기기 통계도 정리합니다.",
            "태그 링크를 브라우저에서 열면 미리 입력된 값이 포함될 수 있는 전체 링크가 웹사이트 호스팅 및 CDN 서비스에 전달됩니다. 안내 페이지는 추가 데이터 요청 없이 기기에서 해석합니다. 건강 정보의 상세 내용은 사용자가 펼칠 때만 표시하고, 해석에 성공하면 주소창에서 해당 데이터를 제거합니다. 태그 상세 내용은 신뢰할 수 있는 기기에서만 열어 보세요."
          ]
        ],
        [
          "7. 개발자 수집과 웹사이트",
          [
            "현재 App에는 자체 계정 시스템, AI 서비스, 제3자 분석, 광고 SDK 또는 앱·사이트 간 추적 기능이 없습니다. Apple은 StoreKit, CloudKit, MapKit 지도 등 시스템 서비스 데이터를 자체 정책에 따라 처리합니다. 사용자가 내보내기, 공유 또는 브라우저에서 링크 열기를 선택하면 수신자나 웹서비스가 전달받은 내용을 볼 수 있습니다.",
            "이 웹사이트는 쿠키, 분석, 광고, 온라인 입력 양식 또는 제3자 글꼴 서비스를 사용하지 않습니다. 자체 스크립트가 브라우저 언어에 맞춰 첫 페이지를 선택하며, 사용자가 언어를 직접 바꿀 때만 그 설정을 브라우저에 저장합니다. NFC 페이지의 처리 방식은 위 항목을 참고하세요."
          ]
        ],
        [
          "8. 아동, 변경과 문의",
          [
            "Petter Days는 반려동물 돌봄을 위한 App이며 나이나 신분증을 적극적으로 수집하지 않습니다. 기능이나 데이터 처리 방식이 바뀌면 이 방침과 날짜를 업데이트합니다.",
            `개인정보 또는 이용 관련 문의는 <a href="${supportURL}">${supportEmail}</a>으로 이메일을 보내 주세요. 일반적인 문제는 <a href="${issueURL}">GitHub Issues</a>에서도 신고할 수 있습니다. 공개 채널이므로 진료 기록, 연락처, 백업, 정확한 위치 등 개인정보는 게시하지 마세요.`
          ]
        ]
      ]
    },
    choices: { eyebrow: "개인정보 선택 및 데이터 관리", title: "보고, 가져가고, 복원하거나 삭제하세요.", intro: "이 핵심 기능은 구독과 무관합니다. 되돌릴 수 없는 작업 전에 전체 백업을 만들고 검증하세요.", sections: [["백업과 수의사용 자료", ["「프로필 → 데이터 및 백업 → 가져오기 및 내보내기」에서 전체 백업을 내보내거나 추세 차트, 상세 표와 선택한 첨부파일이 있는 수의사용 자료를 만듭니다."]], ["백업과 복원", ["전체 기록, 수정 기록, 삭제 상태와 첨부 파일이 포함된 .petterdaysbackup을 만들 수 있습니다. 개인 정보가 포함되므로 직접 관리하는 위치에만 저장하세요. 무료 사용자도 세 마리 이상이 포함된 백업을 모두 복원할 수 있으며 두 마리를 넘는 데이터는 구독 전까지 보기와 내보내기가 가능한 읽기 전용입니다."]], ["삭제와 공유", ["일반 삭제는 최근 삭제에서 복원할 수 있습니다. 가정 전체 영구 삭제는 별도의 고위험 작업입니다. 구독 종료가 CKShare 관계를 자동 삭제한다는 뜻은 아닙니다."]], ["도움말", [`<a href="${supportURL}">${supportEmail}</a>을 사용하되 공개 페이지에 개인정보나 백업을 올리지 마세요.`]]]},
    terms: { eyebrow: "이용 약관", title: "명확한 경계로 안심할 수 있는 기록.", intro: "Petter Days를 사용하면 이 약관에 동의하는 것입니다.", sections: [["서비스와 의료 한계", ["Petter Days는 기록, 알림, 추세, 첨부파일, 백업, 관찰 도구, 재고와 선택적 iCloud 협업을 제공합니다. 의료기기가 아니며 질병을 진단·예방·치료하지 않습니다."]], ["사용자 책임", ["콘텐츠와 공유의 적법성, 기기, Apple Account, 백업 파일 보호는 사용자의 책임입니다."]], ["구독", ["Petter Days Pro는 Apple App Store 자동 갱신 구독입니다. 가격, 기간, 취소, 환불과 세금은 Apple 구매 화면과 약관을 따릅니다. 각 공유 참여자에게 별도 구독이 필요합니다."]], ["데이터와 가용성", ["기기 고장, 저장 용량, 네트워크, iCloud, 오작동이 데이터에 영향을 줄 수 있습니다. 전체 백업을 정기적으로 만들고 검증하세요. 영구 보관이나 절대 손실되지 않음을 보장하지 않습니다."]], ["문의", [`<a href="${supportURL}">${supportEmail}</a>을 이용하고 비공개 건강 정보를 공개하지 마세요.`]]]},
    support: { eyebrow: "지원", title: "먼저 데이터를 보호한 뒤 문제를 해결하세요.", intro: "동기화, 백업 또는 자료 문제로 App을 반복 삭제하지 마세요. 가능하면 먼저 백업을 만들고 전체 메시지를 기록하세요.", cards: [["이메일 문의", supportEmail, supportURL], ["데이터 관리", "백업, 복원, 내보내기, 삭제와 공유", "/ko/privacy/choices/"], ["개인정보", "기기 내 처리, iCloud와 권한", "/ko/privacy/"], ["이용 약관", "서비스, 구독과 책임", "/ko/terms/"]], sections: [["권장 순서", ["App을 삭제하지 마세요. 열 수 있다면 「프로필 → 데이터 및 백업 → 가져오기 및 내보내기」에서 전체 백업을 만들고 App/iOS 버전, 시간, 전체 오류를 기록한 다음 개인정보 없이 신고하세요."]], ["구독과 iCloud", ["구매에 사용한 Apple Account를 확인하고 구매 복원을 선택하세요. Petter Days Pro 구독이 유효한지, iCloud 동기화를 명시적으로 켰는지, iCloud Drive와 저장 공간이 충분한지 확인하고 재설치로 동기화를 강제하지 마세요."]], ["공개 채널 주의", [`일반적인 문제는 <a href="${issueURL}">GitHub Issues</a>에 공개적으로 신고할 수 있습니다. 진료 기록, 백업, 사진, 연락처, 결제 정보 또는 정확한 위치는 게시하지 마세요. 개인정보 관련 문의는 위 이메일을 이용해 주세요.`]]]},
  },
};

const pages = ["home", "privacy", "choices", "terms", "support"];

function pathFor(locale, page) {
  const prefix = locales[locale].prefix;
  if (page === "home") return `${prefix || ""}/`;
  if (page === "choices") return `${prefix}/privacy/choices/` || "/privacy/choices/";
  return `${prefix}/${page}/` || `/${page}/`;
}

function absolutePath(locale, page) {
  const path = pathFor(locale, page).replace(/\/+/g, "/");
  return `${origin}${path}`;
}

function langLinks(page, current) {
  return Object.entries(locales).map(([code, value]) => `<a href="${pathFor(code, page)}?lang=${code}" hreflang="${code}"${code === current ? ' aria-current="page"' : ""}>${value.language}</a>`).join("");
}

function header(locale, page, product = false) {
  const c = locales[locale];
  const links = product
    ? `<a href="#features">${homeContent[locale].nav[0]}</a><a href="#nfc">${homeContent[locale].nav[1]}</a><a href="${pathFor(locale, "support")}">${homeContent[locale].nav[2]}</a>`
    : `<a href="${pathFor(locale, "privacy")}">${c.nav.privacy}</a><a href="${pathFor(locale, "terms")}">${c.nav.terms}</a><a href="${pathFor(locale, "support")}">${c.nav.support}</a>`;
  return `<a class="skip-link" href="#content">${homeContent[locale].skip}</a>
  <header class="site-header"><nav class="nav" aria-label="${c.nav.home}">
    <a class="brand" href="${pathFor(locale, "home")}"><img class="brand-icon" src="${productIdentity.icon}" alt=""><span>Petter Days</span></a>
    <div class="nav-links">${links}
      <details class="lang"><summary>${c.nav.language} ▾</summary><div class="lang-menu">${langLinks(page, locale)}</div></details>
    </div>
  </nav></header>`;
}

function footer(locale, product = false) {
  const c = locales[locale];
  const h = homeContent[locale];
  const note = product ? `${escape(h.demo)}<br>${escape(h.medical)}` : `${c.common.medical}<br>${c.common.source}`;
  return `<footer class="site-footer"><div class="footer-inner"><div><a class="brand" href="${pathFor(locale, "home")}"><img class="brand-icon" src="${productIdentity.icon}" alt=""><span>Petter Days</span></a><p class="footer-note">${note}<br>© 2026 ZhenHui Wang</p></div><nav class="footer-links" aria-label="${c.nav.support}"><a href="${pathFor(locale, "privacy")}">${c.nav.privacy}</a><a href="${pathFor(locale, "choices")}">${h.data}</a><a href="${pathFor(locale, "terms")}">${c.nav.terms}</a><a href="${pathFor(locale, "support")}">${c.nav.support}</a></nav></div></footer>`;
}

function document(locale, page, title, description, content, product = false) {
  const c = locales[locale];
  const canonical = absolutePath(locale, page);
  const alternates = Object.keys(locales).map((code) => `<link rel="alternate" hreflang="${code}" href="${absolutePath(code, page)}">`).join("");
  return `<!doctype html><html lang="${locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${product ? '<meta name="theme-color" content="#FFFDFA">' : '<meta name="theme-color" content="#F3EFE7" media="(prefers-color-scheme: light)"><meta name="theme-color" content="#141210" media="(prefers-color-scheme: dark)">'}<title>${escape(title)} · Petter Days</title><meta name="description" content="${escape(description)}"><meta name="apple-itunes-app" content="app-id=${productIdentity.appStoreAppleID}"><meta property="og:title" content="${escape(title)} · Petter Days"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${canonical}"><meta property="og:type" content="website"><meta property="og:image" content="${origin}${productIdentity.icon}"><meta name="twitter:card" content="summary"><link rel="canonical" href="${canonical}">${alternates}<link rel="alternate" hreflang="x-default" href="${absolutePath("zh-Hans", page)}"><link rel="icon" type="image/png" sizes="32x32" href="${productIdentity.favicon}"><link rel="apple-touch-icon" sizes="180x180" href="${productIdentity.touchIcon}"><script src="/assets/language.js"></script><link rel="stylesheet" href="/assets/styles.css"><link rel="stylesheet" href="/assets/rounded.css">${product ? '<link rel="stylesheet" href="/assets/home.css"><script src="/assets/home.js" defer></script>' : ''}</head><body${product ? ' class="product-page"' : ''}>${header(locale, page, product)}<main id="content">${content}</main>${footer(locale, product)}</body></html>`;
}

function home(locale) {
  const h = homeContent[locale];
  return document(locale, "home", h.title, h.description, productHome(locale, h), true);
}

function legalPage(locale, page) {
  const c = locales[locale];
  const data = c[page];
  const sections = data.sections.map(([title, paragraphs]) => `<section><h2>${title}</h2>${paragraphs.map((p) => `<p>${p}</p>`).join("")}</section>`).join("");
  const content = `<header class="legal-hero"><p class="eyebrow">${data.eyebrow}</p><h1>${data.title}</h1><p>${data.intro}</p><div class="meta"><span>${c.common.owner}</span><span>${c.common.effective}</span><span>${c.common.updated}</span></div></header><article class="article">${page === "privacy" ? `<p class="callout">${c.common.medical}</p>` : ""}${sections}</article>`;
  return document(locale, page, data.eyebrow, data.intro, content);
}

function support(locale) {
  const c = locales[locale];
  const s = c.support;
  const cards = s.cards.map(([title, text, href]) => `<a class="support-card" href="${href}"><strong>${title}</strong><span>${text}</span></a>`).join("");
  const sections = s.sections.map(([title, paragraphs]) => `<section><h2>${title}</h2>${paragraphs.map((p) => `<p>${p}</p>`).join("")}</section>`).join("");
  const content = `<header class="legal-hero"><p class="eyebrow">${s.eyebrow}</p><h1>${s.title}</h1><p>${s.intro}</p><div class="support-grid">${cards}</div></header><article class="article">${sections}</article>`;
  return document(locale, "support", s.eyebrow, s.intro, content);
}

function outputFile(locale, page) {
  const prefix = locales[locale].prefix.replace(/^\//, "");
  if (page === "home") return join(out, prefix, "index.html");
  if (page === "choices") return join(out, prefix, "privacy", "choices", "index.html");
  return join(out, prefix, page, "index.html");
}

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await cp(join(root, "static"), out, { recursive: true });
const linkTemplate = await readFile(join(out, "link/index.html"), "utf8");
await writeFile(join(out, "link/index.html"), linkTemplate.replaceAll("{{APP_ICON_URL}}", productIdentity.icon).replaceAll("{{FAVICON_URL}}", productIdentity.favicon).replaceAll("{{TOUCH_ICON_URL}}", productIdentity.touchIcon).replaceAll("{{APP_STORE_URL}}", appStoreURL).replaceAll("{{APP_STORE_ID}}", productIdentity.appStoreAppleID));
await mkdir(join(out, "assets"), { recursive: true });
await cp(join(out, "styles.css"), join(out, "assets", "styles.css"));
await rm(join(out, "styles.css"));

const urls = [];
for (const locale of Object.keys(locales)) {
  for (const page of pages) {
    const html = page === "home" ? home(locale) : page === "support" ? support(locale) : legalPage(locale, page);
    const file = outputFile(locale, page);
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, html);
    urls.push({ location: absolutePath(locale, page), modified: page === "home" ? homeUpdatedDate : updatedDate });
  }
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(({ location, modified }) => `  <url><loc>${location}</loc><lastmod>${modified}</lastmod></url>`).join("\n")}\n</urlset>\n`;
await writeFile(join(out, "sitemap.xml"), sitemap);

const notFound = document("zh-Hans", "home", "页面不存在", "找不到这个页面。", `<header class="legal-hero"><p class="eyebrow">404</p><h1>这里没有这份记录。</h1><p>链接可能已经改变。请返回 Petter Days 首页或支持页面。</p><div class="actions"><a class="button" href="/">返回首页</a><a class="button secondary" href="/support/">获取支持</a></div></header>`);
await writeFile(join(out, "404.html"), notFound);

const generated = await readFile(join(out, "index.html"), "utf8");
if (!generated.includes('class="product-page"') || !generated.includes('id="features"')) throw new Error("Home generation failed");
console.log(`Built ${urls.length} localized pages in ${out}`);
