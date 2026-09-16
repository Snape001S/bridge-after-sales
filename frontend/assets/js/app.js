/* ============================================================
   桥通售后 · 前端交互脚本
   首页：场景选择 / 演示填充 / 场景中心 / 六步动画 + 真实调用分析接口
   报告页：从会话数据渲染报告（后端失败自动降级内置示例）
   案例库：从接口加载案例（失败降级内置示例）+ 分类筛选
   诊断页：多条文本 → 沟通风险画像
   对比页：优化前后对比
   ============================================================ */

(function () {
  "use strict";

  /* ---------- 快速体验案例（跨境电商语境，点击自动填入输入框 + 设置场景） ---------- */
  var DEMOS = {
    price: {
      scene: "negotiation",
      text: "Your price is too expensive."
    },
    complaint: {
      scene: "customer",
      text: "Your product quality is unacceptable."
    },
    refund: {
      scene: "customer",
      text: "Just give me a refund."
    },
    competitive: {
      scene: "negotiation",
      text: "Your offer is not competitive."
    }
  };

  /* ---------- 国际商务沟通场景中心（5 大场景） ---------- */
  var SCENE_CENTER = [
    { scene: "email", name: "商务邮件", en: "Email Communication",
      desc: "询价、报价、催款、投诉、售后——外贸往来最核心的书面沟通场景。",
      text: "We have not received your payment. You must pay us immediately." },
    { scene: "negotiation", name: "商务谈判", en: "Business Negotiation",
      desc: "价格协商、合同条款、方案取舍——在坚持立场与维护关系中寻找平衡。",
      text: "Your price is unacceptable. We will find another supplier." },
    { scene: "meeting", name: "国际会议", en: "International Meeting",
      desc: "提出观点、表达异议、总结发言——公开场合的表达更考验分寸。",
      text: "You are wrong. My plan is better." },
    { scene: "ecommerce", name: "跨境电商", en: "Customer Communication",
      desc: "客户咨询、产品描述、售后服务——线上交易的每一句回复都是口碑。",
      text: "Your products are terrible. We want a full refund now." },
    { scene: "reception", name: "商务接待", en: "Business Reception",
      desc: "邀约、接待礼仪、文化差异——从第一封邀请函就开始建立关系。",
      text: "We want you to come to our company next week." }
  ];

  /* 诊断页分析用样本文本（与后端默认一致） */
  var DIAGNOSIS_TEXTS = [
    "We have not received your payment. You must pay us immediately.",
    "Your price is unacceptable. We will find another supplier.",
    "Your proposal is completely wrong.",
    "Your products are very bad quality. We are very disappointed.",
    "We want to arrange a meeting with you next week."
  ];

  /* ============================================================
     首页
     ============================================================ */
  var scenePills = document.getElementById("scenePills");
  var input = document.getElementById("analyzeInput");
  var analyzeBtn = document.getElementById("analyzeBtn");
  var overlay = document.getElementById("analyzeOverlay");
  var stepsBox = document.getElementById("stepsBox");

  function currentScene() {
    var active = scenePills ? scenePills.querySelector(".pill.active") : null;
    return active ? active.getAttribute("data-scene") : "auto";
  }

  function currentPill(box, attr) {
    if (!box) return "auto";
    var active = box.querySelector(".pill.active");
    return active ? active.getAttribute(attr) : "auto";
  }

  function bindPills(boxId, attr) {
    var box = document.getElementById(boxId);
    if (!box) return;
    box.addEventListener("click", function (e) {
      var pill = e.target.closest(".pill");
      if (!pill) return;
      box.querySelectorAll(".pill").forEach(function (p) { p.classList.remove("active"); });
      pill.classList.add("active");
    });
  }
  bindPills("culturePills", "data-culture");
  bindPills("bizPills", "data-biz");

  if (scenePills) {
    scenePills.addEventListener("click", function (e) {
      var pill = e.target.closest(".pill");
      if (!pill) return;
      scenePills.querySelectorAll(".pill").forEach(function (p) { p.classList.remove("active"); });
      pill.classList.add("active");
    });
  }

  if (input) {
    document.querySelectorAll("[data-demo]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var demo = DEMOS[btn.getAttribute("data-demo")];
        if (!demo) return;
        input.value = demo.text;
        if (scenePills) {
          scenePills.querySelectorAll(".pill").forEach(function (p) {
            p.classList.toggle("active", p.getAttribute("data-scene") === demo.scene);
          });
        }
        input.focus();
      });
    });
  }

  /* 场景中心：点击卡片 → 设置场景 + 填充示例文本 + 滚动到输入区 */
  var sceneGrid = document.getElementById("sceneGrid");
  if (sceneGrid) {
    sceneGrid.addEventListener("click", function (e) {
      var card = e.target.closest(".scene-card");
      if (!card) return;
      sceneGrid.querySelectorAll(".scene-card").forEach(function (c) {
        c.classList.remove("selected");
      });
      card.classList.add("selected");
      var scene = card.getAttribute("data-scene");
      var text = card.getAttribute("data-text") || "";
      if (scenePills) {
        scenePills.querySelectorAll(".pill").forEach(function (p) {
          p.classList.toggle("active", p.getAttribute("data-scene") === scene);
        });
      }
      if (input) {
        input.value = text;
        input.focus();
        var rect = input.getBoundingClientRect();
        window.scrollTo({ top: window.scrollY + rect.top - 90, behavior: "smooth" });
      }
    });
  }

  function showAnalysisSteps() {
    var STEPS = ["场景识别", "语言分析", "礼仪分析", "文化分析", "五维评分", "生成报告"];
    stepsBox.innerHTML = "";
    STEPS.forEach(function (name) {
      var div = document.createElement("div");
      div.className = "step";
      div.innerHTML = '<span class="step-dot"></span><span>' + name + "</span>";
      stepsBox.appendChild(div);
    });
    overlay.classList.add("show");

    var idx = 0;
    var timer = setInterval(function () {
      var steps = stepsBox.querySelectorAll(".step");
      if (idx > 0 && steps[idx - 1]) steps[idx - 1].className = "step done";
      if (idx < steps.length) {
        if (steps[idx]) steps[idx].className = "step running";
        idx++;
      } else {
        clearInterval(timer);
        return true; // 动画完成
      }
      return false;
    }, 480);
    return timer;
  }

  if (analyzeBtn && overlay && stepsBox) {
    analyzeBtn.addEventListener("click", function () {
      var text = (input && input.value.trim()) || "";
      if (text.length < 5) {
        if (input) {
          input.focus();
          input.style.borderColor = "#DC2626";
          setTimeout(function () { input.style.borderColor = ""; }, 1200);
        }
        return;
      }
      analyzeBtn.disabled = true;
      showAnalysisSteps();
      var scene = currentScene();
      var culture = currentPill(document.getElementById("culturePills"), "data-culture");
      var biz = currentPill(document.getElementById("bizPills"), "data-biz");

      CB.callAnalyze(text, scene, culture, biz).then(function (report) {
        if (report && report.total !== undefined) {
          CB.saveReport(report, false);
          setTimeout(function () { window.location.href = "report.html"; }, 300);
        } else {
          // 后端不可用：降级内置示例数据（标记离线模式）
          var mock = JSON.parse(JSON.stringify(window.CB_MOCK.report));
          mock.text = text;
          mock.scene = scene === "auto" ? mock.scene : scene;
          CB.saveReport(mock, true);
          setTimeout(function () { window.location.href = "report.html"; }, 300);
        }
      });
    });
  }

  /* ============================================================
     报告页
     ============================================================ */
  function initReport() {
    if (!document.getElementById("scoreNum")) return; // 非报告页

    var report = CB.loadReport();
    var offline = CB.isOfflineMode();
    if (!report) {
      report = window.CB_MOCK.report; // 直接访问报告页（无会话数据）→ 内置示例
      offline = true;
    }

    if (offline) CB.markOffline();
    CB_RENDER.renderOfflineBanner();
    CB_RENDER.renderRing(report.total);
    CB_RENDER.renderHero(report);
    CB_RENDER.renderGauge(report.total);
    CB_RENDER.renderReasoning(report);
    CB_RENDER.renderJudgmentBasis(report);
    CB_RENDER.renderRadar(report.scores);
    CB_RENDER.renderDims(report);
    CB_RENDER.renderIssues(report);
    CB_RENDER.renderFixes(report);
    CB_RENDER.renderRelated(report);

    var copyBtn = document.getElementById("copyBtn");
    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        var texts = (report.fixes || []).map(function (f) {
          return "原文: " + f.original + "\n优化: " + f.optimized;
        });
        var blob = texts.join("\n\n");
        var done = function () {
          copyBtn.textContent = "✓ 已复制";
          setTimeout(function () { copyBtn.textContent = "复制全部优化表达"; }, 1600);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(blob).then(done, function () { fallbackCopy(blob); done(); });
        } else { fallbackCopy(blob); done(); }
      });
    }
  }

  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (e) { /* ignore */ }
    document.body.removeChild(ta);
  }

  /* ============================================================
     案例库页
     ============================================================ */
  function initCases() {
    var grid = document.getElementById("caseGrid");
    if (!grid) return;

    CB.callCases("all").then(function (data) {
      var cases = (data && data.cases) ? data.cases : window.CB_MOCK.cases;
      if (!data) CB.markOffline();
      CB_RENDER.renderOfflineBanner();
      CB_RENDER.renderCaseGrid(grid, cases);

      // 分类计数 + 总条数
      updateCaseStats(grid);
    });
  }

  /* 案例库：分类计数 + 搜索过滤（与分类/来源筛选叠加） */
  var _caseCategory = "all";
  var _caseSource = "all";

  function updateCaseStats(grid) {
    var countEl = document.getElementById("caseCount");
    if (countEl) countEl.textContent = "共 " + grid.querySelectorAll(".case-card").length + " 条案例";
    var pills = document.getElementById("caseFilter");
    if (pills) {
      pills.querySelectorAll(".pill").forEach(function (p) {
        var f = p.getAttribute("data-filter");
        var n = f === "all" ? grid.querySelectorAll(".case-card").length
                            : grid.querySelectorAll('.case-card[data-scenario="' + f + '"]').length;
        var label = p.textContent.replace(/\s*\(\d+\)$/, "");
        p.textContent = label + " (" + n + ")";
      });
    }
  }

  function applyCaseFilters() {
    var grid = document.getElementById("caseGrid");
    var empty = document.getElementById("caseEmpty");
    if (!grid) return;
    var search = (document.getElementById("caseSearch") || {}).value || "";
    search = search.trim().toLowerCase();
    var visible = 0;
    grid.querySelectorAll(".case-card").forEach(function (card) {
      var okCat = _caseCategory === "all" || card.getAttribute("data-scenario") === _caseCategory;
      var okSrc = _caseSource === "all" || card.getAttribute("data-source") === _caseSource;
      var okSearch = !search || card.textContent.toLowerCase().indexOf(search) !== -1;
      var show = okCat && okSrc && okSearch;
      card.style.display = show ? "" : "none";
      if (show) visible++;
    });
    if (empty) empty.classList.toggle("show", visible === 0);
  }

  /* 分类筛选（事件委托，兼容动态生成的卡片） */
  var filterBox = document.getElementById("caseFilter");
  if (filterBox) {
    filterBox.addEventListener("click", function (e) {
      var pill = e.target.closest(".pill");
      if (!pill) return;
      filterBox.querySelectorAll(".pill").forEach(function (p) { p.classList.remove("active"); });
      pill.classList.add("active");
      _caseCategory = pill.getAttribute("data-filter");
      applyCaseFilters();
    });
  }

  /* 来源筛选（案例来源分类） */
  var sourceBox = document.getElementById("sourceFilter");
  if (sourceBox) {
    sourceBox.addEventListener("click", function (e) {
      var pill = e.target.closest(".pill");
      if (!pill) return;
      sourceBox.querySelectorAll(".pill").forEach(function (p) { p.classList.remove("active"); });
      pill.classList.add("active");
      _caseSource = pill.getAttribute("data-source-filter");
      applyCaseFilters();
    });
  }

  /* 搜索框（与分类筛选叠加） */
  var searchInput = document.getElementById("caseSearch");
  if (searchInput) {
    searchInput.addEventListener("input", function () { applyCaseFilters(); });
  }

  /* ============================================================
     诊断页：多条文本 → 沟通风险画像
     ============================================================ */
  function initDiagnosis() {
    var box = document.getElementById("diagTotal");
    if (!box) return; // 非诊断页

    CB.callDiagnosis(DIAGNOSIS_TEXTS).then(function (profile) {
      var data = profile || window.CB_MOCK.diagnosis;
      if (!profile) {
        CB.markOffline();
        CB_RENDER.renderOfflineBanner();
      }
      CB_RENDER.renderDiagnosis(data);
      var btn = document.getElementById("diagAgain");
      if (btn) btn.style.display = "";
      window.CB_RENDER_AGAIN = initDiagnosis;
    });
  }

  /* ============================================================
     对比页：优化前后对比
     ============================================================ */
  function initComparison() {
    var list = document.getElementById("cmpList");
    if (!list) return; // 非对比页

    CB.callComparisons().then(function (payload) {
      var data = payload || window.CB_MOCK.comparisons;
      if (!payload) {
        CB.markOffline();
        CB_RENDER.renderOfflineBanner();
      }
      CB_RENDER.renderComparison(data);
    });
  }

  /* 对比页场景筛选 */
  var cmpFilter = document.getElementById("cmpFilter");
  if (cmpFilter) {
    cmpFilter.addEventListener("click", function (e) {
      var pill = e.target.closest(".pill");
      if (!pill) return;
      cmpFilter.querySelectorAll(".pill").forEach(function (p) { p.classList.remove("active"); });
      pill.classList.add("active");
      var f = pill.getAttribute("data-filter");
      var list = document.getElementById("cmpList");
      if (!list) return;
      list.querySelectorAll(".cmp-case").forEach(function (card) {
        var show = f === "all" || card.getAttribute("data-scene") === f;
        card.style.display = show ? "" : "none";
      });
    });
  }

  /* ---------- 导航高亮（按当前页面自动定位） ---------- */
  (function navActive() {
    var path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    var map = {
      "index.html": "风险检测",
      "diagnosis.html": "沟通诊断",
      "comparison.html": "对比优化",
      "model.html": "模型说明",
      "cases.html": "案例库"
    };
    var target = map[path];
    document.querySelectorAll(".nav-link").forEach(function (a) {
      var text = a.textContent.trim();
      if (target && text === target) a.classList.add("active");
    });
  })();

  /* ---------- 移动端导航：汉堡菜单 ---------- */
  var navToggle = document.getElementById("navToggle");
  var nav = document.querySelector(".nav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      nav.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", nav.classList.contains("nav-open") ? "true" : "false");
    });
    nav.querySelectorAll(".nav-link").forEach(function (a) {
      a.addEventListener("click", function () { nav.classList.remove("nav-open"); });
    });
  }

  /* ---------- 启动 ---------- */
  initReport();
  initCases();
  initDiagnosis();
  initComparison();
})();

