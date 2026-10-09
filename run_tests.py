"""
Jaldhara Test Runner
Usage:
    python run_tests.py
"""
import sys
import subprocess

def run():
    print("=" * 60)
    print("Running Jaldhara Quantum & API Test Suite...")
    print("=" * 60)
    cmd = [sys.executable, "-m", "pytest", "tests/test_quantum_suite.py", "-v"]
    ret = subprocess.call(cmd)
    sys.exit(ret)

if __name__ == "__main__":
    run()
