package com.sasken.skillsync.controller;

import com.sasken.skillsync.model.Enrollment;
import com.sasken.skillsync.model.User;
import com.sasken.skillsync.model.Course;
import com.sasken.skillsync.repository.EnrollmentRepository;
import com.sasken.skillsync.repository.UserRepository;
import com.sasken.skillsync.repository.CourseRepository;
import com.sasken.skillsync.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/enrollments")
@CrossOrigin(origins = "*")
public class EnrollmentController {

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('TRAINER')")
    public ResponseEntity<List<Enrollment>> getAllEnrollments() {
        List<Enrollment> enrollments = enrollmentRepository.findAll();
        return ResponseEntity.ok(enrollments);
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('TRAINER') or #userId == authentication.principal.id")
    public ResponseEntity<List<Enrollment>> getEnrollmentsByUser(@PathVariable Long userId) {
        List<Enrollment> enrollments = enrollmentRepository.findByUserId(userId);
        return ResponseEntity.ok(enrollments);
    }

    @GetMapping("/course/{courseId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('TRAINER')")
    public ResponseEntity<List<Enrollment>> getEnrollmentsByCourse(@PathVariable Long courseId) {
        List<Enrollment> enrollments = enrollmentRepository.findByCourseId(courseId);
        return ResponseEntity.ok(enrollments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Enrollment> getEnrollmentById(@PathVariable Long id) {
        Optional<Enrollment> enrollment = enrollmentRepository.findById(id);
        return enrollment.map(ResponseEntity::ok)
                        .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('TRAINER')")
    public ResponseEntity<Enrollment> createEnrollment(@RequestBody CreateEnrollmentRequest request) {
        Optional<User> user = userRepository.findById(request.getUserId());
        Optional<Course> course = courseRepository.findById(request.getCourseId());

        if (user.isEmpty() || course.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        // Check if enrollment already exists
        if (enrollmentRepository.existsByUserIdAndCourseId(request.getUserId(), request.getCourseId())) {
            return ResponseEntity.badRequest().build();
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setUser(user.get());
        enrollment.setCourse(course.get());
        enrollment.setType(request.getType());
        enrollment.setStatus(Enrollment.EnrollmentStatus.ENROLLED);
        enrollment.setEnrolledAt(LocalDateTime.now());

        Enrollment savedEnrollment = enrollmentRepository.save(enrollment);
        return ResponseEntity.ok(savedEnrollment);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('TRAINER')")
    public ResponseEntity<Enrollment> updateEnrollmentStatus(
            @PathVariable Long id,
            @RequestBody UpdateEnrollmentStatusRequest request) {
        
        return enrollmentRepository.findById(id).map(enrollment -> {
            enrollment.setStatus(request.getStatus());
            if (request.getStatus() == Enrollment.EnrollmentStatus.COMPLETED) {
                enrollment.setCompletedAt(LocalDateTime.now());
            }
            return ResponseEntity.ok(enrollmentRepository.save(enrollment));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<?> deleteEnrollment(@PathVariable Long id) {
        return enrollmentRepository.findById(id).map(enrollment -> {
            enrollmentRepository.delete(enrollment);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<EnrollmentStats> getEnrollmentStats() {
        long totalEnrollments = enrollmentRepository.count();
        long completedEnrollments = enrollmentRepository.countByStatus(Enrollment.EnrollmentStatus.COMPLETED);
        long inProgressEnrollments = enrollmentRepository.countByStatus(Enrollment.EnrollmentStatus.IN_PROGRESS);
        
        EnrollmentStats stats = new EnrollmentStats();
        stats.setTotalEnrollments(totalEnrollments);
        stats.setCompletedEnrollments(completedEnrollments);
        stats.setInProgressEnrollments(inProgressEnrollments);
        
        return ResponseEntity.ok(stats);
    }

    // DTO classes for requests
    public static class CreateEnrollmentRequest {
        private Long userId;
        private Long courseId;
        private Enrollment.EnrollmentType type;

        // Getters and setters
        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        public Long getCourseId() { return courseId; }
        public void setCourseId(Long courseId) { this.courseId = courseId; }
        public Enrollment.EnrollmentType getType() { return type; }
        public void setType(Enrollment.EnrollmentType type) { this.type = type; }
    }

    public static class UpdateEnrollmentStatusRequest {
        private Enrollment.EnrollmentStatus status;

        public Enrollment.EnrollmentStatus getStatus() { return status; }
        public void setStatus(Enrollment.EnrollmentStatus status) { this.status = status; }
    }

    public static class EnrollmentStats {
        private long totalEnrollments;
        private long completedEnrollments;
        private long inProgressEnrollments;

        // Getters and setters
        public long getTotalEnrollments() { return totalEnrollments; }
        public void setTotalEnrollments(long totalEnrollments) { this.totalEnrollments = totalEnrollments; }
        public long getCompletedEnrollments() { return completedEnrollments; }
        public void setCompletedEnrollments(long completedEnrollments) { this.completedEnrollments = completedEnrollments; }
        public long getInProgressEnrollments() { return inProgressEnrollments; }
        public void setInProgressEnrollments(long inProgressEnrollments) { this.inProgressEnrollments = inProgressEnrollments; }
    }
} 