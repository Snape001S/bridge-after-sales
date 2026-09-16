# CrossBridge AI · 上线部署镜像
# 适用：Hugging Face Spaces (Docker) / Render 等容器平台
FROM python:3.11-slim

WORKDIR /app

# 先装依赖（利用层缓存）
COPY backend/requirements.txt /app/backend/requirements.txt
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

# 拷贝运行所需全部文件
COPY backend /app/backend
COPY frontend /app/frontend
COPY data /app/data

# 平台通过 PORT 环境变量指定端口（HF Spaces 默认 7860，Render 自动注入）
ENV PORT=7860
EXPOSE 7860

WORKDIR /app/backend
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-7860}"]
