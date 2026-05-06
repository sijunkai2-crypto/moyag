import SeoAuditForm from './seo-audit-form';

const checks = [
  'Page Title / Meta Description',
  'H1 / H2 页面结构',
  '关键词相关性',
  '英文内容表达',
  'Contact / Inquiry 转化入口',
  'sitemap.xml / robots.txt 基础检查'
];

const painPoints = [
  'Google 搜不到你的官网',
  '官网有访问但没有询盘',
  '英文页面像机器翻译，缺少信任感',
  '产品页内容太薄，无法覆盖海外买家搜索意图',
  '表单、邮箱、WhatsApp 入口不明显',
  '不知道该围绕哪些关键词布局'
];

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="container heroGrid">
          <div>
            <p className="eyebrow">Moyag AI SEO Growth Agent</p>
            <h1>免费检测你的英文官网 SEO 问题</h1>
            <p className="heroText">
              快速分析你的官网在 Google 搜索、页面结构、关键词布局和询盘转化方面的问题，获得一份可执行的初步优化建议。
            </p>
            <div className="heroActions">
              <a href="#audit-form" className="primaryBtn">立即检测官网</a>
              <a href="#how-it-works" className="secondaryBtn">查看检测内容</a>
            </div>
            <p className="note">适合外贸企业、B2B 制造商、跨境服务商和出海品牌。</p>
          </div>
          <div className="heroCard">
            <p className="cardLabel">First-step MVP</p>
            <h2>提交官网链接，我们先做初步诊断。</h2>
            <p>第一阶段不做复杂后台，不承诺排名，只做能带来销售线索的官网 SEO 诊断闭环。</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="eyebrow">Why it matters</p>
          <h2>你的官网可能不是没有客户，而是 Google 和海外买家都看不懂。</h2>
          <div className="gridList">
            {painPoints.map((item) => <div className="listCard" key={item}>{item}</div>)}
          </div>
        </div>
      </section>

      <section className="section muted" id="how-it-works">
        <div className="container">
          <p className="eyebrow">What we check</p>
          <h2>一次检测，覆盖 SEO、英文内容和询盘转化。</h2>
          <div className="checks">
            {checks.map((item) => <span key={item}>{item}</span>)}
          </div>
        </div>
      </section>

      <section className="section formSection" id="audit-form">
        <div className="container formGrid">
          <div>
            <p className="eyebrow">Start here</p>
            <h2>提交官网，获取 SEO 初步诊断</h2>
            <p className="sectionText">
              我们会记录你的官网、主营产品、目标市场和当前问题。后台收到线索后，团队可以用 AI + 人工审核生成诊断报告，再进行销售跟进。
            </p>
          </div>
          <SeoAuditForm />
        </div>
      </section>
    </main>
  );
}
