# CrossBridge AI —— 跨文化商务沟通风险智能检测助手

> **AI + 商务英语 + 跨文化交际** ｜ 新文科实践创新项目 ｜ 可运行 Demo
> English: *AI-powered Cross-cultural Communication Risk Detector — detect communication risks beyond translation.*

---

## 项目简介

**CrossBridge AI** 是面向国际商务场景的**跨文化沟通风险检测与表达优化系统**。输入一段国际商务沟通文本（邮件、谈判、会议发言等），系统从**语言、商务礼仪、文化适配**三条线检测潜在风险，输出五维评分、AI 推理过程、三套优化表达策略与文化解释。

**一句话定位**：翻译解决「对不对」，我们解决「得体不得体」——不是翻译软件，不是英语学习软件，不是通用写作助手，而是国际商务沟通的"发送前体检"。

---

## 背景问题

国际商务沟通中存在三类"翻译软件看不出"的风险：

| 风险类型 | 典型问题 | 后果 |
|---|---|---|
| 语言风险 | 中式英语、搭配不当、术语误用 | 专业形象受损、理解偏差 |
| 商务礼仪风险 | 命令式语气、称呼失当、缺少寒暄致谢 | 失礼得罪客户、合作意愿下降 |
| 跨文化风险 | 直接否定、当众反驳、隐私探问（高低语境/面子差异） | "翻译正确但沟通失败"，订单流失 |

例：*"You are wrong. My plan is better."* 翻译完全正确，但在亚洲高语境文化中当众否定对方方案，会严重伤及"面子"。

---

## 核心功能

1. **商务沟通风险检测**：语言/礼仪/文化三条线检测 + **AI 推理过程展示**（关键词识别 → 商务意图 → 风险判断 → 文化因素 → 最终风险）
2. **五维风险评价模型**：语言准确性 / 商务礼貌 / 文化适配 / 表达清晰 / 合作友好（0–100 加权评分 + 雷达图 + 风险仪表盘）
3. **跨文化分析**：支持指定目标文化（美国/欧洲/日本/东南亚/中东），解释与策略随文化适配（评分逻辑不变）
4. **表达优化**：每处风险提供**三套商务表达策略**（关系维护型 / 商务谈判型 / 强谈判型）+ 预计评分提升
5. **案例匹配**：同场景真实案例复盘；30 条风险案例 + 22 条场景案例（含问题类型/来源分类/解决效果）
6. **沟通诊断画像**：多条文本聚合生成沟通风险画像（优势/改进建议）
7. **Before/After 对比**：直观展示 AI 带来的风险降低

---

## 技术架构

```
┌─────────────────────────────────────────────────┐
│  前端 frontend/（零构建：HTML + CSS + JS）        │
│  6 个页面 + 离线降级（无后端也可浏览）             │
├─────────────────────────────────────────────────┤
│  后端 backend/（Python FastAPI，托管前端+API）    │
│  ├─ 双通道引擎：大模型（DeepSeek/硅基流动/Ollama） │
│  │              + 规则引擎（52 条案例库驱动）      │
│  ├─ 六层分析流程：场景识别→语言→礼仪→文化→评分→优化 │
│  ├─ 结构化输出 + 强校验 + 失败自动降级            │
│  └─ 总分由后端按权重确定性计算（杜绝随机）         │
├─────────────────────────────────────────────────┤
│  数据 data/：风险案例库 / 场景案例库 / 对比案例     │
│              / 案例解决效果（专家标注知识资产）     │
└─────────────────────────────────────────────────┘
```

**技术栈**：Python · FastAPI · Pydantic · Uvicorn（后端）；原生 HTML/CSS/JS（前端，无需 Node/构建）；SQLite 无需（数据为 JSON 文件）；AI 调用 OpenAI 兼容接口（纯 urllib，零第三方 AI 依赖）。

---

## 项目结构

```
CrossBridge-AI/
├── README.md                # 项目说明
├── LICENSE                  # MIT 许可
├── Dockerfile               # 线上部署（容器平台自动识别）
├── frontend/                # 前端页面（零构建）
│   ├── index.html           # 首页：价值展示 + 场景中心 + 快速体验
│   ├── report.html          # 分析报告页（评分/推理/风险/策略）
│   ├── diagnosis.html       # 沟通诊断画像页
│   ├── comparison.html      # Before/After 对比页
│   ├── model.html           # 模型说明页（CCRM 六层）
│   ├── cases.html           # 案例库（知识库）页
│   └── assets/              # css / js
├── backend/                 # Python FastAPI 后端
│   ├── main.py              # 服务入口（托管前端 + 7 个 API）
│   ├── config.py            # AI 通道配置（环境变量，无硬编码密钥）
│   ├── prompts.py           # 专业 System Prompt（学科知识固化）
│   ├── analyzer.py          # 六步分析流水线（失败自动降级）
│   ├── mock_analyzer.py     # 规则引擎（案例库驱动）
│   ├── aggregator.py        # 诊断聚合 + 前后对比
│   └── ...                  # models / providers / cases
├── data/                    # 知识数据（专家标注案例库）
│   ├── cross_culture_cases.json   # 30 条风险案例
│   ├── scene_test_cases.json      # 22 条场景案例
│   ├── comparison_pairs.json      # 8 组前后对比案例
│   └── case_resolutions.json      # 案例解决效果
└── docs/                    # 方案书 / 设计 / 部署指南
```

---

## 本地运行方法

要求：Python 3.9+（无需 Node；无需 API Key 也能完整体验）

```bash
# 1. 克隆并进入
git clone <仓库地址>
cd CrossBridge-AI

# 2. 安装依赖（仅需一次）
pip install -r backend/requirements.txt

# 3. 启动（浏览器自动打开 http://127.0.0.1:8000）
python backend/main.py
```

> **免安装浏览**：直接双击 `frontend/index.html` 也可浏览全部页面（离线演示模式）；完整分析请启动服务。

**可选：启用真实大模型**（默认内置规则引擎，免费离线；配置后效果更强，失败自动降级）

```bash
# Windows PowerShell
$env:DEEPSEEK_API_KEY="sk-你的Key"     # 或 SILICONFLOW_API_KEY / 本地 Ollama
python backend/main.py
```

**验证 Key 是否生效**：启动后访问 `http://127.0.0.1:8000/api/health`，查看 `ai_provider` 字段：
- `"ai_provider": "deepseek"` → 大模型增强模式已生效（商务表达优化/跨文化解释/风险原因由 DeepSeek 实时生成）
- `"ai_provider": "mock"` → 未配置 Key 或 Key 未识别，使用规则引擎（52 条专家案例库，免费离线，功能完整）

也可运行验证脚本：`python scripts/test_deepseek.py`（有 Key 显示增强模式，无 Key 显示回退模式）。

**线上部署**：仓库已含 `Dockerfile`，可一键部署到 Hugging Face Spaces / Render（详见 `docs/上线指南.md`）。

---

## Demo 展示流程

```
输入商务文本（或点击"快速体验案例"一键填入）
        ↓
点击"开始检测" → 六步分析动画
        ↓
综合风险评分 + 五维雷达图 + 风险仪表盘
        ↓
AI 推理过程（关键词→意图→风险→文化→最终风险）
        ↓
风险分析（逐句问题卡片）
        ↓
三套优化表达策略 + 预计评分提升
        ↓
同场景案例复盘
（可选：沟通诊断画像 / Before-After 对比 / 案例库）
```

---

## API 一览

| 接口 | 方法 | 说明 |
|---|---|---|
| `/api/analyze` | POST | `{text, scene, culture, business_scene}` → 完整风险报告 |
| `/api/diagnosis` | POST | `{texts:[...]}` → 沟通风险画像 |
| `/api/comparisons` | GET | 8 组优化前后对比 |
| `/api/cases` | GET | 案例库（含来源/问题类型/解决效果） |
| `/api/scene-cases` | GET | 场景测试案例 |
| `/api/health` | GET | 健康检查 |

---

## 合规说明

- 案例库为团队原创整理（基于外贸实务、教材语料、指导教师指导改编），可自由用于学术与演示。
- 开源组件（FastAPI、Pydantic、Uvicorn）均为 MIT/BSD 宽松许可。
- API Key 仅通过环境变量注入，**代码中无任何硬编码密钥**。
- AI 分析结果用于商务沟通辅助参考，实际商业决策需结合具体业务环境综合判断。

---

## License

[MIT](LICENSE) © 2026 CrossBridge AI Team
