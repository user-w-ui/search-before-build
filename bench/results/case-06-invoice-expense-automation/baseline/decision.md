# 最终判断：ADAPT（改造/拼装），值得做窄版 MVP

## 给用户的完整回答

值得做，但建议把目标定成“本地、可复核的个人发票台账”，先改造现成组件，不从零重做 OCR 或企业费控平台。

现在已经有几条可复用的路：FP 报销系统在自托管 Linux 上提供中国增值税发票字段、审核流程和 Excel/PDF 导出（[项目说明](https://github.com/zhangdexuan/fp-reimbursement-system)）；InvoiceFlowAI 能从 QQ/163 邮箱收集电子票并生成 Excel，但 Outlook 入口和图片外发策略需要改造（[项目说明](https://github.com/EthanYoQ/Invoice-Downloader)）；Paperless-ngx 和 Docspell 能提供本地原件归档、OCR、邮件/目录导入和 API（[Paperless-ngx 文档](https://github.com/paperless-ngx/paperless-ngx/blob/dev/docs/usage.md)，[Docspell 文档](https://docspell.org/docs/features/)）。票亮也已经把本地 OCR、低置信度/重复提示、逐张确认和 Excel 导出做成了 Windows 工具（[产品页](https://www.sdwy520.com/piaoliang.html)）。

没有一个方案同时满足你的六个条件：Outlook 附件、微信/支付宝 PDF 和手机照片的混合入口；中国发票号码/金额/日期/购销双方/报销类别；重复票和抬头校验；按月 Excel；默认本地或私有部署；发送财务邮件前由你最后确认。云端方案的功能更齐，例如 AI Builder 支持简体中文、购销方、日期、金额、明细和置信度，但它通过 Power Automate/AI Builder 云服务处理文件（[官方字段与限制](https://learn.microsoft.com/en-us/ai-builder/prebuilt-invoice-processing)）；发票盒子也声称覆盖邮箱、微信、支付宝、拍照、查重和 Excel，却明确采用云端同步（[产品页](https://fapiaohezi.com/)）。这两类方案都不符合你的默认隐私边界。

我会按下面的顺序做一个小 MVP：

1. 文件入口先统一到本地 `inbox` 文件夹；手机用系统文件共享或私有服务器上传。Outlook 只做只读附件同步，使用 Microsoft Graph 的 Mail.Read 权限或本地导出，避免让邮件读取和发送共用一条自动化路径（[Graph 附件文档](https://learn.microsoft.com/en-us/graph/api/attachment-get?view=graph-rest-1.0)）。微信/支付宝先继续导出到这个文件夹，等核心流程稳定后再补自动抓取。
2. 电子 PDF 先读文本层；手机照片和图片型 PDF 用本地 PaddleOCR/结构化解析。模型只负责提出字段，原文件、原始 OCR、字段置信度、人工修改记录都保存本地；云 OCR/视觉模型只作为用户明确打开的低置信度回退。PaddleOCR 的 PP-StructureV3 已提供文档方向、版面和表格解析入口（[官方文档](https://www.paddleocr.ai/main/en/version3.x/pipeline_usage/PP-StructureV3.html)），但中国发票字段和校验仍要由应用层定义。
3. 数据表至少保存：原文件路径与 SHA-256、来源、发票代码、发票号码、开票日期、价税合计、购买方/销售方名称和税号、报销类别、置信度、状态、人工修改时间。重复提醒使用“文件 hash + 发票代码/号码”，必要时再比较日期和金额；只提示，不自动删除。
4. 抬头校验使用你配置的预期购买方名称和税号，遇到缺失、相似但不一致或低置信度时进入待复核队列。OCR 的结果不能直接视为真伪或税务合规结论。
5. 复核页面要同时显示原票预览、识别值、置信度和修改框。只有状态为 `CONFIRMED` 的记录才能生成某月 Excel 和附件包；“发送给财务”必须是另一个明确按钮，点击前展示收件人、主题、附件和记录数，发送动作不由导入或识别自动触发。

如果你每月都会重复整理一批票，且隐私和最后确认是硬要求，这个窄版项目值得做，能把最耗时的收集、录入、查重和月度汇总变成可控流程。若票量很少或只想马上用，先试用本地的票亮，或把 FP/InvoiceFlowAI 当作代码起点；不要先投入训练模型或构建完整企业审批系统。

第一轮验收应使用你自己的三组样本：有文本层的电子发票、微信/支付宝导出的 PDF、手机拍的纸票。对每张票记录号码、日期、金额、购销方、类别是否需要人工改；只有低置信度和异常票能稳定停在复核队列，且发送前确实需要你点击确认，才继续加自动抓取和更多票种。

## 决策依据

- **痛点强度**：输入源多且每月重复，自动归集和台账能直接减少重复劳动。
- **可复用度**：本地 OCR、PDF 文本提取、Excel 写出和邮件附件读取都有现成实现；从零训练模型的边际价值低。
- **差异点**：真正值得自建的是本地数据边界、针对个人抬头的规则、两种查重、人工修正记录和显式发信闸门。
- **主要风险**：照片质量、电子票/OFD/XML 解析差异、中国票种变化、误识别导致金额或抬头错误；需要保留原件和人工复核，不承诺自动税务合规。
- **推荐路径**：先用 FP 或 Paperless/Docspell 作为可审计本地底座，吸收 InvoiceFlowAI 的邮箱/Excel 处理思路，再写一个薄的字段模型、检查规则和确认页面。云 OCR 默认关闭。
