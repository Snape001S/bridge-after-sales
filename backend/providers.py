# -*- coding: utf-8 -*-
"""AI 通道抽象层：deepseek / siliconflow / ollama 三种 LLM 调用（OpenAI 兼容接口）。
全部使用 Python 标准库 urllib 实现，零第三方依赖，便于学生环境一键运行。
"""
import json
import time
import urllib.request
import urllib.error

from config import (
    DEEPSEEK_API_KEY, DEEPSEEK_BASE_URL, DEEPSEEK_MODEL,
    SILICONFLOW_API_KEY, SILICONFLOW_BASE_URL, SILICONFLOW_MODEL,
    OLLAMA_BASE_URL, OLLAMA_MODEL,
    REQUEST_TIMEOUT,
)


class LLMError(Exception):
    pass


# 可重试的 HTTP 状态码（限流/服务器瞬时错误）
_RETRYABLE_CODES = {429, 500, 502, 503, 504}


def _post_json(url: str, headers: dict, payload: dict, timeout: int, max_retry: int = 2):
    """POST JSON 并自动重试（429/5xx 与瞬时网络错误，指数退避）。"""
    data = json.dumps(payload).encode("utf-8")
    last_err = None
    for attempt in range(max_retry + 1):
        try:
            req = urllib.request.Request(url, data=data, headers=headers, method="POST")
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            last_err = e
            if e.code in _RETRYABLE_CODES and attempt < max_retry:
                time.sleep(1.5 * (attempt + 1))  # 退避：1.5s / 3s
                continue
            body = e.read().decode("utf-8", "ignore")[:300]
            raise LLMError(f"HTTP {e.code}: {body}") from e
        except Exception as e:  # 网络/超时等瞬时错误
            last_err = e
            if attempt < max_retry:
                time.sleep(1.0 * (attempt + 1))
                continue
            raise LLMError(f"请求失败: {e}") from e
    raise LLMError(f"请求失败: {last_err}")


def _call_openai_compatible(base_url: str, api_key: str, model: str, messages, timeout: int) -> str:
    headers = {"Content-Type": "application/json", "Authorization": f"Bearer {api_key}"}
    payload = {
        "model": model,
        "messages": messages,
        "temperature": 0.2,
        "response_format": {"type": "json_object"},
    }
    resp = _post_json(base_url.rstrip("/") + "/chat/completions", headers, payload, timeout)
    try:
        return resp["choices"][0]["message"]["content"]
    except (KeyError, IndexError) as e:
        raise LLMError(f"响应格式异常: {json.dumps(resp, ensure_ascii=False)[:300]}") from e


def _call_ollama(model: str, messages, timeout: int) -> str:
    payload = {
        "model": model,
        "messages": messages,
        "stream": False,
        "format": "json",
        "options": {"temperature": 0.2},
    }
    resp = _post_json(OLLAMA_BASE_URL.rstrip("/") + "/api/chat",
                      {"Content-Type": "application/json"}, payload, timeout)
    try:
        return resp["message"]["content"]
    except KeyError as e:
        raise LLMError(f"Ollama 响应格式异常: {json.dumps(resp, ensure_ascii=False)[:300]}") from e


def chat(provider: str, messages, timeout: int = REQUEST_TIMEOUT) -> str:
    """调用指定通道的 LLM，返回模型输出的文本（应为一个 JSON 字符串）。"""
    provider = provider.strip().lower()
    if provider == "deepseek":
        if not DEEPSEEK_API_KEY:
            raise LLMError("未配置 DEEPSEEK_API_KEY")
        return _call_openai_compatible(DEEPSEEK_BASE_URL, DEEPSEEK_API_KEY, DEEPSEEK_MODEL, messages, timeout)
    if provider == "siliconflow":
        if not SILICONFLOW_API_KEY:
            raise LLMError("未配置 SILICONFLOW_API_KEY")
        return _call_openai_compatible(SILICONFLOW_BASE_URL, SILICONFLOW_API_KEY, SILICONFLOW_MODEL, messages, timeout)
    if provider == "ollama":
        return _call_ollama(OLLAMA_MODEL, messages, timeout)
    raise LLMError(f"未知 AI 通道: {provider}")


def parse_json(text: str) -> dict:
    """从 LLM 输出中提取 JSON（容忍 ```json 代码块包裹等常见问题）。"""
    t = text.strip()
    if t.startswith("```"):
        t = t.strip("`")
        if t.lower().startswith("json"):
            t = t[4:]
        t = t.strip()
    try:
        return json.loads(t)
    except json.JSONDecodeError:
        # 尝试截取第一个 { 到最后一个 }
        start, end = t.find("{"), t.rfind("}")
        if start >= 0 and end > start:
            return json.loads(t[start:end + 1])
        raise
