'use client';

import { FormEvent, useState } from 'react';

type SubmitState = 'idle' | 'loading' | 'success' | 'error';

export default function SeoAuditForm() {
  const [status, setStatus] = useState<SubmitState>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('loading');
    setMessage('');

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || '提交失败，请稍后再试。');

      setStatus('success');
      setMessage('提交成功。我们已收到你的官网信息，会尽快进行初步诊断并联系你。');
      form.reset();
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : '提交失败，请稍后再试。');
    }
  }

  return (
    <form className="auditForm" onSubmit={handleSubmit}>
      <label>公司名称<input name="company" required placeholder="例如：Moyag AI" /></label>
      <label>官网链接<input name="website" required type="url" placeholder="https://example.com" /></label>
      <label>主营产品 / 服务<input name="product" required placeholder="例如：industrial parts, packaging machines" /></label>
      <label>目标市场<input name="market" required placeholder="例如：United States / Europe / Middle East" /></label>
      <label>当前主要问题
        <select name="problem" required defaultValue="">
          <option value="" disabled>请选择一个问题</option>
          <option>Google 搜不到</option>
          <option>官网没有流量</option>
          <option>有流量但没有询盘</option>
          <option>英文内容不专业</option>
          <option>不知道关键词怎么做</option>
          <option>想优化产品页</option>
          <option>想提升海外买家信任</option>
          <option>其他</option>
        </select>
      </label>
      <label>联系人<input name="contactName" required placeholder="你的姓名" /></label>
      <label>邮箱<input name="email" required type="email" placeholder="name@company.com" /></label>
      <label>WhatsApp / 微信<input name="messenger" placeholder="可选" /></label>
      <label className="full">补充说明<textarea name="note" rows={4} placeholder="可以简单描述你的官网现状或目标客户。" /></label>
      <button className="submitBtn" disabled={status === 'loading'} type="submit">
        {status === 'loading' ? '提交中...' : '提交官网检测'}
      </button>
      {message && <p className={`formMessage ${status}`}>{message}</p>}
    </form>
  );
}
