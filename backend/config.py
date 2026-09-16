# -*- coding: utf-8 -*-
"""桥通售后 后端配置。
AI 通道支持四种：mock（默认，无需任何 Key）/ deepseek / siliconflow / ollama。
不配置任何 Key 时自动使用 mock 规则引擎，Demo 依然可完整演示。
"""
import os

# ---- AI 通道选择 ----------------------------------------------------------
# auto: 有 DEEPSEEK_API_KEY 用 deepseek；有 SILICONFLOW_API_KEY 用 siliconflow；都没有用 mock
# 也可以直接指定: mock | deepseek | siliconflow | ollama
AI_PROVIDER = os.environ.get("AI_PROVIDER", "auto")

# ---- DeepSeek（推荐：低价稳定，需在 platform.deepseek.com 注册获取 Key）-----
DEEPSEEK_API_KEY = os.environ.get("DEEPSEEK_API_KEY", "")
DEEPSEEK_BASE_URL = os.environ.get("DEEPSEEK_BASE_URL", "https://api.deepseek.com")
DEEPSEEK_MODEL = os.environ.get("DEEPSEEK_MODEL", "deepseek-chat")

# ---- 硅基流动（免费额度，注册即送，可调用开源模型）--------------------------
SILICONFLOW_API_KEY = os.environ.get("SILICONFLOW_API_KEY", "")
SILICONFLOW_BASE_URL = os.environ.get("SILICONFLOW_BASE_URL", "https://api.siliconflow.cn/v1")
SILICONFLOW_MODEL = os.environ.get("SILICONFLOW_MODEL", "Qwen/Qwen2.5-7B-Instruct")

# ---- Ollama（本地免费离线模型，需要先安装 Ollama 并 pull 模型）--------------
OLLAMA_BASE_URL = os.environ.get("OLLAMA_BASE_URL", "http://127.0.0.1:11434")
OLLAMA_MODEL = os.environ.get("OLLAMA_MODEL", "qwen3:8b")

# ---- 通用 ---------------------------------------------------------------
DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data")
CASES_PATH = os.path.join(DATA_DIR, "cross_culture_cases.json")
FRONTEND_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "frontend")

REQUEST_TIMEOUT = 90        # LLM 请求超时（秒）
MAX_LLM_RETRY = 1           # 每个 LLM 步骤失败重试次数


def resolve_provider():
    """决定当前实际使用的 AI 通道。"""
    p = AI_PROVIDER.strip().lower()
    if p != "auto":
        return p
    if DEEPSEEK_API_KEY:
        return "deepseek"
    if SILICONFLOW_API_KEY:
        return "siliconflow"
    return "mock"

