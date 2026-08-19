import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const out = join(root, "dist");
const origin = "https://petterdays.wongkoo.group";
const effectiveDate = "2026-08-19";
const issueURL = "https://github.com/wongkoo/petterdays-site/issues/new/choose";

const locales = {
  "zh-Hans": {
    prefix: "",
    language: "简体中文",
    nav: { home: "首页", privacy: "隐私", terms: "条款", support: "支持", language: "语言" },
    common: {
      product: "Petter Days",
      owner: "发布者：ZhenHui Wang",
      effective: `生效日期：${effectiveDate}`,
      updated: `更新日期：${effectiveDate}`,
      medical: "Petter Days 是宠物照护记录与辅助观察工具，不提供医疗诊断，也不能替代专业兽医意见。",
      source: "本网站不使用 Cookie、分析、广告或追踪脚本。",
      soon: "App Store 上架准备中",
      learn: "了解隐私设计",
    },
    home: {
      eyebrow: "为长期照护而设计",
      title: "每一天，都是更完整的宠物档案。",
      intro: "把尿便、体重、用药、就诊、静息呼吸、遛弯和照护安排放在一起。离线也能记录，需要时再用自己的 iCloud 与家人协作。",
      trust: [
        ["本地优先", "免费版核心记录无需联网"],
        ["由你掌握", "完整备份、恢复与导出永久免费"],
        ["私人 iCloud", "订阅后由用户主动启用同步与共享"],
      ],
      featuresTitle: "从日常记录，到一次更有准备的就诊",
      featuresIntro: "Petter Days 不追求堆满指标，而是让每条记录有时间、来源、附件和修改历史。",
      features: [
        ["日常健康记录", "快速记录尿尿、便便、体重、症状、用药、静息呼吸和自定义事项。"],
        ["变化与趋势", "用同期对比看见尿便、体重和可靠呼吸记录的变化，并能回到原始记录。"],
        ["照护与仓库", "安排任务，维护用品规格、库存、临期批次、采购和历史价格。"],
        ["兽医资料包", "把趋势图、明细表格和关键附件整理为可分享的 PDF，同时保留来源边界。"],
      ],
      plansTitle: "核心能力免费，云端协作按需开启",
      plansIntro: "未订阅、订阅到期或 iCloud 异常都不会成为删除数据的理由。",
      free: { title: "免费版", price: "始终可用", items: ["本机健康记录与附件", "最多管理两只宠物", "照护、仓库和趋势", "完整备份、恢复与导出"] },
      cloud: { title: "Petter Days Cloud", price: "可选订阅，价格以 App Store 为准", items: ["Apple 设备间自动同步", "换机或重装后从 iCloud 恢复", "邀请已订阅家人只读或共同编辑", "不限制宠物数量"] },
      cloudNote: "云端数据占用用户自己的 iCloud 空间；Petter Days 不提供无限云空间，也不会把私人宠物健康资料保存到开发者数据库。",
    },
    privacy: {
      eyebrow: "隐私政策",
      title: "你的记录，首先属于你。",
      intro: "本政策说明 Petter Days 如何在设备上处理资料、何时使用用户自己的 iCloud，以及用户如何备份、共享与删除数据。",
      sections: [
        ["1. 适用范围", ["Petter Days 用于记录和查看用户自行录入的宠物资料、健康记录、用药与照护计划、用品库存、附件、备份，以及设备端静息呼吸辅助测量结果。Petter Days 不要求注册开发者账号，不使用邮箱、手机号或密码登录。"]],
        ["2. 数据保存位置", ["免费使用时，资料保存在用户 iPhone 上的本地资料库，App 不启用 CloudKit 同步链路。", "用户订阅并明确启用 Petter Days Cloud 后，结构化记录、照片和附件通过 Apple CloudKit 保存在用户自己的 iCloud private/shared database，并占用其 iCloud 空间。开发者不建立宠物健康数据后端，也不从用户私人 CloudKit 收集这些资料。", "用户可以为单只宠物创建 CKShare，邀请的 iCloud 成员按主人设置的只读或编辑权限共同照护。各参与者均需独立订阅 Petter Days Cloud。"]],
        ["3. 设备权限", ["相机：仅在用户选择相机静息呼吸测量时采集胸腹画面并在 iPhone 上分析。原始视频默认不保存；只有用户明确选择时才作为附件保存。", "麦克风：仅在用户选择麦克风气流测量时采集鼻口附近的气流或呼吸声，并在本次测量内存中分析。原始 PCM 默认不保存。", "运动与健身：仅在用户选择相应呼吸测量方式时识别手机晃动或胸腹壁细微运动。原始运动样本默认不保存。", "位置：仅在用户主动开始遛弯后，在活动期间计算路线、距离和时间；结束或放弃后停止。精确坐标默认保存在设备和可选的私人 iCloud，不进入开发者分析系统。", "照片与文件：仅通过系统选择器接收用户明确选择的头像、照片、PDF、录音或视频。通知仅在用户主动开启提醒后请求。"]],
        ["4. 订阅与购买", ["购买、续费、恢复、退款和资格验证由 Apple App Store 与 StoreKit 处理。Petter Days 不取得支付卡信息。产品名称和价格以 App Store 显示为准。", "订阅到期后，Petter Days 暂停新的 CloudKit 读写和共享管理，但不删除已下载的本地数据、云端 zone 或仍有效的 CKShare 参与关系。用户仍可查看、备份、恢复和导出资料。"]],
        ["5. 备份、导出、共享与删除", ["用户可创建加密或不加密的完整备份。不加密备份可能被任何取得文件的人读取；加密备份的密码由用户自行保管，开发者无法找回。", "用户主动导出或分享的可读文件、附件或备份由用户选择保存位置和接收方。退出共享或被主人移除后，CloudKit 按参与关系和权限处理该共享的本机副本，主人的原数据不会因此删除。", "用户可软删除并恢复记录，也可在 App 中永久删除整个家庭资料。App 不会秘密保留已永久删除的本机资料，也不能远程删除用户已经导出的副本。具体操作见隐私选择与数据管理页面。"]],
        ["6. 静息呼吸与健康信息", ["相机、麦克风气流和运动传感器三种方式分别计算和记录，不互相修正。质量不足时 App 应拒绝提供正式频率。机器结果、人工复核和用户记录的兽医结论分别保存。", "这些功能是辅助观察工具，不是医疗诊断。出现异常或对宠物健康有疑问时，请联系专业兽医。"]],
        ["7. 开发者收集、追踪与第三方", ["当前版本不包含自建账号、AI 服务、第三方分析、广告 SDK 或跨 App/网站追踪。开发者不会通过 Petter Days 服务器取得用户的宠物健康资料。Apple 可能依据其自身政策处理 StoreKit、CloudKit 和系统服务数据。", "本网站不使用 Cookie、分析、广告、在线表单或第三方字体。若未来新增诊断日志、客服表单、AI Gateway、开发者服务器或第三方 SDK，本政策和 App Store 隐私声明会在功能上线前更新。"]],
        ["8. 儿童、变更与联系", ["Petter Days 面向宠物照护记录，不主动收集用户年龄或身份证明。我们可能因产品能力、法律或平台要求更新本政策，并在本页标注新的生效与更新日期。", `如有隐私或支持问题，请通过 <a href="${issueURL}">支持渠道</a> 联系。请勿在公开问题中提交宠物病历、联系方式、备份文件、精确位置或其他私人资料。`]],
      ],
    },
    choices: {
      eyebrow: "隐私选择与数据管理",
      title: "查看、带走、恢复或删除你的资料。",
      intro: "这些核心数据能力不受订阅限制。进行不可逆操作前，请先创建一份经过验证的完整备份。",
      sections: [
        ["导出与资料包", ["在 App 的“档案 → 数据与安全”中导出结构化记录，或按宠物生成包含趋势图、明细表格和所选附件的兽医资料包。可读导出默认不包含遛弯精确坐标。"]],
        ["创建完整备份", ["可创建加密或不加密的 .pethealthbackup。加密备份需要用户设置密码；不加密备份便于检查内容，但任何取得文件的人都可能读取。请把备份保存到可信位置并完成一次恢复演练。"]],
        ["恢复备份", ["恢复会完整检查备份结构和数据关系。免费用户也可以恢复包含超过两只宠物的备份：所有数据都会恢复，最多两只宠物可继续编辑，其余保持可查看、可导出但只读；订阅后恢复编辑。"]],
        ["删除与恢复记录", ["普通删除进入“最近删除”，可在保留期内恢复；修改、删除和恢复均保留审计信息。永久删除整个家庭资料是独立的高风险操作，确认后从当前资料库移除。"]],
        ["iCloud 与共享", ["只有订阅且明确启用 Petter Days Cloud 后才同步。可在共享管理中查看成员与权限、退出共享或由主人移除成员。关闭订阅会暂停新的同步与共享操作，不会自动删除云端资料或 CKShare 关系。"]],
        ["需要帮助", [`打开 <a href="${issueURL}">支持渠道</a> 描述问题和 App 版本。不要公开提交备份、病历、精确位置或其他私人资料；我们会说明安全的后续处理方式。`]],
      ],
    },
    terms: {
      eyebrow: "使用条款",
      title: "清楚的边界，安心的记录。",
      intro: "使用 Petter Days 即表示你同意以下条款。若不同意，请停止使用 App。",
      sections: [
        ["1. 服务范围", ["Petter Days 提供宠物健康与照护记录、提醒、趋势、附件、备份、辅助测量、库存及可选 iCloud 协作能力。服务可能随版本调整，并以 App 内实际功能为准。"]],
        ["2. 非医疗服务", ["Petter Days 不是医疗器械，不进行诊断、预防或治疗，也不替代兽医意见。用户应自行判断何时寻求专业帮助；紧急或持续异常情况应立即联系兽医。"]],
        ["3. 用户责任", ["用户应确保录入内容、附件、共享对象和权限合法、准确且适当，并妥善保管设备、Apple Account、备份和备份密码。未经许可不得上传或分享他人的私人资料。"]],
        ["4. 订阅", ["Petter Days Cloud 是通过 Apple App Store 提供的自动续期订阅。价格、周期、试用、续期、取消、退款和税费以购买页面及 Apple 条款为准。每位 CloudKit 共享参与者需拥有自己的有效订阅。"]],
        ["5. 数据与可用性", ["核心功能按本地优先设计，但设备故障、存储空间、系统服务、网络、iCloud 状态、误操作或不可抗力仍可能影响数据。用户应定期创建并验证完整备份。我们不会以“绝不会丢失”或“永久保管”作保证。"]],
        ["6. 可接受使用", ["不得利用 Petter Days 侵犯他人权益、传播恶意内容、绕过订阅或权限限制、干扰服务、逆向攻击共享机制，或从事违法活动。"]],
        ["7. 变更与终止", ["我们可能为安全、合规、系统兼容或产品改进更新 App 与条款。若用户不再使用，可导出资料、取消订阅并删除本机数据。订阅取消按 Apple 的订阅管理规则生效。"]],
        ["8. 联系", [`条款或支持问题请使用 <a href="${issueURL}">支持渠道</a>。请勿在公开问题中提交私人健康资料或备份文件。`]],
      ],
    },
    support: {
      eyebrow: "支持",
      title: "先保住资料，再解决问题。",
      intro: "遇到同步、备份或资料库问题时，不要反复卸载 App。先创建备份并记录提示信息，再按下面的入口处理。",
      cards: [["提交问题", "通过 GitHub Issues 描述问题与 App 版本", issueURL], ["管理资料", "查看备份、恢复、导出、删除与共享说明", "/privacy/choices/"], ["隐私政策", "了解本地处理、iCloud 与权限", "/privacy/"], ["使用条款", "了解服务、订阅与责任边界", "/terms/"]],
      sections: [
        ["常见处理顺序", ["1. 不要删除 App，也不要清理资料库文件。", "2. 若 App 仍可打开，进入“档案 → 数据与安全”创建完整备份。", "3. 记录 App 版本、iOS 版本、出现问题的时间和完整提示。", "4. 通过支持渠道提交不含私人数据的说明。"]],
        ["订阅与购买", ["购买和恢复由 Apple App Store 处理。请先确认设备登录了购买时使用的 Apple Account，再在 App 中选择“恢复购买”。价格和当前权益以 App Store 与 App 内显示为准。"]],
        ["iCloud 同步与共享", ["确认已订阅、在 App 中明确启用 Petter Days Cloud、系统已登录 iCloud、iCloud Drive 可用且空间充足。不要通过卸载重装来强制同步。家庭共享指 CKShare 共同照护，不表示订阅权益由 App Store 家庭共享。"]],
        ["公开渠道隐私提醒", ["GitHub Issues 是公开页面。请勿上传宠物病历、备份、照片、联系方式、Apple Account 信息、支付信息或精确位置。先提交一般问题，我们会说明是否需要其他安全处理方式。"]],
      ],
    },
  },
  "zh-Hant": {
    prefix: "/zh-Hant",
    language: "繁體中文",
    nav: { home: "首頁", privacy: "私隱", terms: "條款", support: "支援", language: "語言" },
    common: { product: "Petter Days", owner: "發佈者：ZhenHui Wang", effective: `生效日期：${effectiveDate}`, updated: `更新日期：${effectiveDate}`, medical: "Petter Days 是寵物照護記錄與輔助觀察工具，不提供醫療診斷，也不能取代專業獸醫意見。", source: "本網站不使用 Cookie、分析、廣告或追蹤腳本。", soon: "App Store 上架準備中", learn: "了解私隱設計" },
    home: { eyebrow: "為長期照護而設計", title: "每一天，都是更完整的寵物檔案。", intro: "把尿便、體重、用藥、就診、靜息呼吸、散步和照護安排放在一起。離線也能記錄，需要時再用自己的 iCloud 與家人協作。", trust: [["本機優先", "免費版核心記錄無需連線"], ["由你掌握", "完整備份、還原與匯出永久免費"], ["私人 iCloud", "訂閱後由用戶主動啟用同步與共享"]], featuresTitle: "從日常記錄，到一次更有準備的就診", featuresIntro: "每條記錄保留時間、來源、附件和修改歷史。", features: [["日常健康記錄", "快速記錄尿尿、便便、體重、症狀、用藥、靜息呼吸和自訂事項。"], ["變化與趨勢", "用同期比較看見尿便、體重和可靠呼吸記錄的變化。"], ["照護與倉庫", "安排任務，管理用品、庫存、到期批次、採購和歷史價格。"], ["獸醫資料包", "把趨勢圖、明細表和所選附件整理為可分享的 PDF。"]], plansTitle: "核心能力免費，雲端協作按需開啟", plansIntro: "未訂閱、訂閱到期或 iCloud 異常都不會成為刪除資料的理由。", free: { title: "免費版", price: "一直可用", items: ["本機健康記錄與附件", "最多管理兩隻寵物", "照護、倉庫和趨勢", "完整備份、還原與匯出"] }, cloud: { title: "Petter Days Cloud", price: "可選訂閱，價格以 App Store 為準", items: ["Apple 裝置間自動同步", "換機或重裝後從 iCloud 還原", "邀請已訂閱家人唯讀或共同編輯", "不限制寵物數量"] }, cloudNote: "雲端資料使用用戶自己的 iCloud 空間；Petter Days 不提供無限雲端空間，也不把私人寵物健康資料儲存在開發者資料庫。" },
    privacy: { eyebrow: "私隱政策", title: "你的記錄，首先屬於你。", intro: "本政策說明裝置處理、私人 iCloud、備份、共享與刪除。", sections: [["1. 範圍與帳戶", ["Petter Days 處理用戶自行輸入的寵物資料、健康與照護記錄、用品庫存、附件、備份和裝置端靜息呼吸結果。App 不要求註冊開發者帳戶。"]], ["2. 儲存位置", ["免費使用時，資料只在 iPhone 本機資料庫，CloudKit 同步不會啟用。", "訂閱並明確啟用 Petter Days Cloud 後，資料透過 Apple CloudKit 存入用戶自己的私人或共享 iCloud 資料庫並佔用其空間。開發者不建立寵物健康資料後端。", "用戶可透過 CKShare 以唯讀或可編輯權限分享單隻寵物；每位參與者需各自訂閱。"]], ["3. 權限", ["相機、麥克風和運動感測器只在用戶選擇對應靜息呼吸方式時使用並在裝置上分析；原始媒體和樣本預設不保存。", "位置只在用戶主動開始散步後於活動期間使用；結束或放棄後停止。精確路線不傳給開發者分析服務。", "照片、文件和通知只在用戶主動選擇相應功能時透過系統介面取得授權。"]], ["4. 訂閱、備份與刪除", ["Apple App Store 與 StoreKit 處理購買、續訂、退款和恢復；Petter Days 不取得支付卡資料。", "可建立加密或不加密完整備份。未加密檔案可被取得者讀取；加密密碼由用戶保管。", "訂閱到期只會暫停新的雲端操作，不會刪除本機資料、雲端區域或仍有效的分享關係。用戶仍可檢視、備份、還原及匯出。"]], ["5. 健康邊界", ["靜息呼吸方式分別計算，品質不足時不應提供正式頻率。這些功能不是醫療診斷；有疑問時請聯絡獸醫。"]], ["6. 收集、追蹤與聯絡", ["目前不包含自建帳戶、AI、第三方分析、廣告或跨 App 追蹤。開發者不透過 Petter Days 伺服器取得私人健康資料。Apple 系統服務受 Apple 自身政策約束。", `私隱或支援問題請使用 <a href="${issueURL}">支援渠道</a>。公開頁面請勿提交病歷、備份、精確位置或其他私人資料。`]]]},
    choices: { eyebrow: "私隱選擇與資料管理", title: "檢視、帶走、還原或刪除資料。", intro: "這些核心能力不受訂閱限制。不可逆操作前請先建立並驗證完整備份。", sections: [["匯出與資料包", ["在 App 的資料與安全頁匯出結構化記錄，或按寵物產生含趨勢圖、明細表和所選附件的獸醫資料包。"]], ["完整備份與還原", ["可建立加密或不加密 .pethealthbackup。免費用戶也可完整還原超過兩隻寵物的備份；超出兩隻的寵物保持可檢視和匯出但唯讀。"]], ["刪除與共享", ["一般刪除可在最近刪除中還原；永久刪除整個家庭資料是獨立高風險操作。CKShare 成員可按權限退出或被移除，取消訂閱不等於自動刪除分享關係。"]], ["需要協助", [`使用 <a href="${issueURL}">支援渠道</a>，但不要公開私人資料或備份。`]]]},
    terms: { eyebrow: "使用條款", title: "清楚的邊界，安心的記錄。", intro: "使用 Petter Days 即表示同意以下條款。", sections: [["服務與醫療邊界", ["Petter Days 提供寵物記錄、提醒、趨勢、附件、備份、輔助測量、庫存及可選 iCloud 協作。它不是醫療器械，不診斷、預防或治療疾病，也不取代獸醫。"]], ["用戶責任", ["用戶應確保內容與共享合法適當，並妥善保管裝置、Apple Account、備份及密碼。"]], ["訂閱", ["Petter Days Cloud 經 Apple App Store 自動續訂；價格、取消、退款及稅項以 Apple 購買頁面和條款為準。每位共享參與者需各自訂閱。"]], ["資料與可用性", ["裝置、儲存空間、網絡、iCloud、誤操作等可能影響資料。請定期建立並驗證備份；我們不作永不遺失或永久保管承諾。"]], ["聯絡", [`條款或支援問題請使用 <a href="${issueURL}">支援渠道</a>，不要公開私人健康資料。`]]]},
    support: { eyebrow: "支援", title: "先保住資料，再解決問題。", intro: "遇到同步、備份或資料庫問題時不要反覆卸載。先建立備份並記錄完整提示。", cards: [["提交問題", "透過 GitHub Issues 描述問題與 App 版本", issueURL], ["管理資料", "備份、還原、匯出、刪除與共享", "/zh-Hant/privacy/choices/"], ["私隱政策", "本機處理、iCloud 與權限", "/zh-Hant/privacy/"], ["使用條款", "服務、訂閱與責任邊界", "/zh-Hant/terms/"]], sections: [["處理順序", ["不要刪除 App。若仍可開啟，先在資料與安全建立完整備份，記錄 App/iOS 版本、時間和提示，再提交不含私人資料的說明。"]], ["訂閱與 iCloud", ["確認登入購買時的 Apple Account，使用恢復購買；確認已訂閱、明確啟用 Cloud、iCloud Drive 可用且空間充足。不要用卸載重裝強制同步。"]], ["私隱提醒", ["GitHub Issues 是公開頁面，請勿提交病歷、備份、照片、聯絡方式、支付資料或精確位置。"]]]},
  },
  en: {
    prefix: "/en",
    language: "English",
    nav: { home: "Home", privacy: "Privacy", terms: "Terms", support: "Support", language: "Language" },
    common: { product: "Petter Days", owner: "Publisher: ZhenHui Wang", effective: `Effective: ${effectiveDate}`, updated: `Updated: ${effectiveDate}`, medical: "Petter Days is a pet-care record and observation tool. It does not provide a medical diagnosis or replace professional veterinary advice.", source: "This website uses no cookies, analytics, advertising, or tracking scripts.", soon: "Preparing for the App Store", learn: "How privacy works" },
    home: { eyebrow: "Built for long-term care", title: "Every day adds to a clearer pet record.", intro: "Keep toilet habits, weight, medication, visits, resting respiration, walks, and care plans together. Record offline, then optionally collaborate through your own iCloud.", trust: [["Local first", "Core free records work without a network"], ["Yours to carry", "Complete backup, restore, and export stay free"], ["Private iCloud", "Sync and sharing start only after you enable them"]], featuresTitle: "From daily observations to a better-prepared vet visit", featuresIntro: "Each record keeps its time, source, attachments, and revision history.", features: [["Daily health records", "Log urine, stool, weight, symptoms, medication, resting respiration, and custom events."], ["Changes and trends", "Compare matching periods and return from every chart to the underlying records."], ["Care and supplies", "Plan tasks and manage products, stock, expiry dates, purchases, and historical prices."], ["Veterinary brief", "Create a shareable PDF with trend charts, detail tables, and selected attachments."]], plansTitle: "Core care stays free. Cloud collaboration is optional.", plansIntro: "No expired subscription or iCloud problem is a reason to delete your data.", free: { title: "Free", price: "Always available", items: ["On-device records and attachments", "Manage up to two pets", "Care, supplies, and trends", "Complete backup, restore, and export"] }, cloud: { title: "Petter Days Cloud", price: "Optional subscription; App Store price applies", items: ["Automatic sync across Apple devices", "Restore from iCloud after reinstalling", "Invite subscribed family as viewers or editors", "No pet-count limit"] }, cloudNote: "Cloud data uses your own iCloud storage. Petter Days does not offer unlimited cloud storage or keep private pet-health records in a developer database." },
    privacy: { eyebrow: "Privacy Policy", title: "Your records belong to you first.", intro: "This policy explains on-device processing, optional use of your iCloud, and how you can back up, share, export, and delete data.", sections: [["1. Scope and accounts", ["Petter Days handles pet profiles, health and care records, medication plans, supplies, attachments, backups, and on-device resting-respiration results that you choose to create. No Petter Days account, email, phone number, or password is required."]], ["2. Where data is stored", ["On the Free plan, data stays in the local database on your iPhone and the CloudKit synchronization path is not enabled.", "After you subscribe and explicitly enable Petter Days Cloud, structured records, photos, and attachments are stored through Apple CloudKit in your own private or shared iCloud database and use your iCloud storage. The developer does not operate a pet-health data backend or collect this data from your private CloudKit database.", "You can share one pet through CKShare with read-only or editing permission. Every participant needs a separate active Petter Days Cloud subscription."]], ["3. Device permissions", ["Camera: used only when you choose camera-based resting-respiration measurement. Frames are analyzed on iPhone. Raw video is not saved unless you explicitly choose to keep it as an attachment.", "Microphone: used only when you choose airflow measurement near the pet’s nose or mouth. Raw PCM is processed in memory for that measurement and is not saved by default.", "Motion & Fitness: used only by selected respiration methods to detect device movement or subtle chest/abdominal motion. Raw samples are not saved by default.", "Location: used only during a walk you start, to calculate route, distance, and duration. Collection stops when you finish or abandon the activity. Precise routes stay on device and, if enabled, in private iCloud; they are not sent to developer analytics.", "Photos, files, and notifications are accessed only after you choose the relevant system picker or enable a reminder."]], ["4. Subscriptions and purchases", ["Apple App Store and StoreKit handle purchase, renewal, restoration, refund, and entitlement verification. Petter Days does not receive payment-card details. Product names and prices are those shown by the App Store.", "When a subscription expires, new CloudKit and sharing operations pause. Downloaded local data, cloud zones, and valid CKShare participation are not intentionally deleted. Viewing, backup, restore, and export remain available."]], ["5. Backup, export, sharing, and deletion", ["You may create an encrypted or unencrypted complete backup. Anyone with an unencrypted file may be able to read it. You are responsible for an encrypted backup password; the developer cannot recover it.", "You choose where exports, attachments, and backups are saved and whom they are shared with. Leaving a share or being removed lets CloudKit process the participant copy according to Apple’s rules; it does not delete the owner’s source records.", "Records may be soft-deleted and restored, and an entire household may be permanently deleted in the App. The App does not secretly retain permanently deleted local data and cannot remove copies that you previously exported. See Privacy Choices & Data Management for steps."]], ["6. Resting respiration and health information", ["Camera, microphone-airflow, and motion methods are calculated and stored separately. Insufficient quality should produce no formal rate. Machine results, human review, and a veterinarian’s conclusion remain distinct.", "These features support observation and are not a medical diagnosis. Contact a veterinarian whenever you are concerned about a pet’s health."]], ["7. Developer collection, tracking, and third parties", ["The current version has no developer account system, AI service, third-party analytics, advertising SDK, or cross-app/site tracking. The developer does not receive private pet-health records through a Petter Days server. Apple may process StoreKit, CloudKit, and system-service data under its own policies.", "This website has no cookies, analytics, ads, web form, or third-party fonts. Before any future diagnostic logging, support form, AI gateway, developer server, or third-party SDK launches, this policy and the App Store privacy disclosure will be updated."]], ["8. Children, changes, and contact", ["Petter Days is designed for pet-care records and does not actively collect age or identity documents. We may update this policy for product, legal, or platform changes and will update the dates on this page.", `For privacy or support questions, use the <a href="${issueURL}">support channel</a>. Do not post medical records, contact details, backup files, precise location, or other private data in a public issue.`]]]},
    choices: { eyebrow: "Privacy Choices & Data Management", title: "View, carry, restore, or delete your data.", intro: "These core data tools are not subscription-gated. Before an irreversible action, create and test a complete backup.", sections: [["Export and veterinary brief", ["Use Profile → Data & Security to export structured records, or create a per-pet veterinary brief with trend charts, detail tables, and selected attachments. Readable exports exclude precise walk coordinates by default."]], ["Complete backup", ["Create an encrypted or unencrypted .pethealthbackup. An encrypted backup requires a password that only you keep. An unencrypted backup is easier to inspect but can be read by anyone who obtains it."]], ["Restore", ["Restore validates the package and its relationships. Free users can restore backups with more than two pets without losing data: up to two remain editable and the rest remain visible and exportable in read-only mode until subscribed."]], ["Delete and recover", ["Ordinary deletion goes to Recently Deleted and can be restored during its retention period. Permanently deleting a household is a separate high-risk action that removes it from the current library after confirmation."]], ["iCloud and sharing", ["Sync begins only after subscription and explicit enablement. Sharing management shows members and permissions. Expiring a subscription pauses new cloud operations; it does not claim to remove cloud data or CKShare participation automatically."]], ["Get help", [`Use the <a href="${issueURL}">support channel</a> with the App version and a non-private description. Do not post backups, medical records, or precise locations.`]]]},
    terms: { eyebrow: "Terms of Use", title: "Clear boundaries for dependable records.", intro: "By using Petter Days, you agree to these terms. If you do not agree, stop using the App.", sections: [["1. Service", ["Petter Days provides pet-care records, reminders, trends, attachments, backups, observation tools, inventory, and optional iCloud collaboration. Features may change with future versions."]], ["2. Not medical care", ["Petter Days is not a medical device and does not diagnose, prevent, monitor, or treat disease. It does not replace a veterinarian. Seek professional help for urgent, persistent, or concerning symptoms."]], ["3. Your responsibilities", ["You are responsible for the legality and accuracy of content, attachments, recipients, and permissions, and for protecting your device, Apple Account, backups, and backup passwords. Do not upload or share another person’s private data without authority."]], ["4. Subscription", ["Petter Days Cloud is an auto-renewable subscription sold through Apple App Store. Price, term, trial, renewal, cancellation, refund, and taxes follow the purchase screen and Apple’s terms. Each shared participant needs a separate subscription."]], ["5. Data and availability", ["A device failure, storage limits, network or iCloud state, user action, or events outside reasonable control may affect data. Keep and test complete backups. We do not promise that data can never be lost or will be stored forever."]], ["6. Acceptable use and changes", ["Do not use Petter Days to violate rights or law, distribute malware, bypass subscription or permission controls, or interfere with service. We may update the App and these terms for security, compliance, compatibility, or product improvements."]], ["7. Contact", [`Use the <a href="${issueURL}">support channel</a> for terms or support questions. Never post private health data or backups publicly.`]]]},
    support: { eyebrow: "Support", title: "Protect the data first. Then solve the problem.", intro: "For a sync, backup, or library problem, do not repeatedly uninstall the App. Create a backup when possible and record the full message first.", cards: [["Report a problem", "Describe the issue and App version through GitHub Issues", issueURL], ["Manage data", "Backup, restore, export, delete, and sharing", "/en/privacy/choices/"], ["Privacy Policy", "On-device processing, iCloud, and permissions", "/en/privacy/"], ["Terms of Use", "Service, subscriptions, and responsibilities", "/en/terms/"]], sections: [["Recommended order", ["Do not delete the App. If it still opens, create a complete backup in Profile → Data & Security. Note the App version, iOS version, time, and full message, then send a description with no private data."]], ["Purchase and iCloud", ["Sign in with the Apple Account used for purchase and choose Restore Purchases. For Cloud, confirm an active subscription, explicit Cloud enablement, available iCloud Drive, and enough storage. Do not uninstall to force synchronization."]], ["Public-channel warning", ["GitHub Issues is public. Never upload medical records, backups, photos, contact information, Apple Account details, payment data, or precise locations."]]]},
  },
  ja: {
    prefix: "/ja",
    language: "日本語",
    nav: { home: "ホーム", privacy: "プライバシー", terms: "利用規約", support: "サポート", language: "言語" },
    common: { product: "Petter Days", owner: "提供者：ZhenHui Wang", effective: `発効日：${effectiveDate}`, updated: `更新日：${effectiveDate}`, medical: "Petter Days はペットケアの記録と観察を補助するツールです。医療診断を行わず、獣医師の助言に代わるものではありません。", source: "このサイトは Cookie、解析、広告、追跡スクリプトを使用しません。", soon: "App Store 公開準備中", learn: "プライバシーについて" },
    home: { eyebrow: "長期的なケアのために", title: "毎日の記録を、確かなペットカルテへ。", intro: "排尿・排便、体重、投薬、受診、安静時呼吸、散歩、ケア予定をひとつに。オフラインで記録し、必要なときだけ自分の iCloud で家族と共有できます。", trust: [["ローカル優先", "無料の基本記録はオフラインで利用可能"], ["データはあなたのもの", "完全バックアップ・復元・書き出しは無料"], ["プライベート iCloud", "購読後も明示的に有効化した場合のみ同期"]], featuresTitle: "日常の観察から、受診の準備まで", featuresIntro: "各記録に時刻、情報源、添付、変更履歴を残します。", features: [["健康記録", "排尿・排便、体重、症状、投薬、安静時呼吸、独自項目を記録。"], ["変化と傾向", "同じ期間を比較し、グラフから元の記録を確認。"], ["ケアと在庫", "予定、用品、在庫、期限、購入、価格履歴を管理。"], ["獣医向け資料", "傾向グラフ、明細表、選択した添付を PDF に整理。"]], plansTitle: "基本機能は無料。クラウド連携は必要なときだけ。", plansIntro: "購読切れや iCloud の問題を理由にデータを削除しません。", free: { title: "無料", price: "いつでも利用可能", items: ["端末内の記録と添付", "2匹まで管理", "ケア、在庫、傾向", "完全バックアップ・復元・書き出し"] }, cloud: { title: "Petter Days Cloud", price: "任意の購読。価格は App Store に表示", items: ["Apple デバイス間で自動同期", "再インストール時に iCloud から復元", "購読済み家族を閲覧・編集で招待", "ペット数の制限なし"] }, cloudNote: "クラウドデータは利用者自身の iCloud 容量を使用します。開発者のデータベースに個人のペット健康情報を保存しません。" },
    privacy: { eyebrow: "プライバシーポリシー", title: "記録の持ち主は、まずあなたです。", intro: "端末内処理、任意の iCloud、バックアップ、共有、削除について説明します。", sections: [["1. 対象とアカウント", ["Petter Days は、利用者が作成するペット情報、健康・ケア記録、用品、添付、バックアップ、端末上の安静時呼吸結果を扱います。Petter Days 独自アカウントは不要です。"]], ["2. 保存場所", ["無料版ではデータは iPhone 内に保存され、CloudKit 同期は有効になりません。", "購読後に Petter Days Cloud を明示的に有効化すると、Apple CloudKit を通じて利用者自身の非公開・共有 iCloud データベースに保存され、その容量を使用します。開発者はペット健康データ用サーバーを運営しません。", "CKShare ではペット単位で閲覧または編集権限を設定できます。参加者全員に個別の有効な購読が必要です。"]], ["3. 権限", ["カメラ、マイク、モーションは選択した安静時呼吸測定中だけ使用し、端末上で解析します。元の動画、PCM、モーションサンプルは既定では保存しません。", "位置情報は利用者が開始した散歩中だけ経路・距離・時間の計算に使い、終了・中止後は停止します。正確な経路を開発者の解析サービスへ送りません。", "写真、ファイル、通知は対応する機能を利用者が選んだ場合のみシステム経由で許可を求めます。"]], ["4. 購読とデータ管理", ["購入、更新、復元、返金、資格確認は Apple App Store と StoreKit が処理し、Petter Days はカード情報を受け取りません。", "暗号化または非暗号化の完全バックアップを作成できます。非暗号化ファイルは取得者に読まれる可能性があります。暗号化パスワードは利用者が管理します。", "購読終了時は新しいクラウド操作を停止しますが、端末データ、クラウド zone、有効な CKShare 関係を意図的に削除しません。閲覧、復元、バックアップ、書き出しは継続できます。"]], ["5. 健康上の境界", ["各呼吸測定方式は別々に計算し、品質が不十分な場合は正式な数値を出さない設計です。医療診断ではありません。心配なときは獣医師に相談してください。"]], ["6. 収集・追跡・連絡", ["現行版には独自アカウント、AI、第三者解析、広告、横断追跡がありません。開発者サーバー経由で個人の健康記録を取得しません。Apple のシステムサービスには Apple のポリシーが適用されます。", `お問い合わせは <a href="${issueURL}">サポート窓口</a> へ。公開 Issue に診療記録、バックアップ、位置情報などを投稿しないでください。`]]]},
    choices: { eyebrow: "プライバシー設定とデータ管理", title: "表示、持ち出し、復元、削除。", intro: "これらの基本機能は購読に依存しません。不可逆操作の前に完全バックアップを作成し、確認してください。", sections: [["書き出し", ["データとセキュリティから構造化記録を書き出すか、傾向グラフ、明細表、選択した添付を含む獣医向け資料を作成します。"]], ["バックアップと復元", ["暗号化または非暗号化の .pethealthbackup を作成できます。無料版でも3匹以上を失わず復元でき、2匹を超える分は購読まで閲覧・書き出し可能な読み取り専用になります。"]], ["削除と共有", ["通常の削除は「最近削除した項目」から復元可能です。世帯全体の完全削除は別の高リスク操作です。購読終了は CKShare 関係の自動削除を意味しません。"]], ["サポート", [`<a href="${issueURL}">サポート窓口</a> を利用し、公開ページに個人データやバックアップを投稿しないでください。`]]]},
    terms: { eyebrow: "利用規約", title: "明確な境界で、安心して記録。", intro: "Petter Days の利用により、本規約に同意したものとみなされます。", sections: [["サービスと医療上の境界", ["Petter Days は記録、通知、傾向、添付、バックアップ、観察補助、在庫、任意の iCloud 連携を提供します。医療機器ではなく、診断・予防・治療を行いません。"]], ["利用者の責任", ["内容と共有の適法性、端末、Apple Account、バックアップ、パスワードの管理は利用者の責任です。"]], ["購読", ["Petter Days Cloud は Apple App Store の自動更新購読です。価格、期間、解約、返金、税は Apple の購入画面と規約に従います。各共有参加者に個別購読が必要です。"]], ["データと可用性", ["端末故障、容量、ネットワーク、iCloud、誤操作などでデータが影響を受ける場合があります。完全バックアップを定期的に作成・検証してください。永久保存や絶対に失われないことを保証しません。"]], ["連絡", [`<a href="${issueURL}">サポート窓口</a> を利用し、個人の健康情報を公開しないでください。`]]]},
    support: { eyebrow: "サポート", title: "まずデータを守り、その後で解決します。", intro: "同期、バックアップ、ライブラリの問題で App を何度も削除しないでください。可能なら先にバックアップを作成します。", cards: [["問題を報告", "GitHub Issues で問題と App バージョンを報告", issueURL], ["データ管理", "バックアップ、復元、書き出し、削除、共有", "/ja/privacy/choices/"], ["プライバシー", "端末処理、iCloud、権限", "/ja/privacy/"], ["利用規約", "サービス、購読、責任", "/ja/terms/"]], sections: [["推奨手順", ["App を削除せず、開ける場合は完全バックアップを作成します。App/iOS バージョン、時刻、完全なメッセージを記録し、個人情報を除いて報告してください。"]], ["購読と iCloud", ["購入時の Apple Account を確認して購入を復元します。Cloud では有効な購読、明示的な有効化、iCloud Drive、空き容量を確認し、再インストールで同期を強制しないでください。"]], ["公開窓口の注意", ["GitHub Issues は公開です。診療記録、バックアップ、写真、連絡先、支払情報、正確な位置を投稿しないでください。"]]]},
  },
  ko: {
    prefix: "/ko",
    language: "한국어",
    nav: { home: "홈", privacy: "개인정보", terms: "이용 약관", support: "지원", language: "언어" },
    common: { product: "Petter Days", owner: "게시자: ZhenHui Wang", effective: `시행일: ${effectiveDate}`, updated: `업데이트: ${effectiveDate}`, medical: "Petter Days는 반려동물 돌봄 기록과 관찰을 돕는 도구입니다. 의료 진단을 제공하거나 수의사의 조언을 대신하지 않습니다.", source: "이 웹사이트는 쿠키, 분석, 광고 또는 추적 스크립트를 사용하지 않습니다.", soon: "App Store 출시 준비 중", learn: "개인정보 보호 방식" },
    home: { eyebrow: "오랜 돌봄을 위해 설계", title: "매일의 기록이 더 분명한 반려동물 건강 기록이 됩니다.", intro: "배뇨·배변, 체중, 투약, 진료, 안정 시 호흡, 산책과 돌봄 일정을 한곳에 기록하세요. 오프라인으로 사용하고 필요할 때만 자신의 iCloud로 가족과 협업할 수 있습니다.", trust: [["로컬 우선", "무료 핵심 기록은 네트워크 없이 사용"], ["내가 관리하는 데이터", "전체 백업·복원·내보내기는 계속 무료"], ["비공개 iCloud", "구독 후에도 사용자가 명시적으로 켜야 동기화"]], featuresTitle: "일상 관찰부터 진료 준비까지", featuresIntro: "각 기록에는 시간, 출처, 첨부파일과 수정 이력이 남습니다.", features: [["건강 기록", "배뇨, 배변, 체중, 증상, 투약, 안정 시 호흡과 사용자 지정 항목을 기록합니다."], ["변화와 추세", "같은 기간을 비교하고 모든 차트에서 원본 기록으로 돌아갑니다."], ["돌봄과 창고", "일정, 용품, 재고, 유효기간, 구매와 과거 가격을 관리합니다."], ["수의사용 자료", "추세 차트, 상세 표와 선택한 첨부파일을 PDF로 만듭니다."]], plansTitle: "핵심 기능은 무료, 클라우드 협업은 선택", plansIntro: "구독 만료나 iCloud 오류를 이유로 데이터를 삭제하지 않습니다.", free: { title: "무료", price: "계속 사용 가능", items: ["기기 내 기록과 첨부파일", "반려동물 두 마리까지 관리", "돌봄, 재고, 추세", "전체 백업·복원·내보내기"] }, cloud: { title: "Petter Days Cloud", price: "선택 구독, 가격은 App Store 기준", items: ["Apple 기기 간 자동 동기화", "재설치 후 iCloud에서 복원", "구독한 가족을 읽기/편집으로 초대", "반려동물 수 제한 없음"] }, cloudNote: "클라우드 데이터는 사용자의 iCloud 저장 공간을 사용합니다. 개발자 데이터베이스에 비공개 반려동물 건강 데이터를 보관하지 않습니다." },
    privacy: { eyebrow: "개인정보 처리방침", title: "기록은 먼저 사용자의 것입니다.", intro: "기기 내 처리, 선택적 iCloud, 백업, 공유와 삭제 방식을 설명합니다.", sections: [["1. 범위와 계정", ["Petter Days는 사용자가 만드는 반려동물 정보, 건강·돌봄 기록, 용품, 첨부파일, 백업과 기기 내 안정 시 호흡 결과를 처리합니다. 별도의 Petter Days 계정은 필요하지 않습니다."]], ["2. 저장 위치", ["무료 버전에서는 데이터가 iPhone 로컬 데이터베이스에 남고 CloudKit 동기화가 활성화되지 않습니다.", "구독 후 Petter Days Cloud를 명시적으로 켜면 Apple CloudKit을 통해 사용자의 비공개 또는 공유 iCloud 데이터베이스에 저장되며 사용자의 용량을 사용합니다. 개발자는 반려동물 건강 데이터 서버를 운영하지 않습니다.", "CKShare로 한 반려동물을 읽기 전용 또는 편집 권한으로 공유할 수 있으며 모든 참여자에게 별도의 유효한 구독이 필요합니다."]], ["3. 권한", ["카메라, 마이크, 동작 센서는 사용자가 해당 안정 시 호흡 방식을 선택한 동안에만 사용하며 기기에서 분석합니다. 원본 영상, PCM, 동작 샘플은 기본적으로 저장하지 않습니다.", "위치는 사용자가 시작한 산책 중 경로·거리·시간 계산에만 사용하고 종료 또는 취소 후 중지합니다. 정확한 경로를 개발자 분석 서비스로 보내지 않습니다.", "사진, 파일, 알림은 사용자가 해당 기능을 선택한 경우에만 시스템을 통해 권한을 요청합니다."]], ["4. 구독과 데이터 관리", ["Apple App Store와 StoreKit이 구매, 갱신, 복원, 환불과 권한 확인을 처리하며 Petter Days는 카드 정보를 받지 않습니다.", "암호화 또는 비암호화 전체 백업을 만들 수 있습니다. 비암호화 파일은 획득한 사람이 읽을 수 있으며 암호화 비밀번호는 사용자가 보관합니다.", "구독 만료 시 새 클라우드 작업을 일시 중지하지만 기기 데이터, 클라우드 zone 또는 유효한 CKShare 관계를 의도적으로 삭제하지 않습니다. 보기, 백업, 복원, 내보내기는 계속 가능합니다."]], ["5. 건강 정보의 한계", ["각 호흡 측정 방식은 별도로 계산하며 품질이 부족하면 공식 수치를 제공하지 않아야 합니다. 의료 진단이 아니며 우려가 있으면 수의사에게 문의하세요."]], ["6. 수집·추적·문의", ["현재 버전에는 자체 계정, AI, 제3자 분석, 광고 또는 교차 추적이 없습니다. 개발자 서버를 통해 비공개 건강 기록을 수집하지 않습니다. Apple 시스템 서비스에는 Apple의 정책이 적용됩니다.", `문의는 <a href="${issueURL}">지원 채널</a>을 이용하세요. 공개 이슈에 진료 기록, 백업, 정확한 위치 또는 기타 개인정보를 게시하지 마세요.`]]]},
    choices: { eyebrow: "개인정보 선택 및 데이터 관리", title: "보고, 가져가고, 복원하거나 삭제하세요.", intro: "이 핵심 기능은 구독과 무관합니다. 되돌릴 수 없는 작업 전에 전체 백업을 만들고 검증하세요.", sections: [["내보내기", ["데이터 및 보안에서 구조화 기록을 내보내거나 추세 차트, 상세 표와 선택한 첨부파일이 있는 수의사용 자료를 만듭니다."]], ["백업과 복원", ["암호화 또는 비암호화 .pethealthbackup을 만들 수 있습니다. 무료 사용자도 세 마리 이상이 포함된 백업을 모두 복원할 수 있으며 두 마리를 넘는 데이터는 구독 전까지 보기와 내보내기가 가능한 읽기 전용입니다."]], ["삭제와 공유", ["일반 삭제는 최근 삭제에서 복원할 수 있습니다. 가정 전체 영구 삭제는 별도의 고위험 작업입니다. 구독 종료가 CKShare 관계를 자동 삭제한다는 뜻은 아닙니다."]], ["도움말", [`<a href="${issueURL}">지원 채널</a>을 사용하되 공개 페이지에 개인정보나 백업을 올리지 마세요.`]]]},
    terms: { eyebrow: "이용 약관", title: "명확한 경계로 안심할 수 있는 기록.", intro: "Petter Days를 사용하면 이 약관에 동의하는 것입니다.", sections: [["서비스와 의료 한계", ["Petter Days는 기록, 알림, 추세, 첨부파일, 백업, 관찰 도구, 재고와 선택적 iCloud 협업을 제공합니다. 의료기기가 아니며 질병을 진단·예방·치료하지 않습니다."]], ["사용자 책임", ["콘텐츠와 공유의 적법성, 기기, Apple Account, 백업 및 비밀번호 보호는 사용자의 책임입니다."]], ["구독", ["Petter Days Cloud는 Apple App Store 자동 갱신 구독입니다. 가격, 기간, 취소, 환불과 세금은 Apple 구매 화면과 약관을 따릅니다. 각 공유 참여자에게 별도 구독이 필요합니다."]], ["데이터와 가용성", ["기기 고장, 저장 용량, 네트워크, iCloud, 오작동이 데이터에 영향을 줄 수 있습니다. 전체 백업을 정기적으로 만들고 검증하세요. 영구 보관이나 절대 손실되지 않음을 보장하지 않습니다."]], ["문의", [`<a href="${issueURL}">지원 채널</a>을 이용하고 비공개 건강 정보를 공개하지 마세요.`]]]},
    support: { eyebrow: "지원", title: "먼저 데이터를 보호한 뒤 문제를 해결하세요.", intro: "동기화, 백업 또는 자료 문제로 App을 반복 삭제하지 마세요. 가능하면 먼저 백업을 만들고 전체 메시지를 기록하세요.", cards: [["문제 신고", "GitHub Issues에서 문제와 App 버전 설명", issueURL], ["데이터 관리", "백업, 복원, 내보내기, 삭제와 공유", "/ko/privacy/choices/"], ["개인정보", "기기 내 처리, iCloud와 권한", "/ko/privacy/"], ["이용 약관", "서비스, 구독과 책임", "/ko/terms/"]], sections: [["권장 순서", ["App을 삭제하지 마세요. 열 수 있다면 데이터 및 보안에서 전체 백업을 만들고 App/iOS 버전, 시간, 전체 오류를 기록한 다음 개인정보 없이 신고하세요."]], ["구독과 iCloud", ["구매에 사용한 Apple Account를 확인하고 구매 복원을 선택하세요. Cloud는 유효한 구독, 명시적 활성화, iCloud Drive와 충분한 저장 공간을 확인하고 재설치로 동기화를 강제하지 마세요."]], ["공개 채널 주의", ["GitHub Issues는 공개입니다. 진료 기록, 백업, 사진, 연락처, 결제 정보 또는 정확한 위치를 올리지 마세요."]]]},
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
  return Object.entries(locales).map(([code, value]) => `<a href="${pathFor(code, page)}" hreflang="${code}"${code === current ? ' aria-current="page"' : ""}>${value.language}</a>`).join("");
}

function header(locale, page) {
  const c = locales[locale];
  return `<a class="skip-link" href="#content">${locale === "en" ? "Skip to content" : locale === "ja" ? "本文へ移動" : locale === "ko" ? "본문으로 이동" : "跳至正文"}</a>
  <header class="site-header"><nav class="nav" aria-label="${c.nav.home}">
    <a class="brand" href="${pathFor(locale, "home")}"><span class="brand-mark" aria-hidden="true"></span><span>Petter Days</span></a>
    <div class="nav-links"><a href="${pathFor(locale, "privacy")}">${c.nav.privacy}</a><a href="${pathFor(locale, "terms")}">${c.nav.terms}</a><a href="${pathFor(locale, "support")}">${c.nav.support}</a>
      <details class="lang"><summary>${c.nav.language} ▾</summary><div class="lang-menu">${langLinks(page, locale)}</div></details>
    </div>
  </nav></header>`;
}

function footer(locale) {
  const c = locales[locale];
  return `<footer class="site-footer"><div class="footer-inner"><div><a class="brand" href="${pathFor(locale, "home")}"><span class="brand-mark" aria-hidden="true"></span><span>Petter Days</span></a><p class="footer-note">${c.common.medical}<br>${c.common.source}<br>© 2026 ZhenHui Wang</p></div><nav class="footer-links"><a href="${pathFor(locale, "privacy")}">${c.nav.privacy}</a><a href="${pathFor(locale, "choices")}">${locale === "en" ? "Data choices" : locale === "ja" ? "データ管理" : locale === "ko" ? "데이터 관리" : "数据管理"}</a><a href="${pathFor(locale, "terms")}">${c.nav.terms}</a><a href="${pathFor(locale, "support")}">${c.nav.support}</a></nav></div></footer>`;
}

function document(locale, page, title, description, content) {
  const c = locales[locale];
  const canonical = absolutePath(locale, page);
  const alternates = Object.keys(locales).map((code) => `<link rel="alternate" hreflang="${code}" href="${absolutePath(code, page)}">`).join("");
  return `<!doctype html><html lang="${locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#F3EFE7" media="(prefers-color-scheme: light)"><meta name="theme-color" content="#141210" media="(prefers-color-scheme: dark)"><title>${title} · Petter Days</title><meta name="description" content="${description}"><link rel="canonical" href="${canonical}">${alternates}<link rel="alternate" hreflang="x-default" href="${absolutePath("zh-Hans", page)}"><link rel="stylesheet" href="/assets/styles.css"></head><body>${header(locale, page)}<main id="content">${content}</main>${footer(locale)}</body></html>`;
}

function home(locale) {
  const c = locales[locale];
  const h = c.home;
  const trust = h.trust.map(([title, text]) => `<div class="trust-item"><strong>${title}</strong>${text}</div>`).join("");
  const features = h.features.map(([title, text]) => `<article class="feature"><h3>${title}</h3><p>${text}</p><span class="motif" aria-hidden="true"></span></article>`).join("");
  const list = (items) => items.map((item) => `<li>${item}</li>`).join("");
  const content = `<section class="hero"><div><p class="eyebrow">${h.eyebrow}</p><h1>${h.title}</h1><p class="hero-copy">${h.intro}</p><div class="actions"><span class="button" aria-disabled="true">${c.common.soon}</span><a class="button secondary" href="${pathFor(locale, "privacy")}">${c.common.learn}</a></div></div><div class="hero-art" aria-hidden="true"><span class="orb one"></span><span class="orb two"></span><span class="orb three"></span><span class="pet-face"><span class="eye left"></span><span class="eye right"></span><span class="nose"></span><span class="whisker"></span></span></div></section><section class="trust-strip">${trust}</section><section class="section"><div class="section-heading"><p class="eyebrow">Petter Days</p><h2>${h.featuresTitle}</h2><p>${h.featuresIntro}</p></div><div class="feature-grid">${features}</div></section><section class="section"><div class="section-heading"><h2>${h.plansTitle}</h2><p>${h.plansIntro}</p></div><div class="plans"><article class="plan"><h3>${h.free.title}</h3><p class="price">${h.free.price}</p><ul>${list(h.free.items)}</ul></article><article class="plan cloud"><h3>${h.cloud.title}</h3><p class="price">${h.cloud.price}</p><ul>${list(h.cloud.items)}</ul></article></div><p class="note">${h.cloudNote}</p></section>`;
  return document(locale, "home", h.title, h.intro, content);
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
    urls.push(absolutePath(locale, page));
  }
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>${url}</loc><lastmod>${effectiveDate}</lastmod></url>`).join("\n")}\n</urlset>\n`;
await writeFile(join(out, "sitemap.xml"), sitemap);

const notFound = document("zh-Hans", "home", "页面不存在", "找不到这个页面。", `<header class="legal-hero"><p class="eyebrow">404</p><h1>这里没有这份记录。</h1><p>链接可能已经改变。请返回 Petter Days 首页或支持页面。</p><div class="actions"><a class="button" href="/">返回首页</a><a class="button secondary" href="/support/">获取支持</a></div></header>`);
await writeFile(join(out, "404.html"), notFound);

const generated = await readFile(join(out, "index.html"), "utf8");
if (!generated.includes("Every day") && !generated.includes("每一天")) throw new Error("Home generation failed");
console.log(`Built ${urls.length} localized pages in ${out}`);
