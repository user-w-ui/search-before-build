# Case 06：发票与报销助手（A 臂基线）

本文件记录一次直接 Codex 子代理运行的研究顺序。研究没有加载、调用或读取 Search Before Build/plugin skill、plugin references、`bench/real` 或历史 `bench/results` 内容；没有使用 Claude CLI，也没有委派子任务。

## 输入与问答

用户请求原文：

> 我想做一个给自己用的发票和报销助手。发票现在散落在 Outlook 邮件附件、微信/支付宝导出的 PDF，还有手机拍的纸质小票里。我希望把文件丢给它后，自动识别发票号码、金额、日期、买卖双方和报销类别，发现重复票或抬头不对时提醒我，再按月份导出 Excel 报销明细。数据最好留在自己的电脑或私有服务器上，发邮件给财务前必须由我最后确认。这个东西值得自己开发吗？

没有提出澄清问题，也没有产生用户回答；问答事件数为 0。按请求直接研究并给出建议。

## 研究顺序

1. 检查 Microsoft AI Builder/Power Automate 的发票字段、置信度、中文与文件限制，以及 Microsoft Graph 的 Outlook 附件读取路径。
2. 检查 PaddleOCR 的本地文档解析能力，以及 Paperless-ngx、Docspell 的自托管归档能力。
3. 检查 Expensify 和中国 VAT 发票 OCR API，确认云端方案的功能覆盖及隐私冲突。
4. 检查 GitHub 上的本地中文发票/报销工具：FP 报销系统、Invoice Manager、InvoiceFlowAI、invoice-pay-record-manager、campus-reimburse-kit、invoice-ledger-skill，以及 Windows 本地工具票亮和发票盒子。
5. 按字段抽取、混合入口、查重/抬头校验、Excel、私有部署和人工发送闸门六项要求归纳缺口。

## 时间标记

工具返回没有为每个 web 请求提供调用时间。下面是本次运行中通过本机时钟捕获的精确标记；`session.jsonl` 保留了各工具调用的真实先后顺序，并在环境文件中说明这是代理自记录证据日志。

| 事件 | 本地时间（Asia/Shanghai） | UTC |
| --- | --- | --- |
| 研究证据捕获标记 | 2026-09-03T16:26:03.3542153+08:00 | 2026-09-03T08:26:03.3580157Z |
| 研究证据冻结标记 | 2026-09-03T16:27:50.9468863+08:00 | 2026-09-03T08:27:50.9495798Z |

## 工具调用统计

| 工具/调用族 | 次数 | 细分 |
| --- | ---: | --- |
| `web__run` | 13 | `search_query` 5 次、18 个查询；`open` 3 次、29 个 ref；`find` 5 次、28 个 ref |
| `exec_command`（只读检查/目录准备） | 15 | 仓库内 `bench` 检查、时间标记、一次失败和一次成功的目录创建，以及证据格式/内容校验；首次目录创建命令因 PowerShell 参数错误失败，随后用明确路径成功 |
| `apply_patch` | 4 | 写入本目录下六个证据文件，随后补全 session 的完整最终回答、运行元数据和调用统计 |
| Claude CLI、插件工具、子代理 | 0 | 未使用 |

## 精确搜索查询

下列 18 条查询按实际调用原样记录：

1. `site:learn.microsoft.com Power Automate AI Builder invoice processing model fields line items confidence duplicate invoices`
2. `site:learn.microsoft.com Microsoft Graph Outlook message attachments download permissions`
3. `PaddleOCR official documentation Chinese invoice OCR PP-StructureV3 local deployment`
4. `site:paperless-ngx.readthedocs.io invoice OCR self hosted custom fields`
5. `Paperless-ngx official documentation OCR custom fields correspondence self hosted`
6. `Docspell official documentation self hosted OCR tags full text search`
7. `open source self hosted expense management OCR invoices official documentation`
8. `Expensify official SmartScan receipt OCR data privacy export spreadsheet`
9. `official Chinese VAT invoice OCR API invoice number buyer seller amount date local open source`
10. `site:cloud.baidu.com 票据识别 增值税发票 OCR 字段 发票号码 价税合计`
11. `site:help.aliyun.com 增值税发票识别 OCR 发票号码 开票日期 购买方 销售方`
12. `site:ai.baidu.com OCR 增值税发票识别`
13. `site:github.com/paperless-ngx/paperless-ngx docs custom fields OCR email consume local storage`
14. `site:github.com/paperless-ngx/paperless-ngx mail rules consume documents email`
15. `site:github.com/paperless-ngx/paperless-ngx workflows custom fields`
16. `个人 发票 报销 OCR Excel 导出 本地部署 开源 项目`
17. `发票管理 OCR 报销 单机版 Excel 导出 隐私 中国 软件`
18. `自建 发票管理 识别 报销 开源 GitHub 中文`

## 打开/抓取的 URL

实际执行的 `open`/`find` 目标如下；标记为 403 或抓取错误的页面没有被当作成功证据使用，但仍保留在日志中：

- `https://learn.microsoft.com/en-us/ai-builder/prebuilt-invoice-processing`（open/find，成功）
- `https://learn.microsoft.com/en-us/ai-builder/flow-invoice-processing`（open，成功）
- `https://learn.microsoft.com/en-us/ai-builder/form-processing-model-in-flow`（open，成功）
- `https://learn.microsoft.com/en-us/graph/api/attachment-get?view=graph-rest-1.0`（open，成功）
- `https://www.paddleocr.ai/main/en/version3.x/pipeline_usage/PP-StructureV3.html`（open，成功）
- `https://www.paddleocr.ai/main/en/version3.x/inference_deployment/serving/paddleocr_official_api/python.html`（open，成功）
- `https://docs.paperless-ngx.com/`（open，403）
- `https://docs.paperless-ngx.com/configuration/`（open，403）
- `https://docspell.org/docs/`（open，成功）
- `https://docs.paperless-ngx.com/usage/`（open，403；重复尝试）
- `https://help.expensify.com/articles/expensify-classic/spending-insights/Export-Expenses-And-Reports`（open，成功）
- `https://cloud.baidu.com/doc/OCR/s/nk3h7xy2t`（open/find，成功）
- `https://help.aliyun.com/zh/rpa/user-guide/vat-invoice-recognition`（open，成功）
- `https://github.com/stone16/Invoice-Manager`（open/find，成功）
- `https://docspell.org/docs/features/`（open，成功）
- `https://use.expensify.com/receipt-scanning-app`（open，成功）
- `https://cloud.tencent.com/document/product/866/36210//`（open，成功）
- `https://learn.microsoft.com/en-us/graph/outlook-get-mime-message`（open，成功）
- `https://learn.microsoft.com/en-us/graph/outlook-large-attachments`（open，成功）
- `https://github.com/zhangdexuan/fp-reimbursement-system`（open/find，成功）
- `https://github.com/SC123667/invoice-pay-record-manager`（open/find，成功）
- `https://github.com/Rain-dust/campus-reimburse-kit`（open，成功）
- `https://github.com/maple192600-LI/invoice-ledger-skill`（open，成功）
- `https://github.com/EthanYoQ/Invoice-Downloader`（open/find，成功）
- `https://www.sdwy520.com/piaoliang.html`（open，成功）
- `https://fapiaohezi.com/`（open，成功）
- `https://www.fapiaowang.cn/`（open，返回空正文）
- `https://www.lipiaop.com/`（open，抓取错误）

## 研究输出

候选能力和证据链接见 `candidates.md`；需求覆盖矩阵见 `coverage.md`；最终建议和可执行 MVP 见 `decision.md`。最终回答已经完整复制到 `decision.md` 和 `session.jsonl`。
