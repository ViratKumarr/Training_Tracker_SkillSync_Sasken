#!/bin/bash

echo "🚀 Starting SkillSync Training Tracker..."
echo "========================================"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if Java is installed
print_step "1. Checking Java installation..."
if ! command -v java &> /dev/null; then
    echo "❌ Java is not installed. Please install Java 17 or higher."
    exit 1
fi

JAVA_VERSION=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2 | cut -d'.' -f1)
if [ "$JAVA_VERSION" -lt 17 ]; then
    echo "❌ Java version $JAVA_VERSION is too old. Please install Java 17 or higher."
    exit 1
fi

print_status "✓ Java version: $(java -version 2>&1 | head -n 1)"

# Check if Maven is installed
print_step "2. Checking Maven installation..."
if ! command -v mvn &> /dev/null; then
    echo "❌ Maven is not installed. Please install Maven 3.6 or higher."
    exit 1
fi

print_status "✓ Maven version: $(mvn -version | head -n 1)"

# Check if Node.js is installed
print_step "3. Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16 or higher."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please install Node.js 16 or higher."
    exit 1
fi

print_status "✓ Node.js version: $(node -v)"

# Start backend
print_step "4. Starting backend..."
cd backend
print_status "Building and starting backend on http://localhost:8080"
print_status "This will take a moment to start..."
mvn spring-boot:run &
BACKEND_PID=$!

# Wait for backend to start
sleep 15

# Test backend
print_step "5. Testing backend..."
if curl -s http://localhost:8080/api > /dev/null 2>&1; then
    print_status "✓ Backend is running on http://localhost:8080"
else
    print_warning "Backend might still be starting. Please wait a moment."
fi

# Start frontend
print_step "6. Starting frontend..."
cd ../frontend
print_status "Installing frontend dependencies..."
npm install
if [ $? -eq 0 ]; then
    print_status "✓ Frontend dependencies installed"
else
    echo "❌ Frontend dependency installation failed"
    exit 1
fi

print_status "Starting frontend on http://localhost:3000"
npm start &
FRONTEND_PID=$!

# Wait a moment for frontend to start
sleep 10

# Final status
echo ""
echo "🎉 SkillSync Training Tracker is now running!"
echo "=============================================="
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:8080"
echo "🗄️  H2 Console: http://localhost:8080/api/h2-console"
echo ""
echo "🔑 Default Login Credentials:"
echo "   Admin:    admin@sasken.com / admin123"
echo "   Manager:  manager@sasken.com / manager123"
echo "   Trainer:  trainer@sasken.com / trainer123"
echo "   Employee: employee@sasken.com / employee123"
echo ""
echo "💡 Tips:"
echo "   - The backend uses H2 in-memory database (no setup required)"
echo "   - Sample data will be loaded automatically"
echo "   - Check the browser console for any frontend errors"
echo ""
echo "🛑 To stop the application:"
echo "   Press Ctrl+C in this terminal"
echo "   Or kill the processes: kill $BACKEND_PID $FRONTEND_PID"
echo ""

# Keep the script running
wait 