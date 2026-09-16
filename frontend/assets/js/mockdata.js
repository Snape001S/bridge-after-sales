/* ============================================================
   CrossBridge AI · 内置离线演示数据（后端不可用时的降级数据）
   与后端 data/cross_culture_cases.json 的案例保持一致（精选 8 条）
   ============================================================ */

window.CB_MOCK = {
  report: {
  "text": "Dear Mr. Sato,\n\nWe have received your quotation, but your price is too expensive. Please give us a better price.\n\nBest regards,\nZhang Wei",
  "scene": "email",
  "scene_label": "商务邮件",
  "scores": {
    "language_accuracy": 7,
    "business_politeness": 6,
    "cultural_adaptability": 9,
    "communication_clarity": 9,
    "relationship_friendliness": 9
  },
  "total": 78,
  "risk_level": "medium_low",
  "risk_label": "中风险 · Medium Risk",
  "summary": "整体表达存在明显风险，共检出 2 处风险，主要涉及商务礼仪、语言表达。建议按下方优化表达修改后再发送，可显著提升专业形象与合作意愿。",
  "issues": [
    {
      "type": "etiquette",
      "quote": "Please give us a better price.",
      "severity": "high",
      "analysis": "① 最后通牒式威胁（or we cancel）在商务沟通中极具破坏性；② 'Give us' 命令式索取；③ 未提供任何理由或交换条件（如订单量、长期合作），变成单纯压迫。\n（日本文化视角：日本属高语境、面子敏感文化，直接否定易造成对方压力）"
    },
    {
      "type": "language",
      "quote": "We have received your quotation, but your price is too expensive. Please give us a better price.",
      "severity": "medium",
      "analysis": "① 搭配不地道：商务语境评价价格更常用 'above our budget' / 'beyond our expectation'，'expensive' 偏口语且语气过重。② 'too expensive' 是强烈否定，暗含'你报价不合理'的指责；③ 'give us a better price' 是直接索取式请求，缺少肯定、理由与感谢。"
    }
  ],
  "fixes": [
    {
      "original": "Please give us a better price.",
      "optimized": "We value our cooperation and would like to move forward with this order. Given our projected order volume of [数量], could you kindly consider a 10% adjustment? We believe this would support a long-term partnership.",
      "culture_explanation": "谈判筹码应'交换'而非'威胁'：用订单量、长期合作等理由换取让步，给对方'为什么可以降价'的依据。威胁只会让对方面子尽失，触发对抗或终止合作。",
      "strategies": [
        {
          "key": "relationship",
          "name": "关系维护型",
          "suited_for": "强调感谢、合作、共同解决",
          "regions": "日本 / 东南亚 / 中东 / 长期合作客户",
          "optimized": "We value our cooperation and would like to move forward with this order. Given our projected order volume of [数量], could you kindly consider a 10% adjustment? We believe this would support a long-term partnership. We truly appreciate our continued cooperation and look forward to growing together."
        },
        {
          "key": "negotiation",
          "name": "商务谈判型",
          "suited_for": "明确提出需求、保持专业",
          "regions": "美国 / 欧洲",
          "optimized": "We value our cooperation and would like to move forward with this order. Given our projected order volume of [数量], could you kindly consider a 10% adjustment? We believe this would support a long-term partnership. We would appreciate your kind consideration and look forward to your favorable reply."
        },
        {
          "key": "assertive",
          "name": "强谈判型",
          "suited_for": "提出价格要求、避免威胁",
          "regions": "采购议价场景",
          "optimized": "We are committed to reaching an agreement that works for both sides. We value our cooperation and would like to move forward with this order. Given our projected order volume of [数量], could you kindly consider a 10% adjustment? We believe this would support a long-term partnership. We trust we can settle this matter promptly and amicably."
        }
      ]
    },
    {
      "original": "We have received your quotation, but your price is too expensive. Please give us a better price.",
      "optimized": "Dear Mr. Sato,\n\nThank you for your quotation. We appreciate the detailed breakdown. However, the price is higher than our budget expectations. Would you be able to consider a more favorable rate, given our order volume?\n\nBest regards,\nZhang Wei",
      "culture_explanation": "用客观事实（预算、订单量）代替主观指责（太贵），把'你的报价不合理'变成'我们的预算有限'——给对方台阶，符合'对事不对人'的国际商务原则，在高语境文化（日本、中东）中尤其重要。",
      "strategies": [
        {
          "key": "relationship",
          "name": "关系维护型",
          "suited_for": "强调感谢、合作、共同解决",
          "regions": "日本 / 东南亚 / 中东 / 长期合作客户",
          "optimized": "Dear Mr. Sato,\n\nThank you for your quotation. We appreciate the detailed breakdown. However, the price is higher than our budget expectations. Would you be able to consider a more favorable rate, given our order volume?\n\nBest regards,\nZhang Wei We truly appreciate our continued cooperation and look forward to growing together."
        },
        {
          "key": "negotiation",
          "name": "商务谈判型",
          "suited_for": "明确提出需求、保持专业",
          "regions": "美国 / 欧洲",
          "optimized": "Dear Mr. Sato,\n\nThank you for your quotation. We appreciate the detailed breakdown. However, the price is higher than our budget expectations. Would you be able to consider a more favorable rate, given our order volume?\n\nBest regards,\nZhang Wei We would appreciate your kind consideration and look forward to your favorable reply."
        },
        {
          "key": "assertive",
          "name": "强谈判型",
          "suited_for": "提出价格要求、避免威胁",
          "regions": "采购议价场景",
          "optimized": "We are committed to reaching an agreement that works for both sides. Dear Mr. Sato,\n\nThank you for your quotation. We appreciate the detailed breakdown. However, the price is higher than our budget expectations. Would you be able to consider a more favorable rate, given our order volume?\n\nBest regards,\nZhang Wei We trust we can settle this matter promptly and amicably."
        }
      ]
    }
  ],
  "dimension_reasons": {
    "language_accuracy": "语言层面存在搭配/语域问题",
    "business_politeness": "礼貌层面存在命令式或索取式表达",
    "cultural_adaptability": "文化层面未发现明显文化冲突",
    "communication_clarity": "清晰度要点明确、结构清晰",
    "relationship_friendliness": "关系维护体现合作诚意"
  },
  "related_cases": [
    {
      "id": "EM-002",
      "scenario": "email",
      "sub_scene": "报价回复",
      "original_expression": "We have received your quotation, but your price is too expensive. Please give us a better price.",
      "problem_analysis": "① 搭配不地道：商务语境评价价格更常用 'above our budget' / 'beyond our expectation'，'expensive' 偏口语且语气过重。② 'too expensive' 是强烈否定，暗含'你报价不合理'的指责；③ 'give us a better price' 是直接索取式请求，缺少肯定、理由与感谢。",
      "risk_level": "medium_high",
      "recommended_expression": "Dear Mr. Sato,\n\nThank you for your quotation. We appreciate the detailed breakdown. However, the price is higher than our budget expectations. Would you be able to consider a more favorable rate, given our order volume?\n\nBest regards,\nZhang Wei",
      "culture_explanation": "用客观事实（预算、订单量）代替主观指责（太贵），把'你的报价不合理'变成'我们的预算有限'——给对方台阶，符合'对事不对人'的国际商务原则，在高语境文化（日本、中东）中尤其重要。",
      "target_culture": "日本 / 高语境",
      "match_keywords": [
        "too expensive",
        "expensive"
      ],
      "issue_type": "language",
      "tags": [
        "chinglish",
        "negativity",
        "price"
      ],
      "problem_type": "价格谈判",
      "source_type": "国际贸易邮件"
    },
    {
      "id": "EM-010",
      "scenario": "email",
      "sub_scene": "价格施压",
      "original_expression": "Give us a 10% discount, or we will cancel the order.",
      "problem_analysis": "① 最后通牒式威胁（or we cancel）在商务沟通中极具破坏性；② 'Give us' 命令式索取；③ 未提供任何理由或交换条件（如订单量、长期合作），变成单纯压迫。",
      "risk_level": "high",
      "recommended_expression": "We value our cooperation and would like to move forward with this order. Given our projected order volume of [数量], could you kindly consider a 10% adjustment? We believe this would support a long-term partnership.",
      "culture_explanation": "谈判筹码应'交换'而非'威胁'：用订单量、长期合作等理由换取让步，给对方'为什么可以降价'的依据。威胁只会让对方面子尽失，触发对抗或终止合作。",
      "target_culture": "通用",
      "match_keywords": [
        "discount",
        "cancel the order",
        "give us"
      ],
      "issue_type": "etiquette",
      "tags": [
        "threat",
        "negotiation",
        "tone"
      ],
      "problem_type": "价格谈判",
      "source_type": "国际贸易邮件"
    }
  ],
  "provider": "mock",
  "mode": "rule",
  "culture": "japan",
  "culture_label": "日本",
  "business_scene": "negotiation",
  "business_scene_label": "商务谈判",
  "reasoning": {
    "keywords": [
      {
        "term": "too expensive",
        "category": "价格谈判"
      },
      {
        "term": "give us",
        "category": "表达风险"
      },
      {
        "term": "better price",
        "category": "价格谈判"
      },
      {
        "term": "price",
        "category": "价格谈判"
      },
      {
        "term": "expensive",
        "category": "价格谈判"
      },
      {
        "term": "quotation",
        "category": "价格谈判"
      }
    ],
    "intent": "双方就价格或条款进行协商，需兼顾立场与关系",
    "risk_areas": [
      "商务礼仪风险",
      "语言表达风险",
      "谈判策略风险"
    ],
    "culture_factor": "日本属典型高语境、面子敏感文化：直接否定价格或威胁更换供应商，易造成对方面子压力，对方可能含蓄回避而非正面回应，合作信任因此受损。",
    "final_risk": "中风险 · Medium Risk"
  }
},

  cases: [
  {
    "id": "EM-001",
    "scenario": "email",
    "sub_scene": "初次接触邮件",
    "original_expression": "Dear Sir, We are a company that sells various products. Please visit our website.",
    "problem_analysis": "① 'Dear Sir' 是泛指称呼：未确认收件人姓名与性别，若对方是女士将直接失礼；国际商务标准做法是先查询对方姓名，使用 Mr./Ms./Dr.+姓氏或中性敬称。② 自我推销无重点，缺少对对方的了解、合作价值与明确行动请求。",
    "risk_level": "medium_high",
    "recommended_expression": "Dear Mr. Suzuki,\n\nI came across your company through [渠道] and was impressed by your work in [领域]. We specialize in [产品/服务] and believe there may be opportunities for us to cooperate. Would you be open to a brief call this week?\n\nBest regards,\nZhang Wei",
    "culture_explanation": "称呼是国际商务的第一印象：日韩、欧美客户都对'用对头衔'非常敏感（Dr./Director 等），错误的泛称会立刻降低专业可信度。先了解对方、建立关系再谈业务，是跨文化沟通的通用第一步。",
    "target_culture": "通用 / 日韩",
    "match_keywords": [
      "dear sir",
      "we are a company"
    ],
    "issue_type": "etiquette",
    "tags": [
      "addressing",
      "first-contact"
    ],
    "problem_type": "合作维护",
    "source_type": "国际贸易邮件",
    "resolution": {
      "before_total": 86,
      "before_risk": "低风险 · Low Risk",
      "after_total": 90,
      "after_risk": "低风险 · Low Risk",
      "improvement": 4
    }
  },
  {
    "id": "EM-002",
    "scenario": "email",
    "sub_scene": "报价回复",
    "original_expression": "We have received your quotation, but your price is too expensive. Please give us a better price.",
    "problem_analysis": "① 搭配不地道：商务语境评价价格更常用 'above our budget' / 'beyond our expectation'，'expensive' 偏口语且语气过重。② 'too expensive' 是强烈否定，暗含'你报价不合理'的指责；③ 'give us a better price' 是直接索取式请求，缺少肯定、理由与感谢。",
    "risk_level": "medium_high",
    "recommended_expression": "Dear Mr. Sato,\n\nThank you for your quotation. We appreciate the detailed breakdown. However, the price is higher than our budget expectations. Would you be able to consider a more favorable rate, given our order volume?\n\nBest regards,\nZhang Wei",
    "culture_explanation": "用客观事实（预算、订单量）代替主观指责（太贵），把'你的报价不合理'变成'我们的预算有限'——给对方台阶，符合'对事不对人'的国际商务原则，在高语境文化（日本、中东）中尤其重要。",
    "target_culture": "日本 / 高语境",
    "match_keywords": [
      "too expensive",
      "expensive"
    ],
    "issue_type": "language",
    "tags": [
      "chinglish",
      "negativity",
      "price"
    ],
    "problem_type": "价格谈判",
    "source_type": "国际贸易邮件",
    "resolution": {
      "before_total": 78,
      "before_risk": "中风险 · Medium Risk",
      "after_total": 90,
      "after_risk": "低风险 · Low Risk",
      "improvement": 12
    }
  },
  {
    "id": "EM-003",
    "scenario": "email",
    "sub_scene": "催款邮件",
    "original_expression": "We have not received your payment. You must pay us immediately.",
    "problem_analysis": "① 以 'You must' 命令式开场，缺乏礼貌缓冲；② 未说明逾期背景、未给对方解释机会；③ 直接施压极易激发对抗情绪，损害长期合作关系。",
    "risk_level": "high",
    "recommended_expression": "Dear Mr. Chen,\n\nI hope this message finds you well. We noticed that payment for invoice INV-2025-01 (due [日期]) has not yet reached us. Could you kindly check on the status? If there is any issue, please let us know and we will work with you on a solution.\n\nBest regards,\nZhang Wei",
    "culture_explanation": "催款要点：先问候、给事实（发票号与到期日）、再请求，并给对方'台阶'（可能有原因）。直接命令在关系导向文化中会被视为'撕破脸'，而礼貌催收既能收回款项又保住客户。",
    "target_culture": "通用",
    "match_keywords": [
      "must pay",
      "pay us"
    ],
    "issue_type": "etiquette",
    "tags": [
      "tone",
      "payment",
      "urgent"
    ],
    "problem_type": "合作维护",
    "source_type": "国际贸易邮件",
    "resolution": {
      "before_total": 80,
      "before_risk": "中风险 · Medium Risk",
      "after_total": 90,
      "after_risk": "低风险 · Low Risk",
      "improvement": 10
    }
  },
  {
    "id": "EM-004",
    "scenario": "email",
    "sub_scene": "终止合作",
    "original_expression": "We don't need your products anymore.",
    "problem_analysis": "绝对化、直接化的否定：① 否定对方全部产品价值；② 不给出任何客观理由；③ 完全切断未来合作可能。在关系导向文化中属于高风险表达。",
    "risk_level": "high",
    "recommended_expression": "We truly appreciate our past cooperation with your team. As our current business needs have changed, we may not be able to place further orders at this time. We hope to keep in touch for future opportunities.",
    "culture_explanation": "三段式'肯定过去 → 客观理由 → 留有余地'：即便终止合作也不切断关系。东亚、中东、拉美等关系导向文化看重长期往来，直白拒绝等于关闭未来所有可能。",
    "target_culture": "东亚 / 中东 / 拉美",
    "match_keywords": [
      "don't need",
      "do not need",
      "anymore"
    ],
    "issue_type": "culture",
    "tags": [
      "face",
      "relationship",
      "rejection"
    ],
    "problem_type": "拒绝表达",
    "source_type": "国际贸易邮件",
    "resolution": {
      "before_total": 81,
      "before_risk": "中风险 · Medium Risk",
      "after_total": 90,
      "after_risk": "低风险 · Low Risk",
      "improvement": 9
    }
  },
  {
    "id": "EM-005",
    "scenario": "email",
    "sub_scene": "订单确认",
    "original_expression": "Please confirm the order as soon as possible.",
    "problem_analysis": "① 'as soon as possible'（ASAP）在商务沟通中含义模糊，不同文化理解不同（有人理解为'本周'，有人理解为'一个月内'）；② 未给出具体截止时间与理由，容易造成承诺错位。",
    "risk_level": "medium_low",
    "recommended_expression": "Could you please confirm the order by [具体日期]? This will allow us to schedule production and meet your delivery expectations.",
    "culture_explanation": "时间观念是跨文化沟通的高频冲突点：单时制文化（德国、北欧、美国）期待明确截止日期；多时制文化（南欧、中东、拉美）对时间更灵活。给出具体日期+理由，双方都清楚。",
    "target_culture": "通用",
    "match_keywords": [
      "as soon as possible",
      "confirm the order",
      "asap"
    ],
    "issue_type": "culture",
    "tags": [
      "time",
      "deadline",
      "clarity"
    ],
    "problem_type": "合作维护",
    "source_type": "国际贸易邮件",
    "resolution": {
      "before_total": 76,
      "before_risk": "中风险 · Medium Risk",
      "after_total": 80,
      "after_risk": "中风险 · Medium Risk",
      "improvement": 4
    }
  },
  {
    "id": "EM-006",
    "scenario": "email",
    "sub_scene": "投诉处理",
    "original_expression": "Your products are very bad quality. We are very disappointed.",
    "problem_analysis": "① 'very bad' 过度情绪化、主观化，不符合商务投诉的专业表达；② 只指责不给出具体证据（哪批货、什么问题、影响多大）；③ 缺少解决方案请求，沟通难以推进。",
    "risk_level": "high",
    "recommended_expression": "We have identified quality issues with batch [批号] received on [日期]. Specifically, [具体问题描述]. This has affected our operations. Could you please investigate and advise on how you plan to resolve this?",
    "culture_explanation": "专业投诉的公式：具体事实 → 影响说明 → 解决方案请求。'对事不对人'让供应商愿意配合；情绪化指责只会触发防御心理。给证据、给影响、给解决路径，是最有力量的投诉。",
    "target_culture": "通用",
    "match_keywords": [
      "very bad",
      "disappointed",
      "quality is bad"
    ],
    "issue_type": "language",
    "tags": [
      "complaint",
      "emotion",
      "evidence"
    ],
    "problem_type": "投诉处理",
    "source_type": "国际贸易邮件",
    "resolution": {
      "before_total": 81,
      "before_risk": "中风险 · Medium Risk",
      "after_total": 90,
      "after_risk": "低风险 · Low Risk",
      "improvement": 9
    }
  },
  {
    "id": "EM-007",
    "scenario": "email",
    "sub_scene": "道歉邮件",
    "original_expression": "Sorry for the delay. We will send it later.",
    "problem_analysis": "① 道歉过于简短，缺乏诚意结构（承认影响+原因+补救）；② 'later' 是模糊时间承诺，对方无法安排后续计划，信任度受损。",
    "risk_level": "medium_low",
    "recommended_expression": "We sincerely apologize for the delay in sending the [文件/货物]. This was due to [简要原因]. We have arranged shipment for [具体日期], and you will receive tracking details by [日期]. We appreciate your patience.",
    "culture_explanation": "国际商务道歉的黄金结构：诚恳道歉 → 简要原因 → 具体补救时间 → 感谢耐心。模糊承诺（later/soon）在不同文化中都意味着'不可靠'，具体日期才能重建信任。",
    "target_culture": "通用",
    "match_keywords": [
      "sorry for the delay",
      "send it later",
      "we will send"
    ],
    "issue_type": "etiquette",
    "tags": [
      "apology",
      "commitment"
    ],
    "problem_type": "投诉处理",
    "source_type": "国际贸易邮件",
    "resolution": {
      "before_total": 86,
      "before_risk": "低风险 · Low Risk",
      "after_total": 90,
      "after_risk": "低风险 · Low Risk",
      "improvement": 4
    }
  },
  {
    "id": "EM-008",
    "scenario": "email",
    "sub_scene": "会议邀请",
    "original_expression": "We want to arrange a meeting with you next week.",
    "problem_analysis": "① 'We want' 以自我为中心，未考虑对方日程；② 未提供备选时间与议程，增加对方决策成本；③ 缺少礼貌请求结构。",
    "risk_level": "medium_low",
    "recommended_expression": "We would like to invite you to a meeting to discuss [议题]. Would [时间1] or [时间2] work for you? We can also accommodate your preferred time. The agenda is attached for your reference.",
    "culture_explanation": "邀请=降低对方成本：给备选时间、给议程、给调整余地。在等级观念强的文化（日韩）中，还应注意邀请对象与职位对等。",
    "target_culture": "通用",
    "match_keywords": [
      "arrange a meeting",
      "want to arrange"
    ],
    "issue_type": "etiquette",
    "tags": [
      "meeting",
      "request"
    ],
    "problem_type": "合作维护",
    "source_type": "国际贸易邮件",
    "resolution": {
      "before_total": 86,
      "before_risk": "低风险 · Low Risk",
      "after_total": 90,
      "after_risk": "低风险 · Low Risk",
      "improvement": 4
    }
  },
  {
    "id": "EM-009",
    "scenario": "email",
    "sub_scene": "跟进邮件",
    "original_expression": "Any update? Please reply to my email.",
    "problem_analysis": "① 跟进缺乏上下文引用（对方可能收到多封邮件）；② 催促语气生硬；③ 未给对方明确的行动请求（回复什么、截止何时）。",
    "risk_level": "medium",
    "recommended_expression": "I wanted to follow up on my email from [日期] regarding [主题]. Could you let us know your thoughts when you have a moment? We are aiming to finalize this by [日期] if possible.",
    "culture_explanation": "跟进的艺术：引用原邮件上下文、理解对方忙碌、给出理由与时限。在低语境文化（欧美）中直接跟进是高效的；在高语境文化中，跟进还应留出'面子'缓冲。",
    "target_culture": "通用",
    "match_keywords": [
      "any update",
      "reply to my email"
    ],
    "issue_type": "etiquette",
    "tags": [
      "follow-up",
      "urgent"
    ],
    "problem_type": "合作维护",
    "source_type": "国际贸易邮件",
    "resolution": {
      "before_total": 86,
      "before_risk": "低风险 · Low Risk",
      "after_total": 90,
      "after_risk": "低风险 · Low Risk",
      "improvement": 4
    }
  },
  {
    "id": "EM-010",
    "scenario": "email",
    "sub_scene": "价格施压",
    "original_expression": "Give us a 10% discount, or we will cancel the order.",
    "problem_analysis": "① 最后通牒式威胁（or we cancel）在商务沟通中极具破坏性；② 'Give us' 命令式索取；③ 未提供任何理由或交换条件（如订单量、长期合作），变成单纯压迫。",
    "risk_level": "high",
    "recommended_expression": "We value our cooperation and would like to move forward with this order. Given our projected order volume of [数量], could you kindly consider a 10% adjustment? We believe this would support a long-term partnership.",
    "culture_explanation": "谈判筹码应'交换'而非'威胁'：用订单量、长期合作等理由换取让步，给对方'为什么可以降价'的依据。威胁只会让对方面子尽失，触发对抗或终止合作。",
    "target_culture": "通用",
    "match_keywords": [
      "discount",
      "cancel the order",
      "give us"
    ],
    "issue_type": "etiquette",
    "tags": [
      "threat",
      "negotiation",
      "tone"
    ],
    "problem_type": "价格谈判",
    "source_type": "国际贸易邮件",
    "resolution": {
      "before_total": 84,
      "before_risk": "中风险 · Medium Risk",
      "after_total": 90,
      "after_risk": "低风险 · Low Risk",
      "improvement": 6
    }
  },
  {
    "id": "NG-001",
    "scenario": "negotiation",
    "sub_scene": "报价谈判",
    "original_expression": "Your price is unacceptable. We will find another supplier.",
    "problem_analysis": "① 'unacceptable' 直接否定对方全部报价，语气激烈；② 'find another supplier' 是威胁式施压，等于关闭谈判桌；③ 未给出期望价格与理由，谈判无法继续。",
    "risk_level": "high",
    "recommended_expression": "We value our cooperation. However, the current price exceeds our budget. Could you kindly explain how the price is structured? We would like to explore a solution that works for both sides.",
    "culture_explanation": "谈判的核心是'共同解决问题'而非'击败对方'。开放式提问（如何构成价格）把对抗转为合作，符合双赢原则；直接威胁在大多数文化中都会破坏信任基础。",
    "target_culture": "通用",
    "match_keywords": [
      "unacceptable",
      "another supplier"
    ],
    "issue_type": "culture",
    "tags": [
      "negotiation",
      "threat",
      "face"
    ],
    "problem_type": "价格谈判",
    "source_type": "企业商务案例",
    "resolution": {
      "before_total": 81,
      "before_risk": "中风险 · Medium Risk",
      "after_total": 90,
      "after_risk": "低风险 · Low Risk",
      "improvement": 9
    }
  },
  {
    "id": "NG-002",
    "scenario": "negotiation",
    "sub_scene": "签约谈判",
    "original_expression": "We must sign the contract today, no exceptions.",
    "problem_analysis": "① 时间压迫式最后通牒（must...no exceptions）不尊重对方决策流程；② 未说明紧迫原因；③ 在需要内部合议的文化（日本、中东）中可能直接导致谈判失败。",
    "risk_level": "medium_high",
    "recommended_expression": "To move forward efficiently, could we aim to finalize the contract by this Friday? Please let us know if you need more time to review—we are happy to accommodate.",
    "culture_explanation": "决策节奏是文化差异的典型表现：日本企业重视内部合议（nemawashi），阿拉伯文化重视关系与信任建立，'必须今天签'会被视为不尊重。给目标日期+给延期权利，是最佳平衡。",
    "target_culture": "日本 / 中东",
    "match_keywords": [
      "must sign",
      "no exceptions",
      "sign the contract today"
    ],
    "issue_type": "culture",
    "tags": [
      "time",
      "decision-making",
      "pressure"
    ],
    "problem_type": "价格谈判",
    "source_type": "企业商务案例",
    "resolution": {
      "before_total": 80,
      "before_risk": "中风险 · Medium Risk",
      "after_total": 90,
      "after_risk": "低风险 · Low Risk",
      "improvement": 10
    }
  },
  {
    "id": "NG-003",
    "scenario": "negotiation",
    "sub_scene": "条款谈判",
    "original_expression": "Our terms are final. Take it or leave it.",
    "problem_analysis": "① 'Take it or leave it' 是典型的对抗式最后通牒，极度损害关系；② 不给对方任何协商空间，等于否定谈判的意义；③ 极易触发'面子'防御。",
    "risk_level": "high",
    "recommended_expression": "We believe our current terms are competitive based on [市场依据]. That said, we are open to discussing specific areas where you see concerns. Where would you like to focus?",
    "culture_explanation": "即使立场坚定，也要给对方'协商过程'的尊重。'我们愿意讨论具体关切'保持了底线，又保留了对方的尊严与参与感，是坚定而不失礼的表达。",
    "target_culture": "通用",
    "match_keywords": [
      "take it or leave it",
      "terms are final"
    ],
    "issue_type": "culture",
    "tags": [
      "ultimatum",
      "face"
    ],
    "problem_type": "价格谈判",
    "source_type": "企业商务案例",
    "resolution": {
      "before_total": 81,
      "before_risk": "中风险 · Medium Risk",
      "after_total": 90,
      "after_risk": "低风险 · Low Risk",
      "improvement": 9
    }
  },
  {
    "id": "NG-004",
    "scenario": "negotiation",
    "sub_scene": "市场分歧",
    "original_expression": "You don't understand our market at all.",
    "problem_analysis": "① 全盘否定对方专业能力，属人身攻击式表述；② 在等级与面子文化中极度冒犯；③ 未给出任何建设性信息。",
    "risk_level": "high",
    "recommended_expression": "Our market has some unique characteristics, such as [具体差异]. We'd be happy to share more insights so we can align our approach together.",
    "culture_explanation": "'对事不对人'的沟通原则：指出差异（具体事实）而非否定能力（人身评价）。邀请对方共同了解，把指责转化为知识共享，维护关系同时推进理解。",
    "target_culture": "通用",
    "match_keywords": [
      "don't understand",
      "understand our market"
    ],
    "issue_type": "culture",
    "tags": [
      "face",
      "personal-attack"
    ],
    "problem_type": "合作维护",
    "source_type": "企业商务案例",
    "resolution": {
      "before_total": 75,
      "before_risk": "中风险 · Medium Risk",
      "after_total": 90,
      "after_risk": "低风险 · Low Risk",
      "improvement": 15
    }
  },
  {
    "id": "NG-005",
    "scenario": "negotiation",
    "sub_scene": "价格折中",
    "original_expression": "Let's split the difference 50/50. That's fair.",
    "problem_analysis": "① 单方面认定'对半分=公平'，忽略了价格基准与各自让利的实际意义；② 在部分文化（如中东）中，直接对半折中可能被视为不认真的讨价还价；③ 'That's fair' 替对方做判断，略显强势。",
    "risk_level": "medium",
    "recommended_expression": "We could consider meeting in the middle. Would a price of [金额] work for both sides? If so, we can prepare the agreement right away.",
    "culture_explanation": "折中提议应作为'选项'而非'结论'：用问句把决定权留给对方，同时给出具体数字让对方评估。尊重对方讨价还价的过程本身，就是尊重其文化习惯。",
    "target_culture": "中东 / 通用",
    "match_keywords": [
      "split the difference",
      "that's fair",
      "50/50"
    ],
    "issue_type": "culture",
    "tags": [
      "fairness",
      "bargaining"
    ],
    "problem_type": "价格谈判",
    "source_type": "企业商务案例",
    "resolution": {
      "before_total": 84,
      "before_risk": "中风险 · Medium Risk",
      "after_total": 90,
      "after_risk": "低风险 · Low Risk",
      "improvement": 6
    }
  },
  {
    "id": "NG-006",
    "scenario": "negotiation",
    "sub_scene": "交期谈判",
    "original_expression": "We can't accept your delivery schedule. Change it.",
    "problem_analysis": "① 直接命令（Change it）语气生硬；② 只拒绝不解释原因；③ 未提出替代方案或协商空间。",
    "risk_level": "medium_high",
    "recommended_expression": "Unfortunately, the proposed delivery schedule does not align with our project timeline, which requires [原因/节点]. Could we explore an alternative schedule, such as [备选方案]?",
    "culture_explanation": "拒绝的礼貌公式：遗憾 → 原因 → 替代方案。'提供备选'把单纯的拒绝变成建设性协商，让对方有路可走，谈判才能继续。",
    "target_culture": "通用",
    "match_keywords": [
      "can't accept",
      "delivery schedule",
      "change it"
    ],
    "issue_type": "etiquette",
    "tags": [
      "rejection",
      "schedule"
    ],
    "problem_type": "拒绝表达",
    "source_type": "企业商务案例",
    "resolution": {
      "before_total": 86,
      "before_risk": "低风险 · Low Risk",
      "after_total": 86,
      "after_risk": "低风险 · Low Risk",
      "improvement": 0
    }
  },
  {
    "id": "NG-007",
    "scenario": "negotiation",
    "sub_scene": "破裂收尾",
    "original_expression": "If you don't agree, the deal is off.",
    "problem_analysis": "① 以'交易取消'作为威胁手段，属于谈判自杀式表达；② 彻底关闭协商通道；③ 即使最终达成协议，关系裂痕也已产生。",
    "risk_level": "high",
    "recommended_expression": "We are eager to reach an agreement. Could we identify the key gap between us and see if there is a way to bridge it?",
    "culture_explanation": "破裂边缘的正确做法是'回到共同目标'：我们都想达成协议，那么差距在哪、如何弥合。把威胁语言转化为问题解决语言，是成熟谈判者的标志。",
    "target_culture": "通用",
    "match_keywords": [
      "deal is off",
      "don't agree",
      "if you don't"
    ],
    "issue_type": "culture",
    "tags": [
      "threat",
      "ultimatum"
    ],
    "problem_type": "拒绝表达",
    "source_type": "企业商务案例",
    "resolution": {
      "before_total": 81,
      "before_risk": "中风险 · Medium Risk",
      "after_total": 90,
      "after_risk": "低风险 · Low Risk",
      "improvement": 9
    }
  },
  {
    "id": "NG-008",
    "scenario": "negotiation",
    "sub_scene": "还价回应",
    "original_expression": "Your counteroffer is ridiculous.",
    "problem_analysis": "① 'ridiculous' 是羞辱性评价，直接攻击对方专业判断；② 在任何文化中都属高危表达；③ 情绪化反应关闭了理性协商的可能。",
    "risk_level": "high",
    "recommended_expression": "We appreciate your proposal, though it is significantly below our cost structure. We would like to understand your expectations better—what range would work for you?",
    "culture_explanation": "对不合理还价：先感谢（尊重其提出权），再给出客观限制（成本结构），再反向提问了解对方基准。把'你荒谬'变成'我们想了解你'，既守住底线又保住关系。",
    "target_culture": "通用",
    "match_keywords": [
      "ridiculous",
      "counteroffer"
    ],
    "issue_type": "etiquette",
    "tags": [
      "insult",
      "emotion"
    ],
    "problem_type": "价格谈判",
    "source_type": "企业商务案例",
    "resolution": {
      "before_total": 84,
      "before_risk": "中风险 · Medium Risk",
      "after_total": 90,
      "after_risk": "低风险 · Low Risk",
      "improvement": 6
    }
  },
  {
    "id": "MT-001",
    "scenario": "meeting",
    "sub_scene": "会议反驳",
    "original_expression": "You are wrong. My plan is better.",
    "problem_analysis": "① 当众否定他人方案（You are wrong）严重伤及'面子'，尤其对亚洲与会者；② 'My plan' 强调个人而非团队；③ 未给出任何论据。",
    "risk_level": "high",
    "recommended_expression": "I see the merits of your approach. Let me share an alternative angle that could complement it, and we can compare the two together.",
    "culture_explanation": "会议发言的'先肯定后补充'原则：指出方案价值，再提替代视角，把个人对立转化为集体讨论。在面子文化中，'给对方台阶'是专业素养的体现。",
    "target_culture": "东亚 / 通用",
    "match_keywords": [
      "you are wrong",
      "my plan is better"
    ],
    "issue_type": "culture",
    "tags": [
      "face",
      "meeting",
      "confrontation"
    ],
    "problem_type": "拒绝表达",
    "source_type": "商务英语教学案例",
    "resolution": {
      "before_total": 81,
      "before_risk": "中风险 · Medium Risk",
      "after_total": 90,
      "after_risk": "低风险 · Low Risk",
      "improvement": 9
    }
  },
  {
    "id": "MT-002",
    "scenario": "meeting",
    "sub_scene": "会议插话",
    "original_expression": "Wait, let me talk first.",
    "problem_analysis": "① 粗暴打断发言人，违反会议发言秩序；② 在重视轮次与礼仪的文化（北欧、日韩）中会被视为不专业；③ 未尊重当前发言者的话语权。",
    "risk_level": "medium_low",
    "recommended_expression": "May I add a brief point on this? I'll keep it short so we can return to your topic.",
    "culture_explanation": "插话的正确姿势：请求许可 + 承诺简短 + 归还话题权。既表达观点又不破坏发言秩序，展现对他人话语权的尊重。",
    "target_culture": "北欧 / 日韩",
    "match_keywords": [
      "let me talk",
      "wait, let me"
    ],
    "issue_type": "etiquette",
    "tags": [
      "interruption",
      "meeting"
    ],
    "problem_type": "合作维护",
    "source_type": "商务英语教学案例",
    "resolution": {
      "before_total": 86,
      "before_risk": "低风险 · Low Risk",
      "after_total": 90,
      "after_risk": "低风险 · Low Risk",
      "improvement": 4
    }
  },
  {
    "id": "MT-003",
    "scenario": "meeting",
    "sub_scene": "方案评估",
    "original_expression": "That idea will never work in our company.",
    "problem_analysis": "① 'never' 绝对化否定，不留讨论空间；② 打击提案者的积极性；③ 未给出技术/资源层面的具体理由。",
    "risk_level": "medium_high",
    "recommended_expression": "This idea has potential. One challenge we may face is [具体障碍]. How might we address that in our context?",
    "culture_explanation": "建设性质疑的公式：肯定潜力 → 提出具体障碍 → 邀请共同解决。把'不可能'变成'如何可能'，激发团队智慧而非关闭讨论。",
    "target_culture": "通用",
    "match_keywords": [
      "never work",
      "idea will never"
    ],
    "issue_type": "culture",
    "tags": [
      "negativity",
      "idea-killing"
    ],
    "problem_type": "拒绝表达",
    "source_type": "商务英语教学案例",
    "resolution": {
      "before_total": 78,
      "before_risk": "中风险 · Medium Risk",
      "after_total": 90,
      "after_risk": "低风险 · Low Risk",
      "improvement": 12
    }
  },
  {
    "id": "MT-004",
    "scenario": "meeting",
    "sub_scene": "方案表态",
    "original_expression": "I'm not interested in your proposal.",
    "problem_analysis": "① 当众直接表态'没兴趣'，让对方下不来台；② 未说明原因或替代方向；③ 关系导向文化中属高风险冒犯。",
    "risk_level": "high",
    "recommended_expression": "Thank you for sharing your proposal. At this stage, our priorities are focused on [方向]. Could we revisit this idea after [节点/条件]?",
    "culture_explanation": "委婉拒绝的公式：感谢 → 客观原因 → 未来窗口。'暂不关注但保留窗口'既表达立场，又保全提案者的面子和未来合作可能。",
    "target_culture": "通用",
    "match_keywords": [
      "not interested"
    ],
    "issue_type": "culture",
    "tags": [
      "rejection",
      "face"
    ],
    "problem_type": "拒绝表达",
    "source_type": "商务英语教学案例",
    "resolution": {
      "before_total": 81,
      "before_risk": "中风险 · Medium Risk",
      "after_total": 90,
      "after_risk": "低风险 · Low Risk",
      "improvement": 9
    }
  },
  {
    "id": "MT-005",
    "scenario": "meeting",
    "sub_scene": "会议收尾",
    "original_expression": "Let's wrap up. We don't have all day.",
    "problem_analysis": "① 催促收尾显得不耐烦，贬低他人发言价值；② 'don't have all day' 带有轻蔑；③ 破坏会议氛围与参会者积极性。",
    "risk_level": "medium",
    "recommended_expression": "We have covered the key points well. To respect everyone's time, shall we summarize the action items and close? We can continue any remaining discussion offline.",
    "culture_explanation": "时间管理的礼貌表达：先肯定会议成果，再以'尊重大家时间'为由收尾，并给出后续安排。把'我赶时间'变成'为大家着想'。",
    "target_culture": "通用",
    "match_keywords": [
      "wrap up",
      "don't have all day",
      "all day"
    ],
    "issue_type": "etiquette",
    "tags": [
      "time",
      "meeting"
    ],
    "problem_type": "合作维护",
    "source_type": "商务英语教学案例",
    "resolution": {
      "before_total": 86,
      "before_risk": "低风险 · Low Risk",
      "after_total": 90,
      "after_risk": "低风险 · Low Risk",
      "improvement": 4
    }
  },
  {
    "id": "CU-001",
    "scenario": "customer",
    "sub_scene": "延误通知",
    "original_expression": "The delay is not our fault. Our supplier made the mistake.",
    "problem_analysis": "① 责任推诿：客户要的是解决方案而非归责游戏；② 让客户感到不被重视；③ 未给出补救时间与行动计划。",
    "risk_level": "medium_high",
    "recommended_expression": "We sincerely apologize for the delay. We are working closely with our supply chain to resolve it, and we will provide a confirmed schedule within 48 hours.",
    "culture_explanation": "客户沟通黄金公式：道歉 + 行动承诺 + 明确时间点。客户永远优先于'谁的责任'；主动担责（哪怕不完全是自己的错）能最大化挽回信任。",
    "target_culture": "通用",
    "match_keywords": [
      "not our fault",
      "our supplier made"
    ],
    "issue_type": "culture",
    "tags": [
      "blame",
      "customer-service"
    ],
    "problem_type": "投诉处理",
    "source_type": "企业商务案例",
    "resolution": {
      "before_total": 84,
      "before_risk": "中风险 · Medium Risk",
      "after_total": 90,
      "after_risk": "低风险 · Low Risk",
      "improvement": 6
    }
  },
  {
    "id": "CU-002",
    "scenario": "customer",
    "sub_scene": "资料索取",
    "original_expression": "Send us the documents ASAP.",
    "problem_analysis": "① ASAP 含义模糊，无法形成明确承诺；② 缺少礼貌请求结构；③ 未说明用途与优先级，对方难以合理安排。",
    "risk_level": "medium_low",
    "recommended_expression": "Could you please send us the documents by [具体日期]? We need them to proceed with [用途]。Thank you for your help.",
    "culture_explanation": "给具体日期+说明用途，让对方理解'为什么急'，配合意愿会显著提升。模糊的 ASAP 在不同文化中的理解差异巨大。",
    "target_culture": "通用",
    "match_keywords": [
      "asap",
      "send us the documents",
      "documents asap"
    ],
    "issue_type": "etiquette",
    "tags": [
      "time",
      "clarity"
    ],
    "problem_type": "合作维护",
    "source_type": "企业商务案例",
    "resolution": {
      "before_total": 72,
      "before_risk": "中风险 · Medium Risk",
      "after_total": 86,
      "after_risk": "低风险 · Low Risk",
      "improvement": 14
    }
  },
  {
    "id": "CU-003",
    "scenario": "customer",
    "sub_scene": "问题处理",
    "original_expression": "We can't help you with this problem.",
    "problem_analysis": "① 直接告知'无能为力'，切断客户希望；② 未解释原因或提供替代渠道；③ 客户服务中属高风险表达。",
    "risk_level": "medium_high",
    "recommended_expression": "This particular issue is outside our current scope. However, I can connect you with [替代渠道/同事] who may be able to assist, or we can explore [替代方案] together.",
    "culture_explanation": "服务拒绝公式：遗憾 + 替代方案。'不能帮'永远要跟'谁能帮/怎么帮'配对，客户要的是解决路径，不是拒绝本身。",
    "target_culture": "通用",
    "match_keywords": [
      "can't help",
      "can not help",
      "we can't help"
    ],
    "issue_type": "etiquette",
    "tags": [
      "service",
      "rejection"
    ],
    "problem_type": "投诉处理",
    "source_type": "企业商务案例",
    "resolution": {
      "before_total": 86,
      "before_risk": "低风险 · Low Risk",
      "after_total": 90,
      "after_risk": "低风险 · Low Risk",
      "improvement": 4
    }
  },
  {
    "id": "CU-004",
    "scenario": "customer",
    "sub_scene": "客户投诉",
    "original_expression": "You should have told us earlier.",
    "problem_analysis": "① 指责客户（should have），把责任推给客户；② 客户沟通中指责客户是大忌；③ 未关注问题本身如何解决。",
    "risk_level": "medium_high",
    "recommended_expression": "Thank you for letting us know about this. We understand the situation better now. Going forward, how can we improve the communication process to prevent this?",
    "culture_explanation": "客户永远'告诉得不够早'是服务方的反思而非客户的过错。感谢告知 + 聚焦改进，把可能的对抗转化为合作优化。",
    "target_culture": "通用",
    "match_keywords": [
      "should have told",
      "told us earlier"
    ],
    "issue_type": "culture",
    "tags": [
      "blame",
      "customer-service"
    ],
    "problem_type": "投诉处理",
    "source_type": "企业商务案例",
    "resolution": {
      "before_total": 84,
      "before_risk": "中风险 · Medium Risk",
      "after_total": 90,
      "after_risk": "低风险 · Low Risk",
      "improvement": 6
    }
  },
  {
    "id": "CU-005",
    "scenario": "customer",
    "sub_scene": "订单收尾",
    "original_expression": "Thanks for your order. Goodbye.",
    "problem_analysis": "① 收尾过于草率，缺少关系维护意识；② 'Goodbye' 终结感过强，无后续合作铺垫；③ 白白浪费了一次建立忠诚度的机会。",
    "risk_level": "medium_low",
    "recommended_expression": "Thank you for your order! We truly appreciate your business. We will keep you updated on the delivery progress, and we look forward to serving you again in the future.",
    "culture_explanation": "关系维护是国际商务的长期投资：感谢 + 主动更新 + 未来期待，把一次性交易转化为可持续合作。尤其在关系导向文化中，'收尾决定下一次开始'。",
    "target_culture": "通用",
    "match_keywords": [
      "goodbye",
      "thanks for your order"
    ],
    "issue_type": "culture",
    "tags": [
      "relationship",
      "closing"
    ],
    "problem_type": "合作维护",
    "source_type": "企业商务案例",
    "resolution": {
      "before_total": 84,
      "before_risk": "中风险 · Medium Risk",
      "after_total": 90,
      "after_risk": "低风险 · Low Risk",
      "improvement": 6
    }
  },
  {
    "id": "DC-001",
    "scenario": "daily",
    "sub_scene": "隐私话题",
    "original_expression": "How much do you earn per month?",
    "problem_analysis": "薪资、年龄、婚恋状态等在多数西方文化中属隐私话题，直接询问非常失礼，会让对方尴尬并质疑你的社交边界感。",
    "risk_level": "medium_low",
    "recommended_expression": "How is your business going these days?",
    "culture_explanation": "跨文化交际中的'安全话题'（天气、行业动态、旅行、兴趣爱好）是破冰首选；薪资与年龄话题在英语文化圈（尤其英美）属于明确禁区，在东亚部分场合虽可谈但需谨慎。",
    "target_culture": "英美 / 西方",
    "match_keywords": [
      "how much do you earn",
      "salary",
      "earn per month"
    ],
    "issue_type": "culture",
    "tags": [
      "privacy",
      "taboo-topic"
    ],
    "problem_type": "合作维护",
    "source_type": "商务英语教学案例",
    "resolution": {
      "before_total": 84,
      "before_risk": "中风险 · Medium Risk",
      "after_total": 90,
      "after_risk": "低风险 · Low Risk",
      "improvement": 6
    }
  },
  {
    "id": "DC-002",
    "scenario": "daily",
    "sub_scene": "个人隐私",
    "original_expression": "You're so old, why aren't you married?",
    "problem_analysis": "① 评价对方年龄（so old）属人身评价，冒犯性极强；② 婚恋状况是高度私密话题；③ 在个人主义文化中'催婚'逻辑完全不适用且冒犯。",
    "risk_level": "high",
    "recommended_expression": "How have you been? I hope work is going well for you these days.",
    "culture_explanation": "西方个人主义文化强调个人边界：年龄、婚恋、收入都是禁区。即使在中国文化中'关心'的话题，在跨文化语境中应一律回避，转向工作与公共话题。",
    "target_culture": "西方 / 个人主义文化",
    "match_keywords": [
      "why aren't you married",
      "so old",
      "not married"
    ],
    "issue_type": "culture",
    "tags": [
      "privacy",
      "taboo-topic",
      "personal"
    ],
    "problem_type": "合作维护",
    "source_type": "商务英语教学案例",
    "resolution": {
      "before_total": 81,
      "before_risk": "中风险 · Medium Risk",
      "after_total": 90,
      "after_risk": "低风险 · Low Risk",
      "improvement": 9
    }
  }
],

  /* ---- 沟通诊断画像（离线兜底） ---- */
  diagnosis: {
  "sample_count": 5,
  "total": 82,
  "risk_level": "medium_low",
  "risk_label": "中风险 · Medium Risk",
  "summary": "基于 5 次典型沟通文本的 AI 分析：综合风险评分 82 分（中风险）。优势维度：语言准确性、表达清晰；需重点改进：商务礼貌、文化适配、合作友好。",
  "scores": {
    "language_accuracy": 8.4,
    "business_politeness": 7.6,
    "cultural_adaptability": 7.8,
    "communication_clarity": 9.0,
    "relationship_friendliness": 7.8
  },
  "dimension_reasons": {
    "language_accuracy": "多次分析均值 8.4/10",
    "business_politeness": "多次分析均值 7.6/10",
    "cultural_adaptability": "多次分析均值 7.8/10",
    "communication_clarity": "多次分析均值 9.0/10",
    "relationship_friendliness": "多次分析均值 7.8/10"
  },
  "strengths": [
    {
      "dim": "语言准确性",
      "score": 8.4,
      "note": "语言基础扎实，表达准确地道，专业可信度高。"
    },
    {
      "dim": "表达清晰",
      "score": 9.0,
      "note": "要点明确、结构清晰，信息传达高效。"
    }
  ],
  "improvements": [
    {
      "dim": "商务礼貌",
      "score": 7.6,
      "advice": "避免命令式表达（You must / Give us），多用 Could you please / We would appreciate it if 等请求句式。"
    },
    {
      "dim": "文化适配",
      "score": 7.8,
      "advice": "对高语境文化（日韩、中东）客户，避免直接否定；先肯定再委婉表达，注意面子维护。"
    },
    {
      "dim": "合作友好",
      "score": 7.8,
      "advice": "增加感谢、跟进与未来合作意向的表达，把事务性沟通升级为关系经营。"
    }
  ],
  "mode": "rule"
},

  /* ---- 优化前后对比（离线兜底） ---- */
  comparisons: {
  "total": 8,
  "pairs": [
    {
      "id": "CMP-001",
      "scene": "email",
      "scene_label": "商务邮件",
      "title": "催款邮件",
      "risk_focus": "命令式语气与直接施压",
      "original": "We have not received your payment. You must pay us immediately.",
      "optimized": "Dear Mr. Chen,\n\nWe noticed that payment for invoice INV-2025-01 (due last Friday) has not yet reached us. Could you kindly check on the status? If there is any issue, we will be happy to work with you on a solution.",
      "before": {
        "total": 80,
        "risk_level": "medium_low",
        "risk_label": "中风险 · Medium Risk",
        "scores": {
          "language_accuracy": 9,
          "business_politeness": 4,
          "cultural_adaptability": 9,
          "communication_clarity": 9,
          "relationship_friendliness": 9
        },
        "issues": [
          {
            "type": "etiquette",
            "quote": "We have not received your payment. You must pay us immediately.",
            "severity": "high"
          },
          {
            "type": "etiquette",
            "quote": "You must pay us immediately.",
            "severity": "medium"
          }
        ]
      },
      "after": {
        "total": 90,
        "risk_level": "low",
        "risk_label": "低风险 · Low Risk",
        "scores": {
          "language_accuracy": 9,
          "business_politeness": 9,
          "cultural_adaptability": 9,
          "communication_clarity": 9,
          "relationship_friendliness": 9
        },
        "issues": []
      },
      "reduction": 10
    },
    {
      "id": "CMP-002",
      "scene": "negotiation",
      "scene_label": "商务谈判",
      "title": "报价谈判",
      "risk_focus": "威胁式施压与关闭谈判",
      "original": "Your price is unacceptable. We will find another supplier.",
      "optimized": "We value our cooperation. However, the current price exceeds our budget. Could you kindly share how the price is structured? We would like to explore a solution that works for both sides.",
      "before": {
        "total": 81,
        "risk_level": "medium_low",
        "risk_label": "中风险 · Medium Risk",
        "scores": {
          "language_accuracy": 9,
          "business_politeness": 9,
          "cultural_adaptability": 6,
          "communication_clarity": 9,
          "relationship_friendliness": 6
        },
        "issues": [
          {
            "type": "culture",
            "quote": "Your price is unacceptable. We will find another supplier.",
            "severity": "high"
          }
        ]
      },
      "after": {
        "total": 90,
        "risk_level": "low",
        "risk_label": "低风险 · Low Risk",
        "scores": {
          "language_accuracy": 9,
          "business_politeness": 9,
          "cultural_adaptability": 9,
          "communication_clarity": 9,
          "relationship_friendliness": 9
        },
        "issues": []
      },
      "reduction": 9
    },
    {
      "id": "CMP-003",
      "scene": "meeting",
      "scene_label": "国际会议",
      "title": "会议反驳",
      "risk_focus": "当众否定伤面子",
      "original": "You are wrong. My plan is better.",
      "optimized": "I see the merits of your approach. Let me share an alternative angle that could complement it, and we can compare the two together.",
      "before": {
        "total": 81,
        "risk_level": "medium_low",
        "risk_label": "中风险 · Medium Risk",
        "scores": {
          "language_accuracy": 9,
          "business_politeness": 9,
          "cultural_adaptability": 6,
          "communication_clarity": 9,
          "relationship_friendliness": 6
        },
        "issues": [
          {
            "type": "culture",
            "quote": "You are wrong. My plan is better.",
            "severity": "high"
          }
        ]
      },
      "after": {
        "total": 90,
        "risk_level": "low",
        "risk_label": "低风险 · Low Risk",
        "scores": {
          "language_accuracy": 9,
          "business_politeness": 9,
          "cultural_adaptability": 9,
          "communication_clarity": 9,
          "relationship_friendliness": 9
        },
        "issues": []
      },
      "reduction": 9
    },
    {
      "id": "CMP-004",
      "scene": "customer",
      "scene_label": "客户沟通",
      "title": "延误责任",
      "risk_focus": "责任推诿",
      "original": "The delay is not our fault. Our supplier made the mistake.",
      "optimized": "We sincerely apologize for the delay. We are working closely with our supply chain to resolve it, and we will provide a confirmed schedule within 48 hours.",
      "before": {
        "total": 84,
        "risk_level": "medium_low",
        "risk_label": "中风险 · Medium Risk",
        "scores": {
          "language_accuracy": 9,
          "business_politeness": 9,
          "cultural_adaptability": 7,
          "communication_clarity": 9,
          "relationship_friendliness": 7
        },
        "issues": [
          {
            "type": "culture",
            "quote": "The delay is not our fault. Our supplier made the mistake.",
            "severity": "medium"
          }
        ]
      },
      "after": {
        "total": 90,
        "risk_level": "low",
        "risk_label": "低风险 · Low Risk",
        "scores": {
          "language_accuracy": 9,
          "business_politeness": 9,
          "cultural_adaptability": 9,
          "communication_clarity": 9,
          "relationship_friendliness": 9
        },
        "issues": []
      },
      "reduction": 6
    },
    {
      "id": "CMP-005",
      "scene": "email",
      "scene_label": "商务邮件",
      "title": "跟进质问",
      "risk_focus": "质问式跟进",
      "original": "Why haven't you replied to our emails?",
      "optimized": "I wanted to follow up on my previous messages regarding the quotation. When you have a moment, could you let us know your thoughts?",
      "before": {
        "total": 84,
        "risk_level": "medium_low",
        "risk_label": "中风险 · Medium Risk",
        "scores": {
          "language_accuracy": 9,
          "business_politeness": 6,
          "cultural_adaptability": 9,
          "communication_clarity": 9,
          "relationship_friendliness": 9
        },
        "issues": [
          {
            "type": "etiquette",
            "quote": "Why haven't you replied to our emails?",
            "severity": "high"
          }
        ]
      },
      "after": {
        "total": 90,
        "risk_level": "low",
        "risk_label": "低风险 · Low Risk",
        "scores": {
          "language_accuracy": 9,
          "business_politeness": 9,
          "cultural_adaptability": 9,
          "communication_clarity": 9,
          "relationship_friendliness": 9
        },
        "issues": []
      },
      "reduction": 6
    },
    {
      "id": "CMP-006",
      "scene": "negotiation",
      "scene_label": "商务谈判",
      "title": "压价威胁",
      "risk_focus": "最后通牒式威胁",
      "original": "Give us a 15% discount or we walk away.",
      "optimized": "Given our projected order volume of 20,000 units, could you kindly consider a 15% adjustment? We believe this would support a long-term partnership.",
      "before": {
        "total": 78,
        "risk_level": "medium_low",
        "risk_label": "中风险 · Medium Risk",
        "scores": {
          "language_accuracy": 9,
          "business_politeness": 3,
          "cultural_adaptability": 9,
          "communication_clarity": 9,
          "relationship_friendliness": 9
        },
        "issues": [
          {
            "type": "etiquette",
            "quote": "Give us a 15% discount or we walk away.",
            "severity": "high"
          },
          {
            "type": "etiquette",
            "quote": "Give us a 15% discount or we walk away.",
            "severity": "high"
          }
        ]
      },
      "after": {
        "total": 90,
        "risk_level": "low",
        "risk_label": "低风险 · Low Risk",
        "scores": {
          "language_accuracy": 9,
          "business_politeness": 9,
          "cultural_adaptability": 9,
          "communication_clarity": 9,
          "relationship_friendliness": 9
        },
        "issues": []
      },
      "reduction": 12
    },
    {
      "id": "CMP-007",
      "scene": "meeting",
      "scene_label": "国际会议",
      "title": "方案拒绝",
      "risk_focus": "全盘否定伤面子",
      "original": "Your proposal is completely wrong.",
      "optimized": "Thank you for sharing your proposal. We see potential in some aspects. However, the timeline may need further discussion. Could we explore adjustments together?",
      "before": {
        "total": 81,
        "risk_level": "medium_low",
        "risk_label": "中风险 · Medium Risk",
        "scores": {
          "language_accuracy": 9,
          "business_politeness": 9,
          "cultural_adaptability": 6,
          "communication_clarity": 9,
          "relationship_friendliness": 6
        },
        "issues": [
          {
            "type": "culture",
            "quote": "Your proposal is completely wrong.",
            "severity": "high"
          }
        ]
      },
      "after": {
        "total": 90,
        "risk_level": "low",
        "risk_label": "低风险 · Low Risk",
        "scores": {
          "language_accuracy": 9,
          "business_politeness": 9,
          "cultural_adaptability": 9,
          "communication_clarity": 9,
          "relationship_friendliness": 9
        },
        "issues": []
      },
      "reduction": 9
    },
    {
      "id": "CMP-008",
      "scene": "customer",
      "scene_label": "客户沟通",
      "title": "投诉指责",
      "risk_focus": "情绪化指责",
      "original": "Your products are terrible. We want a full refund now.",
      "optimized": "We have identified quality issues with batch #102 received on May 10. This has affected our operations. Could you please investigate and advise on how you plan to resolve this, including compensation options?",
      "before": {
        "total": 81,
        "risk_level": "medium_low",
        "risk_label": "中风险 · Medium Risk",
        "scores": {
          "language_accuracy": 9,
          "business_politeness": 9,
          "cultural_adaptability": 6,
          "communication_clarity": 9,
          "relationship_friendliness": 6
        },
        "issues": [
          {
            "type": "culture",
            "quote": "Your products are terrible. We want a full refund now.",
            "severity": "high"
          }
        ]
      },
      "after": {
        "total": 90,
        "risk_level": "low",
        "risk_label": "低风险 · Low Risk",
        "scores": {
          "language_accuracy": 9,
          "business_politeness": 9,
          "cultural_adaptability": 9,
          "communication_clarity": 9,
          "relationship_friendliness": 9
        },
        "issues": []
      },
      "reduction": 9
    }
  ]
}
};