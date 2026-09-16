# -*- coding: utf-8 -*-
"""案例库数据访问模块：加载、筛选、相关案例检索、解决效果附件。"""
import json
import os

from config import CASES_PATH


def load_cases():
    with open(CASES_PATH, encoding="utf-8") as f:
        return json.load(f)["cases"]


CASES = load_cases()


def _load_resolutions():
    path = os.path.join(os.path.dirname(CASES_PATH), "case_resolutions.json")
    if not os.path.exists(path):
        return {}
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except Exception:  # noqa: BLE001
        return {}


RESOLUTIONS = _load_resolutions()


def get_all(scenario: str = "all"):
    cases = CASES if scenario in ("all", "") else [c for c in CASES if c["scenario"] == scenario]
    out = []
    for c in cases:
        item = dict(c)
        item["resolution"] = RESOLUTIONS.get(c["id"], {})
        out.append(item)
    return out


def search_related(scene: str, text: str, limit: int = 2):
    """按'场景 + 关键词命中'检索相关案例，用于报告底部的'相关案例'区。"""
    text_l = (text or "").lower()
    scored = []
    for c in CASES:
        s = 0
        if scene and c["scenario"] == scene:
            s += 2
        for kw in c.get("match_keywords", []):
            if kw.lower() in text_l:
                s += 3
        if s:
            scored.append((s, c))
    scored.sort(key=lambda x: -x[0])
    return [c for _, c in scored[:limit]]
