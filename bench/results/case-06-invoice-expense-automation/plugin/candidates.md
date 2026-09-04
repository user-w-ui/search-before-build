# Candidates

| 类别 | 候选 | 已核验用途 | 主要限制 |
| --- | --- | --- | --- |
| 可改造项目 | [FP 报销信息整理识别系统](https://github.com/zhangdexuan/fp-reimbursement-system) | 中文增值税发票字段、识别后编辑、审批、Excel/PDF 导出、本地存储 | Outlook 导入、交通票据、三类 Action Gate 和实际准确率需补做 |
| 可改造项目 | [Invoice Manager](https://github.com/stone16/Invoice-Manager) | OCR+LLM 双源比对、原图预览、冲突字段人工选择、Docker 部署 | 外部 LLM 依赖边界、验真、去重、导出和邮件动作需核验 |
| 可复用组件 | [PaddleOCR / PP-StructureV3](https://github.com/PaddlePaddle/PaddleOCR) | 本地 OCR、版面/表格解析、服务化和二次开发；Apache 2.0 | 不是报销工作流，不负责中国发票验真或去重 |
| 可复用组件 | [invoice2data](https://invoice2data.readthedocs.io/latest/reference.html) | 本地 PDF/图片文本抽取、模板/正则、CSV/JSON/XML 输出；MIT | 中国票制模板、照片、交通票据和业务复核需自建 |
| 可直接使用服务 | [百度增值税发票识别](https://cloud.baidu.com/doc/OCR/s/nk3h7xy2t) | 中国多票种结构化字段与验真 | 云 API，与发票不出陌生云的约束冲突 |
| 可直接使用服务 | [腾讯云通用票据识别](https://cloud.tencent.cn/document/product/866/90802) | 混合 PDF、多种增值税/火车/出租车/机票票据 | 云 API；复核、去重、Excel 和确认门仍需自建 |
| 当前工作流组件 | [Office 365 Outlook connector](https://learn.microsoft.com/en-us/connectors/office365/) | 邮件触发、只取带附件、读取附件内容 | 云连接器有超时、重复、漏触发和受保护附件限制 |
| 当前工作流组件 | [国家税务总局查验平台](https://inv-veri.chinatax.gov.cn/?p=51) | 验真输入字段与查验范围 | 网页交互限制、每日次数限制，不能替代本地 OCR |

重复项已由内核按稳定 GitHub/URL identity 合并；FP 与 PaddleOCR 在候选池中同时作为可改造/底层复用路径出现。
