package com.sasken.skillsync.config;

import com.sasken.skillsync.model.User;
import com.sasken.skillsync.model.Course;
import com.sasken.skillsync.repository.UserRepository;
import com.sasken.skillsync.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        System.out.println("DataInitializer: Starting data initialization...");

        // Check if users already exist
        long userCount = userRepository.count();
        System.out.println("DataInitializer: Found " + userCount + " users in database");

        if (userCount == 0) {
            System.out.println("DataInitializer: Creating users and courses...");
            // Create test users with plain text passwords (NoOpPasswordEncoder)
            User admin = new User();
            admin.setFirstName("Admin");
            admin.setLastName("User");
            admin.setEmail("admin@sasken.com");
            admin.setPassword("admin123");
            admin.setRole(User.UserRole.ADMIN);
            admin.setDepartment("IT");
            admin.setEmployeeId("EMP001");
            admin.setPhoneNumber("+1234567890");
            admin.setActive(true);
            admin.setCreatedAt(LocalDateTime.now());
            admin.setUpdatedAt(LocalDateTime.now());
            userRepository.save(admin);

            User manager = new User();
            manager.setFirstName("Manager");
            manager.setLastName("User");
            manager.setEmail("manager@sasken.com");
            manager.setPassword("manager123");
            manager.setRole(User.UserRole.MANAGER);
            manager.setDepartment("HR");
            manager.setEmployeeId("EMP002");
            manager.setPhoneNumber("+1234567891");
            manager.setActive(true);
            manager.setCreatedAt(LocalDateTime.now());
            manager.setUpdatedAt(LocalDateTime.now());
            userRepository.save(manager);

            User trainer = new User();
            trainer.setFirstName("Trainer");
            trainer.setLastName("User");
            trainer.setEmail("trainer@sasken.com");
            trainer.setPassword("trainer123");
            trainer.setRole(User.UserRole.TRAINER);
            trainer.setDepartment("Training");
            trainer.setEmployeeId("EMP003");
            trainer.setPhoneNumber("+1234567892");
            trainer.setActive(true);
            trainer.setCreatedAt(LocalDateTime.now());
            trainer.setUpdatedAt(LocalDateTime.now());
            userRepository.save(trainer);

            User employee = new User();
            employee.setFirstName("Employee");
            employee.setLastName("User");
            employee.setEmail("employee@sasken.com");
            employee.setPassword("employee123");
            employee.setRole(User.UserRole.EMPLOYEE);
            employee.setDepartment("Engineering");
            employee.setEmployeeId("EMP004");
            employee.setPhoneNumber("+1234567893");
            employee.setActive(true);
            employee.setCreatedAt(LocalDateTime.now());
            employee.setUpdatedAt(LocalDateTime.now());
            userRepository.save(employee);

            System.out.println("✅ Test users created successfully!");
            System.out.println("Login credentials:");
            System.out.println("Admin: admin@sasken.com / admin123");
            System.out.println("Manager: manager@sasken.com / manager123");
            System.out.println("Trainer: trainer@sasken.com / trainer123");
            System.out.println("Employee: employee@sasken.com / employee123");

            // Create 15 courses for enrollment
            createCourses();
        } else {
            System.out.println("DataInitializer: Users already exist, checking courses...");
            // Always check for courses separately (in case users exist but courses don't)
            createCourses();
        }
    }

    private void createCourses() {
        long courseCount = courseRepository.count();
        System.out.println("DataInitializer: Found " + courseCount + " courses in database");

        if (courseCount == 0) {
            System.out.println("🔄 Creating 15 courses...");
            // Get trainer user for courses
            System.out.println("DataInitializer: Looking for trainer user...");
            User trainer = userRepository.findByEmail("trainer@sasken.com").orElse(null);
            System.out.println("DataInitializer: Trainer found: " + (trainer != null));

            if (trainer == null) {
                System.out.println("❌ Trainer user not found! Cannot create courses.");
                return;
            }

            // Course 1 - Java Masterclass 2025
            Course course1 = new Course();
            course1.setTitle("Java Masterclass 2025: 130+ Hours of Expert Lessons");
            course1.setDescription("Complete Java programming course from beginner to expert with 130+ hours of content");
            course1.setDurationHours(130);
            course1.setCategory(Course.CourseCategory.TECHNICAL);
            course1.setType(Course.CourseType.VIRTUAL);
            course1.setTrainer(trainer);
            course1.setMaxParticipants(50);
            course1.setActive(true);
            course1.setMaterials("https://www.udemy.com/course/java-the-complete-java-developer-course/?couponCode=LETSLEARNNOW");
            course1.setCreatedAt(LocalDateTime.now());
            course1.setUpdatedAt(LocalDateTime.now());
            courseRepository.save(course1);
            System.out.println("✅ Created course 1: " + course1.getTitle());

            // Course 2 - Learn JAVA Programming
            Course course2 = new Course();
            course2.setTitle("Learn JAVA Programming - Beginner to Master");
            course2.setDescription("Master Java programming from basics to advanced concepts with practical examples");
            course2.setDurationHours(80);
            course2.setCategory(Course.CourseCategory.TECHNICAL);
            course2.setType(Course.CourseType.VIRTUAL);
            course2.setTrainer(trainer);
            course2.setMaxParticipants(40);
            course2.setActive(true);
            course2.setMaterials("https://www.udemy.com/course/java-se-programming/?couponCode=LETSLEARNNOW");
            course2.setCreatedAt(LocalDateTime.now());
            course2.setUpdatedAt(LocalDateTime.now());
            courseRepository.save(course2);
            System.out.println("✅ Created course 2: " + course2.getTitle());

            // Course 3 - Java Spring Framework 6
            Course course3 = new Course();
            course3.setTitle("Java Spring Framework 6, Spring Boot 3, Spring AI Telusko");
            course3.setDescription("Learn the latest Spring Framework 6 and Spring Boot 3 with Spring AI integration");
            course3.setDurationHours(60);
            course3.setCategory(Course.CourseCategory.TECHNICAL);
            course3.setType(Course.CourseType.VIRTUAL);
            course3.setTrainer(trainer);
            course3.setMaxParticipants(35);
            course3.setActive(true);
            course3.setMaterials("https://www.udemy.com/course/spring-5-with-spring-boot-2/?couponCode=KEEPLEARNING");
            course3.setCreatedAt(LocalDateTime.now());
            course3.setUpdatedAt(LocalDateTime.now());
            courseRepository.save(course3);
            System.out.println("✅ Created course 3: " + course3.getTitle());

            // Course 4 - Spring Boot 3 & Hibernate
            Course course4 = new Course();
            course4.setTitle("[NEW] Spring Boot 3, Spring 6 & Hibernate for Beginners");
            course4.setDescription("Complete guide to Spring Boot 3, Spring 6, and Hibernate for beginners");
            course4.setDurationHours(45);
            course4.setCategory(Course.CourseCategory.TECHNICAL);
            course4.setType(Course.CourseType.VIRTUAL);
            course4.setTrainer(trainer);
            course4.setMaxParticipants(30);
            course4.setActive(true);
            course4.setMaterials("https://www.udemy.com/course/spring-hibernate-tutorial/?couponCode=LETSLEARNNOW");
            course4.setCreatedAt(LocalDateTime.now());
            course4.setUpdatedAt(LocalDateTime.now());
            courseRepository.save(course4);
            System.out.println("✅ Created course 4: " + course4.getTitle());

            // Course 5 - React Complete Guide 2025
            Course course5 = new Course();
            course5.setTitle("React - The Complete Guide 2025 (incl. Next.js, Redux)");
            course5.setDescription("Master React with Next.js, Redux, and modern development practices");
            course5.setDurationHours(70);
            course5.setCategory(Course.CourseCategory.TECHNICAL);
            course5.setType(Course.CourseType.VIRTUAL);
            course5.setTrainer(trainer);
            course5.setMaxParticipants(40);
            course5.setActive(true);
            course5.setMaterials("https://www.udemy.com/course/react-the-complete-guide-incl-redux/?couponCode=LETSLEARNNOW");
            course5.setCreatedAt(LocalDateTime.now());
            course5.setUpdatedAt(LocalDateTime.now());
            courseRepository.save(course5);
            System.out.println("✅ Created course 5: " + course5.getTitle());

            // Course 6 - Ultimate React Course 2025
            Course course6 = new Course();
            course6.setTitle("The Ultimate React Course 2025: React, Next.js, Redux & More");
            course6.setDescription("Complete React course with Next.js, Redux, and modern React patterns");
            course6.setDurationHours(65);
            course6.setCategory(Course.CourseCategory.TECHNICAL);
            course6.setType(Course.CourseType.VIRTUAL);
            course6.setTrainer(trainer);
            course6.setMaxParticipants(35);
            course6.setActive(true);
            course6.setMaterials("https://www.udemy.com/course/the-ultimate-react-course/?couponCode=LETSLEARNNOW");
            course6.setCreatedAt(LocalDateTime.now());
            course6.setUpdatedAt(LocalDateTime.now());
            courseRepository.save(course6);
            System.out.println("✅ Created course 6: " + course6.getTitle());

            // Course 7 - Complete Full-Stack Web Development
            Course course7 = new Course();
            course7.setTitle("The Complete Full-Stack Web Development Bootcamp");
            course7.setDescription("Learn full-stack web development from frontend to backend with modern technologies");
            course7.setDurationHours(100);
            course7.setCategory(Course.CourseCategory.TECHNICAL);
            course7.setType(Course.CourseType.VIRTUAL);
            course7.setTrainer(trainer);
            course7.setMaxParticipants(30);
            course7.setActive(true);
            course7.setMaterials("https://www.udemy.com/course/the-complete-web-development-bootcamp/?couponCode=KEEPLEARNING");
            course7.setCreatedAt(LocalDateTime.now());
            course7.setUpdatedAt(LocalDateTime.now());
            courseRepository.save(course7);
            System.out.println("✅ Created course 7: " + course7.getTitle());

            // Course 8 - Ultimate MySQL Bootcamp
            Course course8 = new Course();
            course8.setTitle("The Ultimate MySQL Bootcamp: Go from SQL Beginner to Expert");
            course8.setDescription("Master MySQL and SQL from beginner to expert level with practical projects");
            course8.setDurationHours(55);
            course8.setCategory(Course.CourseCategory.TECHNICAL);
            course8.setType(Course.CourseType.VIRTUAL);
            course8.setTrainer(trainer);
            course8.setMaxParticipants(40);
            course8.setActive(true);
            course8.setMaterials("https://www.udemy.com/course/the-ultimate-mysql-bootcamp-go-from-sql-beginner-to-expert/?couponCode=KEEPLEARNING");
            course8.setCreatedAt(LocalDateTime.now());
            course8.setUpdatedAt(LocalDateTime.now());
            courseRepository.save(course8);
            System.out.println("✅ Created course 8: " + course8.getTitle());

            // Course 9 - SQL MySQL for Data Analytics
            Course course9 = new Course();
            course9.setTitle("SQL - MySQL for Data Analytics and Business Intelligence");
            course9.setDescription("Learn SQL and MySQL for data analytics and business intelligence applications");
            course9.setDurationHours(40);
            course9.setCategory(Course.CourseCategory.TECHNICAL);
            course9.setType(Course.CourseType.VIRTUAL);
            course9.setTrainer(trainer);
            course9.setMaxParticipants(35);
            course9.setActive(true);
            course9.setMaterials("https://www.udemy.com/course/sql-mysql-for-data-analytics-and-business-intelligence/?couponCode=KEEPLEARNING");
            course9.setCreatedAt(LocalDateTime.now());
            course9.setUpdatedAt(LocalDateTime.now());
            courseRepository.save(course9);
            System.out.println("✅ Created course 9: " + course9.getTitle());

            // Course 10 - The Complete Full-Stack Web Development Bootcamp (Second instance)
            Course course10 = new Course();
            course10.setTitle("The Complete Full-Stack Web Development Bootcamp");
            course10.setDescription("Comprehensive full-stack web development course covering frontend and backend technologies");
            course10.setDurationHours(95);
            course10.setCategory(Course.CourseCategory.TECHNICAL);
            course10.setType(Course.CourseType.VIRTUAL);
            course10.setTrainer(trainer);
            course10.setMaxParticipants(30);
            course10.setActive(true);
            course10.setMaterials("https://www.udemy.com/course/the-complete-web-development-bootcamp/?couponCode=LETSLEARNNOW");
            course10.setCreatedAt(LocalDateTime.now());
            course10.setUpdatedAt(LocalDateTime.now());
            courseRepository.save(course10);
            System.out.println("✅ Created course 10: " + course10.getTitle());

            // Course 11 - 100 Days of Code Python
            Course course11 = new Course();
            course11.setTitle("100 Days of Code: The Complete Python Pro Bootcamp");
            course11.setDescription("Master Python programming with 100 days of coding challenges and projects");
            course11.setDurationHours(120);
            course11.setCategory(Course.CourseCategory.TECHNICAL);
            course11.setType(Course.CourseType.VIRTUAL);
            course11.setTrainer(trainer);
            course11.setMaxParticipants(50);
            course11.setActive(true);
            course11.setMaterials("https://www.udemy.com/course/100-days-of-code/?couponCode=LETSLEARNNOW");
            course11.setCreatedAt(LocalDateTime.now());
            course11.setUpdatedAt(LocalDateTime.now());
            courseRepository.save(course11);
            System.out.println("✅ Created course 11: " + course11.getTitle());

            // Course 12 - Ultimate AWS Certified Cloud Practitioner
            Course course12 = new Course();
            course12.setTitle("[NEW] Ultimate AWS Certified Cloud Practitioner CLF-C02 2025");
            course12.setDescription("Complete AWS Cloud Practitioner certification course with latest CLF-C02 exam content");
            course12.setDurationHours(50);
            course12.setCategory(Course.CourseCategory.TECHNICAL);
            course12.setType(Course.CourseType.VIRTUAL);
            course12.setTrainer(trainer);
            course12.setMaxParticipants(30);
            course12.setActive(true);
            course12.setMaterials("https://www.udemy.com/course/aws-certified-cloud-practitioner-new/?couponCode=KEEPLEARNING");
            course12.setCreatedAt(LocalDateTime.now());
            course12.setUpdatedAt(LocalDateTime.now());
            courseRepository.save(course12);
            System.out.println("✅ Created course 12: " + course12.getTitle());

            // Course 13 - Build Responsive Websites HTML CSS
            Course course13 = new Course();
            course13.setTitle("Build Responsive Real-World Websites with HTML and CSS");
            course13.setDescription("Learn to build beautiful, responsive websites using modern HTML5 and CSS3");
            course13.setDurationHours(35);
            course13.setCategory(Course.CourseCategory.TECHNICAL);
            course13.setType(Course.CourseType.VIRTUAL);
            course13.setTrainer(trainer);
            course13.setMaxParticipants(40);
            course13.setActive(true);
            course13.setMaterials("https://www.udemy.com/course/design-and-develop-a-killer-website-with-html5-and-css3/?couponCode=LETSLEARNNOW");
            course13.setCreatedAt(LocalDateTime.now());
            course13.setUpdatedAt(LocalDateTime.now());
            courseRepository.save(course13);
            System.out.println("✅ Created course 13: " + course13.getTitle());

            // Course 14 - C Programming For Beginners
            Course course14 = new Course();
            course14.setTitle("C Programming For Beginners - Master the C Language");
            course14.setDescription("Complete C programming course from basics to advanced concepts");
            course14.setDurationHours(30);
            course14.setCategory(Course.CourseCategory.TECHNICAL);
            course14.setType(Course.CourseType.VIRTUAL);
            course14.setTrainer(trainer);
            course14.setMaxParticipants(35);
            course14.setActive(true);
            course14.setMaterials("https://www.udemy.com/course/c-programming-for-beginners-/?couponCode=KEEPLEARNING");
            course14.setCreatedAt(LocalDateTime.now());
            course14.setUpdatedAt(LocalDateTime.now());
            courseRepository.save(course14);
            System.out.println("✅ Created course 14: " + course14.getTitle());

            // Course 15 - Python Data Structures & Algorithms
            Course course15 = new Course();
            course15.setTitle("Python Data Structures & Algorithms + LEETCODE Exercises");
            course15.setDescription("Master data structures and algorithms in Python with LeetCode practice problems");
            course15.setDurationHours(60);
            course15.setCategory(Course.CourseCategory.TECHNICAL);
            course15.setType(Course.CourseType.VIRTUAL);
            course15.setTrainer(trainer);
            course15.setMaxParticipants(25);
            course15.setActive(true);
            course15.setMaterials("https://www.udemy.com/course/data-structures-algorithms-python/?couponCode=KEEPLEARNING");
            course15.setCreatedAt(LocalDateTime.now());
            course15.setUpdatedAt(LocalDateTime.now());
            courseRepository.save(course15);
            System.out.println("✅ Created course 15: " + course15.getTitle());

            // Verify total count
            long totalCourses = courseRepository.count();
            System.out.println("🎯 Total courses in database: " + totalCourses);
            System.out.println("✅ All 15 courses created successfully!");
        }
    }
}
