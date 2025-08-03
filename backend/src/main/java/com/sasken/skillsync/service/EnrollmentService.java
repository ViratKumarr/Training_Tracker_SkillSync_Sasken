package com.sasken.skillsync.service;

import com.sasken.skillsync.model.Course;
import com.sasken.skillsync.model.Enrollment;
import com.sasken.skillsync.model.User;
import com.sasken.skillsync.repository.CourseRepository;
import com.sasken.skillsync.repository.EnrollmentRepository;
import com.sasken.skillsync.repository.UserRepository;
import com.sasken.skillsync.exception.ResourceNotFoundException;
import com.sasken.skillsync.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class EnrollmentService {

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private NotificationService notificationService;

    public List<Enrollment> getAllEnrollments() {
        return enrollmentRepository.findAll();
    }

    public List<Enrollment> getEnrollmentsByUser(Long userId) {
        return enrollmentRepository.findByUserId(userId);
    }

    public List<Enrollment> getEnrollmentsByCourse(Long courseId) {
        return enrollmentRepository.findByCourseId(courseId);
    }

    public List<Enrollment> getEnrollmentsByStatus(Enrollment.EnrollmentStatus status) {
        return enrollmentRepository.findByStatus(status);
    }

    public Optional<Enrollment> getEnrollmentById(Long id) {
        return enrollmentRepository.findById(id);
    }

    public Enrollment createEnrollment(Long userId, Long courseId, Enrollment.EnrollmentType type, String notes) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));

        // Check if user is already enrolled in this course
        Optional<Enrollment> existingEnrollment = enrollmentRepository.findByUserIdAndCourseId(userId, courseId);
        if (existingEnrollment.isPresent()) {
            throw new BadRequestException("User is already enrolled in this course");
        }

        // Check course capacity
        if (course.getMaxParticipants() != null) {
            long currentEnrollments = enrollmentRepository.countActiveByCourseId(courseId);
            if (currentEnrollments >= course.getMaxParticipants()) {
                throw new BadRequestException("Course has reached maximum capacity");
            }
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setUser(user);
        enrollment.setCourse(course);
        enrollment.setStatus(Enrollment.EnrollmentStatus.ENROLLED);
        enrollment.setType(type);
        enrollment.setEnrolledAt(LocalDateTime.now());
        enrollment.setCompletionPercentage(0.0);
        enrollment.setNotes(notes);

        Enrollment savedEnrollment = enrollmentRepository.save(enrollment);

        // Send notification
        notificationService.sendEnrollmentNotification(user, course, "enrolled");

        return savedEnrollment;
    }

    public Enrollment updateEnrollmentStatus(Long enrollmentId, Enrollment.EnrollmentStatus status) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found with id: " + enrollmentId));

        enrollment.setStatus(status);
        
        if (status == Enrollment.EnrollmentStatus.COMPLETED) {
            enrollment.setCompletionPercentage(100.0);
            enrollment.setCompletedAt(LocalDateTime.now());
            
            // Send completion notification
            notificationService.sendEnrollmentNotification(enrollment.getUser(), enrollment.getCourse(), "completed");
        }

        return enrollmentRepository.save(enrollment);
    }

    public Enrollment updateCompletionPercentage(Long enrollmentId, Double percentage) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found with id: " + enrollmentId));

        enrollment.setCompletionPercentage(percentage);
        
        if (percentage >= 100.0) {
            enrollment.setStatus(Enrollment.EnrollmentStatus.COMPLETED);
            enrollment.setCompletedAt(LocalDateTime.now());
        }

        return enrollmentRepository.save(enrollment);
    }

    public void deleteEnrollment(Long enrollmentId) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found with id: " + enrollmentId));

        enrollmentRepository.delete(enrollment);
    }

    public List<Enrollment> getOverdueEnrollments() {
        return enrollmentRepository.findOverdueEnrollments(LocalDateTime.now());
    }

    public List<Enrollment> getCompletedEnrollmentsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return enrollmentRepository.findCompletedEnrollmentsByDateRange(startDate, endDate);
    }

    public long getEnrollmentCountByCourse(Long courseId) {
        return enrollmentRepository.countActiveByCourseId(courseId);
    }

    public double getAverageCompletionPercentageByCourse(Long courseId) {
        return enrollmentRepository.getAverageCompletionPercentageByCourseId(courseId);
    }

    public List<Enrollment> getEnrollmentsByDepartment(String department) {
        return enrollmentRepository.findByUserDepartment(department);
    }

    public List<Enrollment> getMandatoryEnrollmentsByUser(Long userId) {
        return enrollmentRepository.findMandatoryEnrollmentsByUserId(userId);
    }

    public List<Enrollment> getOptionalEnrollmentsByUser(Long userId) {
        return enrollmentRepository.findOptionalEnrollmentsByUserId(userId);
    }
}
