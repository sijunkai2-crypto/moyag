import SeoAuditForm from './seo-audit-form';

const services = [
  ['SEO 战略诊断', '分析官网现状、目标市场、产品关键词、页面结构与索引问题，输出可执行优化路线图。'],
  ['关键词增长体系', '围绕产品词、应用场景词、目标市场词、采购意图词，建立 Google 可持续获客关键词矩阵。'],
  ['技术 SEO 优化', '检查 Title、Meta、H1/H2、Canonical、Robots、图片 Alt、内链、移动端适配等基础问题。'],
  ['内容与落地页建设', '为 B2B、SaaS、AI 工具、跨境服务商设计产品页、应用页、案例页和内容集群。'],
  ['线索转化优化', '优化 CTA、表单、邮箱、电话、WhatsApp、询盘入口，让流量变成销售机会。'],
  ['专业 SEO 报告', '生成综合评分、风险等级、问题数量、高优先级事项、预计修复周期和分区行动计划。']
];

const reportItems = ['执行摘要', '技术 SEO', '页面结构', '内容与关键词', '转化线索', '竞争与增长机会', '优先级行动计划'];

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="container heroGrid">
          <div>
            <p className="eyebrow">Moyag AI · Google SEO Growth System</p>
            <h1>帮出海企业把官网变成稳定获客机器</h1>
            <p className="heroText">
              我们为 B2B、SaaS、AI 工具、跨境服务商提供 Google SEO 策略、关键词布局、内容体系、技术优化与线索转化页面建设。
            </p>
            <div className="heroActions">
              <a className="primaryBtn" href="#audit-form">获取 SEO 诊断</a>
              <a className="secondaryBtn" href="#services">查看服务内容</a>
            </div>
            <p className="note">提交官网后，系统会生成初步 SEO 诊断报告，并保存到后台线索系统。</p>
          </div>

          <div className="heroCard">
            <p className="cardLabel">Professional SEO Report</p>
            <h2>从“官网好不好看”变成“能不能被 Google 找到”</h2>
            <p>报告覆盖技术 SEO、页面结构、关键词覆盖、国际市场适配、询盘入口和增长机会。</p>
          </div>
        </div>
      </section>

      <section className="section muted">
        <div className="container">
          <p className="eyebrow">SEO Diagnosis</p>
          <h2>我们会检测什么</h2>
          <p className="sectionText">从 Google 搜索理解、海外买家信任、询盘转化三个层面拆解官网问题。</p>
          <div className="checks">
            {reportItems.map((item) => <span key={item}>{item}</span>)}
          </div>
        </div>
      </section>

      <section className="section" id="services">
        <div className="container">
          <p className="eyebrow">Services</p>
          <h2>我们提供什么服务</h2>
          <p className="sectionText">适合想用 Google 获得海外客户、询盘、Demo 预约、咨询线索的企业。</p>
          <div className="gridList">
            {services.map(([title, desc]) => (
              <div className="listCard" key={title}>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section muted">
        <div className="container">
          <p className="eyebrow">Why Moyag</p>
          <h2>我们关注的是“搜索流量资产”</h2>
          <div className="gridList">
            <div className="listCard">
              <h3>不是只做排名</h3>
              <p>排名只是表层，我们更关注关键词是否能带来真实买家、咨询和商机。</p>
            </div>
            <div className="listCard">
              <h3>不是只写文章</h3>
              <p>内容需要服务于产品页、场景页、案例页和转化路径，而不是孤立存在。</p>
            </div>
            <div className="listCard">
              <h3>不是只做检测</h3>
              <p>报告必须能落到行动计划，包括优先级、修复周期和预期收益。</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section formSection" id="audit-form">
        <div className="container formGrid">
          <div>
            <p className="eyebrow">Free SEO Audit</p>
            <h2>提交官网，获取初步 SEO 诊断</h2>
            <p className="sectionText">
              填写公司、官网、产品和目标市场后，系统会抓取首页并生成专业 SEO 初步报告。
            </p>
          </div>
          <SeoAuditForm />
        </div>
      </section>
    </main>
  );
}
