# 候选与证据

检索日期：2026-09-03。以下 characterizations 只使用页面中明确写出的能力；营销页面和 GitHub README 的准确率、用户量等自报数字均标为“来源声称”，没有当作独立测量。

## 1. FP 报销信息整理识别系统（最接近的自托管起点）

链接：[GitHub 仓库](https://github.com/zhangdexuan/fp-reimbursement-system)

页面明确写出 React/Express/SQLite + 独立 PaddleOCR 服务，可在 Linux 主机运行且不依赖云；支持中国增值税普票、专票和纸质发票；抽取发票号码、开票日期、购销双方、明细、金额、税额、价税合计、备注、开票人等 14 类字段；流程为新建→识别→编辑→审批→导出 Excel，并可同时导出合并的附件 PDF。README 另声称 PNG 约 22 秒、PDF 约 55 秒和字段抽取准确率 95%+，这些数字未独立验证。

缺口：README 没有记录 Outlook/Graph、微信或支付宝自动入口，也没有明确的重复票、抬头白名单校验或“发邮件前必须由当前用户点击确认”的发送闸门；推荐先审计代码和真实样本，再作为本地薄层的起点。

## 2. InvoiceFlowAI / Invoice-Downloader（邮箱与 Excel 覆盖较好）

链接：[GitHub 仓库](https://github.com/EthanYoQ/Invoice-Downloader)

页面写出 Windows/macOS 桌面版，可通过 QQ/163 IMAP 批量收集 PDF、OFD、XML，自动分类归档并生成 `summary_report.xlsx`；低置信度进入 `Manual_Check`；邮件和文件在本地处理，邮箱凭据使用系统凭据存储。它明确说明启用 GLM OCR/视觉识别时，发票图片会发送到智谱服务商，邮件正文不发送。

缺口：文档只写 QQ/163 IMAP，没有 Outlook/Graph；没有明确微信/支付宝文件夹或手机照片入口、抬头校验和重复票策略；“本地处理”不能覆盖启用外部 GLM 时的图片传输；没有用户确认后再发给财务的工作流。可借鉴入口/报表，但需改造或禁用云回退。

## 3. invoice-pay-record-manager（个人本地工具）

链接：[GitHub 仓库](https://github.com/SC123667/invoice-pay-record-manager)

页面定位为个人报销、项目归档和财务凭证整理的本地桌面工具；支持按地区、类别、年月日归档，批量识别和金额汇总，默认探测微信 `msg/file` 目录；PDF 优先读内嵌文字，图片和无文字 PDF 使用 PaddleOCR；本地结果不完整时可回退到硅基流动等云视觉模型；配置加密保存。

缺口：页面没有写 Excel 导出、Outlook 读取、重复/抬头检查或审批/发送闸门。它适合研究微信目录和本地 OCR 入口，不能直接满足整条报销链。

## 4. Paperless-ngx（自托管档案底座）

链接：[官方仓库文档](https://github.com/paperless-ngx/paperless-ngx/blob/dev/docs/usage.md)，[配置文档](https://github.com/paperless-ngx/paperless-ngx/blob/dev/docs/configuration.md)

官方文档写出本地文档归档、OCR、邮件消费、REST API、自定义字段和工作流；邮件规则可以读取附件，当前文档还写出 Outlook OAuth2 账户；默认会检查内容 checksum 并把重复文档列在 Duplicates 页，也可配置为拒绝同 hash 文件；工作流可以分配元数据并发送邮件。OCR 的默认路径是 Tesseract，中文需要安装 `chi_sim` 语言包。

缺口：这是通用文档管理器，文档没有中国发票号码/代码、价税合计、购销双方和报销类别的结构化发票模型；同 hash 只能抓到字节相同副本，票面相同但文件不同的重复需要自定义规则；工作流邮件动作本身不等于“每次发送前当前用户显式确认”。适合作为原件和审计底座，再外挂发票解析和 review UI。

## 5. Docspell（自托管文档整理器）

链接：[文档首页](https://docspell.org/docs/)，[功能说明](https://docspell.org/docs/features/)

文档明确支持 Tesseract OCR、全文检索、标签/文件夹/自定义字段、REST API、IMAP 邮件导入、Android 上传和本地文件后端；会从文本中提出 correspondents、日期和 tags 候选，并建议人工维护。它面向家庭及小型组织，适合作为私有文档库。

缺口：没有中国发票专用字段、查重/抬头规则、按月 Excel 报销表或最终发信审批。需要自建解析、数据库字段和导出层。

## 6. Microsoft Power Automate + AI Builder（功能覆盖强但云端）

链接：[发票模型](https://learn.microsoft.com/en-us/ai-builder/prebuilt-invoice-processing)，[Power Automate 用法](https://learn.microsoft.com/en-us/ai-builder/flow-invoice-processing)，[文档处理模型](https://learn.microsoft.com/en-us/ai-builder/form-processing-model-in-flow)

官方文档列出简体中文（中国）支持，输入 JPEG/PNG/PDF，并返回 InvoiceId、InvoiceDate、CustomerName/TaxId、VendorName/TaxId、InvoiceTotal、税务字段、明细表和每个字段的 confidence score；自定义模型可以补字段或低置信度回退，示例把结果写入 Excel。对清晰的单票照片/扫描件有明确输入建议和 20 MB 限制。

缺口：流程是 Power Automate cloud flow/AI Builder，上传内容不满足“最好留在自己的电脑或私有服务器”的默认偏好；Graph/Power Automate 还引入 Microsoft 账户权限、许可证和云服务依赖。文档没有针对中国电子发票版式、重复票或抬头白名单给出完整方案；必须另建规则和显式发送确认。

## 7. 中国云端 VAT OCR（百度/阿里云/腾讯云）

链接：[百度增值税发票识别](https://cloud.baidu.com/doc/OCR/s/nk3h7xy2t)，[阿里云 OCR 增值税发票组件](https://help.aliyun.com/zh/rpa/user-guide/vat-invoice-recognition)，[腾讯云 VAT OCR](https://cloud.tencent.com/document/product/866/36210//)

百度页面写出普票、专票、全电发票、卷票和区块链发票的结构化字段；阿里页面明确返回发票代码/号码/日期、购买方名称、销售方名称、金额、税额和税号；腾讯页面明确支持图片/PDF及大量购销方、税务、商品字段，但 PDF 接口按页识别且有 10 MB Base64 限制。

缺口：这些是网络 API，原始图片/PDF需要发给服务商，和本地/私有要求冲突；查重、抬头规则、Excel、人工审批和邮件发送都要由自建编排层完成。可作为用户明确开启的低置信度回退，不能作为默认路径。

## 8. Expensify SmartScan（云端成熟报销产品）

链接：[扫描产品页](https://use.expensify.com/receipt-scanning-app)，[导出帮助](https://help.expensify.com/articles/expensify-classic/spending-insights/Export-Expenses-And-Reports)

官方页面写出拍照、邮件转发、拖放上传、离线排队、OCR 提取 merchant/date/amount/currency、自动分类和 duplicate detection；帮助文档支持基础导出、分类导出和自定义 CSV 模板。

缺口：数据和处理依赖 SaaS；页面没有以中国发票代码/号码、购方抬头/税号为核心的字段承诺，也没有自托管或当前用户点击后才发给财务的发送闸门。若隐私放宽，它能减少自建 UI；当前约束下不推荐。

## 9. 发票盒子（功能最像但明确云同步）

链接：[产品页](https://fapiaohezi.com/)

产品页声称聚合邮箱、微信、支付宝和短信，支持手机拍照/扫描，自动分类、查重、生成报销单和 Excel，并提供 iOS/Android/电脑云端同步和加密存储。

缺口：云端同步与“数据最好留在自己电脑或私有服务器”相反；页面没有说明自托管部署、发信前人工确认或数据留存/删除细节。可以作为功能基准或短期试用对象，不能直接作为符合隐私要求的答案。

## 10. 票亮（Windows 本地、付费、入口较窄）

链接：[产品页](https://www.sdwy520.com/piaoliang.html)

页面写出本地 OCR，导入 PDF/PNG/JPG/JPEG，抽取票号、日期、购销双方、金额和税额；低置信度、缺失字段和重复票会标记，用户可逐张确认后导出 Excel，原票复制到同一文件夹；单机授权页面列出 89 元/年。

缺口：没有公开记录 Outlook/微信/支付宝自动抓取、私有服务器运行或财务邮件确认按钮。若用户接受手动把文件拖入 Windows，这个方案可能比自建更快；需要先用真实照片和 PDF 验证。

## 11. invoice-ledger-skill（本地台账小工具）

链接：[GitHub 仓库](https://github.com/maple192600-LI/invoice-ledger-skill)

README 写出从本地 PDF、图片和扫描件批量识别到持续 Excel 台账；多页 PDF 可拆分多票；本地 OCR 处理图片/扫描件；写入前检查疑似重复，只追加不覆盖；低置信度和未支持票种写入“识别提示”工作表。

缺口：只覆盖本地文件夹到台账，页面没有 Outlook/微信/支付宝抓取、抬头校验、私有服务部署或邮件确认工作流。它可以作为 Excel/低置信度提示设计参考。

## 结论性比较

没有找到一个候选同时满足：Outlook 附件、微信/支付宝导出 PDF 和手机照片的混合入口；中国发票字段；重复票与抬头检查；按月 Excel；默认本地/私有处理；以及发送财务邮件前的用户确认。现成方案分别覆盖了其中 3–5 项，最合理路径是复用本地 OCR/归档或报销代码，补一个小型入口、规则和 review 层。
