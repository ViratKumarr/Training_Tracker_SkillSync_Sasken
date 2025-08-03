# SkillSync Training Tracker

## Overview
SkillSync is a comprehensive training management system designed to help the Capability Management Team assign, track, and report on employee training programs, ensuring timely completion and progress monitoring across the organization.

## Purpose
To enable the Capability Management Team to assign, track, and report on employee training programs, ensuring timely completion and progress monitoring across the organization.

## Key Features
- **User Management**: Role-based access control (Employee, Trainer, Manager, Admin)
- **Course Management**: Create, edit, assign, and schedule training programs
- **Enrollment & Attendance**: Track course participation and attendance
- **Progress Tracking**: Monitor completion percentage, time spent, and quiz/test outcomes
- **Certification & Reporting**: Generate completion certificates and learning reports
- **Feedback Module**: Collect structured feedback via forms/surveys
- **Notification Engine**: Send reminders for upcoming, ongoing, or overdue trainings

## Technology Stack

### Backend
- Java 17
- Spring Boot 3.2.0
- Spring Security with JWT Authentication
- Spring Data JPA
- H2 Database (for development)
- MySQL (for production)

### Frontend
- React.js 18
- React Router 6
- Bootstrap 5
- Axios for API communication

## Getting Started

### Prerequisites
- Java 17 or higher
- Node.js 16 or higher
- Maven 3.6 or higher

### Running the Application
1. Clone the repository
2. Run the application using the provided script:
   - On Linux/Mac:
   ```
   ./run.sh
   ```
   - On Windows:
   ```
   run.bat
   ```
   This will start both the backend and frontend servers.

### Default Login Credentials
- **Admin**: admin@sasken.com / admin123
- **Manager**: manager@sasken.com / manager123
- **Trainer**: trainer@sasken.com / trainer123
- **Employee**: employee@sasken.com / employee123

## Application Structure

### Backend
- **Controllers**: Handle HTTP requests and responses
- **Services**: Implement business logic
- **Repositories**: Interface with the database
- **Models**: Define data structures
- **Security**: JWT authentication and authorization

### Frontend
- **Components**: Reusable UI elements
- **Pages**: Main application views
- **Services**: API communication
- **Context**: State management

## Development Notes
- The backend uses H2 in-memory database for development
- Sample data is loaded automatically on startup
- The frontend proxies API requests to the backend
