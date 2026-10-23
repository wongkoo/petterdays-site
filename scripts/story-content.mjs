// George & Biscuit tell the story in their own voices. Asset provenance stays in the IP library.
const section = (id, title, text, art = null) => ({ id, title, paragraphs: text.trim().split(/\n\n/), art });
export const storyContent = {
  "zh-Hans": {
    label: "开发者故事", back: "探索我们做的 App", eyebrow: "GEORGE & BISCUIT · 深夜开发部",
    title: ["我们给人类", "开发了一个 App。"], intro: "主要是怕他累坏。",
    roles: "Petter Days 联合开发喵与联合开发汪", meta: "乔治和饼干决定给主人开发一个 App。从深夜写代码到零食库存调查，两位毛茸茸开发者的工作实录。",
    quote: "让人类少忙一会儿，多摸我们一会儿。", afterword: "第二条是饼干偷偷加的：“再来一碗。”",
    art: {
      "story-midnight-build": ["乔治在电脑前写代码，饼干认真舔着另一块键盘，窗外已经入夜", "深夜开发部成立。键盘损耗暂未计入成本。"],
      "cat-at-work": ["乔治在电脑前琢磨记录和界面细节", "产品经理正在思考。请勿移动这只猫。"],
      "story-bath-debate": ["乔治对着电脑解释计划，饼干把装着小黄鸭的浴盆推远", "关于洗澡，本次会议未达成一致。"],
      "story-snack-mystery": ["乔治检查库存，饼干面前摆着三个空零食袋，嘴边还有碎屑", "代码检查了三遍。零食检查了三袋。"],
      "dog-at-work": ["饼干在水碗旁用手机测试 NFC 标签", "第二十七圈。第五次饮水。真实场景测试。"],
      "story-off-duty": ["主人放下手机，乔治和饼干依偎在身边等着被摸摸", "交付完成。现在领取报酬。"],
    },
    sections: [
      section("first-note", "这个人类，需要一点技术支持。", `我是乔治，一只猫。旁边那位正在舔键盘的是饼干，一只狗。

先说明一下：键盘不是他弄坏的。

上一个才是。

开发 Petter Days 的念头，诞生于一个普通的晚上。我们的人类蹲在柜子前，左手拿着半袋粮，右手翻着手机，嘴里反复念叨：

“这袋什么时候开的？今天梳毛了吗？上次称体重是多少来着？”

饼干听了很感动，觉得人类终于开始认真研究加餐。

我听了很担心。

这个两脚兽的脑子里，同时装着工作、快递、明天的天气，以及我们上个月哪天剪过指甲。

再装下去，可能需要外接硬盘。

于是，等他睡着以后，我跳上书桌，打开了电脑。

饼干拖来一张椅子，问：“做什么？”

“给人类开发一个 App。”

“可以点外卖吗？”

“不可以。”

“那先把这个需求记下来。”`),
      section("cat-desk", "第一次运行。第三次加餐提案。", `第二天凌晨，我们正式成立了开发团队。

我负责产品、界面和半夜推翻昨天的决定。饼干负责快捷操作、现场测试，以及在我推翻决定时把我从键盘上挪开。

第一次运行，我们失败了。

第二次，成功显示了一个按钮。

第三次，饼干把按钮改成了“再来一碗”。

我们为此进行了长达四十分钟的产品讨论。最后决定：先做记录，加餐问题另议。

我给每只宠物安排了自己的资料和日常记录。吃饭、喝水、体重、护理，该放哪里就放哪里。

饼干提出：“能不能把我的体重放进你的资料里？”

“不可以。”

“那这个功能还不够灵活。”

我认为这恰好证明功能很可靠。

为了让人类按自己的习惯记录，我们又做了自定义字段。饼干当场建了一个“今天表现特别好”的项目，并连续填写了七次。

我删掉六次。

他提交了投诉。`, "cat-at-work"),
      section("care-debate", "反对洗澡高级工程师。", `照护计划是我们争论最久的部分。

饼干坚持认为，“计划洗澡”和“已经洗澡”应该视为同一件事。毕竟光是想到洗澡，他就已经付出了巨大的精神劳动。

我坚持分开。

计划归计划，真正做完以后，才留下完成记录。

饼干沉默了一会儿，把自己的职位改成了“反对洗澡高级工程师”。`, "story-bath-debate"),
      section("snack-case", "库存减少了。嫌疑人很配合。", `接着，我们做了用品管理。

粮、零食、护理用品，库存、到期日和采购记录，都得让人类看得明白。这样他站在商店货架前，就不用再隔空问我们：“家里是不是还有一包？”

测试期间，我们发现了一个严重问题：

零食库存每天都在减少。

我检查了三遍。

饼干检查了三袋。

问题定位非常成功。`, "story-snack-mystery"),
      section("dog-test", "测试地点：水碗旁。", `NFC 快捷入口是饼干最得意的作品。

那天，他把手机、标签和水碗摆成一排，叫我过去看。

“人类照顾我们的时候，手已经很忙了。入口能不能就放在旁边？”

于是，我们把常用记录和标签连起来。用兼容的 iPhone 轻碰一下，就能打开对应入口，核对后保存。

饼干围着水碗走了二十七圈。

我问他在测什么。

“不同方向靠近，体验是否一致。”

“那你为什么喝了五次水？”

“真实场景。”

他确实是一位非常投入的开发者。`, "dog-at-work"),
      section("night-shift", "电脑有点热。是开发热情。", `最后几晚，我们开始收拾那些看不见、但不能含糊的事情。

人类没有网络的时候，也应该能好好记录。重要资料要能完整备份，放到自己选择的地方。需要家里其他人一起照顾我们时，也要把查看和编辑的权限说明白。

这些地方没什么好玩的。

饼干难得没有提出加餐。

我们一项一项试，困了就轮流睡。准确地说，他睡在椅子上，我睡在电脑上。人类第二天发现机器特别热，我们统一解释为开发热情。`),
      section("better-days", "交付了。轮到我们了。", `Petter Days 第一次被我们的人类用起来时，没有发生什么惊天动地的事。

他添了水，记下一笔。

看了一眼用品，知道这周该补什么。

做完护理，留下记录。

然后，他放下手机，坐到了我们旁边。

饼干立刻把脑袋塞进他手里。我装作路过，在另一边趴下。

“他怎么不继续用我们的 App？”饼干小声问。

“今天的事记好了。”

“所以呢？”

“所以，现在轮到我们了。”

饼干想了想，觉得这个产品方向非常正确。

当晚，我们给下一次更新写下了第一条需求：`, "story-off-duty"),
    ],
  },
  "zh-Hant": {
    label: "開發者故事", back: "看看我們做的 App", eyebrow: "GEORGE & BISCUIT · 深夜開發部",
    title: ["我們替人類", "開發了一個 App。"], intro: "主要是怕他累壞。",
    roles: "Petter Days 聯合開發喵與聯合開發汪", meta: "喬治和餅乾決定替主人開發一個 App。從深夜寫程式到零食庫存調查，兩位毛茸茸開發者的工作實錄。",
    quote: "讓人類少忙一會兒，多摸我們一會兒。", afterword: "第二條是餅乾偷偷加的：「再來一碗。」",
    art: {
      "story-midnight-build": ["喬治在電腦前寫程式，餅乾認真舔著另一塊鍵盤，窗外已經入夜", "深夜開發部成立。鍵盤損耗暫未計入成本。"],
      "cat-at-work": ["喬治在電腦前琢磨紀錄與介面的細節", "產品經理正在思考。請勿移動這隻貓。"],
      "story-bath-debate": ["喬治對著電腦解釋計畫，餅乾把裝著小黃鴨的澡盆推遠", "關於洗澡，本次會議未達成共識。"],
      "story-snack-mystery": ["喬治檢查庫存，餅乾面前有三個空零食袋，嘴邊還沾著碎屑", "程式檢查了三遍。零食檢查了三袋。"],
      "dog-at-work": ["餅乾在水碗旁用手機測試 NFC 標籤", "第二十七圈。第五次喝水。真實情境測試。"],
      "story-off-duty": ["主人放下手機，喬治和餅乾依偎在身邊等著被摸摸", "交付完成。現在領取報酬。"],
    },
    sections: [
      section("first-note", "這個人類，需要一點技術支援。", `我是喬治，一隻貓。旁邊那位正在舔鍵盤的是餅乾，一隻狗。

先說明一下：鍵盤不是他弄壞的。

上一個才是。

開發 Petter Days 的念頭，誕生於一個普通的晚上。我們的人類蹲在櫃子前，左手拿著半袋飼料，右手滑著手機，嘴裡反覆念著：

「這袋什麼時候開的？今天梳毛了嗎？上次量體重是多少來著？」

餅乾聽了很感動，覺得人類終於開始認真研究加餐。

我聽了很擔心。

這個兩腳獸的腦袋裡，同時裝著工作、包裹、明天的天氣，以及我們上個月哪天剪過指甲。

再裝下去，可能需要外接硬碟。

於是，等他睡著以後，我跳上書桌，打開了電腦。

餅乾拖來一張椅子，問：「做什麼？」

「替人類開發一個 App。」

「可以叫外送嗎？」

「不可以。」

「那先把這個需求記下來。」`),
      section("cat-desk", "第一次執行。第三次加餐提案。", `隔天凌晨，我們正式成立了開發團隊。

我負責產品、介面，以及半夜推翻昨天的決定。餅乾負責快捷操作、實際測試，以及在我推翻決定時把我從鍵盤上搬開。

第一次執行，失敗了。

第二次，成功顯示了一個按鈕。

第三次，餅乾把按鈕改成了「再來一碗」。

我們為此進行了長達四十分鐘的產品討論。最後決定：先做紀錄，加餐另議。

我替每隻毛孩安排了自己的資料和日常紀錄。吃飯、喝水、體重、照護，該放哪裡就放哪裡。

餅乾提議：「能不能把我的體重放進你的資料裡？」

「不可以。」

「那這個功能還不夠有彈性。」

我認為這正好證明功能很可靠。

為了讓人類照自己的習慣記錄，我們又做了自訂欄位。餅乾當場建了一個「今天表現特別好」的項目，連續填了七次。

我刪掉六次。

他提出了申訴。`, "cat-at-work"),
      section("care-debate", "反對洗澡資深工程師。", `照護計畫是我們爭論最久的部分。

餅乾堅持認為，「計畫洗澡」和「已經洗澡」應該算同一件事。畢竟光是想到洗澡，就已經耗費他巨大的心力。

我堅持分開。

計畫歸計畫，真的做完以後，才能留下完成紀錄。

餅乾沉默了一會兒，把自己的職稱改成了「反對洗澡資深工程師」。`, "story-bath-debate"),
      section("snack-case", "庫存少了。嫌疑人很配合。", `接著，我們做了用品管理。

飼料、零食、照護用品，庫存、到期日和採購紀錄，都得讓人類看得明白。這樣他站在商店貨架前，就不用再隔空問我們：「家裡是不是還有一包？」

測試期間，我們發現了一個嚴重問題：

零食庫存每天都在減少。

我檢查了三遍。

餅乾檢查了三袋。

問題定位非常成功。`, "story-snack-mystery"),
      section("dog-test", "測試地點：水碗旁。", `NFC 快捷入口是餅乾最得意的作品。

那天，他把手機、標籤和水碗排成一列，叫我過去看。

「人類照顧我們的時候，雙手已經很忙了。入口能不能就放在旁邊？」

於是，我們把常用紀錄和標籤連起來。用相容的 iPhone 輕碰一下，就能打開對應入口，核對後儲存。

餅乾繞著水碗走了二十七圈。

我問他在測什麼。

「從不同方向靠近，體驗是不是一樣。」

「那你為什麼喝了五次水？」

「真實情境。」

他確實是一位非常投入的開發者。`, "dog-at-work"),
      section("night-shift", "電腦有點燙。是開發熱情。", `最後幾晚，我們開始處理那些看不見、卻不能含糊的事情。

人類沒有網路時，也應該能好好記錄。重要資料要能完整備份，存到自己選擇的地方。需要家裡其他人一起照顧我們時，也得把查看和編輯的權限說清楚。

這些地方沒什麼好玩的。

餅乾難得沒有提議加餐。

我們一項一項試，累了就輪流睡。準確地說，他睡在椅子上，我睡在電腦上。人類隔天發現機器特別燙，我們一致解釋為開發熱情。`),
      section("better-days", "交付了。輪到我們了。", `我們的人類第一次用起 Petter Days 時，沒有發生什麼驚天動地的事。

他加了水，記下一筆。

看了一眼用品，知道這週該補什麼。

做完照護，留下紀錄。

然後，他放下手機，坐到我們身邊。

餅乾立刻把頭塞進他手裡。我裝作路過，在另一邊趴下。

「他怎麼不繼續用我們的 App？」餅乾小聲問。

「今天的事記好了。」

「所以呢？」

「所以，現在輪到我們了。」

餅乾想了想，覺得這個產品方向非常正確。

當晚，我們替下一次更新寫下了第一條需求：`, "story-off-duty"),
    ],
  },
  en: {
    label: "Our story", back: "Meet the app we built", eyebrow: "GEORGE & BISCUIT · THE NIGHT SHIFT",
    title: ["We built our human", "an app."], intro: "Mostly so they could get some rest.",
    roles: "Petter Days · Co-developurr & Co-developaw", meta: "George and Biscuit build an app for their human. A story of late-night coding, suspicious snack shortages and getting paid in head scratches.",
    quote: "Less busy human. More head scratches.", afterword: "Biscuit quietly added a second request: “Another bowl, please.”",
    art: {
      "story-midnight-build": ["George codes at a laptop while Biscuit earnestly licks a second keyboard after dark", "The night shift is open. Replacement keyboards are not yet in the budget."],
      "cat-at-work": ["George at a laptop, thinking through records and interface details", "Product manager thinking. Do not move the cat."],
      "story-bath-debate": ["George points at a laptop while Biscuit pushes a small tub and rubber duck away", "The bath meeting ended without agreement."],
      "story-snack-mystery": ["George checks the inventory while Biscuit sits beside three empty snack bags with crumbs on his face", "Three code reviews. Three bags of snacks reviewed."],
      "dog-at-work": ["Biscuit tests a phone and NFC tag beside the water bowl", "Lap 27. Drink number five. Real-world testing."],
      "story-off-duty": ["Their human puts the phone down and pets George and Biscuit on the sofa", "App delivered. Payment now due in pats."],
    },
    sections: [
      section("first-note", "Our human needed technical support.", `I’m George. A cat. The colleague licking the keyboard is Biscuit. A dog.

For the record, he didn’t break this keyboard.

That was the previous one.

The idea for Petter Days came to us one ordinary evening. Our human was crouching by the cupboard, half a bag of food in one hand and a phone in the other, muttering:

“When did I open this? Did we do brushing today? What was that last weigh-in?”

Biscuit was touched. At last, our human was taking the question of extra meals seriously.

I was concerned.

That two-legged brain was already holding work, deliveries, tomorrow’s weather and the date of our last nail trim.

Any more, and it would need an external drive.

So, once our human was asleep, I hopped onto the desk and opened the laptop.

Biscuit dragged over a chair. “What are we doing?”

“Building our human an app.”

“Can it order takeaway?”

“No.”

“Put that on the feature list.”`),
      section("cat-desk", "First build. Third request for dinner.", `By the early hours, we had officially formed a development team.

I handled the product, the interface and changing my mind at midnight. Biscuit handled shortcuts, field testing and removing me from the keyboard when I changed my mind.

Our first attempt didn’t run.

The second displayed a button.

On the third, Biscuit renamed it “Another bowl, please.”

A forty-minute product meeting followed. The decision: records first. Second dinner could wait.

I gave every pet a profile and a care history. Meals, water, weight and grooming all had somewhere to go.

“Could my weight go in your profile?” Biscuit asked.

“No.”

“Not very flexible, then.”

I felt this proved it was working rather well.

We added custom fields so humans could keep records their own way. Biscuit immediately created “Exceptionally good today” and filled it in seven times.

I removed six.

He filed a complaint.`, "cat-at-work"),
      section("care-debate", "Senior Engineer, Bath Opposition.", `Care plans caused our longest disagreement.

Biscuit argued that “bath planned” and “bath taken” should count as the same thing. Simply thinking about a bath had already cost him considerable emotional effort.

I insisted they stay separate.

A plan is a plan. A completed record comes after the care has actually happened.

Biscuit went quiet, then changed his job title to “Senior Engineer, Bath Opposition.”`, "story-bath-debate"),
      section("snack-case", "Missing stock. A very helpful suspect.", `Next came supply management.

Food, treats, care supplies. Stock, expiry dates and purchases. Our human needed to see what was what, without standing in a shop wondering aloud, “Don’t we have another bag at home?”

During testing, we discovered a serious issue.

The treat inventory was shrinking every day.

I checked the code three times.

Biscuit checked three bags.

We successfully identified the cause.`, "story-snack-mystery"),
      section("dog-test", "Test location: beside the water bowl.", `Biscuit was especially proud of the NFC shortcut.

One day he lined up a phone, a tag and the water bowl, and called me over.

“Our human’s hands are already full looking after us. Could the shortcut live right here?”

So we linked familiar records to tags. A tap with a compatible iPhone opens the right entry point. Check the details, then save.

Biscuit walked around the bowl twenty-seven times.

I asked what he was testing.

“Whether it works just as well from different directions.”

“Why have you had five drinks?”

“Real-world conditions.”

He is a remarkably committed developer.`, "dog-at-work"),
      section("night-shift", "The laptop is warm. That’s enthusiasm.", `Over the last few nights, we worked on the things you can’t see, but can’t afford to get vague about.

Our human should be able to keep records without an internet connection. Important data should have a complete backup, saved wherever they choose. If someone else in the household helps with care, viewing and editing permissions should be clear.

None of this was especially entertaining.

For once, Biscuit didn’t request another meal.

We tested each part and took turns sleeping. More precisely, he slept on the chair and I slept on the laptop. When our human noticed how warm it was the next morning, we agreed to call it developer enthusiasm.`),
      section("better-days", "App delivered. Our turn now.", `Nothing spectacular happened the first time our human used Petter Days.

They topped up the water and made a record.

Checked the supplies and knew what to buy that week.

Finished the care and logged it.

Then they put the phone down and sat beside us.

Biscuit immediately pushed his head into their hand. I happened to be passing and settled on the other side.

“Why aren’t they using our app anymore?” Biscuit whispered.

“Today’s things are taken care of.”

“So?”

“So it’s our turn.”

Biscuit considered this an excellent product direction.

That night, we wrote the first request for our next update:`, "story-off-duty"),
    ],
  },
  ja: {
    label: "開発ストーリー", back: "私たちの App を見る", eyebrow: "GEORGE & BISCUIT · 深夜開発部",
    title: ["飼い主のために、", "App を作りました。"], intro: "がんばりすぎて、倒れないように。",
    roles: "Petter Days · 共同開発にゃん＆共同開発わん", meta: "猫の George と犬の Biscuit が、飼い主のために App を開発。深夜のコーディング、おやつ在庫の謎、そしてなでなでの報酬まで。",
    quote: "人間の忙しい時間を減らして、なでてもらう時間を増やす。", afterword: "Biscuit がこっそり、二つ目も追加しました。「おかわり。」",
    art: {
      "story-midnight-build": ["夜の部屋で George がパソコンに向かい、Biscuit は別のキーボードを真剣になめている", "深夜開発部、始動。交換用キーボードの予算は未定。"],
      "cat-at-work": ["パソコンの前で記録と画面の細部を考える George", "プロダクト担当、考え中。この猫を動かさないでください。"],
      "story-bath-debate": ["George がパソコンで予定を説明し、Biscuit がアヒルのおもちゃ入りのたらいを遠ざけている", "お風呂の件は、合意に至りませんでした。"],
      "story-snack-mystery": ["George が在庫を調べる横で、口に食べかすをつけた Biscuit が三つの空袋に囲まれている", "コードは三回確認。おやつは三袋確認。"],
      "dog-at-work": ["水の器のそばでスマートフォンと NFC タグを試す Biscuit", "二十七周目。給水五回目。実環境テストです。"],
      "story-off-duty": ["スマートフォンを置いた飼い主に、ソファで George と Biscuit が寄り添っている", "納品完了。報酬を受け取ります。"],
    },
    sections: [
      section("first-note", "この人間には、技術サポートが必要だ。", `私は George。猫です。隣でキーボードをなめているのは Biscuit。犬です。

先に言っておきます。このキーボードを壊したのは、彼ではありません。

壊したのは、前のキーボードです。

Petter Days を作ろうと思ったのは、ある普通の夜でした。うちの人間は棚の前にしゃがみ、片手に半分残ったフードの袋、もう片方にスマートフォンを持って、つぶやいていました。

「これ、いつ開けたっけ？ 今日ブラッシングした？ 前に量った体重はいくつだっけ？」

Biscuit は感動していました。人間がついに、おかわりについて真剣に考え始めたのだと。

私は心配になりました。

この二足歩行の生き物の頭には、仕事、荷物の受け取り、明日の天気、先月の爪切りの日まで入っている。

これ以上は、外付けハードディスクが必要かもしれません。

そこで、人間が寝たあと、机に飛び乗ってパソコンを開きました。

Biscuit が椅子を引きずってきました。「何するの？」

「人間のために App を作る」

「出前を頼める？」

「頼めない」

「じゃあ、要望に入れといて」`),
      section("cat-desk", "初めての起動。三度目のおかわり提案。", `明け方、開発チームが正式に発足しました。

私はプロダクトと画面、そして夜中に昨日の決定をひっくり返す担当。Biscuit はショートカットと現場テスト、そして私が決定をひっくり返したときにキーボードからどかす担当です。

一回目は、動きませんでした。

二回目は、ボタンが一つ表示されました。

三回目、Biscuit がボタンの名前を「おかわり」に変えました。

四十分の会議の末、まずは記録を作ることに。おかわりは別途協議となりました。

ペットごとにプロフィールと日々の記録を用意しました。食事、水分、体重、お手入れ。それぞれに、ちゃんと居場所を。

「僕の体重、君のプロフィールに入れられない？」と Biscuit。

「だめ」

「柔軟性が足りないね」

私は、きちんと動いている証拠だと思いました。

人間が自分のやり方で記録できるよう、カスタム項目も作りました。Biscuit はさっそく「今日はとてもいい子だった」を作り、七回入力しました。

六回分、消しました。

苦情が届きました。`, "cat-at-work"),
      section("care-debate", "お風呂反対・シニアエンジニア。", `一番長くもめたのは、ケアプランでした。

Biscuit は「お風呂の予定」と「入浴済み」は同じ扱いでいいと主張しました。お風呂を想像するだけで、すでに相当な精神的労働をしているからです。

私は、分けるべきだと主張しました。

予定は予定。本当に終わってから、完了の記録を残す。

Biscuit はしばらく黙り、自分の肩書きを「お風呂反対・シニアエンジニア」に変更しました。`, "story-bath-debate"),
      section("snack-case", "在庫が減る。容疑者は協力的。", `次は、用品管理です。

フード、おやつ、お手入れ用品。在庫と期限と購入履歴を、人間が見てわかるように。お店の棚の前で「家にもう一袋なかったっけ？」と、遠くの私たちに聞かなくて済むように。

テスト中、重大な問題が見つかりました。

おやつの在庫が、毎日減っているのです。

私はコードを三回確認しました。

Biscuit は三袋確認しました。

原因の特定には成功しました。`, "story-snack-mystery"),
      section("dog-test", "テスト会場は、水の器の横。", `NFC のショートカットは、Biscuit の自信作です。

ある日、スマートフォンとタグと水の器を並べて、私を呼びました。

「人間はお世話で手がいっぱいでしょ。記録の入口も、ここに置けないかな？」

そこで、よく使う記録をタグにつなげました。対応する iPhone をかざすと、目的の入口が開きます。内容を確かめて、保存。

Biscuit は器の周りを二十七周しました。

何のテストか聞くと、

「どの方向から近づいても、同じように使えるか」

「じゃあ、どうして五回も水を飲んだの？」

「実環境だから」

本当に、熱心な開発者です。`, "dog-at-work"),
      section("night-shift", "パソコンの熱は、開発への情熱です。", `最後の数夜は、目には見えなくても、あいまいにできないところを整えました。

ネットにつながらなくても記録できること。大切なデータを丸ごとバックアップして、好きな場所に保存できること。家族と一緒にお世話するときは、閲覧と編集の権限がはっきりしていること。

あまり面白い作業ではありません。

珍しく、Biscuit もおかわりを要求しませんでした。

一つずつ試し、眠くなったら交代で寝ました。正確には、彼は椅子で、私はパソコンの上で。翌朝、人間が機械の熱さに気づいたので、開発への情熱ということで話を合わせました。`),
      section("better-days", "納品完了。今度は私たちの番。", `人間が初めて Petter Days を使った日、特別なことは何も起きませんでした。

水を足して、一件記録。

用品を見て、今週買い足すものを確認。

お手入れが終わったら、記録。

そしてスマートフォンを置いて、私たちの隣に座りました。

Biscuit はすぐに手の下へ頭を入れました。私は通りすがりを装って、反対側に伏せました。

「どうして、もう App を使わないの？」Biscuit が小声で聞きました。

「今日のことは、記録できたから」

「それで？」

「今度は、私たちの番」

Biscuit は考えて、このプロダクトの方向性はとても正しいと判断しました。

その夜、次のアップデートに向けて、最初の要望を書きました。`, "story-off-duty"),
    ],
  },
  ko: {
    label: "개발 이야기", back: "우리가 만든 앱 둘러보기", eyebrow: "GEORGE & BISCUIT · 심야 개발팀",
    title: ["우리 사람을 위해", "앱을 만들었어요."], intro: "너무 지쳐 버릴까 봐서요.",
    roles: "Petter Days · 공동 개발냥 & 공동 개발멍", meta: "George와 Biscuit이 보호자를 위해 앱을 만들어요. 한밤의 코딩, 사라지는 간식 재고, 쓰다듬기로 받는 보수까지. 두 개발자의 이야기예요.",
    quote: "사람이 덜 바쁘고, 우리를 더 오래 쓰다듬게 하기.", afterword: "Biscuit이 몰래 두 번째 요청을 추가했어요. “한 그릇 더.”",
    art: {
      "story-midnight-build": ["밤늦게 George는 노트북으로 코딩하고 Biscuit은 옆에서 다른 키보드를 진지하게 핥는 모습", "심야 개발팀 출범. 키보드 교체 비용은 아직 예산에 없어요."],
      "cat-at-work": ["노트북 앞에서 기록과 화면의 세부 사항을 고민하는 George", "기획 담당자 생각 중. 고양이를 옮기지 마세요."],
      "story-bath-debate": ["George가 노트북의 계획을 설명하는 동안 Biscuit이 오리 장난감이 든 작은 욕조를 밀어내는 모습", "목욕에 관한 회의는 합의 없이 끝났어요."],
      "story-snack-mystery": ["George가 재고를 살피고, 입에 부스러기가 묻은 Biscuit 앞에는 빈 간식 봉지 세 개가 있는 모습", "코드는 세 번 확인. 간식은 세 봉지 확인."],
      "dog-at-work": ["물그릇 옆에서 휴대폰과 NFC 태그를 시험하는 Biscuit", "스물일곱 바퀴째. 물은 다섯 번째. 실사용 테스트예요."],
      "story-off-duty": ["휴대폰을 내려놓은 보호자 곁에 George와 Biscuit이 기대어 쓰다듬어 달라고 하는 모습", "납품 완료. 이제 보수를 받을 시간이에요."],
    },
    sections: [
      section("first-note", "이 사람에게는 기술 지원이 필요해요.", `나는 George, 고양이예요. 옆에서 키보드를 핥고 있는 친구는 Biscuit, 강아지고요.

먼저 말씀드릴 게 있어요. 이 키보드를 망가뜨린 건 Biscuit이 아니에요.

그 전 키보드였죠.

Petter Days를 만들자는 생각은 평범한 어느 저녁에 떠올랐어요. 우리 사람은 찬장 앞에 쪼그리고 앉아 한 손에는 반쯤 남은 사료 봉지, 다른 손에는 휴대폰을 들고 중얼거렸어요.

“이거 언제 뜯었더라? 오늘 빗질했나? 지난번 몸무게가 얼마였지?”

Biscuit은 감동했어요. 사람이 드디어 추가 식사를 진지하게 연구한다고 생각했거든요.

나는 걱정됐어요.

이 두 발 달린 동물의 머릿속에는 일, 택배, 내일 날씨, 지난달 발톱 깎은 날짜까지 들어 있었어요.

더 넣으려면 외장 하드가 필요할 것 같았죠.

그래서 사람이 잠든 뒤, 책상에 올라가 노트북을 켰어요.

Biscuit이 의자를 끌고 와서 물었어요. “뭐 해?”

“사람한테 줄 앱을 만들 거야.”

“배달 주문도 돼?”

“안 돼.”

“그럼 요청 목록에 넣어 둬.”`),
      section("cat-desk", "첫 실행. 세 번째 추가 식사 제안.", `다음 날 새벽, 개발팀이 정식으로 출범했어요.

나는 기획, 화면 설계, 그리고 한밤중에 어제의 결정을 뒤집는 일을 맡았어요. Biscuit은 바로가기, 현장 테스트, 그리고 내가 결정을 뒤집을 때 키보드에서 나를 옮기는 일을 맡았고요.

첫 번째 실행은 실패했어요.

두 번째에는 버튼 하나가 나타났어요.

세 번째에는 Biscuit이 버튼 이름을 “한 그릇 더”로 바꿨어요.

사십 분 동안 회의한 끝에 결정했어요. 기록부터 만들고, 추가 식사는 나중에 논의하기로요.

반려동물마다 프로필과 일상 기록을 마련했어요. 식사, 물, 체중, 털 관리가 저마다 자리를 찾았죠.

Biscuit이 제안했어요. “내 몸무게를 네 프로필에 넣으면 안 돼?”

“안 돼.”

“유연성이 부족한 기능이네.”

나는 그게 잘 작동한다는 증거라고 생각했어요.

사람이 자기 방식대로 기록할 수 있도록 사용자 지정 항목도 만들었어요. Biscuit은 곧바로 “오늘 아주 착했음”을 만들어 일곱 번 입력했어요.

여섯 개를 지웠어요.

민원이 들어왔어요.`, "cat-at-work"),
      section("care-debate", "목욕 반대 수석 엔지니어.", `가장 오래 논쟁한 건 돌봄 계획이었어요.

Biscuit은 “목욕 예정”과 “목욕 완료”를 같은 것으로 쳐야 한다고 주장했어요. 목욕을 생각하는 것만으로도 이미 엄청난 정신노동을 했다는 거예요.

나는 구분해야 한다고 했어요.

계획은 계획. 실제로 끝낸 다음에 완료 기록을 남기는 거죠.

Biscuit은 잠시 말이 없더니 자기 직함을 “목욕 반대 수석 엔지니어”로 바꿨어요.`, "story-bath-debate"),
      section("snack-case", "줄어드는 재고. 협조적인 용의자.", `그다음에는 용품 관리를 만들었어요.

사료, 간식, 관리 용품. 재고, 유효기간, 구매 내역을 사람이 알아보기 쉽게 정리했죠. 가게 진열대 앞에서 멀리 있는 우리에게 “집에 한 봉지 더 있지 않았나?” 하고 묻지 않아도 되도록요.

테스트 중에 심각한 문제가 발견됐어요.

간식 재고가 매일 줄어들고 있었어요.

나는 코드를 세 번 확인했어요.

Biscuit은 세 봉지를 확인했어요.

원인 파악은 아주 성공적이었어요.`, "story-snack-mystery"),
      section("dog-test", "테스트 장소: 물그릇 옆.", `NFC 바로가기는 Biscuit이 가장 자랑하는 작품이에요.

어느 날 휴대폰, 태그, 물그릇을 나란히 놓고 나를 불렀어요.

“사람은 우리 돌보느라 손이 바쁘잖아. 기록하는 입구도 바로 옆에 두면 안 될까?”

그래서 자주 쓰는 기록을 태그와 연결했어요. 호환되는 iPhone을 가까이 대면 해당 바로가기가 열리고, 내용을 확인한 뒤 저장할 수 있게요.

Biscuit은 물그릇 주위를 스물일곱 바퀴 돌았어요.

뭘 테스트하느냐고 물었어요.

“어느 방향에서 다가가도 똑같이 편한지.”

“그런데 왜 물은 다섯 번 마셨어?”

“실사용 환경이니까.”

정말 몰입하는 개발자예요.`, "dog-at-work"),
      section("night-shift", "노트북이 뜨거운 건 개발 열정이에요.", `마지막 며칠 밤에는 눈에 보이지 않아도 대충 넘길 수 없는 것들을 챙겼어요.

인터넷이 없어도 기록할 수 있어야 해요. 중요한 자료는 원하는 곳에 전체 백업으로 저장할 수 있어야 하고요. 가족이 함께 우리를 돌볼 때는 누가 보고 수정할 수 있는지도 분명해야 하죠.

별로 재미있는 작업은 아니었어요.

드물게도 Biscuit은 추가 식사를 요청하지 않았어요.

하나씩 시험하고 졸리면 번갈아 잤어요. 정확히는 Biscuit은 의자에서, 나는 노트북 위에서 잤죠. 다음 날 사람이 기계가 왜 이렇게 뜨겁냐고 하길래, 개발 열정 때문이라고 입을 맞췄어요.`),
      section("better-days", "납품 완료. 이제 우리 차례예요.", `우리 사람이 처음 Petter Days를 썼을 때, 대단한 일은 일어나지 않았어요.

물을 채우고 기록 하나를 남겼어요.

용품을 확인하고 이번 주에 뭘 사야 할지 알았어요.

돌봄을 마치고 기록했어요.

그리고 휴대폰을 내려놓고 우리 곁에 앉았어요.

Biscuit은 바로 손 아래로 머리를 들이밀었어요. 나는 지나가는 척하다가 반대편에 엎드렸고요.

“왜 우리 앱을 더 안 쓰지?” Biscuit이 작게 물었어요.

“오늘 일은 다 기록했으니까.”

“그래서?”

“이제 우리 차례라는 거야.”

Biscuit은 잠시 생각하더니 이 제품의 방향이 아주 옳다고 판단했어요.

그날 밤, 다음 업데이트의 첫 번째 요청을 적었어요.`, "story-off-duty"),
    ],
  },
};
for (const [locale, story] of Object.entries(storyContent)) {
  const title = story.title.join(locale.startsWith("zh") || locale === "ja" ? "" : " ");
  story.page = { title, searchTitle: story.label, intro: story.meta, sections: story.sections };
}
