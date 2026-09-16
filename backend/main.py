# -*- coding: utf-8 -*-
"""桥通售后 服务入口。
一键启动：python backend/main.py  （或 uvicorn backend.main:app）
启动后打开 http://127.0.0.1:8000 即可使用（前端页面由本服务直接提供）。
"""
import os
import webbrowser
import threading

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from config import FRONTEND_DIR, resolve_provider, DEEPSEEK_API_KEY
from models import AnalyzeRequest, AnalysisResult, DiagnosisRequest
from analyzer import analyze
from cases import get_all
from aggregator import build_diagnosis, build_comparisons, get_scene_test_cases

app = FastAPI(
    title="桥通售后",
    version="1.0.0",
    description="跨文化商务沟通风险智能检测助手 —— AI + 商务英语 + 跨文化交际",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def api_health():
    """健康检查：返回服务状态与当前 AI 通道（便于部署后验证 Key 是否生效）。"""
    return {
        "status": "ok",
        "service": "桥通售后",
        "version": "1.0.0",
        "ai_provider": resolve_provider(),        # deepseek / siliconflow / ollama / mock
        "deepseek_configured": bool(DEEPSEEK_API_KEY),
        "mode_note": "mock=规则引擎(免费离线) | deepseek/siliconflow/ollama=大模型增强(失败自动降级)",
    }


@app.post("/api/analyze", response_model=AnalysisResult)
def api_analyze(req: AnalyzeRequest):
    """输入：{text, scene, culture, business_scene} → 完整风险分析报告（含 AI 推理过程/文化解释/三策略）"""
    return analyze(req.text, req.scene, req.culture, req.business_scene)


@app.get("/api/cases")
def api_cases(scenario: str = "all"):
    cases = get_all(scenario)
    return {"total": len(cases), "scenario": scenario, "cases": cases}


@app.post("/api/diagnosis", response_model=dict)
def api_diagnosis(req: DiagnosisRequest):
    """输入：{texts: [...]} → 输出：聚合沟通风险画像（综合评分/五维均值/优势/改进建议）"""
    return build_diagnosis(req.texts)


@app.get("/api/comparisons")
def api_comparisons(force: bool = False):
    """优化前后对比案例：原表达 vs 优化表达（评分由系统实时计算，含风险降低幅度）"""
    return build_comparisons(force_refresh=force)


@app.get("/api/scene-cases")
def api_scene_cases(category: str = "all"):
    """商务场景测试案例库（20 条，5 大高频场景）"""
    return get_scene_test_cases(category)


# 前端静态页面（放在最后挂载，/api/* 路由优先）
app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")


if __name__ == "__main__":
    provider = resolve_provider()
    port = int(os.environ.get("PORT", "8000"))
    url = f"http://127.0.0.1:{port}"
    print("=" * 56)
    print("  桥通售后 · 跨文化商务沟通风险智能检测助手")
    print(f"  已启动：{url}")
    print(f"  当前 AI 通道：{provider}")
    print("  提示：设置环境变量 DEEPSEEK_API_KEY 或 SILICONFLOW_API_KEY 可启用真实大模型")
    print("=" * 56)
    threading.Timer(1.2, lambda: webbrowser.open(url)).start()
    uvicorn.run(app, host="127.0.0.1", port=port, log_level="info")

