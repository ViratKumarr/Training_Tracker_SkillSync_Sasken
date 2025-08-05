const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

// Create in-memory database for serverless
const db = new sqlite3.Database(':memory:');

// Initialize database schema
function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create Users table
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        employee_id TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT CHECK(role IN ('ADMIN','MANAGER','TRAINER','EMPLOYEE')) NOT NULL,
        department TEXT,
        phone_number TEXT,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Create Courses table
      db.run(`CREATE TABLE IF NOT EXISTS courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        category TEXT CHECK(category IN ('TECHNICAL','SOFT_SKILLS','COMPLIANCE','LEADERSHIP','PRODUCTIVITY')),
        type TEXT CHECK(type IN ('IN_PERSON','VIRTUAL','HYBRID','SELF_PACED')),
        duration_hours INTEGER,
        trainer_id INTEGER,
        is_active BOOLEAN DEFAULT 1,
        is_mandatory BOOLEAN DEFAULT 0,
        max_participants INTEGER,
        prerequisites TEXT,
        materials TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (trainer_id) REFERENCES users(id)
      )`);

      // Create Enrollments table
      db.run(`CREATE TABLE IF NOT EXISTS enrollments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        course_id INTEGER NOT NULL,
        status TEXT CHECK(status IN ('PENDING','ENROLLED','IN_PROGRESS','COMPLETED','DROPPED','SUSPENDED')) DEFAULT 'ENROLLED',
        type TEXT CHECK(type IN ('MANDATORY','OPTIONAL','SELF_ENROLLED','MANAGER_ASSIGNED')) DEFAULT 'SELF_ENROLLED',
        enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        started_at DATETIME,
        completed_at DATETIME,
        last_accessed_at DATETIME,
        completion_percentage REAL DEFAULT 0,
        total_time_spent INTEGER DEFAULT 0,
        certificate_earned BOOLEAN DEFAULT 0,
        certificate_id TEXT,
        grade TEXT,
        notes TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (course_id) REFERENCES courses(id)
      )`);

      // Create Progress table
      db.run(`CREATE TABLE IF NOT EXISTS progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        course_id INTEGER NOT NULL,
        status TEXT CHECK(status IN ('NOT_STARTED','IN_PROGRESS','COMPLETED','PAUSED')) DEFAULT 'NOT_STARTED',
        completion_percentage REAL DEFAULT 0,
        time_spent_minutes INTEGER DEFAULT 0,
        quiz_score REAL,
        max_quiz_score REAL,
        started_at DATETIME,
        completed_at DATETIME,
        last_accessed_at DATETIME,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (course_id) REFERENCES courses(id)
      )`);

      // Create Notifications table
      db.run(`CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        type TEXT CHECK(type IN ('COURSE_ASSIGNMENT','COURSE_REMINDER','COURSE_COMPLETION','SESSION_REMINDER','ATTENDANCE_REMINDER','CERTIFICATE_ISSUED','FEEDBACK_REQUEST','SYSTEM_ANNOUNCEMENT','OVERDUE_TRAINING')),
        priority TEXT CHECK(priority IN ('LOW','MEDIUM','HIGH','URGENT')) DEFAULT 'MEDIUM',
        status TEXT CHECK(status IN ('PENDING','SENT','DELIVERED','FAILED')) DEFAULT 'PENDING',
        is_read BOOLEAN DEFAULT 0,
        read_at DATETIME,
        sent_at DATETIME,
        scheduled_for DATETIME,
        related_entity_type TEXT,
        related_entity_id INTEGER,
        email_sent BOOLEAN DEFAULT 0,
        email_sent_at DATETIME,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )`);

      // Initialize with sample data
      initializeSampleData();
      
      resolve();
    });
  });
}

function initializeSampleData() {
  // Hash password for sample users
  const hashedPassword = bcrypt.hashSync('password123', 10);
  
  // Insert sample users
  const users = [
    ['John', 'Admin', 'admin@sasken.com', 'EMP001', hashedPassword, 'ADMIN', 'IT', '+91-9876543210'],
    ['Jane', 'Manager', 'manager@sasken.com', 'EMP002', hashedPassword, 'MANAGER', 'HR', '+91-9876543211'],
    ['Bob', 'Trainer', 'trainer@sasken.com', 'EMP003', hashedPassword, 'TRAINER', 'Training', '+91-9876543212'],
    ['Alice', 'Employee', 'employee@sasken.com', 'EMP004', hashedPassword, 'EMPLOYEE', 'Engineering', '+91-9876543213']
  ];

  users.forEach(user => {
    db.run(`INSERT INTO users (first_name, last_name, email, employee_id, password, role, department, phone_number) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, user);
  });

  // Insert sample courses with Udemy links
  const courses = [
    ['Java Masterclass 2025: 130+ Hours of Expert Lessons', 'Comprehensive Java programming course covering fundamentals to advanced concepts', 'TECHNICAL', 'SELF_PACED', 130, 3, 1, 0, 100, 'Basic computer knowledge', 'https://www.udemy.com/course/java-the-complete-java-developer-course/?couponCode=LETSLEARNNOW'],
    ['Python Complete Bootcamp: Zero to Hero Programming', 'Master Python programming from basics to advanced with real-world projects', 'TECHNICAL', 'SELF_PACED', 85, 3, 1, 0, 80, 'No prior experience needed', 'https://www.udemy.com/course/complete-python-bootcamp/?couponCode=LETSLEARNNOW'],
    ['React - The Complete Guide (incl Hooks, React Router, Redux)', 'Build powerful, fast, user-friendly and reactive web apps', 'TECHNICAL', 'SELF_PACED', 48, 3, 1, 0, 90, 'Basic JavaScript knowledge', 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/?couponCode=LETSLEARNNOW'],
    ['Node.js, Express, MongoDB & More: The Complete Bootcamp', 'Master Node by building a real-world RESTful API and web app', 'TECHNICAL', 'SELF_PACED', 42, 3, 1, 0, 75, 'JavaScript fundamentals', 'https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/?couponCode=LETSLEARNNOW'],
    ['Angular - The Complete Guide (2024 Edition)', 'Master Angular and build awesome, reactive web apps', 'TECHNICAL', 'SELF_PACED', 36, 3, 1, 0, 85, 'Basic web development knowledge', 'https://www.udemy.com/course/the-complete-guide-to-angular-2/?couponCode=LETSLEARNNOW'],
    ['Docker & Kubernetes: The Complete Guide', 'Build, test, and deploy Docker applications with Kubernetes', 'TECHNICAL', 'SELF_PACED', 22, 3, 1, 0, 60, 'Basic programming knowledge', 'https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/?couponCode=LETSLEARNNOW'],
    ['AWS Certified Solutions Architect - Associate 2024', 'Pass the AWS Solutions Architect Associate Certification', 'TECHNICAL', 'SELF_PACED', 28, 3, 1, 0, 70, 'Basic cloud knowledge', 'https://www.udemy.com/course/aws-certified-solutions-architect-associate/?couponCode=LETSLEARNNOW'],
    ['Machine Learning A-Z: Hands-On Python & R In Data Science', 'Learn to create Machine Learning Algorithms in Python and R', 'TECHNICAL', 'SELF_PACED', 44, 3, 1, 0, 65, 'High school mathematics', 'https://www.udemy.com/course/machinelearning/?couponCode=LETSLEARNNOW'],
    ['The Complete Digital Marketing Course - 12 Courses in 1', 'Master digital marketing strategy, social media marketing, SEO, YouTube, email, Facebook, analytics & more!', 'SOFT_SKILLS', 'SELF_PACED', 23, 3, 1, 0, 80, 'No prior experience needed', 'https://www.udemy.com/course/learn-digital-marketing-course/?couponCode=LETSLEARNNOW'],
    ['Leadership: Practical Leadership Skills', 'Leadership skills you can put to use immediately', 'LEADERSHIP', 'SELF_PACED', 8, 3, 1, 0, 50, 'No prior experience needed', 'https://www.udemy.com/course/practical-leadership/?couponCode=LETSLEARNNOW'],
    ['Project Management Professional (PMP)® Exam Prep', 'Complete PMP exam preparation course', 'PRODUCTIVITY', 'SELF_PACED', 35, 3, 1, 0, 60, 'Basic project experience', 'https://www.udemy.com/course/pmp-pmbok6-35-pdus/?couponCode=LETSLEARNNOW'],
    ['Complete Communication Skills Master Class for Life', 'Public Speaking | Presentation | Conversation | Persuasion', 'SOFT_SKILLS', 'SELF_PACED', 12, 3, 1, 0, 70, 'No prior experience needed', 'https://www.udemy.com/course/communication-skills-social-skills-people-skills/?couponCode=LETSLEARNNOW'],
    ['Agile Crash Course: Agile Project Management; Agile Delivery', 'Agile Project Management, Agile Delivery, Agile Principles, Agile Practices, Scrum, Kanban', 'PRODUCTIVITY', 'SELF_PACED', 6, 3, 1, 0, 55, 'Basic project knowledge', 'https://www.udemy.com/course/agile-crash-course/?couponCode=LETSLEARNNOW'],
    ['Workplace Safety and Health Compliance Training', 'Essential workplace safety protocols and compliance requirements', 'COMPLIANCE', 'SELF_PACED', 4, 3, 1, 1, 100, 'No prior experience needed', 'https://www.udemy.com/course/workplace-safety-training/?couponCode=LETSLEARNNOW'],
    ['Data Protection and Privacy Compliance (GDPR)', 'Understanding data protection laws and privacy compliance', 'COMPLIANCE', 'SELF_PACED', 6, 3, 1, 1, 80, 'Basic legal knowledge helpful', 'https://www.udemy.com/course/gdpr-data-protection/?couponCode=LETSLEARNNOW']
  ];

  courses.forEach(course => {
    db.run(`INSERT INTO courses (title, description, category, type, duration_hours, trainer_id, is_active, is_mandatory, max_participants, prerequisites, materials) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, course);
  });
}

module.exports = { db, initializeDatabase };
