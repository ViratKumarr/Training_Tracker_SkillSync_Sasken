package com.sasken.skillsync.controller;

import com.sasken.skillsync.model.Enrollment;
import com.sasken.skillsync.repository.EnrollmentRepository;
import com.sasken.skillsync.repository.UserRepository;
import com.sasken.skillsync.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/enrollments")
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

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('TRAINER')")
    public ResponseEntity<Enrollment> getEnrollmentById(@PathVariable Long id) {
        Optional<Enrollment> enrollment = enrollmentRepository.findById(id);
        return enrollment.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
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

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<Enrollment> createEnrollment(@Valid @RequestBody CreateEnrollmentRequest request) {
        Enrollment enrollment = new Enrollment();
        enrollment.setUser(userRepository.findById(request.getUserId()).orElse(null));
        enrollment.setCourse(courseRepository.findById(request.getCourseId()).orElse(null));
        enrollment.setStatus(request.getStatus());
        enrollment.setType(request.getType());
        enrollment.setEnrolledAt(LocalDateTime.now());
        
        Enrollment savedEnrollment = enrollmentRepository.save(enrollment);
        return ResponseEntity.ok(savedEnrollment);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<Enrollment> updateEnrollment(@PathVariable Long id, @Valid @RequestBody UpdateEnrollmentRequest request) {
        Optional<Enrollment> enrollmentOpt = enrollmentRepository.findById(id);
        if (enrollmentOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Enrollment enrollment = enrollmentOpt.get();
        enrollment.setStatus(request.getStatus());
        enrollment.setCompletionPercentage(request.getCompletionPercentage());
        enrollment.setGrade(request.getGrade());
        enrollment.setNotes(request.getNotes());
        
        if (request.getStatus() == Enrollment.EnrollmentStatus.COMPLETED) {
            enrollment.setCompletedAt(LocalDateTime.now());
            enrollment.setCertificateEarned(true);
        }

        Enrollment savedEnrollment = enrollmentRepository.save(enrollment);
        return ResponseEntity.ok(savedEnrollment);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteEnrollment(@PathVariable Long id) {
        if (!enrollmentRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        enrollmentRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    public static class CreateEnrollmentRequest {
        private Long userId;
        private Long courseId;
        private Enrollment.EnrollmentStatus status;
        private Enrollment.EnrollmentType type;

        // Getters and setters
        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        public Long getCourseId() { return courseId; }
        public void setCourseId(Long courseId) { this.courseId = courseId; }
        public Enrollment.EnrollmentStatus getStatus() { return status; }
        public void setStatus(Enrollment.EnrollmentStatus status) { this.status = status; }
        public Enrollment.EnrollmentType getType() { return type; }
        public void setType(Enrollment.EnrollmentType type) { this.type = type; }
    }

    public static class UpdateEnrollmentRequest {
        private Enrollment.EnrollmentStatus status;
        private Double completionPercentage;
        private String grade;
        private String notes;

        // Getters and setters
        public Enrollment.EnrollmentStatus getStatus() { return status; }
        public void setStatus(Enrollment.EnrollmentStatus status) { this.status = status; }
        public Double getCompletionPercentage() { return completionPercentage; }
        public void setCompletionPercentage(Double completionPercentage) { this.completionPercentage = completionPercentage; }
        public String getGrade() { return grade; }
        public void setGrade(String grade) { this.grade = grade; }
        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
    }
}
