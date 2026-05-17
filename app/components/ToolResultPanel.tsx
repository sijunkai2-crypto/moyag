type ResultValue = string | number | boolean | string[] | number[] | null | undefined;

type MetricRow = {
  label: string;
  value: string;
  status: 'good' | 'warning' | 'error' | 'neutral';
  detail: string;
};

const labelMap: Record<string, string> = {
  seoHealthScore: 'Site Health',
  titleStatus: 'Title Tag',
  descriptionStatus: 'Meta Description',
  h1Status: 'H1 Structure',
  imagesWithoutAlt: 'Images Without Alt',
  https: 'HTTPS',
  robotsTxt: 'Robots.txt',
  sitemapXml: 'Sitemap.xml',
  internalLinksEstimate: 'Internal Links',
  externalLinksEstimate: 'External Links',
  wordCount: 'Word Count',
  trafficPotential: 'Traffic Potential',
  contentCoverage: 'Content Coverage',
  entryPageOpportunity: 'Entry Page Opportunity',
  conversionReadiness: 'Conversion Readiness',
  riskSignals: 'Risk Signals',
  targetMarket: 'Target Market',
  keywordOpportunities: 'Keyword Opportunities',
  contentIdeas: 'Content Ideas',
  competitorGaps: 'Competitor Gaps',
  backlinkQuality: 'Backlink Quality',
  marketFit: 'Market Fit'
};

function valueToString(value: unknown): string {
  if (Array.isArray(value)) return value.length ? value.join(' · ') : 'None detected';
  if (typeof value === 'boolean') return value ? 'Pass' : 'Issue';
  if (value === null || value === undefined || value === '') return 'Not available';
  return String(value);
}

function metricStatus(key: string, value: unknown): MetricRow['status'] {
  if (key === 'seoHealthScore' && typeof value === 'number') {
    if (value >= 85) return 'good';
    if (value >= 65) return 'warning';
    return 'error';
  }
  if (['titleStatus', 'descriptionStatus', 'h1Status'].includes(key)) return value === 'present' ? 'good' : 'error';
  if (['https', 'robotsTxt', 'sitemapXml'].includes(key)) return value === true ? 'good' : 'warning';
  if (key === 'imagesWithoutAlt' && typeof value === 'number') return value <= 3 ? 'good' : value <= 10 ? 'warning' : 'error';
  if (key === 'riskSignals' && Array.isArray(value)) return value.length === 0 ? 'good' : 'warning';
  if (typeof value === 'string' && /missing|needs|low|issue|failed/i.test(value)) return 'warning';
  return 'neutral';
}

function metricDetail(key: string, value: unknown): string {
  if (key === 'seoHealthScore') return '综合标题、描述、H1、HTTPS、robots、sitemap、图片 alt 和内容量生成。';
  if (key === 'titleStatus') return '标题标签影响搜索结果点击率和页面主题识别。';
  if (key === 'descriptionStatus') return '描述标签影响搜索结果摘要展示和点击意图。';
  if (key === 'h1Status') return 'H1 帮助搜索引擎理解页面核心主题。';
  if (key === 'imagesWithoutAlt') return '图片 alt 缺失会降低图片搜索和可访问性表现。';
  if (key === 'https') return 'HTTPS 是基础可信度和安全信号。';
  if (key === 'robotsTxt') return 'robots.txt 影响搜索引擎抓取规则。';
  if (key === 'sitemapXml') return 'sitemap.xml 帮助搜索引擎发现重要页面。';
  if (key === 'wordCount') return '正文内容量用于评估页面主题覆盖深度。';
  if (Array.isArray(value)) return value.length ? '系统识别到可进一步优化的项目。' : '当前未识别明显风险项。';
  return 'AI estimate 结果，用于快速判断优化优先级。';
}

function buildRows(result: Record<string, unknown>): MetricRow[] {
  return Object.entries(result)
    .filter(([key]) => key !== 'notice' && key !== 'error')
    .map(([key, value]) => ({
      label: labelMap[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase()),
      value: valueToString(value),
      status: metricStatus(key, value),
      detail: metricDetail(key, value)
    }));
}

function statusLabel(status: MetricRow['status']) {
  if (status === 'good') return 'Pass';
  if (status === 'warning') return 'Warning';
  if (status === 'error') return 'Error';
  return 'Info';
}

export default function ToolResultPanel({ result }: { result: Record<string, unknown> }) {
  const rows = buildRows(result);
  const score = typeof result.seoHealthScore === 'number'
    ? result.seoHealthScore
    : Math.max(48, Math.min(94, 86 - rows.filter((row) => row.status === 'error').length * 10 - rows.filter((row) => row.status === 'warning').length * 5));
  const errors = rows.filter((row) => row.status === 'error').length;
  const warnings = rows.filter((row) => row.status === 'warning').length;
  const passed = rows.filter((row) => row.status === 'good').length;
  const visibility = Math.max(35, Math.min(100, score + 7 - warnings * 2));
  const aiSearchHealth = Math.max(30, Math.min(100, score + 4 - errors * 4));
  const priorityRows = rows.filter((row) => row.status === 'error' || row.status === 'warning').slice(0, 5);

  return (
    <div className="hpv34ResultPanel hpv33Panel">
      <div className="hpv34ResultHeader">
        <div>
          <p className="hpv34ResultEyebrow">Quantified SEO Audit</p>
          <h3>检测结果总览</h3>
          <p>以下为 AI estimate / simulated preview，用于展示类似 Semrush 的量化检测结构。</p>
        </div>
        <div className="hpv34ResultScore">
          <strong>{score}</strong>
          <span>/100</span>
          <small>Site Health</small>
        </div>
      </div>

      <div className="hpv34AuditMetricGrid">
        <article><span>Site Health</span><b>{score}%</b><small>综合健康度</small></article>
        <article><span>AI Search Health</span><b>{aiSearchHealth}%</b><small>AI 搜索友好度</small></article>
        <article><span>Visibility</span><b>{visibility}%</b><small>页面可见性</small></article>
        <article><span>Errors</span><b>{errors}</b><small>高优先级问题</small></article>
        <article><span>Warnings</span><b>{warnings}</b><small>中优先级问题</small></article>
        <article><span>Passed</span><b>{passed}</b><small>已通过项目</small></article>
      </div>

      <div className="hpv34ResultTableWrap">
        <table className="hpv34ResultTable">
          <thead>
            <tr>
              <th>检测项目</th>
              <th>结果</th>
              <th>状态</th>
              <th>说明</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <td>{row.label}</td>
                <td>{row.value}</td>
                <td><span className={`hpv34Status hpv34Status-${row.status}`}>{statusLabel(row.status)}</span></td>
                <td>{row.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="hpv34PriorityBox">
        <h4>优先优化建议</h4>
        {priorityRows.length ? (
          <ol>
            {priorityRows.map((row) => <li key={row.label}><b>{row.label}</b>：{row.detail}</li>)}
          </ol>
        ) : (
          <p>当前核心检测项目表现较好，可继续扩展关键词、内容深度和外链建设。</p>
        )}
      </div>

      {result.notice ? <p className="hpv34ResultNotice">{String(result.notice)}</p> : null}
    </div>
  );
}
