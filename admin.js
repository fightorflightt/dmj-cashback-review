(() => {
  const rows = [
    ['Lucy(7022FI)','3611423018630429','低风险'],['18663106141(8D8E58)','3611494014665656','中风险'],['18018127482(B616G6)','3611493009460261','高风险'],['18018127482(B616G6)','3611442017937164','低风险'],['15354258700(8EJOG4)','3611416019423642','中风险'],['17557292746(D950JA)','3611499014875337','低风险'],['13655717609(98IUJ3)','3611480009660182','高风险'],['Aa..(083EL6)','3611491014895930','中风险'],['15996318126(1AIE2H)','3611420018676410','低风险'],['18321853489(CH212D)','3611416005317298','中风险']
  ];
  const riskClass = risk => ({低风险:'low',中风险:'medium',高风险:'high'}[risk]);
  function render(open = false) {
    return `<div class="ops-preview"><aside class="ops-side"><div class="ops-brand">大运营商收益</div>${['运营管理','活动管理','社区管理','红包管理','积分系统','团队列表','用户列表','晒单审核','积分管理','礼品列表','活动列表','积分商城','商品列表','返现活动','返现审核','打款审核','抽奖管理'].map(name=>`<div class="ops-nav ${name==='打款审核'?'selected':''}">${name}</div>`).join('')}</aside><section class="ops-main"><header class="ops-header">首页　／　积分系统　／　<strong>打款审核</strong><span>管理员</span></header><div class="ops-tabs">用户列表　　返现活动　　商品列表　　团队列表　　订单列表　　<span>打款审核</span></div><form class="ops-filters"><label>所属团队：<select name="team"><option value="">请选择所属团队</option><option>布布姐团队</option></select></label><label>手机号码：<input name="phone" placeholder="搜索手机号码"></label><label>支付宝号：<input name="alipay" placeholder="搜索支付宝号"></label><label>打款（代理）：<input type="date" name="agentDate"></label><label>审核时间：<input type="date" name="auditDate" aria-label="打款审核时间"></label><label>收款状态：<select name="status"><option value="">请选择</option><option>待打款</option><option>已打款</option></select></label><div><button type="reset">重置</button><button class="ops-primary" type="submit">查询</button></div></form><div class="ops-card"><div class="ops-status-tabs">${['全部','待审核','已通过','未通过'].map((t,i)=>`<button type="button" data-ops-tab="${t}" class="${i===0?'active':''}">${t}${i===0?'　99+':i===2?'　99+':i===3?'　8':''}</button>`).join('')}</div><div class="ops-table-scroll"><table class="ops-table"><thead><tr>${['芝麻账号','呆萌价账号','补贴金额','商品名','订单号','风险等级','姓名','支付宝','管理类型','所属团队','申请时间','操作'].map(t=>`<th>${t}</th>`).join('')}</tr></thead><tbody>${rows.map((r,i)=>`<tr data-ops-row="${i}"><td>—</td><td>${r[0]}</td><td>10</td><td>良品铺子良辰月飞花510…</td><td>${r[1]}</td><td><span class="ops-risk ${riskClass(r[2])}">${r[2]}</span></td><td>—</td><td>—</td><td>${i%2?'代理管':'全托管'}</td><td>布布姐团队</td><td>2026-09-07<br>16:18:${20+i}</td><td><button class="ops-audit" data-ops-audit="${i}">审核</button></td></tr>`).join('')}</tbody></table></div><div class="ops-pagination"><span data-ops-count>示例数据 · 共10条</span>　<button disabled>上一页</button><button class="active">1</button><button disabled>下一页</button>　10条／页</div></div><p class="ops-demo-note">评审演示 · 风险等级为示例，判定规则待确认</p></section><div class="ops-dialog-layer" ${open?'':'hidden'}><section class="ops-dialog" role="dialog" aria-modal="true" aria-label="打款审核"><header><h2>打款审核</h2><button data-ops-close aria-label="关闭打款审核">关闭</button></header><form class="ops-audit-form"><div class="ops-approval">审批状态：<label><input type="radio" name="approval" value="agree" checked>同意</label><label><input type="radio" name="approval" value="reject">拒绝</label></div><section class="ops-warning"><div class="ops-warning-head"><strong>风险预警</strong><span>示例数据：命中4项</span></div><h3>团队风险</h3><p><span>单日超额：</span>今日已打款620元，超过预警限额500元。</p><p><span>连续多日达标：</span>已连续3天每天打款≥300元，达到预警天数3天。</p><h3>个人风险</h3><p><span>单日超额：</span>今日已打款190元，超过预警限额100元。</p><p><span>连续多日达标：</span>已连续4天每天打款≥100元，达到预警天数3天。</p><small>按北京时间自然日统计成功打款金额。仅预警，仍允许继续打款。</small></section><section class="ops-details"><div class="ops-person"><strong data-ops-person>fghtorflight</strong><span>支付宝：曾馨馨（18039090515）</span><span>芝麻知妈</span></div><dl>${[['补贴金额','2.00元'],['预估利润','2.00元'],['实付款','4.00元'],['佣金＋补贴','3.23元'],['本月已打款','840.00元'],['累计已打款','1236.00元'],['订单直属','嘻嘻哈哈（上级）'],['今日已打款','190.00元'],['商品名','商品名前10个字'],['订单号','23453222132'],['申请时间','2026-10-10 09:23:12'],['打款审核时间','2026-10-10 10:23:12']].map(([k,v])=>`<div><dt>${k}</dt><dd data-ops-field="${k}" ${k==='订单号'?'data-ops-order':''}>${v}</dd></div>`).join('')}</dl></section><p class="ops-feedback" role="status" hidden></p><footer><button type="button" data-ops-close>取消</button><button class="ops-primary" type="submit">确定</button></footer></form></section></div></div>`;
  }
  function bind(root) {
    const layer = root.querySelector('.ops-dialog-layer');
    if (!layer) return;
    const inline = root.classList.contains('audit-card');
    if (inline) {
      layer.querySelector('.ops-dialog').removeAttribute('aria-modal');
      layer.querySelector('.ops-dialog').setAttribute('role','group');
    }
    let opener;
    const close = () => {
      if (inline) {
        root.querySelector('.ops-audit-form').reset();
        layer.querySelector('.ops-feedback').hidden=true;
      } else { layer.hidden=true; document.body.classList.remove('body-locked'); opener?.focus(); }
    };
    root.querySelectorAll('[data-ops-audit]').forEach(button=>button.addEventListener('click',()=>{
      opener=button; const row=rows[Number(button.dataset.opsAudit)];
      layer.querySelector('[data-ops-person]').textContent=row[0];
      layer.querySelector('[data-ops-order]').textContent=row[1];
      layer.querySelector('[data-ops-field="补贴金额"]').textContent='10.00元';
      layer.querySelector('[data-ops-field="预估利润"]').textContent='-6.77元';
      layer.querySelector('[data-ops-field="商品名"]').textContent='良品铺子良辰月飞花510…';
      layer.querySelector('[data-ops-field="申请时间"]').textContent=`2026-09-07 16:18:${20+Number(button.dataset.opsAudit)}`;
      layer.querySelector('.ops-audit-form').reset();
      layer.querySelector('.ops-feedback').hidden=true;
      layer.hidden=false; document.body.classList.add('body-locked'); layer.querySelector('input').focus({preventScroll:true});
    }));
    root.querySelectorAll('[data-ops-close]').forEach(button=>button.addEventListener('click',close));
    layer.addEventListener('keydown',event=>{
      if(event.key==='Escape'){event.stopPropagation();close();}
      if(event.key==='Tab'&&!inline){
        const controls=[...layer.querySelectorAll('button,input')];
        const first=controls[0],last=controls.at(-1);
        if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
        if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
      }
    });
    root.querySelector('.ops-audit-form').addEventListener('submit',event=>{
      event.preventDefault(); const result=new FormData(event.target).get('approval');
      const feedback=layer.querySelector('.ops-feedback'); feedback.hidden=false;
      feedback.textContent=result==='agree'?'演示：审核同意，等待实际打款结果；风险预警不阻止继续打款。':'演示：审核拒绝，未发起打款。';
    });
    const filter=root.querySelector('.ops-filters');
    function filterRows() {
      const query=new FormData(filter); let count=0;
      root.querySelectorAll('[data-ops-row]').forEach(tr=>{const row=rows[Number(tr.dataset.opsRow)]; const visible=(!query.get('phone')||row[0].includes(query.get('phone')))&&!query.get('alipay')&&!query.get('agentDate')&&(!query.get('auditDate')||query.get('auditDate')==='2026-10-10')&&(!query.get('status')||query.get('status')==='待打款');tr.hidden=!visible;if(visible)count++;});
      root.querySelector('[data-ops-count]').textContent=`示例数据 · 共${count}条`;
    }
    filter.addEventListener('submit',event=>{event.preventDefault();filterRows();});
    filter.addEventListener('reset',()=>setTimeout(filterRows,0));
    root.querySelectorAll('[data-ops-tab]').forEach(button=>button.addEventListener('click',()=>{
      root.querySelectorAll('[data-ops-tab]').forEach(b=>b.classList.toggle('active',b===button));
      const show=['全部','待审核'].includes(button.dataset.opsTab); root.querySelectorAll('[data-ops-row]').forEach(tr=>tr.hidden=!show);
      root.querySelector('[data-ops-count]').textContent=`示例数据 · 共${show?10:0}条`;
    }));
  }
  window.CashbackAdmin={render,bind};
})();
