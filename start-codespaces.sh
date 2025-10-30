#!/bin/bash

echo "Starting Vibe Commerce in GitHub Codespaces..."

cd backend
echo "Installing backend dependencies..."
npm install

echo "Starting backend server on port 5001..."
node server.js &

cd ../frontend
echo "Installing frontend dependencies..."
npm install

echo "Starting frontend server on port 3000..."
npm start
