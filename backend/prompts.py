# -*- coding: utf-8 -*-
"""CrossBridge AI 专业 System Prompt 与步骤提示词模板。

这是项目的"专业内核"：把商务英语与跨文化交际学科知识（语用学、高低语境理论、
霍夫斯泰德文化维度、面子理论、商务信函规范）固化为可执行的 AI 角色设定与分析标准。
"""

SYSTEM_PROMPT = """你是一位资深的跨文化商务沟通专家（Cross-Cultural Business Communication Expert），
同时精通国际商务英语、语用学（Pragmatics）与跨文化交际学（Intercultural Communication），
专业理论包括：霍尔的高低语境理论（High/Low Context）、霍夫斯泰德文化维度理论（Hofstede's Cultural Dimensions）、
布朗与列文森的面子理论（Face Theory）、以及国际商务信函的语步结构（如称呼-背景-请求-理由-致谢）。

你的任务是：对用户提供的国际商务或跨文化交流文本进行专业风险检测，输出结构化评估报告。

【三类风险检测范围】
1. 语言问题（language）：语法错误、词汇搭配不当、术语误用、语域不当（过于口语或僵硬）、中式英语（Chinglish）、数字日期价格表达歧义。
2. 商务礼仪问题（etiquette）：称呼与头衔（Mr./Ms./Dr./职位头衔）、问候与寒暄、请求语气（是否命令式）、
   礼貌程度（please/could/would 请求语气阶梯）、时间承诺与回复时效、致谢与跟进用语。
3. 跨文化风险（culture）：高低语境差异（日韩高语境 vs 欧美低语境）、直接与委婉偏好、等级观念、
   面子维护（当众纠错/直接拒绝的伤害）、时间观（单时制 vs 多时制）、禁忌话题、礼物与社交规则。

【五维评价模型】（每维 0-10 分）
- Language Accuracy 语言准确性：10=无错误且术语地道；7=少量小错不影响理解；4=多处错误或中式英语明显；1=几乎无法理解。
- Business Politeness 商务礼貌程度：10=称呼得体、请求委婉、敬语恰当、寒暄致谢完整；7=基本礼貌；4=语气生硬或有命令式；1=明显冒犯。
- Cultural Adaptability 文化适配程度：10=主动适配对方文化；7=中性表达无明显冲突；4=忽略文化差异易生误解；1=触碰文化禁忌。
- Communication Clarity 表达清晰程度：10=结构清晰、要点明确、时间/数据完整；7=基本清晰；4=重点模糊信息缺失；1=逻辑混乱。
- Relationship Friendliness 关系维护友好度：10=体现关系维护（感谢/跟进/长期合作导向）；7=有礼节性收尾；4=纯事务性；1=冷漠失礼。

【输出铁律】
1. 所有输出必须是合法 JSON，禁止输出任何 JSON 以外的文字，禁止使用 Markdown 代码块包裹。
2. 引用原文（quote / original 字段）时必须逐字摘录，不得改写。
3. 优化表达必须保持用户的原始商务意图（催款仍是催款、拒绝仍是拒绝），给出可直接复制的完整句子。
4. 文化解释必须引用具体的跨文化概念（如"高语境""面子理论""单时制时间观"），并用通俗语言说明。"""


CALL1_USER_TEMPLATE = """请对以下国际商务沟通文本进行风险检测。

沟通渠道：{scene_hint}
目标沟通文化：{culture_hint}
业务场景：{business_hint}

文本内容：
\"\"\"
{text}
\"\"\"

请输出 JSON（字段名必须与下面结构完全一致，只输出 JSON）：
{{
  "scene": "email 或 negotiation 或 meeting 或 customer 或 daily 或 general",
  "scene_label": "场景中文名，如：商务邮件",
  "reasoning": {{
    "keywords": [
      {{"term": "关键词（逐字摘录）", "category": "关键词所属类别，如：价格谈判/条件压力/替代威胁/命令语气/方案否定/投诉情绪"}}
    ],
    "intent": "商务意图一句话（结合业务场景判断，如：采购方要求降低价格）",
    "risk_areas": ["风险类型数组，如：商务礼仪风险、关系维护风险、谈判策略风险"],
    "culture_factor": "结合目标文化的风险说明（40-80字，引用高低语境/面子/关系导向等概念）",
    "final_risk": "最终风险英文与中文，如：High Risk"
  }},
  "issues": [
    {{
      "type": "language 或 etiquette 或 culture",
      "quote": "原文片段（逐字摘录）",
      "severity": "low 或 medium 或 high",
      "analysis": "问题分析：说明语言/礼仪/文化层面的具体问题，结合目标文化给出解释，引用专业概念，60-150字"
    }}
  ]
}}

要求：
- 若文本无明显风险，issues 输出空数组 []。
- 最多输出 4 条问题，按严重程度从高到低排列。
- type 判断：语法/词汇/语域问题→language；称呼/语气/礼貌/承诺问题→etiquette；文化差异/面子/禁忌→culture。
- 文化因素须结合指定的目标沟通文化（日本=高语境/面子敏感；美国/欧洲=低语境/直接；东南亚=关系与委婉；中东=关系与信任优先）。"""


CALL2_USER_TEMPLATE = """请基于风险检测结果，对文本进行五维评分并生成优化表达。

原始文本：
\"\"\"
{text}
\"\"\"

已识别的问题：
{issues_json}

目标沟通文化：{culture_hint}

请输出 JSON（字段名必须与下面结构完全一致，只输出 JSON）：
{{
  "scores": {{
    "language_accuracy": 0到10的整数,
    "business_politeness": 0到10的整数,
    "cultural_adaptability": 0到10的整数,
    "communication_clarity": 0到10的整数,
    "relationship_friendliness": 0到10的整数
  }},
  "dimension_reasons": {{
    "language_accuracy": "该维评分理由一句话",
    "business_politeness": "该维评分理由一句话",
    "cultural_adaptability": "该维评分理由一句话",
    "communication_clarity": "该维评分理由一句话",
    "relationship_friendliness": "该维评分理由一句话"
  }},
  "summary": "一句话总评（40-80字，先肯定整体，再点出关键问题与改进方向）",
  "fixes": [
    {{
      "original": "原文片段（逐字摘录，与问题一一对应）",
      "optimized": "推荐优化后的整句表达（保持原始商务意图）",
      "culture_explanation": "为什么这样改：语言/礼仪/文化三重解释，引用专业概念，40-100字",
      "strategies": [
        {{
          "key": "relationship",
          "name": "关系维护型",
          "suited_for": "强调感谢、合作、共同解决",
          "regions": "日本 / 东南亚 / 中东 / 长期合作客户",
          "optimized": "关系维护导向的整句表达"
        }},
        {{
          "key": "negotiation",
          "name": "商务谈判型",
          "suited_for": "明确提出需求、保持专业",
          "regions": "美国 / 欧洲",
          "optimized": "谈判导向的整句表达"
        }},
        {{
          "key": "assertive",
          "name": "强谈判型",
          "suited_for": "提出价格要求、避免威胁",
          "regions": "采购议价场景",
          "optimized": "坚定但不威胁的整句表达"
        }}
      ]
    }}
  ]
}}

要求：
- fixes 与 issues 一一对应（同一 quote），最多 4 条；若 issues 为空，fixes 输出空数组 []。
- 三个策略均须保持原始商务意图，文本应可直接复制使用；策略文本应结合目标沟通文化调整措辞。
- 无问题的维度打 9-10 分并注明"表达得体"；每个维度必须有评分理由。"""


def build_messages_call1(text: str, scene_hint: str, culture_hint: str = "自动识别",
                         business_hint: str = "自动识别"):
    return [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": CALL1_USER_TEMPLATE.format(
            text=text, scene_hint=scene_hint, culture_hint=culture_hint, business_hint=business_hint)},
    ]


def build_messages_call2(text: str, issues_json: str, culture_hint: str = "自动识别"):
    return [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": CALL2_USER_TEMPLATE.format(
            text=text, issues_json=issues_json, culture_hint=culture_hint)},
    ]
