(() => {
  "use strict";
  const data = window.CASHBACK_CONTENT;
  const main = document.getElementById("main");
  const navigation = document.getElementById("navigation");
  const sidebar = document.getElementById("sidebar");
  const scrim = document.getElementById("scrim");
  const menu = document.getElementById("open-nav");
  const modal = document.getElementById("image-modal");
  let currentGroup = null;
  let currentIndex = 0;
  let modalScale = 100;
  let restoreFocus = null;
  let toastTimer;
  const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  const href = (path) => `#${escape(path)}`;

  function closeNavigation() {
    sidebar.classList.remove("open");
    scrim.hidden = true;
    menu.setAttribute("aria-expanded", "false");
    if (modal.hidden) document.body.classList.remove("body-locked");
  }

  function buildNavigation() {
    let section = "";
    let index = 0;
    navigation.innerHTML = '<div class="nav-section">一、PRD及说明</div><a class="nav-link" data-nav="docs" href="#docs/overview"><span class="nav-order">01</span>PRD及说明</a>' + data.groups.map((group) => {
      let heading = "";
      if (section !== group.section) {
        heading = `<div class="nav-section">${escape(group.section)}</div>`;
        section = group.section;
        index = 0;
      }
      index++;
      return `${heading}<a class="nav-link" data-nav="${group.id}" href="#${group.id}/${group.pages[0].id}"><span class="nav-order">${String(index).padStart(2, "0")}</span>${escape(group.name)}<span class="nav-count">${String(group.pages.length).padStart(2, "0")}</span></a>`;
    }).join("");
  }

  function pageLead(label, title, description) {
    return `<div class="page-lead"><div class="section-label">${escape(label)}</div><h1>${escape(title)}</h1><p>${escape(description)}</p></div>`;
  }

  function footer() {
    return '<footer class="page-footer"><span>呆萌价返现功能 · V1.2 · 2026.10.10</span><span>PRD 及设计评审 · 原图与规则说明</span></footer>';
  }

  function docsTabs(selected) {
    return `<div class="docs-tabs" role="tablist" aria-label="说明与PRD"><a href="#docs/overview" class="docs-tab ${selected === "overview" ? "active" : ""}" role="tab" aria-selected="${selected === "overview"}">1、说明</a><a href="#docs/prd" class="docs-tab ${selected === "prd" ? "active" : ""}" role="tab" aria-selected="${selected === "prd"}">2、完整 PRD</a></div>`;
  }

  function overview() {
    return `${pageLead("一、PRD及说明", "PRD及说明", "返现的业务规则、三端流程与设计原图，按 V1.2 产品评审稿整理。")}${docsTabs("overview")}
      <section class="card overview-hero">
        <p class="eyebrow">DAIMENGJIA CASHBACK · 2026.10.10</p>
        <h2>呆萌价返现功能产品需求说明</h2>
        <p>用户提交订单号后，系统审核活动资格；确认收货满 7 天且无售后，返现生效。全托管自动确认，代理管由代理确认，平台运营通过支付宝打款。芝麻先垫付返现，再在平台结算后扣除垫付款，向代理结算剩余佣金。</p>
        <div class="overview-meta"><span>用户端小程序</span><span>代理端小程序</span><span>运营后台</span><span>25 张设计原图</span><span>17 章完整 PRD</span></div>
        <div class="journey" aria-label="返现流程">${[["01", "下单付款", "按活动与实付款匹配"], ["02", "申请返现", "设置支付宝，提交订单"], ["03", "收货生效", "收货满 7 天且无售后"], ["04", "确认返现", "全托管自动／代理确认"], ["05", "打款到账", "平台代打款，核对结果"]].map(([n, title, sub]) => `<div class="journey-step"><b>${n}</b><strong>${title}</strong><span>${sub}</span></div>`).join("")}</div>
      </section>
      <section class="card"><div class="card-title"><span class="card-number">01</span><h2>三端设计与操作路径</h2></div>
        <div class="card-grid">
          <a class="entry-card" href="#user-flow/initial"><div class="entry-top"><strong>用户端小程序</strong><span>09 张</span></div><p>设置个人支付宝、提交订单号，查看申请记录、生效说明和打款进度。</p><small>首页 → 收款设置 → 申请 → 记录</small><span class="entry-cta">查看用户端原图 →</span></a>
          <a class="entry-card" href="#agent-review/managed"><div class="entry-top"><strong>代理端小程序</strong><span>10 张</span></div><p>切换托管模式，确认返现；管理申请用户、黑名单和自建活动。</p><small>返现管理 → 审核确认 → 活动管理</small><span class="entry-cta">查看代理端原图 →</span></a>
          <a class="entry-card" href="#admin-teams/list"><div class="entry-top"><strong>运营后台</strong><span>06 张原图＋审核弹窗</span></div><p>设置团队、核对返现与代打款，查看用户及团队风险预警。</p><small>团队配置 → 返现审核 → 打款与预警</small><span class="entry-cta">查看运营后台原图 →</span></a>
        </div>
      </section>
      <section class="card"><div class="card-title"><span class="card-number">02</span><h2>两种管理模式</h2></div>
        <div class="table-scroll"><table><thead><tr><th>处理环节</th><th>全托管</th><th>代理管（自己管）</th></tr></thead><tbody>
          <tr><td>活动创建</td><td>官方统一创建，代理也可自建。</td><td>代理自行创建，按渠道及配置匹配。</td></tr>
          <tr><td>订单资格</td><td>系统自动审核。</td><td>仍由系统自动审核。</td></tr>
          <tr><td>生效后确认</td><td>自动确认，进入平台代打款。</td><td>等待代理同意或拒绝。</td></tr>
          <tr><td>实际打款</td><td>平台运营完成支付宝打款。</td><td>平台运营完成支付宝打款。</td></tr>
          <tr><td>垫付与结算</td><td colspan="2">芝麻垫付；平台结算后扣除垫付款，结算代理剩余佣金。</td></tr>
        </tbody></table></div>
        <div class="callout">管理模式与配置来源分别记录。“全托管／代理管”决定是否等待代理确认；“跟随官方／单独设置”决定采用哪套返现配置。</div>
      </section>
      <section class="card"><div class="card-title"><span class="card-number">03</span><h2>生效与打款状态</h2></div>
        <div class="table-scroll"><table><thead><tr><th>返现进度</th><th>进入条件与下一步</th></tr></thead><tbody>
          <tr><td>未生效</td><td>资格审核未完成、未通过，或尚未满足收货观察条件。合格且收货满 7 天无售后才生效。</td></tr>
          <tr><td>审核中</td><td>已生效且为代理管，等待代理确认。与系统申请资格审核中分别展示。</td></tr>
          <tr><td>打款中</td><td>全托管自动确认或代理同意，进入平台代打款，等待支付宝结果。</td></tr>
          <tr><td>已打款</td><td>支付宝确认打款成功，记入已返现金额并关联账单；后续维权保留真实到账事实。</td></tr>
          <tr><td>打款失败</td><td>少数情况下支付宝明确返回失败：保留历史与原因，不计为有效申请，用户可重新填写订单号申请。</td></tr>
        </tbody></table></div>
        <div class="callout"><strong>打款失败后：</strong>旧申请不计有效 → 用户回首页重新填写订单号 → 生成新申请并重新校验资格、生效与确认条件。打款中、结果未明或已打款的订单仍拦截重复申请。<a href="#user-flow/order">查看申请入口 →</a></div>
      </section>
      <section class="card"><div class="card-title"><span class="card-number">04</span><h2>金额与风险规则</h2></div>
        <ul class="rule-list">
          <li>区间下限 ≤ 订单实付款 ＜ 区间上限；未覆盖区间默认返现 0 元，显示返现金额只用于展示。</li>
          <li>例如 29 ≤ 实付款 ＜ 29.90，返现 10 元：29.00 元命中，29.90 元不命中这一段。</li>
          <li>预估利润＝佣金＋代理补贴－用户返现金额；不是实际结算净佣金。</li>
          <li>风险预警共四条：团队／用户单日金额＞限额，团队／用户连续 X 个自然日每日金额≥阈值。</li>
          <li>预警只统计北京时间自然日的实际成功金额，仅提示风险，允许继续打款。</li>
          <li>到账后维权达到 1 次及以上触发系统拉黑；黑名单与金额预警分别执行。</li>
        </ul>
      </section>
      <section class="card"><div class="card-title"><span class="card-number">05</span><h2>运营后台范围</h2></div>
        <div class="table-scroll"><table><thead><tr><th>页面</th><th>职责与要求</th><th>查看</th></tr></thead><tbody>
          <tr><td>团队与设置</td><td>托管状态、申请数、异常数；跟随官方／单独设置；去掉账户余额。</td><td><a href="#admin-teams/list">原图 →</a></td></tr>
          <tr><td>活动与区间</td><td>官方活动、商品、区间、时间和上架／显示。未提供独立后台设计图。</td><td><a href="#docs/prd/10">PRD →</a></td></tr>
          <tr><td>返现审核</td><td>资格分类与五种返现进度分开；拒绝需原因；修改重匹配并留日志。</td><td><a href="#admin-review/list">原图 →</a></td></tr>
          <tr><td>打款审核</td><td>管理类型、风险等级与审核弹窗；移除收款记录入口。明确失败不计有效，用户重新填写订单号申请；在途不重复打款。</td><td><a href="#admin-payouts/list">原图 →</a></td></tr>
          <tr><td>风险预警</td><td>四条规则独立启用；用户预警表与团队／用户每日明细。</td><td><a href="#admin-risk/rules">原图 →</a></td></tr>
        </tbody></table></div>
      </section>
      <section class="card"><div class="card-title"><span class="card-number">06</span><h2>评审范围与待确认</h2></div>
        <p class="quiet-note">页面使用“返现设计”文件夹中的原图，规则与说明以《呆萌价返现功能 PRD V1.2》为准。运营打款列表与弹窗已按本次截图更新，后台名称统一为“打款审核”。图中的其他旧字段、旧提示不作为已确认规则；各页旁边已标注差异。本页用于设计与需求评审，不连接真实订单、审核或资金接口。</p>
        <ul class="rule-list"><li>用户详情／黑名单、团队返现设置弹窗、后台活动列表、后台活动区间设置尚无独立设计图；完整要求已保留在 PRD。</li><li>活动冲突优先级、0 元申请归档、佣金覆盖阻断、3 个工作日起算点、拒绝状态与失败历史的筛选归类、未提交支付任务的账号更新时点、黑名单范围与风险统计边界需定稿。</li><li>风险等级判定规则待确认。验收清单 AC01—AC28 与全部待确认项可在完整 PRD 中查看。</li></ul>
        <a class="prd-link" href="#docs/prd/17"><span>查看第 17 章 · 评审待确认与需求覆盖</span><span>→</span></a>
      </section>${footer()}`;
  }

  function prdView() {
    return `${pageLead("一、PRD及说明", "完整 PRD", "来自《呆萌价返现功能 PRD V1.2》，保留全部 17 章、业务规则和验收清单。")}${docsTabs("prd")}
      <div class="prd-top"><label>章节定位 <select id="chapter-select" aria-label="选择PRD章节"><option value="">请选择章节</option>${data.sections.map((section) => `<option value="${section.number}">${section.number}　${escape(section.title)}</option>`).join("")}</select></label><a href="#docs/overview" class="prd-back">返回说明 ↑</a></div>
      <article class="card prd-document">${data.prd}</article>${footer()}`;
  }

  function notesList(title, items, className) {
    if (!items.length) return "";
    return `<section class="card ${className}"><h3>${title}</h3><ul>${items.map((item) => `<li>${escape(item)}</li>`).join("")}</ul></section>`;
  }

  function adminImage(group, item, zoomed = false) {
    const type = group.id === "admin-teams" ? "teams" : group.id === "admin-review" ? "review" : "risk";
    return `<div class="admin-source-frame ${zoomed ? "zoomed" : ""}"><img ${zoomed ? 'id="modal-image"' : ''} src="${item.image}" alt="${escape(item.title)} · 后台名称更新稿"><span class="admin-label ${type}">打款审核</span>${type === "review" ? '<span class="admin-label review-tab">打款审核</span>' : ''}</div>`;
  }

  function designView(group) {
    return `${pageLead(group.section, group.name, group.description)}
      <div class="gallery-summary"><span>共 ${group.pages.length} 个画面，已全部展开</span><span>按编号从左到右、从上到下阅读</span></div>
      <div class="design-gallery ${group.mobile ? "" : "desktop-gallery"}">${group.pages.map((item, index) => designCard(group, item, index)).join("")}</div>${footer()}`;
  }

  function designCard(group, item, index) {
    return `<article class="design-card ${group.mobile ? "" : "desktop-card"} ${item.id === "audit" ? "audit-card" : ""}" id="screen-${item.id}" aria-labelledby="title-${item.id}" tabindex="-1">
        <header class="design-card-heading"><span>${String(index + 1).padStart(2, "0")}</span><h2 id="title-${item.id}">${escape(item.title)}</h2></header>
        <section class="design-stage ${group.mobile ? "" : "desktop-stage"}" aria-label="设计原图预览">
          <div class="stage-bar"><span>${group.mobile ? "小程序设计原图" : "运营后台更新稿"}</span>${item.interactive ? '' : `<button data-zoom="${index}" aria-label="放大查看${escape(item.title)}">⤢ 放大查看</button>`}</div>
          <div class="screen-viewport" tabindex="0" aria-label="${escape(item.title)}，可滚动查看">${item.interactive ? window.CashbackAdmin.render(item.id === "audit") : group.mobile ? `<img src="${item.image}" alt="${escape(item.title)} · 返现设计原图" fetchpriority="high" draggable="false">` : adminImage(group, item)}</div>
          <div class="screen-caption">${item.interactive ? "点击每行“审核”打开弹窗 · 可切换同意／拒绝并查看演示反馈" : group.mobile ? "长图可在画面内滚动 · 放大查看完整原图" : "后台名称已更新 · 放大查看完整画面"}</div>
        </section>
        <aside class="notes" aria-label="功能和交互说明">
          <section class="card"><div class="note-eyebrow"><span>${group.mobile ? "设计原图" : "运营更新稿"}</span><span>${String(index + 1).padStart(2, "0")} / ${String(group.pages.length).padStart(2, "0")}</span></div><h2>${escape(item.title)}</h2><p class="purpose">${escape(item.purpose)}</p><div class="note-label">主要功能与操作</div>
            <ol class="annotation-list">${item.points.map((p, i) => `<li><span class="annotation-number">${i + 1}</span><div class="annotation-content"><strong>${escape(p.label)}</strong><p>${escape(p.text)}</p>${p.target ? `<a href="${href(p.target)}">查看关联页面 →</a>` : ""}</div></li>`).join("")}</ol>
            <a class="prd-link" href="#docs/prd/${item.chapter}"><span>关联 PRD · 第 ${item.chapter} 章</span><span>↗</span></a>
          </section>
          ${notesList("V1.2 规则说明", item.updates, "rule-notes")}
          ${notesList("待确认／设计待补", item.pending, "pending-notes")}
          <div class="notes-source">画面依据：${item.interactive ? "2026年10月10日提供的打款审核列表及弹窗截图" : escape(item.source)}<br>规则依据：PRD V1.2${group.mobile ? "" : "＋本次运营端补充需求"} ／ 仅用于评审。</div>
        </aside>
      </article>`;
  }

  function render() {
    if (!modal.hidden) closeModal();
    closeNavigation();
    const parts = location.hash.slice(1).split("/");
    const section = parts[0] || "docs";
    let title;
    const previousGroup = currentGroup;
    currentGroup = null;
    if (section === "docs") {
      const isPrd = parts[1] === "prd";
      main.innerHTML = isPrd ? prdView() : overview();
      title = isPrd ? "完整 PRD" : "PRD及说明";
      if (isPrd) {
        const select = document.getElementById("chapter-select");
        select.addEventListener("change", () => {
          if (select.value) location.hash = `docs/prd/${select.value}`;
        });
        if (parts[2] && data.sections.some((s) => s.number === parts[2])) {
          select.value = parts[2];
          requestAnimationFrame(() => document.getElementById(`prd-section-${parts[2]}`).scrollIntoView({ block: "start" }));
        } else window.scrollTo(0, 0);
      } else window.scrollTo(0, 0);
    } else {
      currentGroup = data.groups.find((group) => group.id === section);
      if (!currentGroup) {
        main.innerHTML = '<section class="card empty-route"><h1>未找到这个页面</h1><p>页面地址可能不完整，请从目录选择。</p><a href="#docs/overview">回到 PRD及说明 →</a></section>';
        title = "页面未找到";
      } else {
        currentIndex = Math.max(0, currentGroup.pages.findIndex((item) => item.id === parts[1]));
        if (previousGroup !== currentGroup) {
          main.innerHTML = designView(currentGroup);
          main.querySelectorAll("[data-zoom]").forEach((button) => button.addEventListener("click", () => {
            currentIndex = Number(button.dataset.zoom);
            openModal();
          }));
          main.querySelectorAll(".design-card:has(.ops-preview)").forEach((card) => window.CashbackAdmin.bind(card));
        }
        title = `${currentGroup.name} ／ ${currentGroup.pages[currentIndex].title}`;
        main.querySelectorAll(".design-card").forEach((card, index) => card.classList.toggle("linked-card", index === currentIndex));
        if (currentIndex > 0 || previousGroup === currentGroup) {
          const card = document.getElementById(`screen-${currentGroup.pages[currentIndex].id}`);
          card.scrollIntoView({ block: "start" });
          card.focus({ preventScroll: true });
        } else window.scrollTo(0, 0);
      }
    }
    document.title = `${title} · 呆萌价返现功能`;
    document.getElementById("breadcrumb-title").textContent = title;
    navigation.querySelectorAll("[data-nav]").forEach((link) => {
      const active = link.dataset.nav === section;
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  }

  function updateZoom() {
    const img = document.getElementById("modal-image");
    const base = currentGroup.mobile ? 375 : 1300;
    img.style.width = `${base * modalScale / 100}px`;
    img.closest(".admin-source-frame")?.style.setProperty("--image-width", `${base * modalScale / 100}px`);
    document.getElementById("zoom-value").textContent = `${modalScale}%`;
    document.getElementById("zoom-out").disabled = modalScale <= 50;
    document.getElementById("zoom-in").disabled = modalScale >= 200;
  }

  function openModal() {
    const item = currentGroup.pages[currentIndex];
    restoreFocus = document.activeElement;
    document.getElementById("modal-scroll").innerHTML = currentGroup.mobile ? `<img id="modal-image" src="${item.image}" alt="${escape(item.title)}完整设计原图">` : adminImage(currentGroup, item, true);
    document.getElementById("modal-title").textContent = item.title;
    modalScale = currentGroup.mobile ? 100 : (window.innerWidth < 700 ? 75 : 100);
    updateZoom();
    modal.hidden = false;
    document.body.classList.add("body-locked");
    document.getElementById("modal-scroll").scrollTo(0, 0);
    document.getElementById("close-modal").focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove("body-locked");
    if (restoreFocus && restoreFocus.isConnected) restoreFocus.focus({ preventScroll: true });
  }

  function toast(message) {
    const element = document.getElementById("toast");
    element.textContent = message;
    element.classList.add("visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => element.classList.remove("visible"), 2800);
  }

  menu.addEventListener("click", () => {
    sidebar.classList.add("open");
    scrim.hidden = false;
    menu.setAttribute("aria-expanded", "true");
    document.body.classList.add("body-locked");
    (sidebar.querySelector(".nav-link.active") || sidebar.querySelector(".nav-link")).focus();
  });
  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeNavigation();
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) closeNavigation();
  });
  document.getElementById("close-nav").addEventListener("click", () => { closeNavigation(); menu.focus(); });
  scrim.addEventListener("click", closeNavigation);
  document.getElementById("close-modal").addEventListener("click", closeModal);
  document.getElementById("zoom-out").addEventListener("click", () => { modalScale = Math.max(50, modalScale - 25); updateZoom(); });
  document.getElementById("zoom-in").addEventListener("click", () => { modalScale = Math.min(200, modalScale + 25); updateZoom(); });
  document.getElementById("share-link").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      toast("已复制当前页面链接");
    } catch { toast("请复制浏览器地址栏中的页面链接"); }
  });
  document.querySelector(".skip-link").addEventListener("click", (event) => {
    event.preventDefault();
    main.focus();
    main.scrollIntoView({ block: "start" });
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (!modal.hidden) closeModal();
      if (sidebar.classList.contains("open")) { closeNavigation(); menu.focus(); }
    }
    if (event.key === "Tab" && (!modal.hidden || sidebar.classList.contains("open"))) {
      const root = modal.hidden ? sidebar : modal;
      const controls = [...root.querySelectorAll("a[href],button:not(:disabled),select,[tabindex='0']")].filter((el) => el.getClientRects().length);
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  window.addEventListener("hashchange", render);
  buildNavigation();
  render();
})();
