# -*- coding: utf-8 -*-
"""CrossBridge AI 聚合服务：
1. 沟通诊断（diagnosis）：多条文本 → 聚合五维画像（评分/优势/改进建议）
2. 前后对比（comparisons）：预设案例 → 实时分析原表达与优化表达 → 风险降低对比
"""
import json
import os

from config import CASES_PATH
from analyzer import analyze
from models import SCENE_LABELS, DIM_WEIGHTS, risk_of

DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data")
SCENE_CASES_PATH = os.path.join(DATA_DIR, "scene_test_cases.json")
COMPARE_PAIRS_PATH = os.path.join(DATA_DIR, "comparison_pairs.json")

# 维度中文名与改进建议模板
DIM_INFO = {
    "language_accuracy": {
        "zh": "语言准确性",
        "strength": "语言基础扎实，表达准确地道，专业可信度高。",
        "advice": "留意搭配与语域（如用 'above our budget' 代替 'too expensive'），减少中式英语痕迹。",
    },
    "business_politeness": {
        "zh": "商务礼貌",
        "strength": "称呼、语气与请求方式得体，商务礼仪意识强。",
        "advice": "避免命令式表达（You must / Give us），多用 Could you please / We would appreciate it if 等请求句式。",
    },
    "cultural_adaptability": {
        "zh": "文化适配",
        "strength": "能主动考虑对方文化差异，表达适配度高。",
        "advice": "对高语境文化（日韩、中东）客户，避免直接否定；先肯定再委婉表达，注意面子维护。",
    },
    "communication_clarity": {
        "zh": "表达清晰",
        "strength": "要点明确、结构清晰，信息传达高效。",
        "advice": "避免 ASAP 等模糊时间承诺，给出具体日期与理由；关键信息（价格、日期、数量）完整呈现。",
    },
    "relationship_friendliness": {
        "zh": "合作友好",
        "strength": "重视关系维护，沟通中体现长期合作诚意。",
        "advice": "增加感谢、跟进与未来合作意向的表达，把事务性沟通升级为关系经营。",
    },
}

DIAGNOSIS_SAMPLE_TEXTS = [
    "We have not received your payment. You must pay us immediately.",
    "Your price is unacceptable. We will find another supplier.",
    "Your proposal is completely wrong.",
    "Your products are very bad quality. We are very disappointed.",
    "We want to arrange a meeting with you next week.",
]


def _load_json(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def build_diagnosis(texts=None):
    """输入多条沟通文本，输出聚合沟通风险画像。"""
    samples = texts or DIAGNOSIS_SAMPLE_TEXTS
    results = [analyze(t, "auto") for t in samples]
    n = len(results)

    dim_keys = list(DIM_WEIGHTS.keys())
    avg = {k: round(sum(getattr(r.scores, k) for r in results) / n, 1) for k in dim_keys}
    total = round(sum(avg[k] * w for k, w in DIM_WEIGHTS.items()))
    risk_key, risk_zh, risk_en = risk_of(total)

    strengths = []
    improvements = []
    for k in dim_keys:
        v = avg[k]
        if v >= 8.0:
            strengths.append({"dim": DIM_INFO[k]["zh"], "score": v, "note": DIM_INFO[k]["strength"]})
        elif v < 8.0:
            improvements.append({"dim": DIM_INFO[k]["zh"], "score": v, "advice": DIM_INFO[k]["advice"]})
    if not strengths:
        strengths = [{"dim": "整体表达", "score": total, "note": "各项仍有提升空间，详见改进建议。"}]
    if not improvements:
        improvements = [{"dim": "综合", "score": total,
                         "advice": "整体表现良好，建议持续使用系统检测，保持并巩固优势维度。"}]

    summary = (f"基于 {n} 次典型沟通文本的 AI 分析：综合风险评分 {total} 分（{risk_zh}）。"
               f"优势维度：{'、'.join(s['dim'] for s in strengths)}；"
               f"需重点改进：{'、'.join(i['dim'] for i in improvements)}。")

    return {
        "sample_count": n,
        "total": total,
        "risk_level": risk_key,
        "risk_label": f"{risk_zh} · {risk_en}",
        "summary": summary,
        "scores": avg,
        "dimension_reasons": {k: f"多次分析均值 {avg[k]}/10" for k in dim_keys},
        "strengths": strengths,
        "improvements": improvements,
        "mode": results[0].mode,
    }


# 对比结果缓存（避免真实 API 模式重复计费）
_COMPARE_CACHE = None


def build_comparisons(force_refresh=False):
    """预置案例的前后对比：对原表达与优化表达分别调用分析接口，突出风险降低。"""
    global _COMPARE_CACHE
    if _COMPARE_CACHE is not None and not force_refresh:
        return _COMPARE_CACHE

    data = _load_json(COMPARE_PAIRS_PATH)
    out = []
    for p in data["pairs"]:
        before = analyze(p["original"], p["scene"])
        after = analyze(p["optimized"], p["scene"])
        out.append({
            "id": p["id"],
            "scene": p["scene"],
            "scene_label": p.get("scene_label", SCENE_LABELS.get(p["scene"], "一般沟通")),
            "title": p.get("title", ""),
            "risk_focus": p.get("risk_focus", ""),
            "original": p["original"],
            "optimized": p["optimized"],
            "before": {
                "total": before.total,
                "risk_level": before.risk_level,
                "risk_label": before.risk_label,
                "scores": before.scores.model_dump(),
                "issues": [{"type": i.type, "quote": i.quote, "severity": i.severity}
                           for i in before.issues],
            },
            "after": {
                "total": after.total,
                "risk_level": after.risk_level,
                "risk_label": after.risk_label,
                "scores": after.scores.model_dump(),
                "issues": [{"type": i.type, "quote": i.quote, "severity": i.severity}
                           for i in after.issues],
            },
            "reduction": after.total - before.total,  # 评分提升量（正=优化后更安全）
        })
    _COMPARE_CACHE = {"total": len(out), "pairs": out}
    return _COMPARE_CACHE


def get_scene_test_cases(category=None):
    data = _load_json(SCENE_CASES_PATH)
    cases = data["cases"]
    if category and category != "all":
        cases = [c for c in cases if c["category"] == category]
    return {"total": len(cases), "categories": data["categories"], "cases": cases}
