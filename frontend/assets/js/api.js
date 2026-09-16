/* ============================================================
   桥通售后 · 前端 API 客户端（含离线降级）
   - 后端在线：调用 /api/analyze、/api/cases
   - 后端不在线：自动使用内置 mock 数据，并标记"离线演示模式"
   ============================================================ */

(function () {
  "use strict";

  var API_BASE = ""; // 同源部署（后端直接托管前端），留空即可

  function getReportKey() { return "cb_report_v1"; }
  function getModeKey() { return "cb_mode_v1"; }

  /* 带超时的 fetch */
  function fetchJSON(url, options, timeoutMs) {
    var ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
    var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, timeoutMs || 20000) : null;
    var opts = options || {};
    if (ctrl) opts.signal = ctrl.signal;
    return fetch(url, opts).then(function (resp) {
      if (!resp.ok) throw new Error("HTTP " + resp.status);
      return resp.json();
    }).finally(function () { if (timer) clearTimeout(timer); });
  }

  /* 调用分析接口；失败时返回 null（由调用方决定是否降级） */
  function callAnalyze(text, scene, culture, businessScene) {
    return fetchJSON(API_BASE + "/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: text,
        scene: scene || "auto",
        culture: culture || "auto",
        business_scene: businessScene || "auto"
      })
    }, 25000).catch(function () { return null; });
  }

  function callCases(scenario) {
    var q = scenario && scenario !== "all" ? "?scenario=" + encodeURIComponent(scenario) : "";
    return fetchJSON(API_BASE + "/api/cases" + q, null, 10000).catch(function () { return null; });
  }

  /* 沟通诊断：多条文本 → 聚合画像 */
  function callDiagnosis(texts) {
    return fetchJSON(API_BASE + "/api/diagnosis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texts: texts })
    }, 30000).catch(function () { return null; });
  }

  /* 优化前后对比案例 */
  function callComparisons() {
    return fetchJSON(API_BASE + "/api/comparisons", null, 15000).catch(function () { return null; });
  }

  /* 离线降级标记 */
  function markOffline() { sessionStorage.setItem(getModeKey(), "offline"); }
  function clearMode() { sessionStorage.removeItem(getModeKey()); }
  function isOfflineMode() { return sessionStorage.getItem(getModeKey()) === "offline"; }

  function saveReport(report, offline) {
    sessionStorage.setItem(getReportKey(), JSON.stringify(report));
    if (offline) markOffline(); else clearMode();
  }

  function loadReport() {
    var raw = sessionStorage.getItem(getReportKey());
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (e) { return null; }
  }

  window.CB = {
    callAnalyze: callAnalyze,
    callCases: callCases,
    callDiagnosis: callDiagnosis,
    callComparisons: callComparisons,
    saveReport: saveReport,
    loadReport: loadReport,
    isOfflineMode: isOfflineMode,
    markOffline: markOffline,
    getReportKey: getReportKey
  };
})();

