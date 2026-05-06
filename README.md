# Moyag AI SEO Growth Agent

第一版目标：让客户在官网提交英文官网 SEO 检测需求，后台记录销售线索，团队再用 AI + 人工审核生成初步诊断报告。

## 功能

- 官网 SEO 检测落地页
- 客户线索表单
- 表单字段校验
- API 接收提交
- 本地 `data/leads.jsonl` 记录线索

## 本地运行

```bash
npm install
npm run dev
```

打开：

```text
http://localhost:3000
```

## 服务器部署

```bash
npm install
npm run build
npm run start
```

## 当前版本说明

这是第一阶段 MVP，不包含客户登录后台、自动生成完整报告、GSC/GA4 接入、CRM 接入、自动发文章或自动外链。

下一步建议：

1. 部署到阿里云服务器。
2. 绑定 `www.moyag-ai.com`。
3. 测试表单提交。
4. 查看服务器目录下的 `data/leads.jsonl`。
5. 后续再接入数据库或邮件通知。
