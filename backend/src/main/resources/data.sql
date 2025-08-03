-- Sample Users (password is 'admin123', 'manager123', 'trainer123', 'employee123' encoded with BCrypt)
INSERT INTO users (first_name, last_name, email, password, role, department, employee_id, phone_number, is_active, created_at, updated_at) VALUES
('Admin', 'User', 'admin@sasken.com', '$2a$10$.MzKaxWfTS2FNTnz8GmXOOwZt5qIduopR.F9k72ehHcWRUBldaFt2', 'ADMIN', 'IT', 'EMP001', '+1234567890', true, NOW(), NOW()),
('Manager', 'User', 'manager@sasken.com', '$2a$10$Of.oUxWiw/Jlq5mM5obm4OZKsPxQPCYvusSSJvaeCu44o30njNvPm', 'MANAGER', 'HR', 'EMP002', '+1234567891', true, NOW(), NOW()),
('Trainer', 'User', 'trainer@sasken.com', '$2a$10$maaKGFZ2mQGT24YAYMZ4UOWdg1h5OZNaeMQbmpd8FOOwqSkKhJYwW', 'TRAINER', 'Training', 'EMP003', '+1234567892', true, NOW(), NOW()),
('Employee', 'User', 'employee@sasken.com', '$2a$10$qxYj3CnDIT1HG5G3eNI4tu8tWExoBbL.XEopuVrh9K9F3Zcv02416', 'EMPLOYEE', 'Engineering', 'EMP004', '+1234567893', true, NOW(), NOW());

-- Sample Courses (15 total courses with valid Udemy links)
INSERT INTO courses (title, description, category, type, duration_hours, materials, prerequisites, is_active, is_mandatory, max_participants, trainer_id, created_at, updated_at) VALUES
('Java Programming Fundamentals', 'Learn core Java concepts and object-oriented programming', 'TECHNICAL', 'VIRTUAL', 40, 'https://www.udemy.com/course/java-programming-tutorial-for-beginners/', 'Basic computer knowledge', true, true, 50, 3, NOW(), NOW()),
('Spring Boot Development', 'Master Spring Boot framework for building web applications', 'TECHNICAL', 'HYBRID', 60, 'https://www.udemy.com/course/spring-boot-tutorial-for-beginners/', 'Java Programming Fundamentals', true, true, 30, 3, NOW(), NOW()),
('React.js for Beginners', 'Learn React.js for building modern web applications', 'TECHNICAL', 'SELF_PACED', 35, 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/', 'JavaScript basics', true, false, 40, 3, NOW(), NOW()),
('Leadership Skills', 'Develop essential leadership and management skills', 'LEADERSHIP', 'IN_PERSON', 20, 'Internal materials', 'None', true, false, 25, 2, NOW(), NOW()),
('Cybersecurity Awareness', 'Learn about cybersecurity best practices', 'COMPLIANCE', 'VIRTUAL', 15, 'https://www.udemy.com/course/cybersecurity-awareness-training/', 'None', true, true, 100, 3, NOW(), NOW()),
('JavaScript Advanced Concepts', 'Advanced JavaScript programming and ES6+ features', 'TECHNICAL', 'SELF_PACED', 45, 'https://www.udemy.com/course/javascript-the-complete-guide-2020-beginner-advanced/', 'Basic JavaScript knowledge', true, false, 35, 3, NOW(), NOW()),
('Python for Data Science', 'Learn Python programming for data analysis and visualization', 'TECHNICAL', 'HYBRID', 50, 'https://www.udemy.com/course/python-for-data-science-and-machine-learning-bootcamp/', 'Basic programming concepts', true, false, 30, 3, NOW(), NOW()),
('Agile Project Management', 'Master Agile methodologies and project management', 'LEADERSHIP', 'VIRTUAL', 25, 'https://www.udemy.com/course/agile-project-management-scrum-master-certification/', 'None', true, false, 40, 2, NOW(), NOW()),
('Node.js Backend Development', 'Build scalable backend applications with Node.js', 'TECHNICAL', 'SELF_PACED', 40, 'https://www.udemy.com/course/nodejs-the-complete-guide/', 'JavaScript basics', true, false, 35, 3, NOW(), NOW()),
('AWS Cloud Practitioner', 'Learn AWS cloud fundamentals and services', 'TECHNICAL', 'VIRTUAL', 30, 'https://www.udemy.com/course/aws-certified-cloud-practitioner-new/', 'Basic IT knowledge', true, false, 50, 3, NOW(), NOW()),
('Docker and Kubernetes', 'Containerization and orchestration with Docker and K8s', 'TECHNICAL', 'HYBRID', 35, 'https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/', 'Basic Linux knowledge', true, false, 30, 3, NOW(), NOW()),
('Machine Learning Basics', 'Introduction to machine learning algorithms', 'TECHNICAL', 'SELF_PACED', 55, 'https://www.udemy.com/course/machinelearning/', 'Python basics, Mathematics', true, false, 25, 3, NOW(), NOW()),
('Communication Skills', 'Improve workplace communication and presentation skills', 'SOFT_SKILLS', 'VIRTUAL', 20, 'https://www.udemy.com/course/communication-skills-masterclass/', 'None', true, false, 40, 2, NOW(), NOW()),
('Time Management', 'Master productivity and time management techniques', 'PRODUCTIVITY', 'SELF_PACED', 15, 'https://www.udemy.com/course/time-management-mastery-do-more-in-less-time/', 'None', true, false, 60, 2, NOW(), NOW()),
('DevOps Fundamentals', 'Learn DevOps practices and tools', 'TECHNICAL', 'HYBRID', 45, 'https://www.udemy.com/course/devops-fundamentals/', 'Basic IT knowledge', true, false, 35, 3, NOW(), NOW());

-- Sample Enrollments (4 enrollments: 2 completed, 2 in progress)
INSERT INTO enrollments (user_id, course_id, status, type, enrolled_at, completion_percentage, grade, certificate_earned, notes) VALUES
(4, 1, 'COMPLETED', 'MANDATORY', DATEADD('DAY', -45, NOW()), 100.0, 'A+', true, 'Completed successfully'),
(4, 2, 'COMPLETED', 'MANDATORY', DATEADD('DAY', -30, NOW()), 100.0, 'A', true, 'Required for role'),
(4, 3, 'IN_PROGRESS', 'OPTIONAL', DATEADD('DAY', -15, NOW()), 65.0, NULL, false, 'Career development'),
(4, 4, 'IN_PROGRESS', 'MANDATORY', DATEADD('DAY', -10, NOW()), 45.0, NULL, false, 'Compliance requirement'),
(3, 1, 'COMPLETED', 'MANDATORY', DATEADD('DAY', -30, NOW()), 100.0, 'A+', true, 'Completed successfully'),
(3, 2, 'IN_PROGRESS', 'MANDATORY', DATEADD('DAY', -15, NOW()), 65.0, NULL, false, 'Making good progress'),
(2, 5, 'COMPLETED', 'MANDATORY', DATEADD('DAY', -45, NOW()), 100.0, 'A', true, 'Compliance training completed'),
(1, 6, 'ENROLLED', 'OPTIONAL', DATEADD('DAY', -5, NOW()), 25.0, NULL, false, 'Learning advanced concepts');

-- Sample Progress Records (4 courses: 2 completed, 2 in progress)
DELETE FROM progress WHERE user_id=4;

INSERT INTO progress (user_id, course_id, status, completion_percentage, time_spent_minutes, quiz_score, max_quiz_score, started_at, last_accessed_at, created_at, updated_at, notes) VALUES
(4, 1, 'COMPLETED', 100.0, 2400, 95.0, 100.0, NOW(), NOW(), NOW(), NOW(), 'Course 1 completed'),
(4, 2, 'COMPLETED', 100.0, 1800, 90.0, 100.0, NOW(), NOW(), NOW(), NOW(), 'Course 2 completed'),
(4, 3, 'IN_PROGRESS', 40.0, 600, 80.0, 100.0, NOW(), NOW(), NOW(), NOW(), 'Course 3 in progress'),
(4, 4, 'IN_PROGRESS', 30.0, 500, 70.0, 100.0, NOW(), NOW(), NOW(), NOW(), 'Course 4 in progress'),
(4, 5, 'IN_PROGRESS', 20.0, 400, 60.0, 100.0, NOW(), NOW(), NOW(), NOW(), 'Course 5 in progress'),
(4, 6, 'IN_PROGRESS', 10.0, 300, 50.0, 100.0, NOW(), NOW(), NOW(), NOW(), 'Course 6 in progress'),
(4, 7, 'IN_PROGRESS', 30.0, 300, 50.0, 100.0, NOW(), NOW(), NOW(), NOW(), 'Course 7 in progress'),
(4, 8, 'IN_PROGRESS', 20.0, 300, 50.0, 100.0, NOW(), NOW(), NOW(), NOW(), 'Course 8 in progress'),
(4, 9, 'IN_PROGRESS', 10.0, 300, 50.0, 100.0, NOW(), NOW(), NOW(), NOW(), 'Course 9 in progress'),
(4, 10, 'IN_PROGRESS', 30.0, 300, 50.0, 100.0, NOW(), NOW(), NOW(), NOW(), 'Course 10 in progress'),
(4, 11, 'IN_PROGRESS', 20.0, 300, 50.0, 100.0, NOW(), NOW(), NOW(), NOW(), 'Course 11 in progress'),
(4, 12, 'IN_PROGRESS', 10.0, 300, 50.0, 100.0, NOW(), NOW(), NOW(), NOW(), 'Course 12 in progress'),
(4, 13, 'IN_PROGRESS', 30.0, 300, 50.0, 100.0, NOW(), NOW(), NOW(), NOW(), 'Course 13 in progress'),
(4, 14, 'IN_PROGRESS', 20.0, 300, 50.0, 100.0, NOW(), NOW(), NOW(), NOW(), 'Course 14 in progress'),
(4, 15, 'IN_PROGRESS', 10.0, 305, 50.0, 100.0, NOW(), NOW(), NOW(), NOW(), 'Course 15 in progress');

-- Sample Certificates (2 completed courses with certificates)
INSERT INTO certificates (user_id, course_id, certificate_number, grade, score, max_score, completion_percentage, issued_by, status, issued_at, completion_date, notes) VALUES
(4, 1, 'CERT-2024-001', 'A+', 95.0, 100.0, 100.0, 'SkillSync Training', 'ISSUED', DATEADD('DAY', -5, NOW()), DATEADD('DAY', -5, NOW()), 'Excellent performance in Java fundamentals'),
(4, 2, 'CERT-2024-002', 'A', 88.0, 100.0, 100.0, 'SkillSync Training', 'ISSUED', DATEADD('DAY', -3, NOW()), DATEADD('DAY', -3, NOW()), 'Successfully completed Spring Boot development'),
(3, 1, 'CERT-2024-003', 'A+', 95.0, 100.0, 100.0, 'SkillSync Training', 'ISSUED', DATEADD('DAY', -5, NOW()), DATEADD('DAY', -5, NOW()), 'Excellent performance in Java fundamentals'),
(2, 5, 'CERT-2024-004', 'A', 88.0, 100.0, 100.0, 'SkillSync Training', 'ISSUED', DATEADD('DAY', -10, NOW()), DATEADD('DAY', -10, NOW()), 'Successfully completed cybersecurity training');

-- Sample Sessions
INSERT INTO sessions (course_id, title, description, type, start_time, end_time, location, meeting_link, max_capacity, is_active, created_at, updated_at) VALUES
(1, 'Java Basics - Session 1', 'Introduction to Java programming basics', 'LECTURE', DATEADD('DAY', 2, NOW()), DATEADD('DAY', 2, DATEADD('HOUR', 2, NOW())), 'Virtual Classroom', 'https://meet.google.com/abc-defg-hij', 50, true, NOW(), NOW()),
(2, 'Spring Boot Workshop', 'Hands-on Spring Boot development', 'WORKSHOP', DATEADD('DAY', 5, NOW()), DATEADD('DAY', 5, DATEADD('HOUR', 4, NOW())), 'Training Room A', 'https://meet.google.com/xyz-uvw-rst', 30, true, NOW(), NOW()),
(4, 'Leadership Workshop', 'Interactive leadership development session', 'WORKSHOP', DATEADD('DAY', 7, NOW()), DATEADD('DAY', 7, DATEADD('HOUR', 3, NOW())), 'Conference Room B', NULL, 25, true, NOW(), NOW());

-- Sample Feedback
INSERT INTO feedback (user_id, course_id, rating, overall_satisfaction, instructor_rating, content_rating, facility_rating, would_recommend, comments, suggestions, status, submitted_at, reviewed_at, reviewed_by) VALUES
(4, 1, 5, 5, 5, 5, 5, true, 'Excellent course! Very comprehensive and well-structured.', 'More hands-on exercises would be helpful.', 'APPROVED', DATEADD('DAY', -5, NOW()), DATEADD('DAY', -3, NOW()), 'admin@sasken.com'),
(4, 2, 4, 4, 4, 4, 4, true, 'Good Spring Boot course with practical examples.', 'Include more real-world projects.', 'APPROVED', DATEADD('DAY', -3, NOW()), DATEADD('DAY', -1, NOW()), 'admin@sasken.com'),
(2, 5, 4, 4, 4, 4, 4, true, 'Good cybersecurity awareness training.', 'Include more real-world examples.', 'APPROVED', DATEADD('DAY', -10, NOW()), DATEADD('DAY', -8, NOW()), 'admin@sasken.com'),
(3, 1, 5, 5, 5, 5, 5, true, 'Outstanding Java course with excellent instructor.', 'Perfect balance of theory and practice.', 'APPROVED', DATEADD('DAY', -5, NOW()), DATEADD('DAY', -3, NOW()), 'admin@sasken.com');

-- Sample Notifications
INSERT INTO notifications (user_id, title, message, type, priority, status, sent_at, is_read, related_entity_type, related_entity_id) VALUES
(4, 'Course Reminder', 'Your React.js course continues tomorrow', 'COURSE_REMINDER', 'MEDIUM', 'SENT', DATEADD('DAY', -1, NOW()), false, 'COURSE', 3),
(4, 'Certificate Issued', 'Your Java Programming certificate has been issued', 'CERTIFICATE_ISSUED', 'HIGH', 'SENT', DATEADD('DAY', -5, NOW()), true, 'CERTIFICATE', 1),
(4, 'Certificate Issued', 'Your Spring Boot Development certificate has been issued', 'CERTIFICATE_ISSUED', 'HIGH', 'SENT', DATEADD('DAY', -3, NOW()), true, 'CERTIFICATE', 2),
(2, 'Compliance Training Due', 'Cybersecurity training must be completed within 30 days', 'COURSE_REMINDER', 'URGENT', 'SENT', DATEADD('DAY', -3, NOW()), false, 'COURSE', 5),
(1, 'New Course Available', 'JavaScript Advanced Concepts is now available for enrollment', 'COURSE_ASSIGNMENT', 'MEDIUM', 'SENT', DATEADD('DAY', -7, NOW()), true, 'COURSE', 6);

-- Sample Attendance
INSERT INTO attendance (user_id, session_id, status, check_in_time, check_out_time, duration_minutes, notes) VALUES
(4, 1, 'PRESENT', DATEADD('DAY', -1, NOW()), DATEADD('DAY', -1, DATEADD('HOUR', 2, NOW())), 120, 'Active participation'),
(3, 1, 'PRESENT', DATEADD('DAY', -1, NOW()), DATEADD('DAY', -1, DATEADD('HOUR', 2, NOW())), 120, 'Good engagement'),
(2, 3, 'PRESENT', DATEADD('DAY', -3, NOW()), DATEADD('DAY', -3, DATEADD('HOUR', 3, NOW())), 180, 'Excellent participation'); 