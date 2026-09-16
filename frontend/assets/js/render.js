/* ============================================================
   桥通售后 · 报告渲染器
   把后端返回的报告 JSON 渲染为页面元素（评分环/雷达图/五维条/问题卡/优化对照/相关案例）
   ============================================================ */

(function () {
  "use strict";

  var DIMS = [
    { key: "language_accuracy", zh: "语言准确性", en: "Language Accuracy", color: "var(--dim-la)" },
    { key: "business_politeness", zh: "商务礼貌", en: "Business Politeness", color: "var(--dim-bp)" },
    { key: "cultural_adaptability", zh: "文化适配", en: "Cultural Adaptability", color: "var(--dim-ca)" },
    { key: "communication_clarity", zh: "表达清晰", en: "Communication Clarity", color: "var(--dim-cc)" },
    { key: "relationship_friendliness", zh: "合作友好", en: "Relationship Friendliness", color: "var(--dim-rf)" }
  ];

  var TYPE_META = {
    language: { cls: "lang", tag: "tag-blue", label: "语言问题" },
    etiquette: { cls: "etq", tag: "tag-purple", label: "商务礼仪" },
    culture: { cls: "cult", tag: "tag-cyan", label: "跨文化风险" }
  };
  var SEV_LABEL = { low: "低 · Low", medium: "中 · Medium", high: "高 · High" };
  var RISK_BADGE = {
    low: "badge-low", medium_low: "badge-ml", medium_high: "badge-mh", high: "badge-high"
  };
  var SCENE_TAG = {
    email: "tag-blue", negotiation: "tag-purple", meeting: "tag-cyan", customer: "tag-gray", daily: "tag-gray"
  };
  var SCENE_ZH = {
    email: "商务邮件", negotiation: "商务谈判", meeting: "国际会议", customer: "客户沟通", daily: "日常交流", general: "一般沟通"
  };

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------- 评分环 ---------- */
  function renderRing(total) {
    var ring = document.getElementById("ringProgress");
    var num = document.getElementById("scoreNum");
    if (!ring || !num) return;
    var CIRC = 2 * Math.PI * 52;
    num.textContent = total;
    ring.style.transition = "none";
    ring.style.strokeDashoffset = CIRC;
    // 强制重绘后动画
    void ring.getBoundingClientRect();
    ring.style.transition = "stroke-dashoffset 1.2s ease";
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        ring.style.strokeDashoffset = CIRC * (1 - total / 100);
      });
    });
  }

  /* ---------- 风险徽章 + 总评 + 元信息 ---------- */
  function renderHero(report) {
    var badge = document.getElementById("riskBadge");
    if (badge) {
      badge.className = "badge " + (RISK_BADGE[report.risk_level] || "badge-ml");
      badge.textContent = report.risk_label || "中风险 · Medium Risk";
    }
    var sum = document.getElementById("scoreSummary");
    if (sum) sum.textContent = report.summary || "";
    var meta = document.getElementById("metaChips");
    if (meta) {
      var sceneZh = report.scene_label || SCENE_ZH[report.scene] || "一般沟通";
      var len = (report.text || "").length;
      meta.innerHTML =
        '<span class="meta-chip">场景 · ' + esc(sceneZh) + "</span>" +
        (report.culture_label && report.culture_label !== "自动识别"
          ? '<span class="meta-chip">目标文化 · ' + esc(report.culture_label) + "</span>" : "") +
        (report.business_scene_label && report.business_scene_label !== "自动识别"
          ? '<span class="meta-chip">业务场景 · ' + esc(report.business_scene_label) + "</span>" : "") +
        '<span class="meta-chip">原文 ' + len + " 字</span>" +
        '<span class="meta-chip">检出 ' + (report.issues || []).length + " 处风险</span>" +
        '<span class="meta-chip">' + esc(report.mode === "ai" ? "AI 大模型分析" : "规则引擎分析") + "</span>";
    }
  }

  /* ---------- 雷达图 ---------- */
  function renderRadar(scores, targetSvg) {
    var svg = targetSvg || document.getElementById("radarChart");
    if (!svg) return;
    var NS = "http://www.w3.org/2000/svg";
    var cx = 150, cy = 150, R = 96, n = 5;
    var angle = function (i) { return -Math.PI / 2 + (2 * Math.PI * i) / n; };
    var pt = function (i, r) {
      return { x: cx + r * Math.cos(angle(i)), y: cy + r * Math.sin(angle(i)) };
    };
    var el = function (tag, attrs) {
      var e = document.createElementNS(NS, tag);
      for (var k in attrs) e.setAttribute(k, attrs[k]);
      svg.appendChild(e);
      return e;
    };
    [0.25, 0.5, 0.75, 1].forEach(function (k) {
      var pts = [];
      for (var i = 0; i < n; i++) pts.push(pt(i, R * k));
      el("polygon", { points: pts.map(function (t) { return t.x.toFixed(1) + "," + t.y.toFixed(1); }).join(" "),
                      fill: "none", stroke: "#E2E8F0", "stroke-width": "1" });
    });
    for (var i = 0; i < n; i++) {
      var a = pt(i, R);
      el("line", { x1: cx, y1: cy, x2: a.x.toFixed(1), y2: a.y.toFixed(1), stroke: "#CBD5E1", "stroke-width": "1" });
    }
    var vals = [scores.language_accuracy, scores.business_politeness, scores.cultural_adaptability,
                scores.communication_clarity, scores.relationship_friendliness];
    var dpts = vals.map(function (v, i) { return pt(i, R * (v / 10)); });
    el("polygon", { points: dpts.map(function (t) { return t.x.toFixed(1) + "," + t.y.toFixed(1); }).join(" "),
                    fill: "rgba(29,78,216,.16)", stroke: "#1D4ED8", "stroke-width": "2",
                    "stroke-linejoin": "round" });
    dpts.forEach(function (t) {
      el("circle", { cx: t.x, cy: t.y, r: "3.5", fill: "#1D4ED8" });
    });
    DIMS.forEach(function (d, i) {
      var t = pt(i, R + 28);
      el("text", { x: t.x, y: t.y + 4, "text-anchor": "middle", "font-size": "12.5",
                   fill: "#475569", "font-weight": "500" }).textContent = d.zh;
    });
  }

  /* ---------- AI 风险推理过程（关键词→意图→风险→文化→最终风险） ---------- */
  function renderReasoning(report) {
    var box = document.getElementById("reasoningBox");
    if (!box) return;
    var r = report.reasoning || {};
    var kws = (r.keywords || []).map(function (k) {
      return '<span class="rkw"><b>' + esc(k.term) + "</b><i>" + esc(k.category) + "</i></span>";
    }).join("");
    var areas = (r.risk_areas || []).map(function (a) {
      return '<span class="r-area">' + esc(a) + "</span>";
    }).join("");
    var badgeCls = RISK_BADGE[report.risk_level] || "badge-ml";
    box.innerHTML =
      '<div class="card reasoning-card">' +
      '<div class="r-row"><span class="r-label">关键词识别</span><div class="r-content">' +
      (kws || '<span class="r-none">未发现明显风险关键词</span>') + "</div></div>" +
      '<div class="r-row"><span class="r-label">商务意图</span><div class="r-content">' +
      esc(r.intent || "完成商务沟通并维护合作关系") + "</div></div>" +
      '<div class="r-row"><span class="r-label">风险判断</span><div class="r-content">' +
      (areas || '<span class="r-none">未发现明显风险</span>') + "</div></div>" +
      '<div class="r-row"><span class="r-label">文化因素</span><div class="r-content r-culture">' +
      esc(r.culture_factor || "") + "</div></div>" +
      '<div class="r-row"><span class="r-label">最终风险</span><div class="r-content">' +
      '<span class="badge ' + badgeCls + '">' + esc(r.final_risk || report.risk_label || "") + "</span></div></div>" +
      "</div>";
  }

  /* ---------- 风险仪表盘（分段仪表 + 定位标记） ---------- */
  function renderGauge(total) {
    var box = document.getElementById("riskGauge");
    if (!box) return;
    var pct = Math.max(0, Math.min(100, total));
    box.innerHTML =
      '<div class="risk-gauge-track">' +
      '<span class="risk-gauge-seg red"></span><span class="risk-gauge-seg orange"></span>' +
      '<span class="risk-gauge-seg amber"></span><span class="risk-gauge-seg green"></span>' +
      '<span class="risk-gauge-marker" style="left:' + pct + '%"></span></div>' +
      '<div class="risk-gauge-labels"><span>高风险</span><span>中高风险</span><span>中风险</span><span>低风险</span></div>';
  }

  /* ---------- AI 判断依据 ---------- */
  var JUDG_DIMS = [
    { key: "language_accuracy", zh: "语言准确性", color: "var(--dim-la)" },
    { key: "business_politeness", zh: "商务礼貌", color: "var(--dim-bp)" },
    { key: "cultural_adaptability", zh: "文化适配", color: "var(--dim-ca)" },
    { key: "communication_clarity", zh: "表达清晰", color: "var(--dim-cc)" },
    { key: "relationship_friendliness", zh: "合作友好", color: "var(--dim-rf)" }
  ];

  function renderJudgmentBasis(report) {
    var box = document.getElementById("judgmentBox");
    if (!box) return;
    var reasons = report.dimension_reasons || {};
    var items = JUDG_DIMS.map(function (d) {
      return '<div class="judgment-item"><span class="j-dot" style="background:' + d.color + '"></span>' +
        '<span><b>' + esc(d.zh) + "</b>：" + esc(reasons[d.key] || "见风险分析") + "</span></div>";
    }).join("");
    box.innerHTML =
      '<div class="card judgment-card"><div class="judgment-list">' + items + "</div>" +
      '<div class="judgment-method">方法与依据：' +
      "① <b>五维评分锚点</b>——由商务英语学科定义 10/7/4/1 分的行为标准；" +
      "② <b>跨文化交际理论</b>——高低语境、面子理论、文化维度；" +
      "③ <b>专家案例锚定</b>——50 条专业标注案例作为判断参照；" +
      "④ <b>确定性评分</b>——总分由系统按既定权重计算，可复现、可追溯。</div></div>";
  }

  /* 问题类型 → 修复将提升的维度 */
  var TYPE_DIM = {
    language: { label: "语言准确性", cls: "tag-blue" },
    etiquette: { label: "商务礼貌", cls: "tag-purple" },
    culture: { label: "文化适配与合作友好", cls: "tag-cyan" }
  };

  /* ---------- 五维评分条 ---------- */
  function renderDims(report) {
    var box = document.getElementById("dimBars");
    if (!box) return;
    box.innerHTML = "";
    var reasons = report.dimension_reasons || {};
    DIMS.forEach(function (d) {
      var score = report.scores[d.key];
      var row = document.createElement("div");
      row.className = "dim-row";
      row.innerHTML =
        '<div class="dim-head"><span class="dim-name">' + esc(d.zh) + " · " + esc(d.en) + '</span>' +
        '<span class="dim-score tabular" style="color:' + d.color + '">' + score + "/10</span></div>" +
        '<div class="dim-track"><div class="dim-fill" style="width:' + (score * 10) + "%;background:" + d.color + '"></div></div>' +
        '<div class="dim-note">' + esc(reasons[d.key] || "见风险分析") + "</div>";
      box.appendChild(row);
    });
  }

  /* ---------- 风险分析问题卡片 ---------- */
  function renderIssues(report) {
    var box = document.getElementById("issuesBox");
    if (!box) return;
    box.innerHTML = "";
    var issues = report.issues || [];
    if (!issues.length) {
      box.innerHTML = '<div class="card issue-card" style="border-left-color:#16A34A;margin-top:20px">' +
        '<div class="issue-top"><span class="tag tag-gray">检测结果</span></div>' +
        '<p class="issue-analysis" style="margin-top:10px">✅ 本次检测未发现明显风险：整体表达专业得体，符合国际商务沟通规范，可直接使用。</p></div>';
      return;
    }
    issues.forEach(function (it) {
      var m = TYPE_META[it.type] || TYPE_META.culture;
      var card = document.createElement("div");
      card.className = "card issue-card " + m.cls;
      card.style.marginTop = "16px";
      card.innerHTML =
        '<div class="issue-top">' +
        '<span class="tag ' + m.tag + '">' + m.label + "</span>" +
        '<span class="sev">严重度：' + esc(SEV_LABEL[it.severity] || "中") + "</span></div>" +
        '<div class="issue-quote">' + esc(it.quote) + "</div>" +
        '<p class="issue-analysis">' + esc(it.analysis) + "</p>";
      box.appendChild(card);
    });
  }

  /* ---------- 优化表达对照卡（含量化效果估算） ---------- */
  function renderFixes(report) {
    var box = document.getElementById("fixesBox");
    if (!box) return;
    box.innerHTML = "";
    var fixes = report.fixes || [];
    if (!fixes.length) {
      box.innerHTML = '<p class="section-sub" style="margin-top:8px">本次检测未发现需要优化的表达。</p>';
      return;
    }

    /* ---- 量化估算：按问题的类型/严重度回推可提升维度与综合评分 ---- */
    var SEV_P = { high: 3, medium: 2, low: 1 };
    var TYPE_D = {
      language: { dims: ["language_accuracy"], label: "语言准确性", cls: "tag-blue" },
      etiquette: { dims: ["business_politeness"], label: "商务礼貌", cls: "tag-purple" },
      culture: { dims: ["cultural_adaptability", "relationship_friendliness"], label: "文化适配与合作友好", cls: "tag-cyan" }
    };
    var W = { language_accuracy: 3, business_politeness: 2, cultural_adaptability: 2,
              communication_clarity: 2, relationship_friendliness: 1 };
    var DIM_ZH = { language_accuracy: "语言准确性", business_politeness: "商务礼貌",
                   cultural_adaptability: "文化适配", communication_clarity: "表达清晰",
                   relationship_friendliness: "合作友好" };
    var totalOf = function (s) {
      return Math.round(Object.keys(W).reduce(function (sum, k) { return sum + s[k] * W[k]; }, 0));
    };
    var riskOf = function (t) {
      if (t >= 85) return "低风险 · Low Risk";
      if (t >= 70) return "中风险 · Medium Risk";
      if (t >= 50) return "中高风险 · Medium-High Risk";
      return "高风险 · High Risk";
    };

    var cur = report.scores;
    var est = {};
    Object.keys(W).forEach(function (k) { est[k] = cur[k]; });
    (report.issues || []).forEach(function (it) {
      var m = TYPE_D[it.type];
      if (!m) return;
      var p = SEV_P[it.severity] || 1;
      m.dims.forEach(function (k) { est[k] = Math.min(10, est[k] + p); });
    });
    var estTotal = totalOf(est);
    var delta = estTotal - report.total;

    // 区块顶部：量化效果总览（评分变化 + 风险等级变化）
    var overview =
      '<div class="fix-overview">' +
      '<div class="fo-left">采纳全部优化表达后，预计综合评分 <b class="tabular">' + report.total + " → " + estTotal + "</b><span class=\"fo-delta\">（+" + delta + "）</span></div>" +
      '<div class="fo-right">风险等级预计：' + esc(report.risk_label || "") + " → " + esc(riskOf(estTotal)) + "</div>" +
      "</div>";
    box.innerHTML = overview;

    fixes.forEach(function (f) {
      var card = document.createElement("div");
      card.className = "card fix-card";
      // 匹配对应问题，标注修复提升的维度 + 量化效果
      var dimTag = "";
      var effHtml = "";
      if (report.issues && report.issues.length) {
        var hit = null;
        for (var i = 0; i < report.issues.length; i++) {
          if (report.issues[i].quote === f.original) { hit = report.issues[i]; break; }
        }
        if (hit && TYPE_D[hit.type]) {
          var m = TYPE_D[hit.type];
          dimTag = '<span class="tag fix-tag ' + m.cls + '">修复 → 提升 ' + m.label + "</span>";
          var p = SEV_P[hit.severity] || 1;
          var bits = m.dims.map(function (k) {
            var after = Math.min(10, cur[k] + p);
            return DIM_ZH[k] + " " + cur[k] + " → " + after;
          });
          effHtml = '<div class="fix-effect">采纳此项优化，预计提升：<b>' + bits.join(" · ") + "</b></div>";
        }
      }

      // AI 商务表达策略：三个版本
      var strats = (f.strategies && f.strategies.length) ? f.strategies : null;
      var stratHtml = "";
      if (strats) {
        var sIcons = ["🤝", "📊", "💪"];
        stratHtml = '<div class="strategy-list">' + strats.map(function (s, idx) {
          return '<div class="strategy-item s' + (idx + 1) + '">' +
            '<div class="s-head"><span class="s-icon">' + (sIcons[idx] || "✍️") + "</span>" +
            '<span class="s-name">' + esc(s.name) + "</span>" +
            '<span class="s-meta">适合：' + esc(s.suited_for || "") + "</span>" +
            '<span class="s-regions">推荐地区：' + esc(s.regions || "") + "</span></div>" +
            '<div class="s-text">' + esc(s.optimized || "") + "</div></div>";
        }).join("") + "</div>";
      } else {
        stratHtml = '<div class="fix-grid">' +
          '<div class="fix-col fix-orig"><div class="fix-col-label">ORIGINAL · 原表达</div>' +
          '<div class="fix-text">' + esc(f.original) + "</div></div>" +
          '<div class="fix-arrow">→</div>' +
          '<div class="fix-col fix-new"><div class="fix-col-label">OPTIMIZED · 优化表达</div>' +
          '<div class="fix-text">' + esc(f.optimized) + "</div></div></div>";
      }

      card.innerHTML =
        '<div style="display:flex;align-items:center;flex-wrap:wrap;gap:8px">' +
        '<span style="font-size:13px;font-weight:600;color:var(--text-2)">修改点</span>' + dimTag + "</div>" +
        '<div class="fix-orig-line">原文："' + esc(f.original) + '"</div>' +
        '<div class="strategy-label">AI 商务表达策略 · 按沟通对象选择</div>' +
        stratHtml +
        '<div class="fix-culture"><b>💡 文化解释</b><span>' + esc(f.culture_explanation) + "</span></div>" +
        effHtml;
      box.appendChild(card);
    });
  }

  /* ---------- 相关案例 ---------- */
  function renderRelated(report) {
    var box = document.getElementById("relatedBox");
    if (!box) return;
    box.innerHTML = "";
    var cases = report.related_cases || [];
    if (!cases.length) {
      box.style.display = "none";
      return;
    }
    cases.forEach(function (c) {
      var card = document.createElement("div");
      card.className = "card related-card";
      card.innerHTML =
        '<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">' +
        '<span class="tag ' + (SCENE_TAG[c.scenario] || "tag-gray") + '">' + esc(SCENE_ZH[c.scenario] || c.scenario) + "</span>" +
        '<span class="badge ' + (RISK_BADGE[c.risk_level] || "badge-ml") + '">' + esc(c.risk_level === "low" ? "低风险" : c.risk_level === "medium_low" ? "中风险" : c.risk_level === "medium_high" ? "中高风险" : "高风险") + "</span>" +
        '<span style="font-size:13px;color:var(--text-3)">案例编号 ' + esc(c.id) + "</span></div>" +
        '<div class="case-orig" style="margin-top:10px">' + esc(c.original_expression) + "</div>" +
        '<p style="font-size:13px;color:var(--text-2);margin-top:10px">💡 ' + esc(c.culture_explanation) + "</p>";
      box.appendChild(card);
    });
  }

  /* ---------- 离线演示模式横幅 ---------- */
  function renderOfflineBanner() {
    if (!window.CB || !CB.isOfflineMode()) return;
    var box = document.getElementById("offlineBanner");
    if (!box) return;
    box.style.display = "block";
  }

  /* ---------- 案例库网格 ---------- */
  function renderCaseGrid(container, cases) {
    if (!container) return;
    container.innerHTML = "";
    var empty = document.getElementById("caseEmpty");
    var list = cases || [];
    if (!list.length) {
      if (empty) empty.classList.add("show");
      return;
    }
    if (empty) empty.classList.remove("show");
    list.forEach(function (c) {
      var card = document.createElement("article");
      card.className = "card card-hover case-card";
      card.setAttribute("data-scenario", c.scenario);
      card.setAttribute("data-source", c.source_type || "");
      var res = c.resolution || {};
      var resHtml = (res.before_total !== undefined && res.after_total !== undefined)
        ? '<div class="case-res">解决效果：风险 <b>' + esc(res.before_risk || "") + " → " + esc(res.after_risk || "") +
          "</b> · 商务评分 <b>" + res.before_total + " → " + res.after_total + "</b>" +
          (res.improvement > 0 ? ' <span class="res-up">评分提升 ' + res.improvement + "</span>" : "") + "</div>"
        : "";
      card.innerHTML =
        '<div class="case-head">' +
        '<span style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">' +
        '<span class="tag ' + (SCENE_TAG[c.scenario] || "tag-gray") + '">' + esc(SCENE_ZH[c.scenario] || c.scenario) + "</span>" +
        (c.source_type ? '<span class="tag tag-gray" style="font-size:11px">' + esc(c.source_type) + "</span>" : "") +
        "</span>" +
        '<span class="badge ' + (RISK_BADGE[c.risk_level] || "badge-ml") + '">' + esc(c.risk_level === "low" ? "低风险" : c.risk_level === "medium_low" ? "中风险" : c.risk_level === "medium_high" ? "中高风险" : "高风险") + "</span></div>" +
        '<div class="case-orig">' + esc(c.original_expression) + "</div>" +
        '<div class="case-label">RISK · 风险</div>' +
        '<p style="font-size:13px;color:var(--text-2);margin-top:4px">' + esc(c.problem_analysis) + "</p>" +
        (c.tags && c.tags.length
          ? '<div class="case-tags">' +
            (c.problem_type ? '<span class="case-tag">' + esc(c.problem_type) + "</span>" : "") +
            c.tags.map(function (t) { return '<span class="case-tag">#' + esc(t) + "</span>"; }).join("") +
            "</div>"
          : (c.problem_type ? '<div class="case-tags"><span class="case-tag">' + esc(c.problem_type) + "</span></div>" : "")) +
        '<div class="case-label" style="color:var(--risk-low)">OPTIMIZED · 优化表达</div>' +
        '<div class="case-new">' + esc(c.recommended_expression) + "</div>" +
        '<div class="case-cult">💡 ' + esc(c.culture_explanation) + "</div>" +
        resHtml;
      container.appendChild(card);
    });
  }

  /* ---------- 双数据集雷达图（Before/After 对比） ---------- */
  function drawRadarDual(svg, labels, setA, setB) {
    if (!svg) return;
    var NS = "http://www.w3.org/2000/svg";
    var cx = 150, cy = 150, R = 92, n = labels.length;
    var angle = function (i) { return -Math.PI / 2 + (2 * Math.PI * i) / n; };
    var pt = function (i, r) {
      return { x: cx + r * Math.cos(angle(i)), y: cy + r * Math.sin(angle(i)) };
    };
    var el = function (tag, attrs) {
      var e = document.createElementNS(NS, tag);
      for (var k in attrs) e.setAttribute(k, attrs[k]);
      svg.appendChild(e);
      return e;
    };
    [0.25, 0.5, 0.75, 1].forEach(function (k) {
      var pts = [];
      for (var i = 0; i < n; i++) pts.push(pt(i, R * k));
      el("polygon", { points: pts.map(function (t) { return t.x.toFixed(1) + "," + t.y.toFixed(1); }).join(" "),
                      fill: "none", stroke: "#E2E8F0", "stroke-width": "1" });
    });
    for (var i = 0; i < n; i++) {
      var a = pt(i, R);
      el("line", { x1: cx, y1: cy, x2: a.x.toFixed(1), y2: a.y.toFixed(1), stroke: "#CBD5E1", "stroke-width": "1" });
    }
    var mk = function (vals, fill, stroke) {
      var pts = vals.map(function (v, i) { return pt(i, R * (v / 10)); });
      el("polygon", { points: pts.map(function (t) { return t.x.toFixed(1) + "," + t.y.toFixed(1); }).join(" "),
                      fill: fill, stroke: stroke, "stroke-width": "2", "stroke-linejoin": "round",
                      "stroke-dasharray": stroke === "#94A3B8" ? "5 4" : "" });
      pts.forEach(function (t) {
        el("circle", { cx: t.x, cy: t.y, r: "3", fill: stroke });
      });
    };
    mk(setA, "rgba(220,38,38,.10)", "#DC2626");   // 优化前：红
    mk(setB, "rgba(22,163,74,.12)", "#16A34A");   // 优化后：绿
    labels.forEach(function (label, i) {
      var t = pt(i, R + 28);
      el("text", { x: t.x, y: t.y + 4, "text-anchor": "middle", "font-size": "12",
                   fill: "#475569", "font-weight": "500" }).textContent = label;
    });
  }

  /* ---------- 诊断画像（沟通风险画像页） ---------- */
  function renderDiagnosis(profile) {
    if (!document.getElementById("diagTotal")) return;

    // 综合评分环（复用评分环 svg）
    var ring = document.getElementById("diagRing");
    if (ring) {
      var CIRC = 2 * Math.PI * 52;
      ring.style.transition = "none";
      ring.style.strokeDashoffset = CIRC;
      void ring.getBoundingClientRect();
      ring.style.transition = "stroke-dashoffset 1.2s ease";
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          ring.style.strokeDashoffset = CIRC * (1 - profile.total / 100);
        });
      });
    }
    var totalEl = document.getElementById("diagTotal");
    if (totalEl) totalEl.textContent = profile.total;
    var badge = document.getElementById("diagRisk");
    if (badge) {
      badge.className = "badge " + (RISK_BADGE[profile.risk_level] || "badge-ml");
      badge.textContent = profile.risk_label || "中风险 · Medium Risk";
    }
    var sum = document.getElementById("diagSummary");
    if (sum) sum.textContent = profile.summary || "";
    var meta = document.getElementById("diagMeta");
    if (meta) meta.innerHTML = '<span class="meta-chip">基于 ' + profile.sample_count + " 次沟通文本分析</span>" +
      '<span class="meta-chip">' + esc(profile.mode === "ai" ? "AI 大模型分析" : "规则引擎分析") + "</span>";

    // 五维雷达图
    var svg = document.getElementById("diagRadar");
    if (svg) renderRadar(profile.scores, svg);

    // 五维评分条
    var bars = document.getElementById("diagBars");
    if (bars) {
      bars.innerHTML = "";
      DIMS.forEach(function (d) {
        var score = profile.scores[d.key];
        var row = document.createElement("div");
        row.className = "dim-row";
        row.innerHTML =
          '<div class="dim-head"><span class="dim-name">' + esc(d.zh) + " · " + esc(d.en) + '</span>' +
          '<span class="dim-score tabular" style="color:' + d.color + '">' + score + "/10</span></div>" +
          '<div class="dim-track"><div class="dim-fill" style="width:' + (score * 10) + "%;background:" + d.color + '"></div></div>';
        bars.appendChild(row);
      });
    }

    // 优势分析
    var strengths = document.getElementById("diagStrengths");
    if (strengths) {
      strengths.innerHTML = "";
      (profile.strengths || []).forEach(function (s) {
        var item = document.createElement("div");
        item.className = "strength-item";
        item.innerHTML = '<span class="s-ic">✓</span><div>' +
          '<div class="item-title">' + esc(s.dim) + '<span>' + esc(s.score) + "/10</span></div>" +
          '<div class="item-note">' + esc(s.note) + "</div></div>";
        strengths.appendChild(item);
      });
    }

    // 改进建议
    var advice = document.getElementById("diagAdvice");
    if (advice) {
      advice.innerHTML = "";
      (profile.improvements || []).forEach(function (a) {
        var item = document.createElement("div");
        item.className = "advice-item";
        item.innerHTML = '<span class="a-ic">▲</span><div>' +
          '<div class="item-title">' + esc(a.dim) + '<span>' + esc(a.score) + "/10</span></div>" +
          '<div class="item-note">' + esc(a.advice) + "</div></div>";
        advice.appendChild(item);
      });
    }
  }

  /* ---------- 前后对比列表（对比页） ---------- */
  function renderComparison(payload) {
    var box = document.getElementById("cmpList");
    if (!box) return;
    box.innerHTML = "";
    var pairs = (payload && payload.pairs) || [];
    pairs.forEach(function (p) {
      var before = p.before, after = p.after;
      var beforeScores = [before.scores.language_accuracy, before.scores.business_politeness,
                          before.scores.cultural_adaptability, before.scores.communication_clarity,
                          before.scores.relationship_friendliness];
      var afterScores = [after.scores.language_accuracy, after.scores.business_politeness,
                         after.scores.cultural_adaptability, after.scores.communication_clarity,
                         after.scores.relationship_friendliness];
      var card = document.createElement("div");
      card.className = "card cmp-case";
      card.setAttribute("data-scene", p.scene);

      var issueHtml = "";
      (before.issues || []).slice(0, 3).forEach(function (it) {
        var m = TYPE_META[it.type] || TYPE_META.culture;
        issueHtml += '<div class="cmp-issue"><span class="tag ' + m.tag + '">' + m.label +
          '</span> <span style="margin-left:4px">' + esc(it.quote) + "</span></div>";
      });
      if (!issueHtml) issueHtml = '<div class="cmp-issue">未检出明显风险</div>';

      card.innerHTML =
        '<div class="cmp-head">' +
        '<span class="tag ' + (SCENE_TAG[p.scene] || "tag-gray") + '">' + esc(p.scene_label || p.scene) + "</span>" +
        '<span class="cmp-title">' + esc(p.title) + "</span>" +
        '<span class="cmp-focus">风险焦点：' + esc(p.risk_focus || "") + "</span>" +
        "</div>" +
        '<div class="cmp-grid">' +
        '<div class="cmp-col cmp-orig"><div class="cmp-col-label">ORIGINAL<div class="cmp-score">' + before.total + "/100</div></div>" +
        '<div class="cmp-text">' + esc(p.original) + "</div></div>" +
        '<div class="cmp-col cmp-mid"><div class="cmp-col-label">AI RISK ANALYSIS</div><div style="margin-top:10px">' +
        issueHtml + "</div></div>" +
        '<div class="cmp-col cmp-new"><div class="cmp-col-label">OPTIMIZED<div class="cmp-score">' + after.total + "/100</div></div>" +
        '<div class="cmp-text">' + esc(p.optimized) + "</div></div>" +
        "</div>" +
        '<div class="cmp-change">' +
        '<div class="change-num"><b style="color:#DC2626" class="tabular">' + before.total + '</b><span>Before Score</span></div>' +
        '<span class="change-arrow">→</span>' +
        '<div class="change-num"><b style="color:#16A34A" class="tabular">' + after.total + '</b><span>After Score</span></div>' +
        '<span class="delta-badge ' + (p.reduction >= 0 ? "good" : "bad") + '">' +
        (p.reduction >= 0 ? "评分提升 +" + p.reduction + " · 风险等级降低" : "评分下降 " + (-p.reduction)) +
        "</span>" +
        '<div style="width:100%;text-align:center;font-size:13px;color:var(--text-2)">' +
        "风险等级：" + esc(before.risk_label || "") + " → " + esc(after.risk_label || "") +
        "</div>" +
        "</div>" +
        '<div class="cmp-radar-wrap"><svg class="cmp-radar" width="300" height="280" viewBox="0 0 300 300"></svg>' +
        '<div class="radar-legend"><span><span class="legend-dot" style="background:#DC2626"></span>优化前 Before</span>' +
        '<span><span class="legend-dot" style="background:#16A34A"></span>优化后 After</span></div></div>';

      box.appendChild(card);
      var radarSvg = card.querySelector(".cmp-radar");
      if (radarSvg) {
        drawRadarDual(radarSvg,
          ["语言", "礼貌", "文化", "清晰", "友好"],
          beforeScores, afterScores);
      }
    });
  }

  window.CB_RENDER = {
    renderRing: renderRing,
    renderHero: renderHero,
    renderGauge: renderGauge,
    renderReasoning: renderReasoning,
    renderJudgmentBasis: renderJudgmentBasis,
    renderRadar: renderRadar,
    renderDims: renderDims,
    renderIssues: renderIssues,
    renderFixes: renderFixes,
    renderRelated: renderRelated,
    renderOfflineBanner: renderOfflineBanner,
    renderCaseGrid: renderCaseGrid,
    renderDiagnosis: renderDiagnosis,
    renderComparison: renderComparison,
    SCENE_ZH: SCENE_ZH,
    RISK_BADGE: RISK_BADGE
  };
})();

