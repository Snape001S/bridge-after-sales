# -*- coding: utf-8 -*-
"""规则引擎分析器：无 API Key 模式（默认）与 AI 失败时的自动兜底。

原理：用 50 条案例（30 条风险案例库 + 20 条商务场景测试案例）做关键词匹配 +
少量通用风险模式，产出"输入相关"的专业分析。
虽然不如大模型灵活，但完全免费、零依赖、结果稳定 —— 比赛现场永不翻车。
"""
import json
import os
import re

from config import CASES_PATH
from models import (
    AnalysisResult, Issue, Fix, Scores, Reasoning,
    SCENE_LABELS, compute_total, risk_of,
)

# ---- 通用风险模式（未命中案例库时的兜底模板）--------------------------------
GENERIC_PATTERNS = [
    {
        "regex": r"\bmust\b",
        "type": "etiquette", "severity": "medium",
        "analysis": "使用了命令式语气 'must'。国际商务沟通应改用礼貌请求句式（Could you please... / We would appreciate it if...），命令式在多数文化中都显得生硬强势，容易引发抵触。",
        "optimized": "Could you please ...? Your cooperation would be greatly appreciated.",
        "culture": "命令式与请求式的选择是商务礼貌的核心差异：请求句式给对方决策空间，体现'尊重对方'，在高语境文化（日韩、中东）中尤为重要。",
    },
    {
        "regex": r"\basap\b|as soon as possible",
        "type": "etiquette", "severity": "medium",
        "analysis": "'ASAP'（尽快）含义模糊，不同文化对它的理解差异巨大（可能是一周，也可能是一个月），无法形成明确承诺，容易造成后续矛盾。",
        "optimized": "Could you please complete this by [具体日期]? This would allow us to proceed with [目的]。",
        "culture": "时间观差异（单时制 vs 多时制）是跨文化沟通的高频冲突点：单时制文化期待精确日期，多时制文化对时间更灵活——给出具体日期和理由才能让双方预期一致。",
    },
    {
        "regex": r"\bnever\b|\balways\b",
        "type": "language", "severity": "medium",
        "analysis": "使用了 'never/always' 等绝对化副词，在商务表达中属于过度概括，既削弱可信度，也可能在跨文化语境中被理解为强烈指责。",
        "optimized": "In most cases, ... / Based on our experience, ...",
        "culture": "绝对化表述在低语境文化中会被当作事实陈述来反驳，在高语境文化中则显得不留情面；用'多数情况/基于经验'的限定词更专业。",
    },
]

# 场景关键词（用户未选择场景时自动识别）
SCENE_KEYWORDS = {
    "email": ["dear", "quotation", "invoice", "order", "regards", "email", "samples"],
    "negotiation": ["discount", "contract", "price", "offer", "supplier", "negotiat", "terms", "sign"],
    "meeting": ["meeting", "proposal", "agree", "disagree", "present", "plan", "agenda"],
    "customer": ["delay", "documents", "help", "service", "shipment", "apologize"],
    "daily": ["earn", "married", "salary", "how are you", "family"],
    "ecommerce": ["refund", "amazon", "ebay", "aliexpress", "buyer", "seller", "listing", "return"],
    "reception": ["invite", "invitation", "dinner", "visit", "welcome", "pickup", "factory visit"],
}

SEVERITY_PENALTY = {"low": 1, "medium": 2, "high": 3}
TYPE_DIMS = {
    "language": ["language_accuracy"],
    "etiquette": ["business_politeness"],
    "culture": ["cultural_adaptability", "relationship_friendliness"],
}

# ---- 目标文化：风险因素说明（不同文化只影响解释，不改变核心评分逻辑） ----
CULTURE_FACTORS = {
    "auto": "不同商务文化对直接性的接受度差异显著——高语境文化（日本、中东）对直接否定与威胁更敏感，低语境文化（美国、北欧）更习惯直接沟通；建议以礼貌委婉为安全基准。",
    "japan": "日本属典型高语境、面子敏感文化：直接否定价格或威胁更换供应商，易造成对方面子压力，对方可能含蓄回避而非正面回应，合作信任因此受损。",
    "us": "美国商务文化偏低语境、结果导向：谈判中直接讨论价格与要求较常见，风险主要在于语气是否足够专业礼貌，而非直接性本身。",
    "europe": "欧洲商务文化整体偏低语境但重视关系与专业礼仪（北欧更直接、南欧更重关系），需在直接与礼貌之间取得平衡。",
    "seasia": "东南亚多数文化重视关系与委婉表达（如泰国倾向柔和沟通、印尼注重等级礼仪），直接否定容易让对方以沉默回避，损失合作机会。",
    "mideast": "中东商务文化高度重视关系与信任建立，谈判节奏较慢；威胁式表达与时间压迫被视为不尊重，直接影响长期合作意愿。",
}

CULTURE_SHORT = {
    "auto": "不同文化对直接性的接受度差异显著，建议以礼貌委婉为安全基准",
    "japan": "日本属高语境、面子敏感文化，直接否定易造成对方压力",
    "us": "美国商务文化偏向直接，但需保持专业礼貌的语气",
    "europe": "欧洲商务文化需在直接与礼貌之间取得平衡",
    "seasia": "东南亚文化重视委婉与关系，直接表达可能让对方沉默回避",
    "mideast": "中东文化重视关系与信任，避免施压式表达",
}

# ---- 关键词类别（用于 AI 推理过程中的"关键词识别"） ----
KEYWORD_CATEGORY = {
    "better price": "价格谈判", "price": "价格谈判", "discount": "价格谈判", "expensive": "价格谈判",
    "too expensive": "价格谈判", "too high": "价格谈判", "unacceptable": "价格谈判",
    "counteroffer": "价格谈判", "quotation": "价格谈判",
    "otherwise": "条件压力", "or we walk": "条件压力", "or we": "条件压力",
    "another supplier": "替代威胁", "another company": "替代威胁", "choose another": "替代威胁",
    "other suppliers": "替代威胁",
    "must": "命令语气", "must pay": "催款压力", "pay us": "催款压力", "payment": "催款压力",
    "wrong": "方案否定", "proposal": "方案否定", "won't work": "方案否定", "not interested": "方案否定",
    "terrible": "投诉情绪", "full refund": "投诉情绪", "what's wrong with you": "投诉情绪", "disappointed": "投诉情绪",
    "delay": "责任问题", "not our fault": "责任推诿",
    "dinner": "商务邀请", "come to our company": "商务邀请", "invite": "商务邀请",
    "earn": "隐私话题", "salary": "隐私话题", "married": "隐私话题", "so old": "隐私话题",
    "asap": "时间承诺", "no more delays": "时间承诺",
}

# ---- 商务意图（按业务场景） ----
INTENT_BY_BIZ = {
    "inquiry": "采购方就产品/报价进行询价，期望获得清晰、专业的回应",
    "quotation": "供应商回应询价，需在报价中争取订单并维护专业形象",
    "negotiation": "双方就价格或条款进行协商，需兼顾立场与关系",
    "complaint": "客户就问题表达不满，需安抚情绪并给出解决方案",
    "contract": "双方沟通合同条款，需明确权利义务并保持合作氛围",
    "aftersales": "客户售后沟通，需解决问题并维护长期关系",
}
INTENT_BY_SCENE = {
    "email": "通过邮件表达商务诉求并维护合作关系",
    "negotiation": "在谈判中表达诉求并维护合作关系",
    "meeting": "在会议中表达观点并维护协作关系",
    "customer": "与客户沟通诉求并维护合作关系",
    "daily": "在日常跨文化沟通中维护良好关系",
    "ecommerce": "在跨境电商沟通中处理交易与客户关系",
    "reception": "在商务接待中建立与维护客户关系",
    "general": "完成商务沟通并维护合作关系",
}

AREA_BY_TYPE = {
    "language": "语言表达风险",
    "etiquette": "商务礼仪风险",
    "culture": "跨文化适配风险",
}


def _build_strategies(base: str) -> list:
    """由推荐表达生成三个商务表达策略版本（关系维护/商务谈判/强谈判）。"""
    base = base.strip()
    return [
        {"key": "relationship", "name": "关系维护型",
         "suited_for": "强调感谢、合作、共同解决",
         "regions": "日本 / 东南亚 / 中东 / 长期合作客户",
         "optimized": base + " We truly appreciate our continued cooperation and look forward to growing together."},
        {"key": "negotiation", "name": "商务谈判型",
         "suited_for": "明确提出需求、保持专业",
         "regions": "美国 / 欧洲",
         "optimized": base + " We would appreciate your kind consideration and look forward to your favorable reply."},
        {"key": "assertive", "name": "强谈判型",
         "suited_for": "提出价格要求、避免威胁",
         "regions": "采购议价场景",
         "optimized": "We are committed to reaching an agreement that works for both sides. " + base +
                      " We trust we can settle this matter promptly and amicably."},
    ]


def load_cases():
    with open(CASES_PATH, encoding="utf-8") as f:
        return json.load(f)["cases"]


def load_scene_cases():
    """商务场景测试案例（20 条）：与风险案例库共同构成匹配池，覆盖更高频场景。"""
    path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data", "scene_test_cases.json")
    with open(path, encoding="utf-8") as f:
        return json.load(f)["cases"]


CASES = load_cases()
SCENE_CASES = load_scene_cases()
MATCH_POOL = CASES + SCENE_CASES  # 规则引擎匹配池：风险案例库 + 场景测试案例

# 常见缩写（避免把 Mr./Dr. 等缩写句点误判为句号）
_ABBREVS = {"mr", "mrs", "ms", "dr", "st", "vs", "inc", "ltd", "co", "etc",
            "prof", "no", "jr", "sr", "dept", "fig", "e.g", "i.e", "u.s", "u.k"}


def _is_sentence_end(text: str, i: int) -> bool:
    """判断位置 i 的字符是否为句子边界（'.'/'!'/'?'/换行，且不是缩写）。"""
    ch = text[i]
    if ch in "!?\n":
        return True
    if ch != ".":
        return False
    if i + 1 >= len(text) or text[i + 1] not in " \n":
        return False
    # 检查句点前一个词是否为缩写（如 Mr.）
    j = i - 1
    while j >= 0 and text[j].isalpha():
        j -= 1
    word = text[j + 1:i].lower()
    return word not in _ABBREVS


def _sentence_around(text: str, keyword: str, max_len: int = 90) -> str:
    """摘取包含关键词的原文句子片段（用于 quote 字段），正确处理 Mr. 等缩写。"""
    idx = text.lower().find(keyword.lower())
    if idx < 0:
        return keyword
    # 句子起点：从关键词位置向前找边界
    start = 0
    for i in range(idx - 1, -1, -1):
        if _is_sentence_end(text, i):
            start = i + 1
            break
    # 句子终点：从关键词位置向后找边界
    end = len(text)
    for i in range(idx + len(keyword), len(text)):
        if _is_sentence_end(text, i):
            end = i + 1
            break
    snippet = text[start:end].strip()
    if len(snippet) > max_len:
        snippet = snippet[:max_len].rstrip() + "..."
    return snippet or keyword


def _detect_scene(text: str, user_scene: str) -> str:
    if user_scene in SCENE_LABELS:
        return user_scene
    text_l = text.lower()
    best, best_score = "general", 0
    for scene, kws in SCENE_KEYWORDS.items():
        s = sum(1 for kw in kws if kw in text_l)
        if s > best_score:
            best, best_score = scene, s
    return best


def analyze_rule(text: str, scene: str = "auto", culture: str = "auto",
                 business_scene: str = "auto", provider: str = "mock") -> AnalysisResult:
    text_l = text.lower()
    scene_final = _detect_scene(text, scene)
    culture = culture if culture in CULTURE_FACTORS else "auto"
    culture_label = {"auto": "自动识别", "japan": "日本", "us": "美国", "europe": "欧洲",
                     "seasia": "东南亚", "mideast": "中东"}.get(culture, "自动识别")
    biz_label = {"auto": "自动识别", "inquiry": "产品询价", "quotation": "报价回复",
                 "negotiation": "商务谈判", "complaint": "客户投诉", "contract": "合同沟通",
                 "aftersales": "售后服务"}.get(business_scene, "自动识别")

    issues: list = []
    fix_pool: list = []
    matched_case_ids = []
    matched_keywords = []

    # 1) 案例匹配（主引擎：风险案例库 + 商务场景测试案例）
    for case in MATCH_POOL:
        for kw in case.get("match_keywords", []):
            if kw.lower() in text_l:
                # 优先用案例原文作为引用（若用户的文本包含它）；否则摘取关键词所在句子
                if case["original_expression"] in text:
                    quote = case["original_expression"]
                else:
                    quote = _sentence_around(text, kw)
                sev_map = {"low": "low", "medium_low": "medium", "medium_high": "medium",
                           "high": "high"}
                issues.append(Issue(
                    type=case.get("issue_type", "culture"),
                    quote=quote,
                    severity=sev_map.get(case.get("risk_level", "medium"), "medium"),
                    analysis=case["problem_analysis"],
                ))
                fix_pool.append(Fix(
                    original=quote,
                    optimized=case["recommended_expression"],
                    culture_explanation=case["culture_explanation"],
                    strategies=_build_strategies(case["recommended_expression"]),
                ))
                matched_case_ids.append(case["id"])
                matched_keywords.append(kw)
                break  # 每个案例只匹配一次

    # 2) 通用风险模式（兜底）
    for pat in GENERIC_PATTERNS:
        if len(issues) >= 4:
            break
        m = re.search(pat["regex"], text, re.IGNORECASE)
        if m:
            issues.append(Issue(type=pat["type"], quote=_sentence_around(text, m.group(0)),
                                severity=pat["severity"], analysis=pat["analysis"]))
            fix_pool.append(Fix(original=_sentence_around(text, m.group(0)),
                                optimized=pat["optimized"], culture_explanation=pat["culture"],
                                strategies=_build_strategies(pat["optimized"])))
            matched_keywords.append(m.group(0).lower())

    # 3) 问题与优化按严重度从高到低排序（同一案例的几条问题保持相对顺序）
    sev_rank = {"high": 0, "medium": 1, "low": 2}
    if len(issues) > 1:
        pairs = sorted(zip(issues, fix_pool), key=lambda p: sev_rank.get(p[0].severity, 9))
        issues = [p[0] for p in pairs]
        fix_pool = [p[1] for p in pairs]

    issues = issues[:4]
    fix_pool = fix_pool[:4]

    # 3.5) 文化视角补充：为礼仪/文化类问题追加目标文化解释（不影响评分）
    if culture != "auto":
        note = CULTURE_SHORT.get(culture, "")
        if note:
            for it in issues:
                if it.type in ("etiquette", "culture") and note not in it.analysis:
                    it.analysis = f"{it.analysis}\n（{culture_label}文化视角：{note}）"

    # 3) 五维评分：起始 9 分（默认优秀但非完美），按问题类型与严重度扣分
    scores = Scores(language_accuracy=9, business_politeness=9,
                    cultural_adaptability=9, communication_clarity=9,
                    relationship_friendliness=9)
    for it in issues:
        penalty = SEVERITY_PENALTY.get(it.severity, 1)
        for dim in TYPE_DIMS.get(it.type, []):
            cur = getattr(scores, dim) - penalty
            setattr(scores, dim, max(1, min(10, cur)))

    total = compute_total(scores)
    risk_key, risk_zh, risk_en = risk_of(total)
    dims = scores.model_dump()

    # 4) 总评
    if not issues:
        summary = ("整体表达得体，未检出明显风险。建议保持当前的礼貌与清晰度；"
                   "如能确认收件人称呼并给出具体时间承诺，专业感会更上一层。")
    else:
        types_zh = {"language": "语言表达", "etiquette": "商务礼仪", "culture": "跨文化适配"}
        main_types = "、".join(sorted({types_zh[i.type] for i in issues}))
        tone = ("存在明显风险" if any(i.severity == "high" for i in issues)
                else "存在一定风险" if any(i.severity == "medium" for i in issues)
                else "有少量瑕疵")
        summary = (f"整体表达{tone}，共检出 {len(issues)} 处风险，主要涉及{main_types}。"
                   "建议按下方优化表达修改后再发送，可显著提升专业形象与合作意愿。")

    # 5) 相关案例
    related = [c for c in CASES if c["id"] in matched_case_ids][:2]
    if len(related) < 2:
        for c in CASES:
            if c["id"] not in matched_case_ids and c["scenario"] == scene_final:
                related.append(c)
            if len(related) >= 2:
                break

    dim_reasons = {
        "language_accuracy": "语言层面" + ("存在搭配/语域问题" if dims["language_accuracy"] < 9 else "表达基本准确、术语得当"),
        "business_politeness": "礼貌层面" + ("存在命令式或索取式表达" if dims["business_politeness"] < 9 else "称呼与请求语气得体"),
        "cultural_adaptability": "文化层面" + ("存在直接否定或面子风险" if dims["cultural_adaptability"] < 9 else "未发现明显文化冲突"),
        "communication_clarity": "清晰度" + ("个别信息模糊" if dims["communication_clarity"] < 9 else "要点明确、结构清晰"),
        "relationship_friendliness": "关系维护" + ("缺少关系经营意识" if dims["relationship_friendliness"] < 9 else "体现合作诚意"),
    }

    # ---- AI 推理过程：关键词识别 → 商务意图 → 风险判断 → 文化因素 → 最终风险 ----
    kw_seen = set()
    reasoning_keywords = []
    for kw in matched_keywords:
        k = kw.lower()
        if k in kw_seen:
            continue
        kw_seen.add(k)
        reasoning_keywords.append({"term": kw, "category": KEYWORD_CATEGORY.get(k, "表达风险")})
    # 全文扫描：补足文本中出现的其他风险关键词（不依赖案例命中）
    for k, cat in KEYWORD_CATEGORY.items():
        if len(reasoning_keywords) >= 8:
            break
        if k in kw_seen or k not in text_l:
            continue
        kw_seen.add(k)
        reasoning_keywords.append({"term": k, "category": cat})
    if not reasoning_keywords and issues:
        for it in issues:
            snippet = it.quote[:24].lower()
            reasoning_keywords.append({"term": it.quote[:24], "category": AREA_BY_TYPE.get(it.type, "表达风险")})
    reasoning_keywords = reasoning_keywords[:6]

    intent = INTENT_BY_BIZ.get(business_scene) or INTENT_BY_SCENE.get(scene_final, "完成商务沟通并维护合作关系")

    risk_areas = []
    for it in issues:
        a = AREA_BY_TYPE.get(it.type)
        if a and a not in risk_areas:
            risk_areas.append(a)
    if business_scene == "negotiation" and any(i.type in ("etiquette", "culture") for i in issues):
        risk_areas.append("谈判策略风险")
    if any(i.type == "culture" for i in issues):
        risk_areas.append("关系维护风险")
    if not risk_areas:
        risk_areas = ["未发现明显风险"]

    culture_factor = CULTURE_FACTORS.get(culture, CULTURE_FACTORS["auto"])
    if not issues:
        culture_factor = "未发现明显跨文化冲突；不同文化下可保持当前表达，并注意称呼与时间承诺的细节。"

    reasoning = Reasoning(
        keywords=reasoning_keywords,
        intent=intent,
        risk_areas=risk_areas,
        culture_factor=culture_factor,
        final_risk=f"{risk_zh} · {risk_en}",
    )

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
        fixes=fix_pool,
        dimension_reasons=dim_reasons,
        related_cases=related,
        provider=provider,
        mode="rule",
        culture=culture,
        culture_label=culture_label,
        business_scene=business_scene,
        business_scene_label=biz_label,
        reasoning=reasoning,
    )
