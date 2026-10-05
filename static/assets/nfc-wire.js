(function (root) {
  "use strict";

  const RECORDS = Object.freeze({
    1: "urination", 2: "defecation", 3: "toiletBoth", 4: "toiletAttempted",
    5: "walk", 6: "weight", 7: "medication", 8: "respiratory", 9: "heartRate",
    10: "symptom", 11: "clinicalVisit", 12: "vaccination", 13: "medicalProcedure",
  });
  const ENUMS = Object.freeze({
    relativeAmount: { 0: "unknown", 1: "trace", 2: "small", 3: "medium", 4: "large", 5: "usualForPet" },
    urineColor: { 0: "unknown", 1: "normal", 2: "clear", 3: "yellow", 4: "dark", 5: "pink", 6: "red", 7: "brown", 8: "other" },
    stoolConsistency: { 0: "unknown", 1: "dry", 2: "formed", 3: "soft", 4: "diarrhea", 5: "unclassified" },
    observation: { 0: "notObserved", 1: "yes", 2: "no", 3: "unknown" },
    medicationStatus: { 1: "administered", 2: "partial", 3: "skipped", 4: "refused" },
    doseUnit: { 1: "milligram", 2: "gram", 3: "milliliter", 4: "tablet", 5: "capsule", 6: "drop", 7: "puff", 8: "application", 9: "other" },
    route: { 1: "oral", 2: "topical", 3: "injection", 4: "inhaled", 5: "ocular", 6: "otic", 7: "other" },
    severity: { 0: "unknown", 1: "mild", 2: "moderate", 3: "severe", 4: "urgent" },
    visitType: { 1: "wellness", 2: "illness", 3: "emergency", 4: "followUp", 5: "hospitalization", 6: "procedure", 7: "other" },
    procedureKind: { 1: "sterilization", 2: "surgery", 3: "dental", 4: "microchip", 5: "other" },
  });
  const ALIAS_FIELDS = Object.freeze({
    1: "urineAmount", 2: "urineColor", 3: "stoolConsistency", 4: "status",
    5: "doseUnit", 6: "route", 7: "severity", 8: "visitType",
  });

  function fail() { throw new Error("Invalid NFC payload"); }
  function base64URL(token) {
    if (!token || token.length > 65536 || !/^[A-Za-z0-9_-]+$/.test(token)) fail();
    const padded = token.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - token.length % 4) % 4);
    let binary;
    try { binary = root.atob(padded); } catch (_) { fail(); }
    return Uint8Array.from(binary, (character) => character.charCodeAt(0));
  }
  function crc32(bytes) {
    let crc = 0xffffffff;
    for (const byte of bytes) {
      crc ^= byte;
      for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
    }
    return (crc ^ 0xffffffff) >>> 0;
  }
  function uint32(bytes, offset) {
    return (((bytes[offset] << 24) >>> 0) | (bytes[offset + 1] << 16) | (bytes[offset + 2] << 8) | bytes[offset + 3]) >>> 0;
  }
  function varUInt(bytes, state, limit) {
    let value = 0;
    for (let shift = 0; shift < 35; shift += 7) {
      if (state.offset >= limit) fail();
      const byte = bytes[state.offset++];
      value += (byte & 0x7f) * (2 ** shift);
      if (!(byte & 0x80)) return value;
    }
    fail();
  }
  function fields(bytes) {
    const result = new Map();
    const state = { offset: 0 };
    while (state.offset < bytes.length) {
      const tag = bytes[state.offset++];
      const length = varUInt(bytes, state, bytes.length);
      if (length > 32768 || state.offset + length > bytes.length || result.has(tag)) fail();
      result.set(tag, bytes.slice(state.offset, state.offset + length));
      state.offset += length;
    }
    return result;
  }
  function text(value) {
    if (!value || !value.length || value.length > 16384) fail();
    try { return new TextDecoder("utf-8", { fatal: true }).decode(value); } catch (_) { fail(); }
  }
  function stringValue(map, tag, required) {
    const value = map.get(tag);
    if (!value) { if (required) fail(); return undefined; }
    return text(value);
  }
  function byteValue(map, tag, registry, fallback) {
    const value = map.get(tag);
    if (!value) {
      if (fallback !== undefined) return fallback;
      fail();
    }
    if (value.length !== 1 || registry[value[0]] === undefined) fail();
    return registry[value[0]];
  }
  function doubleValue(map, tag, required) {
    const value = map.get(tag);
    if (!value) { if (required) fail(); return undefined; }
    if (value.length !== 8) fail();
    const number = new DataView(value.buffer, value.byteOffset, 8).getFloat64(0, false);
    if (!Number.isFinite(number)) fail();
    return number;
  }
  function integerValue(map, tag) {
    const value = map.get(tag);
    if (!value) return undefined;
    const state = { offset: 0 };
    const result = varUInt(value, state, value.length);
    if (state.offset !== value.length || !Number.isSafeInteger(result)) fail();
    return result;
  }
  function dateValue(map, tag) {
    const value = map.get(tag);
    if (!value) return undefined;
    if (value.length !== 4) fail();
    const year = (value[0] << 8) | value[1], month = value[2], day = value[3];
    if (year < 1900 || year > 2400 || month < 1 || month > 12 || day < 1 || day > 31) fail();
    return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }
  function add(list, key, value) { if (value !== undefined) list.push({ key, value }); }

  function decodeContent(record, bytes) {
    const map = fields(bytes), result = [];
    if (["urination", "defecation", "toiletBoth", "toiletAttempted"].includes(record)) {
      add(result, "urineAmount", byteValue(map, 1, ENUMS.relativeAmount, "unknown"));
      add(result, "urineColor", byteValue(map, 2, ENUMS.urineColor, "unknown"));
      add(result, "stoolAmount", byteValue(map, 3, ENUMS.relativeAmount, "unknown"));
      add(result, "stoolConsistency", byteValue(map, 4, ENUMS.stoolConsistency, "unknown"));
      add(result, "visibleBlood", byteValue(map, 5, ENUMS.observation, "notObserved"));
      add(result, "straining", byteValue(map, 6, ENUMS.observation, "notObserved"));
      add(result, "note", stringValue(map, 7, false));
    } else if (record === "weight") {
      add(result, "kilograms", doubleValue(map, 1, true)); add(result, "note", stringValue(map, 2, false));
    } else if (record === "medication") {
      add(result, "medicationName", stringValue(map, 1, true));
      add(result, "status", byteValue(map, 2, ENUMS.medicationStatus));
      add(result, "doseValue", doubleValue(map, 3, false));
      if (map.has(4)) add(result, "doseUnit", byteValue(map, 4, ENUMS.doseUnit));
      if (map.has(5)) add(result, "route", byteValue(map, 5, ENUMS.route));
      add(result, "prescribedBy", stringValue(map, 6, false)); add(result, "note", stringValue(map, 7, false));
    } else if (record === "symptom") {
      add(result, "symptomName", stringValue(map, 1, true)); add(result, "severity", byteValue(map, 2, ENUMS.severity));
      add(result, "bodyArea", stringValue(map, 3, false)); add(result, "note", stringValue(map, 4, false));
    } else if (record === "clinicalVisit") {
      add(result, "visitType", byteValue(map, 1, ENUMS.visitType)); add(result, "reason", stringValue(map, 2, true));
      add(result, "clinicName", stringValue(map, 3, false)); add(result, "veterinarianName", stringValue(map, 4, false));
      add(result, "assessment", stringValue(map, 5, false)); add(result, "carePlan", stringValue(map, 6, false)); add(result, "note", stringValue(map, 7, false));
    } else if (record === "vaccination") {
      add(result, "vaccineName", stringValue(map, 1, true)); add(result, "doseNumber", integerValue(map, 2));
      add(result, "manufacturer", stringValue(map, 3, false)); add(result, "lotNumber", stringValue(map, 4, false));
      add(result, "clinicName", stringValue(map, 5, false)); add(result, "veterinarianName", stringValue(map, 6, false));
      add(result, "nextRecommendedDate", dateValue(map, 7)); add(result, "note", stringValue(map, 8, false));
    } else if (record === "medicalProcedure") {
      add(result, "procedureKind", byteValue(map, 1, ENUMS.procedureKind)); add(result, "procedureName", stringValue(map, 2, false));
      add(result, "clinicName", stringValue(map, 3, false)); add(result, "veterinarianName", stringValue(map, 4, false));
      add(result, "outcome", stringValue(map, 5, false)); add(result, "note", stringValue(map, 6, false));
    } else if (record === "respiratory" || record === "heartRate") {
      add(result, "ratePerMinute", doubleValue(map, 1, true)); add(result, "context", stringValue(map, 2, false)); add(result, "note", stringValue(map, 3, false));
    } else fail();
    return result;
  }

  function decodeToken(token) {
    const bytes = base64URL(token);
    if (bytes.length < 15 || bytes.length > 32768) fail();
    const bodyEnd = bytes.length - 4;
    if (bytes[0] !== 0x50 || bytes[1] !== 0x44 || bytes[2] !== 1 || crc32(bytes.slice(0, bodyEnd)) !== uint32(bytes, bodyEnd)) fail();
    const flags = bytes[3], record = RECORDS[bytes[4]];
    if ((flags & ~3) !== 0 || !record) fail();
    let offset = 11;
    if (flags & 2) offset += 6;
    if (offset > bodyEnd) fail();
    let content, contentSeen = false;
    const aliases = new Map();
    const state = { offset };
    while (state.offset < bodyEnd) {
      const tag = bytes[state.offset++], length = varUInt(bytes, state, bodyEnd);
      if (length > 32768 || state.offset + length > bodyEnd) fail();
      const value = bytes.slice(state.offset, state.offset + length); state.offset += length;
      if (tag === 1) {
        if (contentSeen) fail();
        content = decodeContent(record, value); contentSeen = true;
      } else if (tag === 0x70) {
        if (value.length < 2 || !ALIAS_FIELDS[value[0]] || aliases.has(value[0])) fail();
        aliases.set(value[0], text(value.slice(1)));
      }
    }
    const mode = flags & 1 ? "direct" : "form";
    if (mode === "direct" && !contentSeen) fail();
    if (content) {
      for (const [group, name] of aliases) {
        const field = content.find((item) => item.key === ALIAS_FIELDS[group]);
        if (!field) fail();
        field.value = name; field.customAlias = true;
      }
    } else if (aliases.size) fail();
    return Object.freeze({ version: 1, record, mode, hasPrefill: contentSeen, hasShortcutKey: Boolean(flags & 2), fields: content || [] });
  }

  const COPY = {
    "zh-Hans": { title: "Petter Days 记录标签", intro: "页面已在本设备解析标签，不会发送解析结果或发起额外数据请求。安装 App 后，轻触标签可继续记录。", type: "记录类型", mode: "打开方式", form: "预填后确认", direct: "直接保存", prefill: "包含预填内容", noPrefill: "不含预填内容", details: "查看标签中的详细内容", privacy: "详细内容可能包含健康信息，请仅在可信设备上展开。打开网页时，托管服务仍会接触链接本身。", invalidTitle: "请在安装了 App 的设备上打开", invalidIntro: "此链接无法在网页中安全解析。它可能来自旧版标签、已损坏，或不是受支持的记录链接。", download: "App Store 下载", back: "返回官网", support: "获取支持" },
    "zh-Hant": { title: "Petter Days 記錄標籤", intro: "頁面已在本裝置解析標籤，不會傳送解析結果或發出額外資料請求。安裝 App 後，輕觸標籤可繼續記錄。", type: "記錄類型", mode: "開啟方式", form: "預填後確認", direct: "直接儲存", prefill: "包含預填內容", noPrefill: "不含預填內容", details: "查看標籤中的詳細內容", privacy: "詳細內容可能包含健康資料，請只在可信裝置上展開。開啟網頁時，託管服務仍會接觸連結本身。", invalidTitle: "請在已安裝 App 的裝置上開啟", invalidIntro: "此連結無法在網頁中安全解析，可能來自舊版、已損壞或並非受支援的記錄連結。", download: "在 App Store 下載", back: "返回官網", support: "取得支援" },
    en: { title: "This is a Petter Days record tag", intro: "The page decoded the tag on this device. It does not send decoded results or make extra data requests. Install the app to use the tag for recording.", type: "Record type", mode: "Action", form: "Review prefill", direct: "Save directly", prefill: "Includes prefilled details", noPrefill: "No prefilled details", details: "Show details stored on the tag", privacy: "Details may contain health information. Reveal them only on a trusted device. The hosting service still receives the link when this page opens.", invalidTitle: "Open on a device with the app installed", invalidIntro: "This link could not be decoded safely. It may be an older or damaged tag, or an unsupported record link.", download: "Download on the App Store", back: "Website", support: "Support" },
    ja: { title: "Petter Days の記録タグです", intro: "ページはこの端末内でタグを解析し、解析結果の送信や追加のデータ通信は行いません。App をインストールすると記録に使用できます。", type: "記録の種類", mode: "動作", form: "入力内容を確認", direct: "直接保存", prefill: "入力済みの詳細あり", noPrefill: "入力済みの詳細なし", details: "タグ内の詳細を表示", privacy: "健康情報が含まれる場合があります。信頼できる端末でのみ表示してください。ページを開く際、ホスティングサービスはリンク自体を受信します。", invalidTitle: "App をインストールした端末で開いてください", invalidIntro: "このリンクは安全に解析できませんでした。旧版、破損、未対応の記録リンクの可能性があります。", download: "App Store でダウンロード", back: "公式サイト", support: "サポート" },
    ko: { title: "Petter Days 기록 태그입니다", intro: "페이지는 이 기기에서 태그를 해석하며 해석 결과를 전송하거나 추가 데이터 요청을 하지 않습니다. App을 설치하면 기록에 사용할 수 있습니다.", type: "기록 유형", mode: "동작", form: "미리 입력된 내용 확인", direct: "바로 저장", prefill: "미리 입력된 세부 정보 포함", noPrefill: "미리 입력된 세부 정보 없음", details: "태그의 세부 정보 보기", privacy: "건강 정보가 포함될 수 있습니다. 신뢰할 수 있는 기기에서만 펼치세요. 페이지를 열 때 호스팅 서비스는 링크 자체를 받습니다.", invalidTitle: "App이 설치된 기기에서 여세요", invalidIntro: "이 링크를 안전하게 해석할 수 없습니다. 이전 버전, 손상된 태그 또는 지원되지 않는 링크일 수 있습니다.", download: "App Store에서 다운로드", back: "웹사이트", support: "지원" },
  };
  const RECORD_LABELS = {
    "zh-Hans": { urination: "尿尿", defecation: "便便", toiletBoth: "尿便", toiletAttempted: "如厕尝试", walk: "遛弯", weight: "体重", medication: "用药", respiratory: "静息呼吸", heartRate: "心率", symptom: "症状", clinicalVisit: "就诊", vaccination: "疫苗", medicalProcedure: "医疗操作" },
    "zh-Hant": { urination: "小便", defecation: "大便", toiletBoth: "大小便", toiletAttempted: "如廁嘗試", walk: "散步", weight: "體重", medication: "用藥", respiratory: "靜息呼吸", heartRate: "心率", symptom: "症狀", clinicalVisit: "就診", vaccination: "疫苗", medicalProcedure: "醫療處置" },
    en: { urination: "Urination", defecation: "Defecation", toiletBoth: "Urination and stool", toiletAttempted: "Toilet attempt", walk: "Walk", weight: "Weight", medication: "Medication", respiratory: "Resting respiration", heartRate: "Heart rate", symptom: "Symptom", clinicalVisit: "Clinical visit", vaccination: "Vaccination", medicalProcedure: "Medical procedure" },
    ja: { urination: "排尿", defecation: "排便", toiletBoth: "排尿・排便", toiletAttempted: "トイレの試み", walk: "散歩", weight: "体重", medication: "投薬", respiratory: "安静時呼吸", heartRate: "心拍数", symptom: "症状", clinicalVisit: "診察", vaccination: "ワクチン", medicalProcedure: "医療処置" },
    ko: { urination: "배뇨", defecation: "배변", toiletBoth: "배뇨·배변", toiletAttempted: "배변 시도", walk: "산책", weight: "체중", medication: "투약", respiratory: "안정 시 호흡", heartRate: "심박수", symptom: "증상", clinicalVisit: "진료", vaccination: "예방접종", medicalProcedure: "의료 처치" },
  };
  const FIELD_LABELS = {
    "zh-Hans": { urineAmount: "尿量", urineColor: "尿液颜色", stoolAmount: "便量", stoolConsistency: "便便状态", visibleBlood: "可见血", straining: "费力", kilograms: "体重（千克）", medicationName: "药物", status: "状态", doseValue: "剂量", doseUnit: "单位", route: "途径", prescribedBy: "开具者", symptomName: "症状", severity: "程度", bodyArea: "部位", visitType: "就诊类型", reason: "原因", clinicName: "医院", veterinarianName: "兽医", assessment: "评估", carePlan: "方案", vaccineName: "疫苗", doseNumber: "剂次", manufacturer: "生产商", lotNumber: "批号", nextRecommendedDate: "下次建议日期", procedureKind: "操作类型", procedureName: "操作名称", outcome: "结果", ratePerMinute: "每分钟次数", context: "状态", note: "备注" },
    "zh-Hant": { urineAmount: "尿量", urineColor: "尿液顏色", stoolAmount: "便量", stoolConsistency: "便便狀態", visibleBlood: "可見血", straining: "費力", kilograms: "體重（公斤）", medicationName: "藥物", status: "狀態", doseValue: "劑量", doseUnit: "單位", route: "途徑", prescribedBy: "開立者", symptomName: "症狀", severity: "程度", bodyArea: "部位", visitType: "就診類型", reason: "原因", clinicName: "醫院", veterinarianName: "獸醫", assessment: "評估", carePlan: "方案", vaccineName: "疫苗", doseNumber: "劑次", manufacturer: "生產商", lotNumber: "批號", nextRecommendedDate: "下次建議日期", procedureKind: "處置類型", procedureName: "處置名稱", outcome: "結果", ratePerMinute: "每分鐘次數", context: "狀態", note: "備註" },
    en: { urineAmount: "Urine amount", urineColor: "Urine color", stoolAmount: "Stool amount", stoolConsistency: "Stool consistency", visibleBlood: "Visible blood", straining: "Straining", kilograms: "Kilograms", medicationName: "Medication", status: "Status", doseValue: "Dose", doseUnit: "Unit", route: "Route", prescribedBy: "Prescribed by", symptomName: "Symptom", severity: "Severity", bodyArea: "Body area", visitType: "Visit type", reason: "Reason", clinicName: "Clinic", veterinarianName: "Veterinarian", assessment: "Assessment", carePlan: "Care plan", vaccineName: "Vaccine", doseNumber: "Dose number", manufacturer: "Manufacturer", lotNumber: "Lot number", nextRecommendedDate: "Next date", procedureKind: "Procedure", procedureName: "Procedure name", outcome: "Outcome", ratePerMinute: "Rate per minute", context: "Context", note: "Note" },
    ja: { urineAmount: "尿量", urineColor: "尿の色", stoolAmount: "便量", stoolConsistency: "便の状態", visibleBlood: "目に見える血", straining: "いきみ", kilograms: "体重（kg）", medicationName: "薬", status: "状態", doseValue: "用量", doseUnit: "単位", route: "投与経路", prescribedBy: "処方者", symptomName: "症状", severity: "程度", bodyArea: "部位", visitType: "診察種別", reason: "理由", clinicName: "病院", veterinarianName: "獣医師", assessment: "評価", carePlan: "計画", vaccineName: "ワクチン", doseNumber: "接種回数", manufacturer: "製造元", lotNumber: "ロット", nextRecommendedDate: "次回推奨日", procedureKind: "処置種別", procedureName: "処置名", outcome: "結果", ratePerMinute: "1分あたり", context: "状況", note: "メモ" },
    ko: { urineAmount: "소변 양", urineColor: "소변 색", stoolAmount: "대변 양", stoolConsistency: "대변 상태", visibleBlood: "육안 혈액", straining: "힘줌", kilograms: "체중(kg)", medicationName: "약", status: "상태", doseValue: "용량", doseUnit: "단위", route: "투여 경로", prescribedBy: "처방자", symptomName: "증상", severity: "정도", bodyArea: "부위", visitType: "진료 유형", reason: "이유", clinicName: "병원", veterinarianName: "수의사", assessment: "평가", carePlan: "계획", vaccineName: "백신", doseNumber: "접종 차수", manufacturer: "제조사", lotNumber: "로트", nextRecommendedDate: "다음 권장일", procedureKind: "처치 유형", procedureName: "처치명", outcome: "결과", ratePerMinute: "분당 횟수", context: "상황", note: "메모" },
  };
  const VALUE_LABELS = {
    "zh-Hans": { unknown: "未知", trace: "微量", small: "少", medium: "中等", large: "多", usualForPet: "和平时相近", normal: "正常", clear: "透明", yellow: "黄色", dark: "深色", pink: "粉色", red: "红色", brown: "棕色", other: "其他", dry: "干硬", formed: "成形", soft: "偏软", diarrhea: "腹泻", unclassified: "未分类", notObserved: "未观察", yes: "是", no: "否", administered: "已使用", partial: "部分使用", skipped: "跳过", refused: "拒绝", milligram: "毫克", gram: "克", milliliter: "毫升", tablet: "片", capsule: "粒", drop: "滴", puff: "喷", application: "次", oral: "口服", topical: "外用", injection: "注射", inhaled: "吸入", ocular: "眼部", otic: "耳部", mild: "轻度", moderate: "中度", severe: "重度", urgent: "紧急", wellness: "健康检查", illness: "疾病就诊", emergency: "急诊", followUp: "复诊", hospitalization: "住院", procedure: "操作", sterilization: "绝育", surgery: "手术", dental: "口腔", microchip: "芯片" },
    "zh-Hant": { unknown: "未知", trace: "微量", small: "少", medium: "中等", large: "多", usualForPet: "和平時相近", normal: "正常", clear: "透明", yellow: "黃色", dark: "深色", pink: "粉紅", red: "紅色", brown: "棕色", other: "其他", dry: "乾硬", formed: "成形", soft: "偏軟", diarrhea: "腹瀉", unclassified: "未分類", notObserved: "未觀察", yes: "是", no: "否", administered: "已使用", partial: "部分使用", skipped: "略過", refused: "拒絕", milligram: "毫克", gram: "克", milliliter: "毫升", tablet: "片", capsule: "粒", drop: "滴", puff: "噴", application: "次", oral: "口服", topical: "外用", injection: "注射", inhaled: "吸入", ocular: "眼部", otic: "耳部", mild: "輕度", moderate: "中度", severe: "重度", urgent: "緊急", wellness: "健康檢查", illness: "疾病就診", emergency: "急診", followUp: "覆診", hospitalization: "住院", procedure: "處置", sterilization: "絕育", surgery: "手術", dental: "口腔", microchip: "晶片" },
    en: { unknown: "Unknown", trace: "Trace", small: "Small", medium: "Medium", large: "Large", usualForPet: "Usual for pet", normal: "Normal", clear: "Clear", yellow: "Yellow", dark: "Dark", pink: "Pink", red: "Red", brown: "Brown", other: "Other", dry: "Dry", formed: "Formed", soft: "Soft", diarrhea: "Diarrhea", unclassified: "Unclassified", notObserved: "Not observed", yes: "Yes", no: "No", administered: "Administered", partial: "Partial", skipped: "Skipped", refused: "Refused", milligram: "Milligram", gram: "Gram", milliliter: "Milliliter", tablet: "Tablet", capsule: "Capsule", drop: "Drop", puff: "Puff", application: "Application", oral: "Oral", topical: "Topical", injection: "Injection", inhaled: "Inhaled", ocular: "Ocular", otic: "Otic", mild: "Mild", moderate: "Moderate", severe: "Severe", urgent: "Urgent", wellness: "Wellness", illness: "Illness", emergency: "Emergency", followUp: "Follow-up", hospitalization: "Hospitalization", procedure: "Procedure", sterilization: "Sterilization", surgery: "Surgery", dental: "Dental", microchip: "Microchip" },
    ja: { unknown: "不明", trace: "ごく少量", small: "少量", medium: "中程度", large: "多量", usualForPet: "普段どおり", normal: "正常", clear: "透明", yellow: "黄色", dark: "濃い色", pink: "ピンク", red: "赤", brown: "茶色", other: "その他", dry: "硬い", formed: "成形", soft: "柔らかい", diarrhea: "下痢", unclassified: "未分類", notObserved: "未観察", yes: "はい", no: "いいえ", administered: "投与済み", partial: "一部投与", skipped: "見送り", refused: "拒否", milligram: "mg", gram: "g", milliliter: "mL", tablet: "錠", capsule: "カプセル", drop: "滴", puff: "吸入", application: "回", oral: "経口", topical: "外用", injection: "注射", inhaled: "吸入", ocular: "眼", otic: "耳", mild: "軽度", moderate: "中等度", severe: "重度", urgent: "緊急", wellness: "健康診断", illness: "疾病", emergency: "救急", followUp: "再診", hospitalization: "入院", procedure: "処置", sterilization: "不妊・去勢", surgery: "手術", dental: "歯科", microchip: "マイクロチップ" },
    ko: { unknown: "알 수 없음", trace: "미량", small: "적음", medium: "보통", large: "많음", usualForPet: "평소와 비슷", normal: "정상", clear: "투명", yellow: "노랑", dark: "진한 색", pink: "분홍", red: "빨강", brown: "갈색", other: "기타", dry: "건조", formed: "형태 있음", soft: "무름", diarrhea: "설사", unclassified: "미분류", notObserved: "관찰 안 됨", yes: "예", no: "아니요", administered: "투여함", partial: "일부 투여", skipped: "건너뜀", refused: "거부", milligram: "mg", gram: "g", milliliter: "mL", tablet: "정", capsule: "캡슐", drop: "방울", puff: "회 흡입", application: "회", oral: "경구", topical: "외용", injection: "주사", inhaled: "흡입", ocular: "안구", otic: "귀", mild: "경도", moderate: "중등도", severe: "중증", urgent: "긴급", wellness: "건강 검진", illness: "질병 진료", emergency: "응급", followUp: "재진", hospitalization: "입원", procedure: "처치", sterilization: "중성화", surgery: "수술", dental: "치과", microchip: "마이크로칩" },
  };

  function locale() {
    const language = (root.navigator && (root.navigator.languages || [root.navigator.language])) || [];
    const value = language.find(Boolean) || "zh-CN";
    if (/^zh-(TW|HK|MO)/i.test(value)) return "zh-Hant";
    if (/^en/i.test(value)) return "en";
    if (/^ja/i.test(value)) return "ja";
    if (/^ko/i.test(value)) return "ko";
    return "zh-Hans";
  }
  function routeToken(location) {
    const match = location.pathname.match(/^\/2\/e\/([A-Za-z0-9_-]+)$/);
    if (match) return match[1];
    const route = new URL(location.href).searchParams.get("route") || "";
    const queryMatch = route.match(/^e\/([A-Za-z0-9_-]+)$/);
    return queryMatch && queryMatch[1];
  }
  function render() {
    if (!root.document || !root.location) return;
    const language = locale(), copy = COPY[language], token = routeToken(root.location);
    let decoded;
    try { decoded = token ? decodeToken(token) : undefined; } catch (_) { decoded = undefined; }
    root.document.documentElement.lang = language;
    const title = root.document.getElementById("nfc-title"), intro = root.document.getElementById("nfc-intro");
    const storeLink = root.document.getElementById("nfc-store");
    if (storeLink) storeLink.textContent = copy.download;
    root.document.getElementById("nfc-back").textContent = copy.back;
    root.document.getElementById("nfc-support").textContent = copy.support;
    if (!decoded) { title.textContent = copy.invalidTitle; intro.textContent = copy.invalidIntro; return; }
    title.textContent = copy.title; intro.textContent = copy.intro;
    root.document.getElementById("nfc-summary").hidden = false;
    root.document.getElementById("nfc-type-label").textContent = copy.type;
    root.document.getElementById("nfc-type").textContent = RECORD_LABELS[language][decoded.record];
    root.document.getElementById("nfc-mode-label").textContent = copy.mode;
    root.document.getElementById("nfc-mode").textContent = copy[decoded.mode];
    root.document.getElementById("nfc-prefill").textContent = decoded.hasPrefill ? copy.prefill : copy.noPrefill;
    const detail = root.document.getElementById("nfc-details");
    if (decoded.hasPrefill) {
      detail.hidden = false; detail.querySelector("summary").textContent = copy.details;
      detail.querySelector("p").textContent = copy.privacy;
      const list = detail.querySelector("dl");
      for (const field of decoded.fields) {
        const term = root.document.createElement("dt"), value = root.document.createElement("dd");
        term.textContent = FIELD_LABELS[language][field.key] || field.key;
        value.textContent = VALUE_LABELS[language][field.value] || String(field.value);
        list.append(term, value);
      }
    }
    if (root.history && root.history.replaceState) root.history.replaceState(null, "", "/link/");
  }

  root.PetterDaysNFCWire = Object.freeze({ decodeToken, records: RECORDS, enums: ENUMS });
  if (root.document) {
    if (root.document.readyState === "loading") root.document.addEventListener("DOMContentLoaded", render, { once: true });
    else render();
  }
})(globalThis);
