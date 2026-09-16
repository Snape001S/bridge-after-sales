# -*- coding: utf-8 -*-
"""CrossBridge AI 分析流水线：
大模型六步分析（场景识别→语言→礼仪→文化→评分→优化建议）→ 强校验 → 失败自动降级规则引擎。
总分与风险等级由后端按权重计算（确定性数学），杜绝大模型算错分。
"""
import json

from config import resolve_provider, MAX_LLM_RETRY
from models import (
    AnalysisResult, Issue, Fix, Scores, Strategy, Reasoning,
    SCENE_LABELS, CULTURE_LABELS, BIZ_SCENE_LABELS,
    compute_total, risk_of,
)
from providers import chat, parse_json, LLMError
from prompts import build_messages_call1, build_messages_call2
from mock_analyzer import analyze_rule, _build_strategies
from cases import search_related

VALID_TYPES = {"language", "etiquette", "culture"}
VALID_SEV = {"low", "medium", "high"}


def _clean_issues(raw_issues) -> list:
    out = []
    if not isinstance(raw_issues, list):
        return out
    for it in raw_issues[:4]:
        if not isinstance(it, dict):
            continue
        t = str(it.get("type", "")).strip().lower()
        s = str(it.get("severity", "")).strip().lower()
        if t not in VALID_TYPES or s not in VALID_SEV:
            continue
        quote = str(it.get("quote", "")).strip()
        analysis = str(it.get("analysis", "")).strip()
        if not quote or not analysis:
            continue
        out.append(Issue(type=t, quote=quote, severity=s, analysis=analysis))
    return out


def _clean_scores(raw) -> Scores:
    d = raw.get("scores", {}) if isinstance(raw, dict) else {}

    def num(k, default=8):
        v = d.get(k)
        try:
            v = int(round(float(v)))
        except (TypeError, ValueError):
            return default
        return max(0, min(10, v))

    return Scores(
        language_accuracy=num("language_accuracy"),
        business_politeness=num("business_politeness"),
        cultural_adaptability=num("cultural_adaptability"),
        communication_clarity=num("communication_clarity"),
        relationship_friendliness=num("relationship_friendliness"),
    )


def _clean_fixes(raw, issues: list) -> list:
    out = []
    raw_list = raw.get("fixes", []) if isinstance(raw, dict) else []
    if not isinstance(raw_list, list):
        return out
    for f_ in raw_list[:4]:
        if not isinstance(f_, dict):
            continue
        original = str(f_.get("original", "")).strip()
        optimized = str(f_.get("optimized", "")).strip()
        if not original or not optimized:
            continue
        expl = str(f_.get("culture_explanation", "")).strip() or "见优化表达说明。"
        strategies = []
        raw_strats = f_.get("strategies", [])
        if isinstance(raw_strats, list):
            for s in raw_strats[:3]:
                if not isinstance(s, dict):
                    continue
                key = str(s.get("key", "")).strip()
                name = str(s.get("name", "")).strip()
                if not key or not name:
                    continue
                strategies.append(Strategy(
                    key=key, name=name,
                    suited_for=str(s.get("suited_for", "")).strip() or "专业商务表达",
                    regions=str(s.get("regions", "")).strip() or "通用",
                    optimized=str(s.get("optimized", "")).strip() or optimized,
                ))
        if not strategies:
            strategies = _build_strategies(optimized)
        out.append(Fix(original=original, optimized=optimized, culture_explanation=expl,
                       strategies=strategies))
    # 若模型未返回与问题对应的修复，用问题本身生成占位
    for it in issues:
        if len(out) >= 4:
            break
        if not any(f.original == it.quote for f in out):
            placeholder = "（建议针对该问题重写表达，确保礼貌得体）"
            out.append(Fix(original=it.quote, optimized=placeholder,
                           culture_explanation="请参考相关案例中的优化表达。",
                           strategies=_build_strategies(placeholder)))
    return out


def _clean_reasoning(raw, issues: list, fallback_risk: str) -> Reasoning:
    """从 LLM 输出解析 AI 推理过程；缺失时按问题生成兜底。"""
    d = raw.get("reasoning", {}) if isinstance(raw, dict) else {}
    if not isinstance(d, dict):
        d = {}
    keywords = []
    raw_kws = d.get("keywords", [])
    if isinstance(raw_kws, list):
        for k in raw_kws[:6]:
            if isinstance(k, dict) and k.get("term"):
                keywords.append({"term": str(k["term"])[:40],
                                 "category": str(k.get("category", "表达风险"))})
    risk_areas = [str(a) for a in d.get("risk_areas", []) if a] if isinstance(d.get("risk_areas"), list) else []
    if not keywords:
        for it in issues[:3]:
            keywords.append({"term": it.quote[:24], "category": "风险片段"})
    if not risk_areas:
        risk_areas = ["风险片段（详见下方分析）"] if issues else ["未发现明显风险"]
    return Reasoning(
        keywords=keywords,
        intent=str(d.get("intent", "完成商务沟通并维护合作关系")).strip(),
        risk_areas=risk_areas,
        culture_factor=str(d.get("culture_factor", "")).strip(),
        final_risk=str(d.get("final_risk", fallback_risk)).strip(),
    )


def _llm_analyze(text: str, scene: str, provider: str,
                 culture: str = "auto", business_scene: str = "auto") -> AnalysisResult:
    scene_hint = SCENE_LABELS.get(scene, "自动识别")
    culture_hint = CULTURE_LABELS.get(culture, "自动识别")
    business_hint = BIZ_SCENE_LABELS.get(business_scene, "自动识别")

    # ---- 步骤1：场景识别 + 风险检测 + 推理过程 ----------------------------------
    data1 = None
    last_err = None
    for _ in range(MAX_LLM_RETRY + 1):
        try:
            content = chat(provider, build_messages_call1(text, scene_hint, culture_hint, business_hint))
            data1 = parse_json(content)
            break
        except Exception as e:  # noqa: BLE001
            last_err = e
    if data1 is None:
        raise LLMError(f"风险检测步骤失败: {last_err}")

    issues = _clean_issues(data1.get("issues", []))
    scene_final = str(data1.get("scene", scene) or scene).strip().lower()
    if scene_final not in SCENE_LABELS:
        scene_final = scene if scene in SCENE_LABELS else "general"

    # ---- 步骤2：五维评分 + 优化建议（含三策略） ----------------------------------
    data2 = None
    last_err = None
    for _ in range(MAX_LLM_RETRY + 1):
        try:
            issues_json = json.dumps(
                [{"type": i.type, "quote": i.quote, "severity": i.severity, "analysis": i.analysis}
                 for i in issues], ensure_ascii=False)
            content = chat(provider, build_messages_call2(text, issues_json, culture_hint))
            data2 = parse_json(content)
            break
        except Exception as e:  # noqa: BLE001
            last_err = e
    if data2 is None:
        raise LLMError(f"评分建议步骤失败: {last_err}")

    scores = _clean_scores(data2)
    total = compute_total(scores)
    risk_key, risk_zh, risk_en = risk_of(total)
    fixes = _clean_fixes(data2, issues)
    summary = str(data2.get("summary", "")).strip() or "分析完成，详见各维度得分与优化建议。"
    dim_reasons = {k: str(v) for k, v in data2.get("dimension_reasons", {}).items()}
    related = search_related(scene_final, text)
    reasoning = _clean_reasoning(data1, issues, f"{risk_zh} · {risk_en}")

    return AnalysisResult(
        text=text,
        scene=scene_final,
        scene_label=SCENE_LABELS.get(scene_final, "一般沟通"),
        scores=scores,
        total=total,
        risk_level=risk_key,
        risk_label=f"{risk_zh} · {risk_en}",
        summary=summary,
        issues=issues,
        fixes=fixes,
        dimension_reasons=dim_reasons,
        related_cases=related,
        provider=provider,
        mode="ai",
        culture=culture,
        culture_label=culture_hint,
        business_scene=business_scene,
        business_scene_label=business_hint,
        reasoning=reasoning,
    )


def analyze(text: str, scene: str = "auto", culture: str = "auto",
            business_scene: str = "auto") -> AnalysisResult:
    """总入口：按配置选择通道，LLM 失败自动降级规则引擎，保证接口永不失败。"""
    provider = resolve_provider()
    if provider == "mock":
        return analyze_rule(text, scene, culture, business_scene, provider="mock")

    try:
        return _llm_analyze(text, scene, provider, culture, business_scene)
    except Exception as e:  # noqa: BLE001
        print(f"[CrossBridge] {provider} 通道分析失败，已自动降级到规则引擎: {e}")
        return analyze_rule(text, scene, culture, business_scene, provider=f"{provider}(降级)")
