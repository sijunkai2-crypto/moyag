import type { BasicSeoData } from './basicSeoAudit';

export type AiSeoReport = {
  score: number;
  riskLevel: '低' | '中' | '高';
  issueCount: number;
  highPriorityCount: number;
  executiveSummary: string;
  sections: Array<{ title: string; summary: string; items: string[] }>;
  roadmap: { day7: string[]; day30: string[]; day90: string[] };
};

export async function generateAiSeoReport(input: {
  url: string;
  industry: string;
  targetMarket: string;
  basicSeoData: BasicSeoData;
  pageText: string;
}): Promise<AiSeoReport> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('OPENAI_API_KEY 未配置');

  const schemaHint = `仅输出 JSON，不要 markdown。字段: score,riskLevel,issueCount,highPriorityCount,executiveSummary,sections,roadmap`;

  const resp = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-4.1-mini',
      input: [
        { role: 'system', content: '你是 B2B 外贸 SEO 顾问，面向中文客户。输出严格 JSON。' },
        {
          role: 'user',
          content: `${schemaHint}\nURL:${input.url}\n行业:${input.industry}\n目标市场:${input.targetMarket}\n基础数据:${JSON.stringify(input.basicSeoData)}\n页面文本片段:${input.pageText.slice(0, 8000)}`
        }
      ]
    })
  });

  if (!resp.ok) throw new Error(`OpenAI 请求失败: ${resp.status}`);
  const data = await resp.json();
  const raw = data.output_text as string;
  const parsed = JSON.parse(raw) as AiSeoReport;
  return parsed;
}
