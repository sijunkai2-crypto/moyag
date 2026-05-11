import SeoAuditForm from './seo-audit-form';

const painPoints = [
  {
    title: 'Google 搜不到你的官网',
    desc: '网站上线了，但搜索品牌词、产品词、应用场景词都很难被 Google 正确识别。'
  },
  {
    title: '有页面，但没有询盘',
    desc: '页面看起来完整，却缺少买家信任、关键词布局、CTA 路径和转化触点。'
  },
  {
    title: '不知道先改哪里',
    desc: 'Title、Meta、H1、Robots、Sitemap、内容结构、收录风险混在一起，很难判断优先级。'
  }
];

const reportFeatures = [
  'SEO 综合评分',
  '风险等级判断',
  '执行摘要',
  '技术 SEO 检查',
  '内容与关键词建议',
  '转化路径诊断',
  '高优先级问题',
  '预计修复周期',
  '优先级行动计划'
];

const process = [
  {
    step: '01',
    title: '提交官网信息',
    desc: '填写官网、产品、目标市场和当前主要问题。'
  },
  {
    step: '02',
    title: '系统生成初步诊断',
    desc: '自动分析首页基础 SEO、页面结构、收录风险和转化线索。'
  },
  {
    step: '03',
    title: '获得专业报告摘要',
    desc: '输出风险等级、问题数量、高优先级事项和后续优化建议。'
  }
];

const audiences = [
  'B2B 外贸企业',
  '工业品 / 制造业官网',
  'SaaS / AI 工具产品',
  '跨境服务商',
  '想做 Google 获客的品牌官网',
  '准备升级英文官网的团队'
];

export default function HomePage() {
  return (
    <main className="v27Page">
      <header className="v27Nav">
        <div className="v27Container v27NavInner">
          <a className="v27Brand" href="#">
            <span>M</span>
            Moyag AI SEO
          </a>
          <nav>
            <a href="#value">服务价值</a>
            <a href="#report">报告内容</a>
            <a href="#process">流程</a>
            <a href="#audit-form">免费检测</a>
          </nav>
        </div>
      </header>

      <section className="v27Hero">
        <div className="v27Container v27HeroGrid">
          <div className="v27HeroCopy">
            <p className="v27Eyebrow">Google SEO Audit · B2B Lead Generation</p>
            <h1>把你的官网，变成能被 Google 找到的获客入口</h1>
            <p className="v27HeroText">
              Moyag AI SEO 为出海企业提供官网 SEO 初步诊断。输入官网地址，系统将生成专业报告摘要，识别技术 SEO、内容结构、收录风险与询盘转化短板。
            </p>

            <div className="v27HeroActions">
              <a className="v27PrimaryBtn" href="#audit-form">立即检测官网</a>
              <a className="v27GhostBtn" href="#report">查看报告内容</a>
            </div>

            <div className="v27TrustRow">
              <span>1 分钟提交</span>
              <span>专业 SEO 摘要</span>
              <span>风险等级判断</span>
              <span>高优先级问题识别</span>
            </div>
          </div>

          <aside className="v27ReportPreview">
            <div className="v27PreviewTop">
              <p>SEO Report Preview</p>
              <strong>Risk Level: Medium</strong>
            </div>

            <div className="v27ScoreCard">
              <span>SEO Score</span>
              <b>72</b>
              <em>/ 100</em>
            </div>

            <div className="v27MiniList">
              <div>
                <span>Technical SEO</span>
                <b>需要优化</b>
              </div>
              <div>
                <span>Content Structure</span>
                <b>存在缺口</b>
              </div>
              <div>
                <span>Conversion Path</span>
                <b>建议增强</b>
              </div>
            </div>

            <p className="v27PreviewNote">
              报告会同步保存到后台线索系统，便于后续跟进客户。
            </p>
          </aside>
        </div>
      </section>

      <section className="v27Strip" id="value">
        <div className="v27Container v27StripGrid">
          <div>
            <b>不是普通表单</b>
            <span>提交后自动生成 SEO 初步诊断</span>
          </div>
          <div>
            <b>不是泛泛建议</b>
            <span>输出风险等级、问题数量和修复优先级</span>
          </div>
          <div>
            <b>不是只看流量</b>
            <span>同时关注 Google 收录、内容结构和询盘转化</span>
          </div>
        </div>
      </section>

      <section className="v27Section">
        <div className="v27Container">
          <div className="v27SectionHead">
            <p className="v27Eyebrow">Common Problems</p>
            <h2>很多出海官网，不是产品不好，而是 Google 看不懂</h2>
            <p>
              SEO 问题通常藏在页面结构、关键词意图、技术配置和转化路径里。我们先帮你把问题拆开。
            </p>
          </div>

          <div className="v27CardGrid">
            {painPoints.map((item) => (
              <article className="v27Card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="v27Section v27SectionDark" id="report">
        <div className="v27Container v27ReportGrid">
          <div>
            <p className="v27Eyebrow">Professional SEO Report</p>
            <h2>你将获得一份更像顾问报告的 SEO 初步诊断</h2>
            <p className="v27LeadText">
              V2.6 已经支持综合评分、风险等级、执行摘要、分区诊断、预计修复周期和 follow-up 建议。V2.7 首页将这些能力前置展示，提高客户提交意愿。
            </p>
          </div>

          <div className="v27FeatureGrid">
            {reportFeatures.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="v27Section" id="process">
        <div className="v27Container">
          <div className="v27SectionHead">
            <p className="v27Eyebrow">How It Works</p>
            <h2>从官网链接到诊断报告，只需要三步</h2>
          </div>

          <div className="v27ProcessGrid">
            {process.map((item) => (
              <article className="v27ProcessCard" key={item.step}>
                <span>{item.step}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="v27Section v27AudienceSection">
        <div className="v27Container v27AudienceGrid">
          <div>
            <p className="v27Eyebrow">Best For</p>
            <h2>适合正在做海外获客的企业</h2>
            <p className="v27LeadText">
              如果你希望官网不只是品牌展示，而是真正承担 Google 搜索获客、询盘转化和销售线索沉淀，这套诊断会更适合你。
            </p>
          </div>

          <div className="v27AudienceList">
            {audiences.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="v27FormSection" id="audit-form">
        <div className="v27Container v27FormGrid">
          <div className="v27FormCopy">
            <p className="v27Eyebrow">Free SEO Audit</p>
            <h2>提交官网，获取初步 SEO 诊断</h2>
            <p>
              填写公司、官网、主营产品和目标市场后，系统会抓取首页并生成专业 SEO 初步报告。表单提交、后台线索、邮件通知和报告生成逻辑保持不变。
            </p>
            <ul>
              <li>识别 Google 收录与技术 SEO 风险</li>
              <li>判断内容结构和关键词覆盖问题</li>
              <li>给出高优先级优化方向</li>
            </ul>
          </div>

          <SeoAuditForm />
        </div>
      </section>
    </main>
  );
}
