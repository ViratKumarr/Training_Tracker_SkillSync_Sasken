package com.sasken.skillsync.config;

import com.sasken.skillsync.model.User;
import com.sasken.skillsync.model.Course;
import com.sasken.skillsync.model.Enrollment;
import com.sasken.skillsync.model.Progress;
import com.sasken.skillsync.model.Certificate;
import com.sasken.skillsync.model.Feedback;
import com.sasken.skillsync.repository.UserRepository;
import com.sasken.skillsync.repository.CourseRepository;
import com.sasken.skillsync.repository.EnrollmentRepository;
import com.sasken.skillsync.repository.ProgressRepository;
import com.sasken.skillsync.repository.CertificateRepository;
import com.sasken.skillsync.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private ProgressRepository progressRepository;

    @Autowired
    private CertificateRepository certificateRepository;

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Override
    public void run(String... args) throws Exception {
        // Check if users already exist
        if (userRepository.count() == 0) {
            // Create test users with plain text passwords (NoOpPasswordEncoder)
            User admin = new User();
            admin.setFirstName("Admin");
            admin.setLastName("User");
            admin.setEmail("admin@sasken.com");
            admin.setPassword("password123");
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
            manager.setPassword("password123");
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
            trainer.setPassword("password123");
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
            employee.setPassword("password123");
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
            System.out.println("Admin: admin@sasken.com / password123");
            System.out.println("Manager: manager@sasken.com / password123");
            System.out.println("Trainer: trainer@sasken.com / password123");
            System.out.println("Employee: employee@sasken.com / password123");

            // Create courses if they don't exist
            createCourses();

            // Create sample enrollments and progress
            createSampleEnrollmentsAndProgress();
        }
    }
