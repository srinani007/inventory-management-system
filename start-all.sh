#!/bin/bash

echo "🚀 Starting all microservices and frontend..."

# Navigate to backend services and start each in new terminal tab
osascript -e 'tell application "Terminal"
    do script "cd ~/intellj-projects/inventory-management-system/backend/user-service && ./mvnw spring-boot:run"
end tell'

osascript -e 'tell application "Terminal"
    do script "cd ~/intellj-projects/inventory-management-system/backend/inventory-service && ./mvnw spring-boot:run"
end tell'

osascript -e 'tell application "Terminal"
    do script "cd ~/intellj-projects/inventory-management-system/backend/order-service && ./mvnw spring-boot:run"
end tell'

osascript -e 'tell application "Terminal"
    do script "cd ~/intellj-projects/inventory-management-system/backend/notification-service && ./mvnw spring-boot:run"
end tell'

# Start frontend
osascript -e 'tell application "Terminal"
    do script "cd ~/intellj-projects/inventory-management-system/frontend/dashboard-app && npm run dev"
end tell'
