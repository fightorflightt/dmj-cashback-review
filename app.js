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
  const previewRanges = new Map();
  const rangeSamples = {
    "本日": [2, 1, "16.25", "24.00"],
    "本月": [12, 9, "156.25", "134.00"],
    "上月": [8, 11, "300.00", "100.00"],
    "总计": [20, 20, "456.25", "234.00"],
  };
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
    return '<footer class="page-footer"><span>呆萌价返现功能 · V1.3 · 2026.10.19</span><span>PRD 及设计评审 · 原图与规则说明</span></footer>';
  }

  function docsTabs(selected) {
    return `<div class="docs-tabs" role="tablist" aria-label="说明与PRD"><a href="#docs/overview" class="docs-tab ${selected === "overview" ? "active" : ""}" role="tab" aria-selected="${selected === "overview"}">1、说明</a><a href="#docs/prd" class="docs-tab ${selected === "prd" ? "active" : ""}" role="tab" aria-selected="${selected === "prd"}">2、完整 PRD</a></div>`;
  }

  function overview() {
    const introduction = data.prd.slice(data.prd.indexOf('<h2 id="prd-section-1">'), data.prd.indexOf('<h2 id="prd-section-3">'));
    return `${pageLead("一、PRD及说明", "PRD及说明", "按具体页面整理的简版 PRD，已合并全托管、发单识别和结算扣款规则。")}${docsTabs("overview")}
      <section class="card prd-document">${introduction}</section>
      <section class="card"><div class="card-title"><span class="card-number">01</span><h2>三端设计与操作路径</h2></div>
        <div class="card-grid">
          <a class="entry-card" href="#user-flow/initial"><div class="entry-top"><strong>用户端小程序</strong><span>09 张</span></div><p>设置个人支付宝、提交订单号，查看申请记录、生效说明和打款进度。</p><small>首页 → 收款设置 → 申请 → 记录</small><span class="entry-cta">查看用户端原图 →</span></a>
          <a class="entry-card" href="#agent-review/managed"><div class="entry-top"><strong>代理端小程序</strong><span>10 张</span></div><p>切换托管模式，确认返现；管理申请用户、黑名单和自建活动。</p><small>返现管理 → 审核确认 → 活动管理</small><span class="entry-cta">查看代理端原图 →</span></a>
          <a class="entry-card" href="#admin-teams/list"><div class="entry-top"><strong>运营后台</strong><span>06 张原图＋审核弹窗</span></div><p>设置团队、核对返现与代打款，查看用户及团队风险预警。</p><small>团队配置 → 返现审核 → 打款与预警</small><span class="entry-cta">查看运营后台原图 →</span></a>
        </div>
      </section>
      <section class="card"><div class="card-title"><h2>支付宝打款与结算扣款</h2></div>
        <p>芝麻先通过支付宝垫付返现，订单佣金结算后扣除垫付款，再向代理结算剩余佣金。佣金不足时，未扣清部分继续从代理后续佣金中抵扣。</p>
        <div class="table-scroll"><table><thead><tr><th>App“我的订单”情况</th><th>订单标签</th></tr></thead><tbody>
          <tr><td>已打款给用户，尚未向代理扣清垫付款</td><td>返现-未扣款</td></tr>
          <tr><td>已打款给用户，已向代理扣清垫付款</td><td>返现-已扣款</td></tr>
        </tbody></table></div>
        <p>后端根据返现打款表及时更新相关订单，扣清后更换标签，并同步账单；同一笔返现不重复打款或扣款。</p>
        <a class="prd-link" href="#docs/prd/5"><span>查看打款、订单标签与结算扣款规则</span><span>→</span></a>
      </section>
      <section class="card"><div class="card-title"><h2>风险预警与黑名单</h2></div>
        <p>收货满7天且无售后才生效。到账后维权由系统自动拉黑，代理也可手动拉黑。团队和个人打款预警在审核时展示，仅作提醒，不自动阻止打款。</p>
        <a class="prd-link" href="#docs/prd/6"><span>查看风险预警与黑名单规则</span><span>→</span></a>
      </section>
      <section class="card"><h2>评审范围</h2><p class="quiet-note">设计画面保留原图，业务规则以已确认的简版 PRD V1.3 为准。新增H5代理管理页面和App“我的订单”标签尚无独立设计图，要求已写入PRD。本网站用于评审，不连接真实订单、审核、发单或支付接口。</p>
        <a class="prd-link" href="#docs/prd/7"><span>查看验收重点</span><span>→</span></a>
      </section>${footer()}`;
  }

  function prdView() {
    return `${pageLead("一、PRD及说明", "完整 PRD", "按已确认内容整理为7章，包含具体页面、发单识别、订单标签、扣款与验收重点。")}${docsTabs("prd")}
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

  function hasMobileControls(group, item) {
    return (group.id === "user-flow" && item.id === "initial") ||
      (group.id === "agent-review" && ["managed", "manual"].includes(item.id));
  }

  function mobileImage(group, item, zoomed = false) {
    const user = group.id === "user-flow";
    const key = `${group.id}/${item.id}`;
    const range = previewRanges.get(key) || "总计";
    const labels = ["待生效(笔)", "审核中(笔)", "打款中(元)", "已打款(元)"];
    return `<div class="mobile-prototype ${zoomed ? "zoomed" : ""}">
      <div class="screen-viewport" tabindex="0" aria-label="${escape(item.title)}，可滚动查看">
        <div class="mobile-source"><img ${zoomed ? 'id="modal-image"' : ''} src="${item.image}" alt="${escape(item.title)} · 交互更新稿" draggable="false">
          ${user ? `<button class="prototype-paste" data-paste aria-label="粘贴订单号">粘贴</button><button class="prototype-alipay" data-set-alipay aria-label="设置支付宝">去设置 ›</button>` :
            `<section class="agent-stat-overlay" data-stat-key="${key}" aria-label="返现概况">
              <div class="agent-stat-header"><span>返现概况</span><div class="agent-range" role="group" aria-label="统计时间">${Object.keys(rangeSamples).map(label => `<button aria-pressed="${label === range}" data-range="${label}">${label}</button>`).join("")}</div></div>
              <div class="agent-metrics" aria-live="polite">${labels.map((label, index) => `<div><strong data-stat-value>${rangeSamples[range][index]}</strong><span>${label}</span></div>`).join("")}</div>
            </section>`}
        </div>
      </div>
      ${user ? `<div class="phone-prompt" hidden role="dialog" aria-modal="true" aria-label="设置支付宝提示"><section><h3>提示</h3><p>请先设置支付宝，否则无法打款。</p><div><button data-dismiss-prompt>取消</button><button data-go-settings>去设置</button></div></section></div>` : ''}
    </div>`;
  }

  function bindMobileControls(root) {
    root.querySelectorAll(".mobile-prototype").forEach(preview => {
      const prompt = preview.querySelector(".phone-prompt");
      const paste = preview.querySelector("[data-paste]");
      function closePrompt() {
        prompt.hidden = true;
        paste.focus({ preventScroll: true });
      }
      function goToSettings() {
        if (prompt) prompt.hidden = true;
        if (!modal.hidden) closeModal();
        if (location.hash === "#user-flow/alipay") {
          const settings = document.getElementById("screen-alipay");
          settings.scrollIntoView({ block: "start" });
          settings.focus({ preventScroll: true });
        } else location.hash = "user-flow/alipay";
      }
      if (paste) {
        paste.addEventListener("click", () => {
          prompt.hidden = false;
          prompt.querySelector("[data-go-settings]").focus({ preventScroll: true });
        });
        preview.querySelector("[data-dismiss-prompt]").addEventListener("click", closePrompt);
        preview.querySelector("[data-go-settings]").addEventListener("click", goToSettings);
        preview.querySelector("[data-set-alipay]").addEventListener("click", goToSettings);
        prompt.addEventListener("keydown", event => {
          if (event.key === "Escape") { event.stopPropagation(); closePrompt(); }
          if (event.key === "Tab") {
            event.stopPropagation();
            event.preventDefault();
            const buttons = [...prompt.querySelectorAll("button")];
            buttons[(buttons.indexOf(document.activeElement) + 1) % buttons.length].focus({ preventScroll: true });
          }
        });
      }
      preview.querySelectorAll("[data-range]").forEach(button => button.addEventListener("click", () => {
        const panel = button.closest("[data-stat-key]");
        const range = button.dataset.range;
        previewRanges.set(panel.dataset.statKey, range);
        document.querySelectorAll("[data-stat-key]").forEach(instance => {
          if (instance.dataset.statKey !== panel.dataset.statKey) return;
          instance.querySelectorAll("[data-range]").forEach(control => control.setAttribute("aria-pressed", String(control.dataset.range === range)));
          instance.querySelectorAll("[data-stat-value]").forEach((value, index) => { value.textContent = rangeSamples[range][index]; });
        });
      }));
    });
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
          <div class="stage-bar"><span>${group.mobile ? hasMobileControls(group, item) ? "小程序交互更新稿" : "小程序设计原图" : "运营后台更新稿"}</span>${item.interactive ? '' : `<button data-zoom="${index}" aria-label="放大查看${escape(item.title)}">⤢ 放大查看</button>`}</div>
          ${hasMobileControls(group, item) ? mobileImage(group, item) : `<div class="screen-viewport" tabindex="0" aria-label="${escape(item.title)}，可滚动查看">${item.interactive ? window.CashbackAdmin.render(item.id === "audit") : group.mobile ? `<img src="${item.image}" alt="${escape(item.title)} · 返现设计原图" fetchpriority="high" draggable="false">` : adminImage(group, item)}</div>`}
          <div class="screen-caption">${item.interactive ? "点击每行“审核”打开弹窗 · 可切换同意／拒绝并查看演示反馈" : hasMobileControls(group, item) ? group.id === "user-flow" ? "点击画面中的“粘贴”体验设置提示" : "可切换统计时间 · 数据为评审示例" : group.mobile ? "长图可在画面内滚动 · 放大查看完整原图" : "后台名称已更新 · 放大查看完整画面"}</div>
        </section>
        <aside class="notes" aria-label="功能和交互说明">
          <section class="card"><div class="note-eyebrow"><span>${group.mobile ? "设计原图" : "运营更新稿"}</span><span>${String(index + 1).padStart(2, "0")} / ${String(group.pages.length).padStart(2, "0")}</span></div><h2>${escape(item.title)}</h2><p class="purpose">${escape(item.purpose)}</p><div class="note-label">主要功能与操作</div>
            <ol class="annotation-list">${item.points.map((p, i) => `<li><span class="annotation-number">${i + 1}</span><div class="annotation-content"><strong>${escape(p.label)}</strong><p>${escape(p.text)}</p>${p.target ? `<a href="${href(p.target)}">查看关联页面 →</a>` : ""}</div></li>`).join("")}</ol>
            <a class="prd-link" href="#docs/prd/${item.chapter}"><span>关联 PRD · 第 ${item.chapter} 章</span><span>↗</span></a>
          </section>
          ${notesList("V1.3 规则说明", item.updates, "rule-notes")}
          ${notesList("待确认／设计待补", item.pending, "pending-notes")}
          <div class="notes-source">画面依据：${item.interactive ? "2026年10月10日提供的打款审核列表及弹窗截图" : escape(item.source)}<br>规则依据：PRD V1.3${group.mobile ? "" : "＋本次运营端补充需求"} ／ 仅用于评审。</div>
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
          bindMobileControls(main);
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
    img.closest(".mobile-prototype")?.style.setProperty("width", `${base * modalScale / 100}px`);
    document.getElementById("zoom-value").textContent = `${modalScale}%`;
    document.getElementById("zoom-out").disabled = modalScale <= 50;
    document.getElementById("zoom-in").disabled = modalScale >= 200;
  }

  function openModal() {
    const item = currentGroup.pages[currentIndex];
    restoreFocus = document.activeElement;
    document.getElementById("modal-scroll").innerHTML = hasMobileControls(currentGroup, item) ? mobileImage(currentGroup, item, true) : currentGroup.mobile ? `<img id="modal-image" src="${item.image}" alt="${escape(item.title)}完整设计原图">` : adminImage(currentGroup, item, true);
    bindMobileControls(document.getElementById("modal-scroll"));
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
