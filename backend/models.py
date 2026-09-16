# -*- coding: utf-8 -*-
"""CrossBridge AI 数据结构（Pydantic 模型）：接口契约 + 强校验。"""
from typing import List, Optional
from pydantic import BaseModel, Field


class AnalyzeRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=2000, description="待检测的国际沟通文本")
    scene: str = Field("auto", description="沟通渠道: auto|email|negotiation|meeting|customer|daily")
    culture: str = Field("auto", description="目标沟通文化: auto|us|europe|japan|seasia|mideast")
    business_scene: str = Field("auto", description="业务场景: auto|inquiry|quotation|negotiation|complaint|contract|aftersales")


class Issue(BaseModel):
    type: str = Field(..., description="language|etiquette|culture")
    quote: str = Field(..., description="原文片段（逐字摘录）")
    severity: str = Field(..., description="low|medium|high")
    analysis: str = Field(..., description="问题分析")


class Strategy(BaseModel):
    key: str = Field(..., description="relationship|negotiation|assertive")
    name: str = Field(..., description="策略名（关系维护型/商务谈判型/强谈判型）")
    suited_for: str = Field(..., description="适用场景")
    regions: str = Field(..., description="推荐地区")
    optimized: str = Field(..., description="策略优化文本")


class Fix(BaseModel):
    original: str = Field(..., description="原文片段")
    optimized: str = Field(..., description="推荐优化表达（整句，可直接使用）")
    culture_explanation: str = Field(..., description="文化解释")
    strategies: List[Strategy] = Field(default_factory=list, description="AI 商务表达策略（三个版本）")


class Reasoning(BaseModel):
    keywords: List[dict] = Field(default_factory=list, description="关键词识别：[{term, category}]")
    intent: str = Field("", description="商务意图")
    risk_areas: List[str] = Field(default_factory=list, description="风险判断（类型列表）")
    culture_factor: str = Field("", description="文化因素说明")
    final_risk: str = Field("", description="最终风险")


class Scores(BaseModel):
    language_accuracy: int = Field(..., ge=0, le=10)
    business_politeness: int = Field(..., ge=0, le=10)
    cultural_adaptability: int = Field(..., ge=0, le=10)
    communication_clarity: int = Field(..., ge=0, le=10)
    relationship_friendliness: int = Field(..., ge=0, le=10)


class AnalysisResult(BaseModel):
    text: str
    scene: str
    scene_label: str
    scores: Scores
    total: int = Field(..., ge=0, le=100)
    risk_level: str = Field(..., description="low|medium_low|medium_high|high")
    risk_label: str
    summary: str
    issues: List[Issue]
    fixes: List[Fix]
    dimension_reasons: dict
    related_cases: List[dict]
    provider: str
    mode: str = Field(..., description="ai=大模型分析 | rule=规则引擎分析（无Key模式）")
    culture: str = Field("auto", description="目标沟通文化")
    culture_label: str = Field("", description="目标文化中文名")
    business_scene: str = Field("auto", description="业务场景")
    business_scene_label: str = Field("", description="业务场景中文名")
    reasoning: Reasoning = Field(default_factory=Reasoning, description="AI 风险推理过程")


# ---- 常量 -----------------------------------------------------------------
SCENE_LABELS = {
    "email": "商务邮件",
    "negotiation": "商务谈判",
    "meeting": "国际会议",
    "customer": "客户沟通",
    "daily": "日常交流",
    "ecommerce": "跨境电商",
    "reception": "商务接待",
    "general": "一般沟通",
}

CULTURE_LABELS = {
    "auto": "自动识别",
    "us": "美国",
    "europe": "欧洲",
    "japan": "日本",
    "seasia": "东南亚",
    "mideast": "中东",
}

BIZ_SCENE_LABELS = {
    "auto": "自动识别",
    "inquiry": "产品询价",
    "quotation": "报价回复",
    "negotiation": "商务谈判",
    "complaint": "客户投诉",
    "contract": "合同沟通",
    "aftersales": "售后服务",
}


class DiagnosisRequest(BaseModel):
    """沟通诊断请求：多条文本 → 聚合生成沟通风险画像。"""
    texts: List[str] = Field(..., min_length=1, max_length=20,
                             description="多条国际沟通文本（建议 5 条以上）")

# 五维权重（加权和 = 总分 0-100）
DIM_WEIGHTS = {
    "language_accuracy": 3.0,
    "business_politeness": 2.0,
    "cultural_adaptability": 2.0,
    "communication_clarity": 2.0,
    "relationship_friendliness": 1.0,
}

RISK_LEVELS = [
    (85, "low", "低风险", "Low Risk"),
    (70, "medium_low", "中风险", "Medium Risk"),
    (50, "medium_high", "中高风险", "Medium-High Risk"),
    (0, "high", "高风险", "High Risk"),
]


def compute_total(scores: Scores) -> int:
    vals = scores.model_dump()
    total = sum(vals[k] * w for k, w in DIM_WEIGHTS.items())
    return int(round(total))


def risk_of(total: int):
    for threshold, key, zh, en in RISK_LEVELS:
        if total >= threshold:
            return key, zh, en
    return "high", "高风险", "High Risk"
