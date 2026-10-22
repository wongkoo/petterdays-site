// Support answers focus on recovery and troubleshooting, not product marketing.
export const supportContent = {
  "zh-Hans": {
    eyebrow: "需要帮忙？", title: "遇到问题，一起解决。", intro: "点开与你有关的问题。还没解决的话，直接联系我们。",
    contact: "联系开发者", contactNote: "来信附上 App 与系统版本、操作步骤和提示截图，方便我们定位问题。",
    questions: [
      { title: "购买后，功能还没有解锁？", answer: "确认 App Store 登录的是购买时的 Apple Account，再在 App 中选择“恢复购买”。仍未恢复时，请通过下方邮箱联系开发者。" },
      { title: "iCloud 没有同步，或家人看不到记录？", answer: "检查 iCloud Drive、可用空间和 App 内的同步开关。共享双方都需要有效 Pro 订阅；只能查看时，请让家庭主人检查你的编辑权限。" },
      { title: "准备换机，或者需要恢复资料？", answer: "先在原设备导出完整备份，再按数据管理说明恢复。遇到资料库异常时，也先备份，不要通过反复卸载来修复。", link: ["查看备份与恢复步骤", "/privacy/choices/"] },
      { title: "碰了 NFC 标签，却没有打开记录？", answer: "确认使用兼容的 iPhone，并在 App 中核验标签；出现系统通知时，点击通知继续。", link: ["查看 NFC 设置步骤", "/guide/nfc/"] },
    ],
  },
  "zh-Hant": {
    eyebrow: "需要幫忙？", title: "遇到問題，一起解決。", intro: "點開與你有關的問題。還沒解決的話，直接聯絡我們。",
    contact: "聯絡開發者", contactNote: "來信請附上 App 與系統版本、操作步驟和提示截圖，方便我們了解問題。",
    questions: [
      { title: "購買後，功能仍未解鎖？", answer: "確認 App Store 登入的是購買時的 Apple Account，再在 App 中選擇「恢復購買」。仍未恢復時，請透過下方電郵聯絡開發者。" },
      { title: "iCloud 沒有同步，或家人看不到紀錄？", answer: "檢查 iCloud Drive、可用空間和 App 內的同步開關。共享雙方都需要有效的 Pro 訂閱；若只能檢視，請家庭擁有者檢查你的編輯權限。" },
      { title: "準備換機，或需要還原資料？", answer: "先在原裝置匯出完整備份，再按照資料管理說明還原。遇到資料庫問題時，也請先備份，不要透過反覆刪除 App 來修復。", link: ["查看備份與還原步驟", "/zh-Hant/privacy/choices/"] },
      { title: "碰了 NFC 標籤，卻沒有開啟紀錄？", answer: "確認使用相容的 iPhone，並在 App 中核驗標籤；出現系統通知時，點一下通知繼續。", link: ["查看 NFC 設定步驟（英文）", "/en/guide/nfc/"] },
    ],
  },
  en: {
    eyebrow: "Need a hand?", title: "Let’s work it out.", intro: "Open the question that fits. If you are still stuck, get in touch.",
    contact: "Email the developer", contactNote: "Include your app and system versions, the steps you took and a screenshot of any message.",
    questions: [
      { title: "Made a purchase, but features are still locked?", answer: "Check that the App Store is signed in with the Apple Account used for the purchase, then choose Restore Purchases in the app. If access is still missing, email the developer below." },
      { title: "iCloud is not syncing, or a family member cannot see records?", answer: "Check iCloud Drive, available storage and the sync setting in the app. Each caregiver needs an active Pro subscription. If you can view but not edit, ask the household owner to check your editing permission." },
      { title: "Moving to a new device or restoring your records?", answer: "Export a complete backup from the original device, then follow the data-management instructions. For library problems, back up first rather than repeatedly uninstalling the app.", link: ["Backup and restoration steps", "/en/privacy/choices/"] },
      { title: "Tapped an NFC tag, but the record did not open?", answer: "Use a compatible iPhone and verify the tag in the app. If a system notification appears, tap it to continue.", link: ["NFC setup steps", "/en/guide/nfc/"] },
    ],
  },
  ja: {
    eyebrow: "お困りですか？", title: "一緒に解決しましょう。", intro: "当てはまる質問を開いてください。解決しない場合は、お気軽にお問い合わせください。",
    contact: "開発者にメールする", contactNote: "App と OS のバージョン、操作手順、表示されたメッセージのスクリーンショットをお知らせください。",
    questions: [
      { title: "購入したのに機能が使えない", answer: "App Store に購入時の Apple Account でサインインしていることを確認し、App 内で購入を復元してください。解決しない場合は、下記のメールでご連絡ください。" },
      { title: "iCloud が同期しない・家族に記録が表示されない", answer: "iCloud Drive、空き容量、App 内の同期設定をご確認ください。共有する各メンバーに有効な Pro サブスクリプションが必要です。閲覧できても編集できない場合は、世帯のオーナーに編集権限をご確認ください。" },
      { title: "機種変更やデータの復元をしたい", answer: "元の端末で完全バックアップを書き出してから、データ管理の手順に沿って復元してください。ライブラリに問題がある場合も、App の削除を繰り返さず、まずバックアップを作成してください。", link: ["バックアップと復元の手順", "/ja/privacy/choices/"] },
      { title: "NFC タグにかざしても記録が開かない", answer: "対応する iPhone を使用し、App 内でタグを確認してください。システム通知が表示されたら、通知をタップして進みます。", link: ["NFC の設定手順（英語）", "/en/guide/nfc/"] },
    ],
  },
  ko: {
    eyebrow: "도움이 필요하세요?", title: "함께 해결해 봐요.", intro: "해당하는 질문을 열어 보세요. 해결되지 않으면 편하게 문의해 주세요.",
    contact: "개발자에게 이메일 보내기", contactNote: "앱과 운영체제 버전, 문제 발생 과정, 안내 메시지 스크린샷을 함께 보내 주세요.",
    questions: [
      { title: "구매했는데 기능이 잠겨 있나요?", answer: "App Store에 구매할 때 사용한 Apple Account로 로그인했는지 확인한 뒤, 앱에서 구매 복원을 선택하세요. 해결되지 않으면 아래 이메일로 문의해 주세요." },
      { title: "iCloud가 동기화되지 않거나 가족에게 기록이 보이지 않나요?", answer: "iCloud Drive, 사용 가능한 저장 공간, 앱 내 동기화 설정을 확인하세요. 함께 돌보는 사람마다 유효한 Pro 구독이 필요합니다. 보기만 가능한 경우에는 가정 소유자에게 편집 권한을 확인해 달라고 요청하세요." },
      { title: "기기를 바꾸거나 자료를 복원하려고 하나요?", answer: "먼저 기존 기기에서 전체 백업을 내보낸 뒤 자료 관리 안내에 따라 복원하세요. 자료 보관함에 문제가 생겨도 앱을 반복해서 삭제하지 말고 먼저 백업해 주세요.", link: ["백업 및 복원 방법", "/ko/privacy/choices/"] },
      { title: "NFC 태그를 읽어도 기록이 열리지 않나요?", answer: "호환되는 iPhone을 사용하고 앱에서 태그를 확인하세요. 시스템 알림이 나타나면 알림을 눌러 계속 진행하세요.", link: ["NFC 설정 방법(영어)", "/en/guide/nfc/"] },
    ],
  },
};
