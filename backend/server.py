"""
Minimal FastAPI stub.

The site is now a pure-static Next.js build (SIGNAL). No backend routes are
used by the frontend. This file exists only so the platform's supervisor-
managed backend service has something to run.
"""
from fastapi import FastAPI

app = FastAPI(title="signal-noop")


@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "signal-noop"}
