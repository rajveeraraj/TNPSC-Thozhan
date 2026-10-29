#!/bin/bash
set -e

echo "========================================================"
echo "  TNPSC தோழன் - Production Docker Launcher"
echo "========================================================"
echo ""

if ! command -v docker &> /dev/null; then
    echo "[ERROR] Docker is not installed or not in PATH!"
    exit 1
fi

echo "Building and launching production containers..."
docker compose up -d --build

echo ""
echo "========================================================"
echo "  All Production Containers are UP and RUNNING!"
echo "========================================================"
echo "  Student Web/PWA App:  http://localhost:3000 (or http://localhost)"
echo "  Admin Dashboard:      http://localhost:8000/admin"
echo "  REST API Health:      http://localhost:8000/api/health"
echo "  MySQL Database:       localhost:3306 (DB: tnpsc_thozhan)"
echo "========================================================"
echo ""
echo "To view logs:        docker compose logs -f"
echo "To stop containers:  docker compose down"
