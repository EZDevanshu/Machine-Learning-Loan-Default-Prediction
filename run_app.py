import os
import sys
import time
import urllib.request
import urllib.error
import subprocess
import signal

# Avoid loky warning on Windows
os.environ["LOKY_MAX_CPU_COUNT"] = str(os.cpu_count() or 4)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(BASE_DIR, "backend")
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")
MODEL_PKL = os.path.join(BASE_DIR, "model", "loan_default_pipeline.pkl")
TRAIN_SCRIPT = os.path.join(BASE_DIR, "model", "train_and_save_model.py")

def check_or_train_model():
    if not os.path.exists(MODEL_PKL):
        print("[1/3] Trained model pipeline not found. Training model on Loan_default.csv...")
        res = subprocess.run([sys.executable, TRAIN_SCRIPT], cwd=BASE_DIR)
        if res.returncode != 0:
            print("[ERROR] Model training failed.")
            sys.exit(1)
        print("[1/3] Model trained and saved successfully.")
    else:
        print("[1/3] Model pipeline verified (model/loan_default_pipeline.pkl exists).")

def wait_for_backend(url="http://localhost:8000/api/v1/health", timeout=25):
    print("      Waiting for FastAPI backend to become healthy...")
    start = time.time()
    while time.time() - start < timeout:
        try:
            with urllib.request.urlopen(url, timeout=2) as resp:
                if resp.status == 200:
                    print("      FastAPI Backend is online and healthy!")
                    return True
        except (urllib.error.URLError, ConnectionResetError, TimeoutError):
            pass
        time.sleep(1)
    print("      Warning: Backend health check timed out, but proceeding...")
    return False

def main():
    print("=" * 65)
    print("   LoanGuard AI - Full-Stack Application Launcher")
    print("   Connecting Model (Scikit-Learn) + Backend (FastAPI) + Frontend (Next.js)")
    print("=" * 65)

    # 1. Model Verification
    check_or_train_model()

    processes = []

    try:
        # 2. Start FastAPI Backend
        print("[2/3] Starting FastAPI Backend on http://localhost:8000 ...")
        backend_cmd = [sys.executable, "-m", "uvicorn", "main:app", "--host", "127.0.0.1", "--port", "8000"]
        backend_proc = subprocess.Popen(
            backend_cmd,
            cwd=BACKEND_DIR,
            stdout=sys.stdout,
            stderr=sys.stderr
        )
        processes.append(backend_proc)

        # Wait for backend readiness
        wait_for_backend()

        # 3. Start Next.js Frontend
        print("[3/3] Starting Next.js Frontend on http://localhost:3000 ...")
        # On Windows, use npm.cmd to avoid PowerShell execution policy restrictions
        npm_cmd = "npm.cmd" if sys.platform == "win32" else "npm"
        frontend_proc = subprocess.Popen(
            [npm_cmd, "run", "dev"],
            cwd=FRONTEND_DIR,
            stdout=sys.stdout,
            stderr=sys.stderr
        )
        processes.append(frontend_proc)

        print("\n" + "=" * 65)
        print("   ALL SYSTEMS CONNECTED AND RUNNING:")
        print("   - Frontend App : http://localhost:3000")
        print("   - Backend API  : http://localhost:8000")
        print("   - API Docs     : http://localhost:8000/docs")
        print("   - Model Engine : HistGradientBoosting (Scikit-Learn)")
        print("=" * 65)
        print("Press Ctrl+C to stop all servers.\n")

        # Keep running
        while True:
            for p in processes:
                ret = p.poll()
                if ret is not None:
                    print(f"Process {p.args} exited with code {ret}")
                    return
            time.sleep(1)

    except KeyboardInterrupt:
        print("\nShutting down LoanGuard AI services...")
    finally:
        for p in processes:
            try:
                p.terminate()
            except Exception:
                pass
        print("All services stopped.")

if __name__ == "__main__":
    main()
