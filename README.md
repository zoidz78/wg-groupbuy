# WG团购群 — 团购收款看板

一个简单的、自托管的收据风格看板，用于追踪团购订单和收款情况。为
WG团购群制作，但换一套数据后也可用于任何团购。

**在线地址：** https://zoidz78.github.io/wg-groupbuy/

## 功能

- 卡片式排版：统计信息、每位成员、备货清单分别独立成卡片，手机上
  一屏可看到 2～3 张卡片
- 界面右上角有 **中文 / EN 双语切换**（仅切换管理界面上的按钮、标
  签这些文字；成员姓名、商品名称、复制出去的付款消息/到货通知等
  "数据"永远是中文，因为买家看到的是这些消息，不是管理界面）。切
  换会记在这台设备上，下次打开自动保持上次选的语言
- 按口味/商品逐一列出每位成员的订单明细，附单项小计和个人总计；
  如果某个商品在送货日被调整过，调整那一行会**紧跟在该商品自己
  那一行下面**，不再统一堆在最后
- 每件商品名称前会自动带上对应的表情图标（🍑水蜜桃、🐔鸡肉、🥟馄
  饨等），新商品也能根据关键词自动匹配到合适的图标，不需要逐个手
  动设置（详见下方"商品表情图标"）
- 每位成员前面带一个序号，和接龙里的顺序一致，方便对照原始接龙记
  录（现场加购的人不在接龙里，所以不带序号）
- 一键标记付款状态（"标记已付款" / "已付款 ✓"），**所有打开此链接
  的人实时共享同一份付款状态**（详见下方"共享实时收款状态"）
- 每位成员卡片上有一个独立的 **"✏️ 编辑调整"/"完成编辑"** 按钮，
  不用再滚动到底部工具栏才能进入编辑模式（工具栏原来的按钮仍然保
  留，两者是同一个开关）
- **打包状态**：每位成员卡片上有独立的"打包"按钮，和付款状态互不
  影响（可以已打包未付款，也可以已付款未打包），统计卡片上会显示
  "已打包 X / Y 人"
- **逐件分拣勾选**：进入编辑模式后，每一行商品前有一个可勾选的
  ⬜/✅，方便几个人分头实际拣货时互相看到进度；完全缺货的那一行会
  直接显示 ❌ 代替勾选框（没东西可拣了），部分到货的行会带一个
  ⚠️ 部分到货 的小标记
- **商品数量的四种就地编辑方式**（进入编辑模式后，直接点某一行商
  品即可，不用再打开旧的"+ 调整"表单）：
  - 普通商品：+/− 加减器，外加一个"缺货"快捷按钮
  - 按重量计价、或整包按重量分装的商品：输入实际到手克数，系统按
    **10g** 向下取整（约定俗成不多收）自动换算成对应数量；也可以
    切换成"没有秤？改用数颗数"
  - 按箱/份分装、每份重量不固定的商品（例如葡萄论串卖、一箱几串
    分给几个人）：输入这一份的重量和整箱重量，按比例自动算出应付
    金额；同一箱后面登记的人会自动带出前一个人填过的整箱重量
  - 按固定颗数分装、部分损坏或短少的商品：直接填实收颗数 / 应收颗
    数，按比例折算金额
  - 旧的"+ 调整"表单仍然保留在编辑模式下作为备用，两者写入的是同
    一种记录，撤销、报表、付款消息的显示方式完全一样
- 每位成员卡片上有 **"💬 复制付款消息"** 按钮，一键复制一段可直接
  粘贴到微信的收款消息——包含该成员的订单明细、送货日调整说明
  （例如短缺、退款）和应付总额（详见下方"复制付款消息"）
- 页面顶部有更醒目的 **"📢 复制到货通知"** 按钮，一键复制一条 @ 全员
  的取货通知，方便直接发到群里（详见下方"复制到货通知"）
- 顶部统计卡片：参团人数、订单总额、已收款、未收款、已打包
- **商品查询 & 备货清单**：显示每种口味/商品总共需要订购的数量；
  卡片上方有一个下拉菜单，**只列出本场实际有人订的商品**（没人订
  的商品不会出现），选中某个商品后，下方会切换成显示这个商品是谁
  订的、每人订了多少份，并给出小计；备货清单里的**每一行商品也可
  以直接点击**，同样会弹出这份认购明细，点击弹窗任意处关闭。商品
  很多（三四十种起）时，完整清单默认**收起**，显示成一行"📋 查看
  全部商品备货清单（N 种商品）"，点开再看，避免一屏全是密密麻麻
  的表格；切换场次会自动重新收起
- **缺货/退货明细（供索赔）卡片**：只要本场有商品被记录为短少，
  就会在商品查询下方自动出现这张卡片，按商品汇总短了多少、该退多
  少钱、影响了谁（附备注），损失最大的排最前面，并给出应退合计；
  没有短货时这张卡片完全不显示
- 按 全部 / 未付款 / 已付款 筛选，外加**门牌/地址下拉**（107 /
  109 / 印度小店 / 后门）和**姓名搜索框**，三者可以同时叠加使用
- **会员** 标签页（在所有场次标签的最右边）：汇总每位成员**当前欠
  款**（跨过去所有场次未付款部分相加，不是历史总消费），按欠款金
  额从高到低排序，方便追欠款
- 支持多场团购，超过一场后以标签页形式切换（按日期排序）；**已结
  束的场次标签会自动上色**——全部收款完成显示绿色，还有人未付款
  显示红色，未来/当天进行中的场次不上色
- 自动浅色/深色模式，手机和电脑均适配
- 送货日调整：短缺、退款/补款、现场加购都可以在页面上直接记录，
  金额自动重新计算（详见下方"送货日调整"）
- **全部收款后自动锁定**：一场团购里所有人都标记已付款后，会自动
  锁定该场——不能再改付款状态、加调整或加新买家，防止误触。需要
  修改时，输入编辑密码即可解锁（详见下方"全部收款后自动锁定"）
- **门牌管理**：可以记录每位成员的楼栋/门牌号，方便安排配送——
  会直接显示在每位成员的卡片上（拥有链接的任何人都能看到），但
  绝不会出现在仓库文件里，也绝不会出现在付款消息或到货通知里
  （详见下方"门牌管理"）
- 一键导出报告：紧凑的表格形式，可打印或另存为 PDF，不会因为人数
  多而变成好几页
- 工具栏 **"🔄 刷新"** 按钮：手动重新加载整个页面。保存到 iOS 主屏
  幕、以"网页 App"方式打开时没有 Safari 那个下拉刷新的手势（这个
  手势属于 Safari 的界面外壳，全屏网页 App 里没有），这个按钮就是
  用来代替它的（详见下方"排查：主屏幕网页 App 没法下拉刷新"）

## 文件说明

| 文件 | 作用 |
|---|---|
| `index.html` | 整个应用程序——读取 `manifest.json` 及其引用的 `data-*.json` 文件，并通过 Firebase 读写付款状态。通常不需要改动这个文件。 |
| `manifest.json` | 列出所有团购场次：`{ date, label, file }`。日期最新的排在最前面。 |
| `data-<日期>.json` | 每场团购一个文件：商品、价格，以及每位成员的订单。 |
| `product-emoji-map.json` | 关键词 → 表情图标对照表，决定每个商品名称前显示哪个图标。可以随时扩充。 |
| `message-template.json` | "复制付款消息"/"复制到货通知"生成文字用的模板——问候语、每行明细的措辞、结尾语等。想改消息的措辞，改这个文件就够了，不需要碰 `index.html`。 |

`product-catalog.json` 是 Claude 内部使用的商品参考表（记录商品短
键、上次价格、称重方式等），**从不部署到网站上**，`index.html` 也
不会读取它，纯粹方便下次新建数据文件时对照。

付款状态**不**存放在仓库的任何文件里——它实时存放在 Firebase
Firestore 中，见下方说明。

## 新增一场团购

1. 新建一个 `data-<日期>.json` 文件（结构见下方"数据结构"部分）。
2. 在 `manifest.json` 中添加一行：
   ```json
   { "date": "2026-09-14", "label": "9/14", "file": "data-2026-09-14.json" }
   ```
3. 把这两个文件都上传到本仓库（Add file → Upload files）。
   `index.html` 不需要改动。

`manifest.json` 中有 2 场以上的记录时，页面顶部会自动出现标签页，可
以在不同场次的团购之间切换。

**如果 `data-<日期>.json` 里有格式错误或笔误**（手打 JSON 很容易漏
掉一个逗号、引号或括号，或者某位成员的 `items` 里写错了商品的短
键）：
- 如果是 JSON 格式本身有问题（漏逗号/括号等），点开那个标签页会
  显示一条清楚的错误提示（说明具体哪里解析失败），而不是卡住不
  动或什么都不显示，其他标签页照常使用。
- 如果 JSON 格式没问题，但某位成员的 `items` 里的商品短键在
  `products` 里找不到（拼错了、或者改名/删除了），那一行会显示
  "⚠️ 商品未找到，请检查 data 文件"，而不是整个页面卡死打不开——
  这类问题以前会导致所有人都无法点开页面，现在只会在那一行显示
  提醒，方便你回去核对修正。

## `data-<日期>.json` 数据结构

```json
{
  "groupName": "WG团购群",
  "itemsLabel": "小馄饨团购",
  "products": {
    "sig": { "label": "招牌鲜肉馄饨", "price": 6.5 },
    "pork_belly": { "label": "五花肉", "price": 12.0, "unit": "kg" },
    "peach": { "label": "彩虹油蟠桃", "price": 8.0, "unit": "kg", "weighMode": "weight", "gramsPerUnit": 1000 },
    "tangerine_seedless": { "label": "无籽蜜橘(2kg/包)", "price": 10.0, "weighMode": "weight", "gramsPerUnit": 2000 },
    "grape_jufeng": { "label": "辽宁巨峰(3串/箱)", "price": 25.0, "weighMode": "proportional" },
    "pear_box": { "label": "香梨(4粒/份)", "price": 12.0, "piecesPerUnit": 4 }
  },
  "orders": [
    { "name": "小明", "items": { "sig": 3 } },
    { "name": "小华", "items": { "sig": 1, "shrimp": 1 } },
    { "name": "阿强", "items": { "pork_belly": 0.5 } },
    { "name": "小美 & 阿杰", "items": { "corn": 2 } }
  ]
}
```

- `itemsLabel`（可选）——一句话描述这场团购是什么（例如"小馄饨团购"），仅供页面顶部
  的"📢 复制到货通知"按钮使用；不填的话会退化成"{场次标签}团购"（例如"9/1团购"），
  不会再把所有商品名称列出来。
- `products` —— 短键 → 商品信息：
  - `label`（中文名）、`price` 必填。
  - `unit`（可选）——默认是`"盒"`，商品按重量或其他非盒装单位出售时需明确设置
    （例如`"kg"`）。
  - `weighMode`（可选）——决定这个商品在编辑模式下用哪种就地编辑器：
    `"weight"` 用实际到手克数编辑器，`"proportional"` 用按箱分摊比例编辑器；
    不填就默认用普通 +/− 加减器。
  - `gramsPerUnit`（可选）——`weighMode:"weight"` 商品每单位对应多少克（例如
    `"kg"` 商品填 `1000`，"无籽蜜橘(2kg/包)"这种整包商品填 `2000`）；不填的话
    会尝试从 `unit`/`label` 里的重量文字自动猜，但明确写出来更可靠。
  - `piecesPerUnit`（可选）——这个商品一份/一箱包含几颗/几件，用于按颗数折算
    金额的编辑器（部分损坏、部分短少时用）。
  - 这几个字段都是可选的——旧的、没有这些字段的数据文件完全兼容，所有商品会
    退化成普通的 +/− 加减器，不会出错。
- `orders` —— 每条明细对应一笔要收的款。`items` 里的数量可以是小数
  （例如`0.5`表示半份/半公斤）。
- **合并订单**：如果两位成员一起拼单、并作为一笔总款支付，用**一
  条**记录、姓名合并成一个字符串表示，例如`"name": "小美 & 阿杰"`。
- **价格/品种缺失或待确认的商品**：如果某件商品价格暂时无法确定
  （例如价目表上没有，或指代不清楚），仍然把它加进该成员的
  `items` 里，但在 `products` 中把该商品的 `"price"` 设为 `null`，
  并加上 `"unverified": true`。页面会把这类商品用黄色高亮显示，标
  注"缺失/待确认"，金额显示为"待确认"且不计入任何总额，页面顶部
  也会出现提醒横幅。确认好价格后，把 `price` 改成实际数字并删除
  `unverified` 字段即可。

## 共享实时收款状态（Firebase）

付款状态通过 **Firebase Firestore** 实时同步——任何人打开这个链
接标记付款，其他所有正在查看的人都会立刻看到更新，不需要手动刷
新。这也是打包状态、分拣勾选、门牌信息和送货日调整共用的同一套
实时机制。

- **Firebase 项目**：WG Group Buy（`wg-group-buy`）
- **数据结构**：每场团购一个 document（用日期作为 document ID）：
  - `paidStatus` —— 每位成员的姓名 → `true`/`false`，外加一个特殊字段
    `__locked`（该场是否已全部收款自动锁定）
  - `packedStatus` —— 每位成员的姓名 → 是否已打包
  - `sortedItems` —— key 是 `成员姓名::商品短键`，值是是否已勾选分拣
  - `adjustments` —— 每条送货日调整一个自动生成的 ID
  - `memberInfo/directory`（单一 document，不按日期分）—— 每位成员的门牌号
- **前端接入方式**：`index.html` 中直接内嵌了 Firebase 的
  `firebaseConfig`（apiKey、projectId 等）。这些值本身不是密钥、公
  开也没关系——真正的访问控制由下面的安全规则决定，而不是靠隐藏
  这些配置
- **Firestore 安全规则**（Firebase 控制台 → Firestore Database →
  Rules，完整版见仓库里的 `firestore-rules.md`）：

  ```
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /paidStatus/{groupBuyDate} {
        allow read, write: if true;
      }
      match /adjustments/{groupBuyDate} {
        allow read, write: if true;
      }
      match /packedStatus/{groupBuyDate} {
        allow read, write: if true;
      }
      match /sortedItems/{groupBuyDate} {
        allow read, write: if true;
      }
      match /memberInfo/{docId} {
        allow read, write: if true;
      }
    }
  }
  ```

  这条规则开放了以上五个 collection 的读写权限给任何拥有链接的
  人，项目里其他数据不受影响。

- 如果页面顶部出现红色的 🔧 提示条，说明 Firestore 读取或写入时
  出错了，提示条会显示具体的错误信息，方便排查。

### 排查：两台设备数据对不上

如果推送更新后，短时间内不同设备显示的付款状态不一致，通常是
GitHub Pages 的 CDN 缓存还没刷新到最新的 `index.html`——等一两分
钟，或者用无痕/私密窗口重新打开链接（绕过缓存）即可自行恢复。如
果等待后依然不一致，检查页面源码里是否包含 `firebase` 字样，确
认线上确实是最新版本。

### 排查：主屏幕网页 App 没法下拉刷新

把这个页面保存到 iOS 主屏幕后（分享 → 添加到主屏幕），打开时是全
屏显示、没有 Safari 的地址栏和工具栏——这种全屏模式下，下拉刷新
这个手势本身就不存在，它是 Safari 界面自带的功能，不属于网页本
身，所以不管怎么下拉都不会有反应，这不是这个页面的 bug。用工具栏
里的 **"🔄 刷新"** 按钮即可手动重新加载整页；如果按了之后内容看起
来还是旧的，通常还是上面那条"两台设备数据对不上"里说的 CDN 缓存
问题，多等一两分钟或强制退出这个网页 App 再重新打开一次即可。

## 送货日调整（短缺 / 退款补款 / 现场加购）

接龙下单和实际送货之间经常会出现差异：少了一份、需要退款、或是现
场多卖了一些。这些调整**不会**修改原始的 `data-<日期>.json`——它
们和付款状态一样，实时存放在 Firebase Firestore 的 `adjustments`
collection 里，每场团购一个 document，作为原始订单之外的第二层记
录，方便随时对照"当初订了什么"和"最后实际收了多少钱"。

**日常使用最快的方式：** 进入编辑模式后（点任意一张成员卡片上的
"✏️ 编辑调整"，或底部工具栏同名按钮，首次需要输入编辑密码），**直
接点某一行商品**即可弹出对应的就地编辑器（普通加减器 / 称重 /
按箱分摊 / 按颗数——具体是哪一种由这个商品在 `data-<日期>.json`
里的 `weighMode`/`piecesPerUnit` 决定，见上方"数据结构"），填好保
存即可，金额自动按下面的规则换算，不需要手动心算。

**称重类商品的取整规则：** 输入实际到手克数后，系统按 **10g**（不
是100g）**向下取整**（约定俗成不多收买家的钱，例如1395g按1390g
算）。由此算出的金额如果出现零头（例如0.33kg×$22=$7.26这种），
还会再按 **1 角** 向下取整——应收的钱只会往下取整、退款只会往下取
整变得更多，两个方向都对买家有利。同一个人同一件商品第二次修改
时，会在上一次修改后的基础上继续换算，不会重复计算。

如果情况比较复杂（例如很多人的订单都要调整），也可以把送货情况
讲给 Claude，让它生成一段调整记录的 JSON，再粘贴进工具栏的
**"📋 批量导入调整"** 面板一次性套用；旧的逐条填写的 **"+ 调整"**
表单也仍然保留作为备用，两者写入的记录格式完全一样。

每条调整记录旁边都有 **"撤销"** 链接，可以随时移除。

以上这些编辑操作，在该场团购**全部收款并自动锁定**后会暂时无法使
用——见下方"全部收款后自动锁定"。

## 打包与分拣

- **打包**：每位成员卡片上有一个独立的"打包"按钮，和"标记已付款"
  互不影响、互不依赖——存在自己的 `packedStatus` collection 里，
  任何人都能点，不需要先解锁编辑模式。统计卡片上会显示"已打包
  X / Y 人"。
- **分拣勾选**：进入编辑模式后，每一行商品前面会出现 ⬜/✅ 勾选
  框，方便几个人分头去实际拣货时，互相看到哪些已经拣好了——存在
  `sortedItems` collection 里，同样是实时共享、任何人可点，和付
  款、调整完全独立，纯粹是"东西有没有物理上拣出来"的记录，不影响
  任何金额。已经彻底缺货的商品（数量归零）不会显示勾选框，而是直
  接显示 ❌（没东西可拣），部分到货的商品仍显示勾选框，但会带一个
  ⚠️ 部分到货 的提醒。

## 全部收款后自动锁定

当一场团购里**所有人都被标记为已付款**后，页面会自动锁定这一场：
不能再标记/取消付款、不能加送货日调整、也不能新增买家，防止团购
结清之后被误触改动（打包和分拣状态不受锁定影响，随时可以继续操
作）。

- 锁定状态是**所有人共享**的——存在 Firebase 里，和付款状态一
  样，不是某一台设备自己的状态，刷新页面也不会解锁。
- 锁定后，底部工具栏的"✏️ 编辑调整"按钮会变成 **"🔓 解锁"**，点
  开后输入编辑密码（和送货日调整用的是同一个 `EDIT_PIN`）即可解
  锁，所有人立刻看到解锁后的状态。即使这台设备之前已经输入过一次
  密码，解锁这一步仍然需要重新输入——这是有意为之，避免"结清后误
  改"这件事变得太随意。
- "💬 复制付款消息""📢 复制到货通知""🖨️ 导出报告"这几个只读/复
  制类的按钮不受锁定影响，随时可用。

## 已结束场次的标签颜色

日期已过的场次，标签页会自动上色，方便一眼看出哪几场还有尾款没
收：全部收款完成显示**绿色**，还有人没付款显示**红色**；当天或未
来的场次一律不上色（算作"还没到日子"）。当前选中的那个标签始终
保持原来的深色高亮，颜色只体现在没被选中的标签上。这个颜色只根据
接龙原始名单里的人算的，现场加购的人（走的是调整记录）暂不计入，
是有意保留的小限制。

## 会员（欠款汇总）

标签栏最右边有一个 **"会员"** 标签，汇总每位成员**当前未结清**的
金额——把过去每一场里还没标付款的部分加总起来，不是这个人的历史
总消费。按欠款从多到少排序。这个统计是打开这个标签时才现算的（不
是每次开页面都算一遍），算过一次后本次浏览就不用再重算。带"测
试"字样日期的场次（例如 9/10测试(v2)）不会计入，避免测试数据污染
真实欠款。

## 门牌管理

可以为每位成员记录一个楼栋/门牌号（自由文本，例如"12栋 06-02"），仅用于
安排配送顺序。这是和真实姓名绑定的真实地址信息，所以特意和其他数据分开
处理：

- **不会出现在这个仓库的任何文件里**——和 `index.html`、`data-<日期>.json`
  这些不一样，门牌信息完全存放在 Firebase Firestore 里（`memberInfo` 这个
  collection），不会被推送到 GitHub，也不会留在仓库的历史记录里。（它仍然
  和付款状态、调整记录一样，对拥有链接的任何人开放读写——只是不会因为有
  人翻看 GitHub 仓库而被看到。）
- **绝不会出现在"复制付款消息"或"复制到货通知"里**——这两个按钮生成的文
  字完全不会读取门牌信息。
- **所有场次共用同一份**，不需要每场团购重新填一次。
- **会直接显示在每位成员的卡片上**——只要填了，打开链接的任何人都能看
  到（和页面上其他内容一样的公开程度）。**修改**门牌号仍然需要先解锁编
  辑模式：点击底部工具栏的 **"🏠 门牌管理"**（需要编辑密码），看到本场
  每位成员的门牌号输入框，填好后点"保存"，所有人立刻看到最新数据。
- 新增买家（走场加购）表单里，如果输入的名字和门牌名录里已有的成员同
  名，地址会自动带出来（只在地址框还是空的时候才会自动填，不会覆盖手
  动填的内容）。

**首次使用前需要在 Firebase 控制台加一条新规则**（Firestore Database →
Rules），因为这是一个全新的 collection：

```
match /memberInfo/{docId} {
  allow read, write: if true;
}
```

加在现有规则旁边即可（完整规则见 `firestore-rules.md`）。没加这条规则之
前，点开"🏠 门牌管理"会看到红色的 🔧 错误提示。

## 商品表情图标（`product-emoji-map.json`）

每个商品名称前显示的图标，是根据商品的中文名称从 `product-emoji-map.json`
里按关键词自动匹配出来的（例如名称里带"水蜜桃"会匹配到 🍑，带"馄饨"会
匹配到 🥟），不需要给每个商品手动挑图标。

- 如果新商品匹配不到任何关键词，会显示默认的 🛒 图标——这不是错误，只是
  说明这个商品的名称还没有被这个表格覆盖到。
- 想让它匹配上，把新增团购的具体商品名称发给 Claude，让它把合适的关键词
  加进 `product-emoji-map.json`（加进已有分类，或者新增一个分类都可以），
  再把更新后的文件上传到仓库根目录即可，`index.html` 不需要改动。

## 复制付款消息（`message-template.json`）

每位成员卡片上的 **"💬 复制付款消息"** 按钮，会把该成员的订单明细、任何
送货日调整（附原因，例如"到货少一份"为一个短缺）和应付总额，拼成一段可以直接粘贴
进微信对话或群聊的文字，点一下就复制到剪贴板。这个和"标记已付款"按钮是
两回事——谁去收款、谁去核对付款状态，可以是两个人分工，互不影响；打印/
导出 PDF 的留档功能也完全不受影响。

格式和这个群平时手写的收款消息一致（不带表情图标；金额前带"$"符号）。示例
（**未付款**状态，"@小美"为示意用的化名，不是真实成员）：

```
@小美

彩虹油蟠桃  $16（2044g）
蜂糖李  $6.7（673g）
哈密瓜  $6.5
青龙菜  $3.5
土鸡蛋  $9.3

一共$42～

Paynow 93395373 /ZHAO JIE
```

如果这位成员的某件商品在送货日被调整过，调整那一行会紧跟在**该商品自己
那一行**下面（而不是统一堆在所有商品明细的最后），例如：

```
@小明

哈密瓜 x2盒  $13
↳ 哈密瓜 -1盒（到货少一份） -$6.5
土鸡蛋  $9.3

一共$9.3～
```

最后的收款方式那一行（`closingUnpaid`）只在这位成员**还没付款**时才会出现；
一旦标记已付款，这段消息就不再显示收款方式（`closingPaid`，目前留空）。这两
行都在 `message-template.json` 里，可以自由改成任何收款方式或留空。

消息的**措辞**（问候语怎么说、每行怎么写、结尾语等）存放在
`message-template.json` 里，和商品数据、价格、调整记录是分开的——想改
措辞，只需要编辑这个文件再重新上传，不需要碰 `index.html`。文件里每个
字段的说明和用法，都写在它自己的 `description` 字段里。

## 复制到货通知（`📢 复制到货通知`）

页面顶部（团购名称正下方）有一个更醒目的按钮 **"📢 复制到货通知（@全员）"**，
用来通知全群"东西到了，可以来拿"，和上面按成员单独收款的消息是两回事。点一
下会复制：

```
@小明 @小华 @阿强 ...（本场所有成员，接龙顺序）

小馄饨团购到啦，欢迎来06-02自取，需要送货小群联系～
```

- 会 @ 到本场每一位成员（按接龙顺序，包含现场加购的人），不看是否已付款——这
  条是通知取货，不是收款。
- "小馄饨团购"这类描述这次到货是什么的短语，来自该场 `data-<日期>.json` 里的
  `itemsLabel` 字段（新建一场团购时顺手填一下，参考上面"数据结构"部分）；没填
  的话会退化成"{场次标签}团购"（例如"9/1团购"），不会再把所有商品名称列出来——
  品种很多的一场如果忘了填 `itemsLabel`，也不会变成一长串读不出来的文字。
- "06-02" 这类取货地点，存放在 `message-template.json` 的 `pickupLocation` 字
  段里——这个一般是固定的，不需要每场都改。
- 其余措辞同样在 `message-template.json` 里，改法和上面"复制付款消息"一样。

## 商品查询（谁订了这个商品）

想知道某个商品一共谁订了、订了多少，有两种入口，都会弹出同一份明细：

1. **商品查询** 卡片上方的下拉菜单——只列出**本场实际有人订**的商品（没
   人订的商品不出现），选一个即可看到每个买家的姓名和数量，以及小计。
2. **备货清单里的任意一行也可以直接点**（不用先去下拉菜单里找），弹出同
   样的明细弹窗，点弹窗任意处关闭。

商品种类多（三四十种起）时，默认只显示一行"📋 查看全部商品备货清单（N
种商品）"的收起状态，点开才展开完整表格，避免刷屏；切换到别的场次会自动
重新收起。

## 导出报告

点击 **"🖨️ 导出报告（PDF/打印）"** 会打开浏览器的打印对话框，显
示一份紧凑的表格版报告——不论当前的筛选状态如何，都会列出所有成
员，附带每人的明细、金额、付款状态，以及备货清单。可以直接打印，
或在打印对话框里选择"存为 PDF"保存文件。这个表格式排版是特意和
屏幕上的卡片式排版分开设计的，人数较多时也不会变成好几页。

## 补充说明

- 管理界面上的按钮、标签等文字支持中/英双语切换（右上角的切换
  开关），但成员姓名、商品名称、送货日调整的备注，以及复制出去的
  付款消息/到货通知，永远保持中文——因为买家看到的是这些内容，不
  是管理界面本身。新增的界面文字（按钮、提示语等）请同时给出中英
  两个版本；新增的商品名称、备注等数据类文字保持中文即可。
- 页面最底部一行小字（例如"v1.13.0"）是这个页面代码的版本号——
  每次 Claude 改动 `index.html` 都会往上加一点，方便部署后一眼确认线上跑
  的是不是预期的版本，不需要打开开发者工具。和这场团购的日期、订单数据
  完全无关，纯粹是代码本身的版本标记。
- 称重商品的取整规则是向下取整到最近的 **10g**（不是100g）——1395g按
  1390g算，始终对买家有利。
- 曾经尝试过用 Claude Artifact（`window.storage`）来实现跨设备共
  享付款状态，但受限于 Anthropic 平台当时一个已知的 postMessage
  跨域问题（已公开报告：`anthropics/claude-code#42064`），未能稳
  定工作，因此改为现在的 GitHub Pages + Firebase 方案。

## 托管方式

本仓库通过 **GitHub Pages** 提供服务（Settings → Pages → Deploy from
branch → `main` / root）。推送到 `main` 分支后，线上页面会在一分钟
左右自动更新。

---

# WG Group Buy — Payment Collection Dashboard

A simple, self-hosted, receipt-style dashboard for tracking group-buy
orders and payment status. Built for WG团购群 (the "WG Group Buy"
chat), but works for any group buy once you swap in your own data.

**Live site:** https://zoidz78.github.io/wg-groupbuy/

## Features

- Card-based layout: the summary stats, each member, and the stocking
  list are each their own card — on mobile you can see roughly 2–3
  cards per screen
- A **Chinese / EN toggle** in the top corner switches the admin UI's
  own labels and buttons only — member names, product names, and
  anything copied out as a payment message or arrival announcement
  stay Chinese regardless of this toggle, since buyers read those
  messages, not the admin UI. The choice is remembered per device
- Lists each member's order itemized by flavor/product, with a
  per-item subtotal and a personal total; if an item was corrected on
  delivery day, that adjustment line now sits directly under the item
  it corrects, instead of being dumped in a block at the end
- Every product name gets an emoji prefix looked up automatically by
  keyword (🍑 for peaches, 🐔 for chicken, 🥟 for dumplings, etc.) —
  new products get matched automatically too, no manual tagging
  needed (see "Product emoji icons" below)
- Each member shows a serial number matching their position in the
  original 接龙, to make cross-checking against the raw WeChat thread
  easy (walk-ins added on delivery day aren't numbered, since they
  were never part of the 接龙)
- One-tap paid-status toggle ("标记已付款" / "已付款 ✓" — "Mark
  paid" / "Paid ✓"), and **paid status is shared live across
  everyone who opens the link** (see "Shared live payment status"
  below)
- Each member's card has its own **"✏️ 编辑调整" / "完成编辑"**
  (edit) toggle — no need to scroll to the bottom toolbar to enter
  edit mode (the original toolbar button is still there too; both
  flip the same shared edit mode)
- **Packing status**: an independent "打包" (packed) toggle per
  member card, tracked separately from paid status (a member can be
  packed-not-paid or paid-not-packed) — shown in the stats ticket as
  "已打包 X / Y 人"
- **Per-item sorting checkboxes**: in edit mode, every item line gets
  a ⬜/✅ tick, so several people physically pulling stock can see each
  other's progress in real time. A fully-shortaged item shows ❌
  instead of a checkbox (nothing left to pull); a partial shortage
  keeps the checkbox plus a small ⚠️ 部分到货 flag
- **Four inline ways to correct a product's quantity** (in edit mode,
  tap the item line directly — no need to open the older "+ 调整"
  form):
  - Plain products: a +/− stepper with a "缺货" (shortage) shortcut
  - Weight-priced or bagged-by-weight products: type the actual grams
    received, rounded down to the nearest **10g** (never rounds up)
    and converted to the right quantity automatically; can switch to
    "没有秤？改用数颗数" (no scale? count pieces instead)
  - Box-shared products where each portion's weight varies (e.g.
    grapes sold by bunch out of a shared box): enter this portion's
    weight and the box's total weight, and the price is computed
    proportionally — the next person sharing the same box gets the
    total weight pre-filled from the first entry
  - Fixed-piece-count products with partial damage/shortage: enter
    pieces received vs. pieces expected, and the price is prorated
  - The older "+ 调整" form still works in edit mode as a fallback —
    both write the exact same record, so undo, reports, and payment
    messages behave identically either way
- Each member's card has a **"💬 复制付款消息"** (copy payment
  message) button that copies a ready-to-paste WeChat message with
  their itemized order, any delivery-day adjustments (with the
  reason, e.g. a shortage), and the total due (see "Copy payment
  message" below)
- A more prominent **"📢 复制到货通知"** button at the top of the page
  copies a single "come collect it" message that @mentions every
  member, ready to post to the group (see "Arrival announcement"
  below)
- Top stats ticket: number of members, order total, collected,
  outstanding, and packed count
- **Product lookup & stocking list**: shows the total quantity needed
  for each flavor/product. A dropdown above the stocking list shows
  **only products actually ordered this round** — picking one swaps
  the panel below to show exactly who ordered it, how much each
  person ordered, and a subtotal. Every row in the stocking list
  itself is also tappable and pops up that same breakdown; tap
  anywhere on the popup to close it. When a round has a lot of
  distinct products (30-40+), the full list starts **collapsed**
  behind a "📋 查看全部商品备货清单（N 种商品）" summary line, to
  avoid a wall of tables — it re-collapses whenever you switch rounds
- **Shortage/refund summary card**: whenever a round has any item
  recorded as short on delivery, a "缺货/退货明细（供索赔）" card
  appears below the product lookup, aggregating the shortfall by
  product — quantity short, refund owed, and who was affected —
  biggest loss first, plus a total refund line. Hidden entirely when
  nothing is short
- Filter by All / Unpaid / Paid, plus a **block/address dropdown**
  (107 / 109 / 印度小店 / 后门) and a **member name search box** —
  all three combine
- A **会员 (Members)** tab, rightmost in the tab bar, showing each
  member's currently-outstanding balance summed across every past
  round (not their lifetime spend), sorted highest-owed first
- Supports multiple group buys — once there's more than one, tabs
  appear (sorted by date) to switch between them; **past rounds are
  color-coded** — green once everyone's paid, red if anyone's still
  unpaid, uncolored for today's or future rounds
- Automatic light/dark mode, responsive on both mobile and desktop
- Delivery-day adjustments: shortages, refunds/surcharges, and
  walk-in extras can all be recorded right on the page, with amounts
  recalculated automatically (see "Delivery-day adjustments" below)
- **Auto-locks once everyone's paid**: once every member in a round
  is marked paid, that round locks — no more (un)marking paid, no
  adjustments, no walk-ins — to prevent an accidental change after
  it's settled. Enter the edit PIN to unlock it again (packing and
  sorting stay unaffected by the lock — see "Auto-lock after full
  payment" below)
- **Block/unit directory**: record each member's block/unit number to
  help plan deliveries — shown right on their card (visible to anyone
  with the link), but never stored in a repo file and never appears
  in any payment message or announcement (see "Block/unit directory"
  below)
- One-tap report export: a dense table format you can print or save
  as a PDF, so a large round doesn't turn into several pages
- Toolbar **"🔄 刷新"** (Refresh) button: manually reloads the whole
  page. Saved to the iOS Home Screen as a "web app," the page opens
  full-screen with no Safari UI — including no pull-to-refresh gesture,
  since that belongs to Safari's chrome, not the page itself — so this
  button is the reliable substitute (see "Troubleshooting: Home Screen
  web app won't pull-to-refresh" below)

## Files

| File | Purpose |
|---|---|
| `index.html` | The whole app — reads `manifest.json` and whichever `data-*.json` files it references, and reads/writes state via Firebase. You normally don't need to touch this file. |
| `manifest.json` | Lists every group buy: `{ date, label, file }`. Most recent date first. |
| `data-<date>.json` | One file per group buy: products, prices, and every member's order. |
| `product-emoji-map.json` | Keyword → emoji lookup table that decides which icon shows next to each product name. Safe to extend any time. |
| `message-template.json` | The wording used by the "copy payment message" / "copy arrival announcement" buttons — greeting, per-line phrasing, closing line, etc. To change how a message reads, edit this file — `index.html` doesn't need to change. |

`product-catalog.json` is a Claude-side reference file only (tracks
short keys, last-used prices, weighing mode) — it's **never deployed**
and `index.html` never fetches it; it just makes building the next
round's data file faster.

Paid status is **not** stored in any file in this repo — it lives
live in Firebase Firestore (see below).

## Adding a new group buy

1. Create a new `data-<date>.json` file (see "Data schema" below).
2. Add a line to `manifest.json`:
   ```json
   { "date": "2026-09-14", "label": "9/14", "file": "data-2026-09-14.json" }
   ```
3. Upload both files to this repo (Add file → Upload files).
   `index.html` doesn't need to change.

Once `manifest.json` has 2 or more entries, tabs automatically appear
at the top of the page to switch between group buys.

**If `data-<date>.json` has a syntax error or a typo** (hand-typing
JSON makes it easy to drop a comma, quote, or bracket, or to
mistype a product's short key in someone's `items`):
- A genuine JSON syntax error (missing comma/bracket/etc.) shows a
  clear error message when you open that tab — naming what failed
  to parse — instead of the tab doing nothing or the page hanging.
  Every other tab keeps working normally.
- A valid JSON file where some member's `items` references a
  product key that doesn't exist in `products` (typo'd, or renamed/
  removed) shows "⚠️ 商品未找到，请检查 data 文件" (product not
  found, please check the data file) on just that line instead of
  crashing the whole page — this used to make the entire dashboard
  unclickable for everyone; now it's a visible, localized warning
  you can go fix.

## `data-<date>.json` schema

```json
{
  "groupName": "WG团购群",
  "itemsLabel": "小馄饨团购",
  "products": {
    "sig": { "label": "招牌鲜肉馄饨", "price": 6.5 },
    "pork_belly": { "label": "五花肉", "price": 12.0, "unit": "kg" },
    "peach": { "label": "彩虹油蟠桃", "price": 8.0, "unit": "kg", "weighMode": "weight", "gramsPerUnit": 1000 },
    "tangerine_seedless": { "label": "无籽蜜橘(2kg/包)", "price": 10.0, "weighMode": "weight", "gramsPerUnit": 2000 },
    "grape_jufeng": { "label": "辽宁巨峰(3串/箱)", "price": 25.0, "weighMode": "proportional" },
    "pear_box": { "label": "香梨(4粒/份)", "price": 12.0, "piecesPerUnit": 4 }
  },
  "orders": [
    { "name": "小明", "items": { "sig": 3 } },
    { "name": "小华", "items": { "sig": 1, "shrimp": 1 } },
    { "name": "阿强", "items": { "pork_belly": 0.5 } },
    { "name": "小美 & 阿杰", "items": { "corn": 2 } }
  ]
}
```

- `itemsLabel` (optional) — a short phrase for what this round is (e.g. "小馄饨团购"),
  used only by the "📢 复制到货通知" button at the top of the page. If omitted, it falls
  back to `"{round label}团购"` (e.g. "9/1团购"), never to a list of every product.
- `products` — short key → product info:
  - `label` (Chinese name) and `price` are required.
  - `unit` (optional) — defaults to `"盒"` (box); set it explicitly (e.g. `"kg"`) for
    anything sold by weight or another unit.
  - `weighMode` (optional) — decides which inline editor this product gets in edit mode:
    `"weight"` for a grams-input editor, `"proportional"` for a box-share calculator;
    omit it for the default plain +/− stepper.
  - `gramsPerUnit` (optional) — grams per unit for a `weighMode:"weight"` product (e.g.
    `1000` for a `"kg"` product, `2000` for a "无籽蜜橘(2kg/包)"-style bagged item). If
    omitted, the app tries to infer it from `unit`/the weight text in `label`, but
    setting it explicitly is more reliable.
  - `piecesPerUnit` (optional) — how many pieces are in one unit/box, used by the
    piece-count editor for partial damage/shortage.
  - All of these fields are optional — older data files without them are fully
    compatible; every product just falls back to the plain +/− stepper.
- `orders` — one entry per amount to collect. Quantities in `items`
  can be decimals (e.g. `0.5` for half a portion/half a kg).
- **Combined orders**: if two members order together and pay as one
  lump sum, represent it as **one** entry with the names combined
  into a single string, e.g. `"name": "小美 & 阿杰"`.
- **Missing/unverified products**: if a product's price can't be
  confirmed yet (not on the price list, or the reference is
  ambiguous), still add it to that member's `items`, but set that
  product's `"price"` to `null` in `products` and add
  `"unverified": true`. The page highlights these in amber, tags
  them "缺失/待确认" (missing/unconfirmed), shows the amount as
  "待确认" (to be confirmed), excludes them from all totals, and
  shows a warning banner at the top. Once confirmed, set a real
  `price` and remove the `unverified` field.

## Shared live payment status (Firebase)

Paid status syncs in real time via **Firebase Firestore** — when
anyone with the link marks someone as paid, everyone else currently
viewing the page sees the update instantly, with no manual refresh
needed. The same real-time mechanism backs packing status, sorting
checkboxes, the block/unit directory, and delivery-day adjustments.

- **Firebase project:** WG Group Buy (`wg-group-buy`)
- **Data shape:** one document per group buy (keyed by date), across:
  - `paidStatus` — each member's name → `true`/`false`, plus a
    special `__locked` field (whether the round auto-locked)
  - `packedStatus` — each member's name → packed or not
  - `sortedItems` — keys shaped `memberName::itemKey` → ticked or not
  - `adjustments` — one auto-generated ID per delivery-day adjustment
  - `memberInfo/directory` (a single document, not keyed by date) —
    each member's block/unit number
- **How the frontend connects:** `index.html` embeds the Firebase
  `firebaseConfig` directly (apiKey, projectId, etc.). These values
  aren't secrets and are fine to be public — actual access control
  comes from the security rules below, not from hiding this config.
- **Firestore security rules** (Firebase console → Firestore
  Database → Rules — full copy in this repo's `firestore-rules.md`):

  ```
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /paidStatus/{groupBuyDate} {
        allow read, write: if true;
      }
      match /adjustments/{groupBuyDate} {
        allow read, write: if true;
      }
      match /packedStatus/{groupBuyDate} {
        allow read, write: if true;
      }
      match /sortedItems/{groupBuyDate} {
        allow read, write: if true;
      }
      match /memberInfo/{docId} {
        allow read, write: if true;
      }
    }
  }
  ```

  This opens read/write access to these five collections for anyone
  with the link — nothing else in the project is exposed.

- If a red 🔧 banner appears at the top of the page, it means a
  Firestore read or write failed — the banner shows the specific
  error message to help debug.

### Troubleshooting: devices showing different data

If different devices show different paid status shortly after a
push, it's usually GitHub Pages' CDN still serving a cached copy of
the old `index.html` — wait a minute or two, or reopen the link in a
private/incognito window to bypass the cache. If it's still
inconsistent after that, check the page source for the word
`firebase` to confirm the live version is actually the latest one.

### Troubleshooting: Home Screen web app won't pull-to-refresh

Saving this page to the iOS Home Screen (Share → Add to Home Screen)
opens it full-screen with no Safari address bar or toolbar. Pull-to-
refresh is a gesture that belongs to Safari's own UI, not to the
page — in full-screen mode there's no Safari chrome to provide it,
so pulling down does nothing there. That's expected, not a bug in
this page. Use the toolbar's **"🔄 刷新"** (Refresh) button instead —
it reloads the whole page manually. If the content still looks stale
right after tapping it, that's almost always the CDN-caching issue
above, not the button itself: wait a minute or two, or force-quit the
web app and reopen it from the Home Screen icon.

## Delivery-day adjustments (shortages / refunds / walk-in extras)

What actually gets delivered often doesn't match the original order
exactly: something's missing, a refund is owed, or extra stuff gets
sold on the spot. These adjustments **never modify** the original
`data-<date>.json` — like paid status, they live in Firebase
Firestore (an `adjustments` collection, one document per round) as a
second layer on top of the frozen original order, so there's always
a clean record of what was ordered vs. what was actually charged.

**Fastest everyday path:** once in edit mode (tap "✏️ 编辑调整" on
any member card, or the same button in the bottom toolbar — the
first time on a device needs the edit PIN), **tap the item line
directly**. This opens the matching inline editor — plain stepper,
weight, box-share, or piece-count, decided by that product's
`weighMode`/`piecesPerUnit` in `data-<date>.json` (see "Data schema"
above) — and saves the right amount automatically using the rounding
rules below.

**Rounding rules for weight-priced items:** enter the actual grams
received, and the app rounds down to the nearest **10g** (never up —
1395g bills as 1390g). If the resulting dollar figure lands on an odd
number of cents (e.g. 0.33kg × $22 = $7.26), it's rounded down again
to the nearest **10 cents** — a charge rounds down to a smaller
amount owed, and a refund rounds down too (making it a slightly
bigger refund) — both directions favor the buyer. Correcting the same
person's same item a second time nets against the already-corrected
amount, not the original order.

For a messier delivery-day recap, you can also describe what happened
to Claude and have it generate the adjustment entries as JSON to
paste into the toolbar's **"📋 批量导入调整"** (bulk import) panel.
The older, form-based **"+ 调整"** option still works too in edit
mode as a fallback — both write the identical record shape.

Every adjustment line has a **"撤销"** (undo) link to remove it.

These editing actions are all temporarily unavailable once a round has
**auto-locked after full payment** — see "Auto-lock after full payment"
below.

## Packing and sorting

- **Packing**: each member's card has its own "打包" (packed) toggle,
  independent of "标记已付款" — stored in its own `packedStatus`
  collection, tappable by anyone without unlocking edit mode. The
  stats ticket shows "已打包 X / Y 人".
- **Sorting checkboxes**: in edit mode, every item line gets a ⬜/✅
  tick, so several people physically pulling stock at once can see
  each other's progress — stored in `sortedItems`, likewise live and
  ungated, and completely independent of payment/packing/adjustments;
  it's purely a "has this been physically pulled" tracker and never
  touches money. A fully-shortaged item (quantity down to zero) shows
  ❌ instead of a checkbox (nothing left to pull); a partial shortage
  keeps the checkbox plus a small ⚠️ 部分到货 flag.

## Auto-lock after full payment

Once **every member in a round has been marked paid**, the page
automatically locks that round: no more marking/unmarking paid, no
delivery-day adjustments, and no adding walk-in buyers — this
prevents an accidental change once a group buy is already settled.
Packing and sorting stay available even while locked.

- The locked state is **shared by everyone** — it lives in Firebase,
  same as paid status, not just on one device, and a page reload
  doesn't clear it.
- Once locked, the bottom toolbar's "✏️ 编辑调整" button becomes
  **"🔓 解锁"** (Unlock). Tapping it and entering the edit PIN (the
  same `EDIT_PIN` used for delivery-day adjustments) unlocks it for
  everyone, instantly. This always requires re-entering the PIN, even
  on a device that's already unlocked edit mode before — that's
  intentional, so reopening a settled round stays a deliberate step.
- The read-only/copy buttons — "💬 复制付款消息", "📢 复制到货通知",
  "🖨️ 导出报告" — are unaffected by the lock and stay available at
  all times.

## Round tab coloring

Past-round tabs are color-coded so you can spot outstanding balances
at a glance: **green** once every base member in that round has paid,
**red** if anyone's still unpaid. Today's and future rounds are left
uncolored (treated as "hasn't happened yet"). The currently-selected
tab always keeps its own dark "active" highlight regardless of color.
This is based on the original 接龙 roster only — walk-ins added via
adjustments aren't factored in yet, a known, low-stakes limitation.

## Members (outstanding balances)

The rightmost tab, **"会员"**, sums each member's currently-unpaid
total across every past round (not their lifetime spend), sorted
highest-owed first. It's computed the first time you open the tab
(not on every page load) and cached for the rest of the session.
Rounds with a "测试" (test) marker in the date, like 9/10测试(v2),
are excluded so test data never pollutes a real balance.

## Block/unit directory

Each member can have a block/unit number on file (free text, e.g. "Block 12
#06-02"), used only to help plan delivery order. Since this is real address
information tied to real names, it's handled differently from everything
else in this project:

- **Never in any file in this repo** — unlike `index.html`,
  `data-<date>.json`, etc., this lives entirely in Firebase Firestore (a
  `memberInfo` collection), never pushed to GitHub and never sitting in the
  repo's history. (It's still readable/writable by anyone with the dashboard
  link, same trust model as paid status and adjustments — it just isn't
  discoverable by browsing the GitHub repo.)
- **Never appears in "复制付款消息" or "复制到货通知"** — neither message
  reads this data at all.
- **Shared across every round** — no need to re-enter it each time a new
  group buy starts.
- **Shown directly on each member's card** — once set, anyone with the
  dashboard link sees it (same visibility as the rest of the page).
  **Editing** it still requires edit mode: tap **"🏠 门牌管理"** (Block/unit
  management) in the bottom toolbar (after unlocking with the edit PIN) to
  see and edit every current member's unit number; tap "保存" to save. Every
  device sees the same saved data immediately.
- On the walk-in ("+ 新增买家") form, typing a name that matches an
  existing member in the directory auto-fills their address — only
  while the address field is still blank, so it never overwrites a
  manual entry.

**Needs one new Firebase rule the first time you use this** (Firestore
Database → Rules in the Firebase console), since it's a brand-new
collection:

```
match /memberInfo/{docId} {
  allow read, write: if true;
}
```

Add it next to the existing rules (full copy in `firestore-rules.md`).
Without it, opening "🏠 门牌管理" shows a red 🔧 error banner instead.

## Product emoji icons (`product-emoji-map.json`)

The icon shown next to each product name is matched automatically by keyword
from `product-emoji-map.json` (a name containing "水蜜桃" matches 🍑, "馄饨"
matches 🥟, etc.) — icons don't need to be picked by hand per product.

- If a new product doesn't match any keyword, it falls back to the default
  🛒 icon — that's not a bug, it just means that product's wording isn't
  covered by the table yet.
- To fix that, send Claude the new round's actual product names and have it
  add the right keywords to `product-emoji-map.json` (into an existing
  category, or a new one), then upload the updated file to the repo root —
  `index.html` doesn't need to change.

## Copy payment message (`message-template.json`)

Each member's card has a **"💬 复制付款消息"** button that copies a
ready-to-paste WeChat message with their itemized order, any delivery-day
adjustments (with the reason, e.g. a shortage), and the total due. This is
separate from the "mark paid" button — one person can sort/collect payment
while another tracks who's paid, and the PDF export for a paper trail is
unaffected either way.

The format matches how this group already writes these messages by hand
(no emoji icons; amounts prefixed with "$"). Example
(**unpaid** status; "@小美" is a placeholder name, not a real member):

```
@小美

彩虹油蟠桃  $16（2044g）
蜂糖李  $6.7（673g）
哈密瓜  $6.5
青龙菜  $3.5
土鸡蛋  $9.3

一共$42～

Paynow 93395373 /ZHAO JIE
```

If one of that member's items was corrected on delivery day, the
adjustment line now sits right under **that product's own line**
rather than in a block at the end, e.g.:

```
@小明

哈密瓜 x2盒  $13
↳ 哈密瓜 -1盒（到货少一份） -$6.5
土鸡蛋  $9.3

一共$9.3～
```

That last payment-info line (`closingUnpaid`) only appears while this member
is still **unpaid** — once marked paid, it's replaced by `closingPaid`
(currently empty, so nothing shows). Both live in `message-template.json`
and can be changed to any payment method, or left blank.

The message's **wording** (how the greeting reads, how each line is
phrased, the closing line, etc.) lives in `message-template.json`, separate
from the product data, prices, and adjustment records. To reword it, just
edit and re-upload that file — no `index.html` changes needed. Each field's
purpose is documented in the file's own `description` field.

## Arrival announcement (`📢 复制到货通知`)

A more prominent button — full-width, right under the group name at the top of the
page — copies a "come collect it" message for the whole group, separate from the
per-member payment message above:

```
@小明 @小华 @阿强 ... (every member in this round, in 接龙 order)

小馄饨团购到啦，欢迎来06-02自取，需要送货小群联系～
```

- @mentions every member of the current round (in 接龙 order, including anyone added
  as a walk-in), regardless of paid status — this is a pickup notice, not a payment
  request.
- The "小馄饨团购" part (what arrived) comes from that round's `data-<date>.json` —
  set its `itemsLabel` field when creating a new round (see "Data schema" above); if
  left unset it falls back to `"{round label}团购"` (e.g. "9/1团购"), never to a list
  of every product — so a round with dozens of distinct items doesn't turn into an
  unreadable wall of text if `itemsLabel` gets forgotten.
- The pickup location ("06-02") lives in `message-template.json`'s `pickupLocation`
  field — this is normally a fixed setting for your building/unit, not something you
  change every round.
- The rest of the wording lives in `message-template.json` too, same as the payment
  message above.

## Product lookup (who ordered what)

Two ways to see who ordered a given product, both landing on the same
breakdown:

1. The dropdown above the **商品查询/备货清单** card — lists only
   products **actually ordered this round**. Pick one to see every
   buyer's name and quantity, plus a subtotal.
2. **Any row in the stocking list is directly tappable** too, no need
   to find it in the dropdown first — pops up the same breakdown; tap
   anywhere on it to close.

When a round has a lot of distinct products (30-40+), the full list
starts **collapsed** behind a "📋 查看全部商品备货清单（N 种商品）"
summary to avoid a wall of tables — it re-collapses on every round
switch.

## Exporting a report

**"🖨️ 导出报告（PDF/打印）"** (Export report) opens the browser's
print dialog with a dense, table-formatted report — every member
regardless of the current filter, with their itemized order, amount,
and paid status, plus the stocking list. Print it directly, or choose
"Save as PDF" in the dialog. This table layout is deliberately
separate from the on-screen card layout so a large round doesn't turn
into several pages of paper.

## Notes

- The admin UI's own chrome (buttons, labels, tabs) supports a
  Chinese/English toggle in the top corner, but member names, product
  names, adjustment notes, and anything copied out as a payment
  message or arrival announcement always stay in Mandarin — buyers
  read those, not the admin UI. Add new UI chrome text in both
  languages; new data-facing text (product names, notes) can stay
  Mandarin-only, matching the existing style.
- The small version string at the very bottom of the page (e.g.
  "v1.13.0") is the code's version number — Claude bumps it every
  time `index.html` changes, so after deploying you can glance at the
  live page and confirm it picked up the version you expect, no dev
  tools needed. It has nothing to do with this round's date or order
  data — it's purely a code build marker.
- The house billing rule rounds actual weight down to the nearest
  **10g** (not 100g) — always in the buyer's favor.
- A Claude Artifact (`window.storage`) approach was tried first for
  shared cross-device payment status, but hit a known Anthropic
  platform postMessage cross-origin bug at the time (publicly
  tracked as `anthropics/claude-code#42064`) that kept it from
  working reliably — hence the move to the current GitHub Pages +
  Firebase setup.

## Hosting

This repo is served via **GitHub Pages** (Settings → Pages → Deploy
from branch → `main` / root). Pushing to the `main` branch updates
the live site automatically within about a minute.
