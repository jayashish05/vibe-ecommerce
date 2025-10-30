#!/bin/bash

echo "🚀 Starting Vibe Commerce..."
echo ""

if ! command -v mongod &> /dev/null
then
    echo "⚠️  MongoDB is not installed or not in PATH"
    echo "Please install MongoDB and ensure it's running"
    exit 1
fi

echo "📦 Starting MongoDB..."
mongod --dbpath ~/data/db &
MONGO_PID=$!
sleep 3

echo ""
echo "🔧 Starting Backend Server..."
cd backend && npm start &
BACKEND_PID=$!

echo ""
echo "⚛️  Starting Frontend..."
cd ../my-app && npm start &
FRONTEND_PID=$!

echo ""
echo "✅ All services started!"
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop all services"

wait
