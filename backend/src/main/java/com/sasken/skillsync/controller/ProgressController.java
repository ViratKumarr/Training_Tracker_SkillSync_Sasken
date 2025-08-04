package com.sasken.skillsync.controller;

import com.sasken.skillsync.model.*;
import com.sasken.skillsync.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/progress")
@CrossOrigin(origins = "http://localhost:3000")
public class ProgressController {

    @Autowired
    private ProgressRepository progressRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private CertificateRepository certificateRepository;

    @GetMapping
    public ResponseEntity<List<Progress>> getAllProgress() {
        List<Progress> progress = progressRepository.findAll();
        return ResponseEntity.ok(progress);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Progress>> getProgressByUser(@PathVariable Long userId) {
        List<Progress> progress = progressRepository.findByUserId(userId);
        return ResponseEntity.ok(progress);
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Progress>> getProgressByCourse(@PathVariable Long courseId) {
        List<Progress> progress = progressRepository.findByCourseId(courseId);
        return ResponseEntity.ok(progress);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Progress> getProgressById(@PathVariable Long id) {
        Optional<Progress> progress = progressRepository.findById(id);
        return progress.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/mark-completed")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('TRAINER') or hasRole('EMPLOYEE')")
    public ResponseEntity<?> markAsCompleted(@RequestBody MarkCompletedRequest request) {
        try {
            // Find the progress record
            Optional<Progress> progressOpt = progressRepository.findByUserIdAndCourseId(
                request.getUserId(), request.getCourseId());
            
            if (progressOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Progress record not found"));
            }

            Progress progress = progressOpt.get();
            
            // Update progress to completed
            progress.setCompletionPercentage(100.0);
            progress.setStatus(Progress.ProgressStatus.COMPLETED);
            progress.setCompletedAt(LocalDateTime.now());
            progress.setLastAccessedAt(LocalDateTime.now());
            progress.setUpdatedAt(LocalDateTime.now());
            
            // Calculate time spent based on course duration if not already set
            if (progress.getTimeSpentMinutes() == null || progress.getTimeSpentMinutes() == 0) {
                Course course = progress.getCourse();
                if (course != null && course.getDurationHours() != null) {
                    progress.setTimeSpentMinutes(course.getDurationHours() * 60);
                }
            }
            
            progressRepository.save(progress);

            // Update enrollment status
            Optional<Enrollment> enrollmentOpt = enrollmentRepository.findByUserIdAndCourseId(
                request.getUserId(), request.getCourseId());
            
            if (enrollmentOpt.isPresent()) {
                Enrollment enrollment = enrollmentOpt.get();
                enrollment.setStatus(Enrollment.EnrollmentStatus.COMPLETED);
                enrollment.setCompletionPercentage(100.0);
                enrollment.setCompletedAt(LocalDateTime.now());
                enrollment.setGrade("A");
                enrollmentRepository.save(enrollment);

                // Generate certificate if it doesn't exist
                if (certificateRepository.findByUserIdAndCourseId(request.getUserId(), request.getCourseId()).isEmpty()) {
                    Certificate certificate = new Certificate();
                    certificate.setUser(progress.getUser());
                    certificate.setCourse(progress.getCourse());
                    certificate.setCompletionPercentage(100.0);
                    certificate.setScore(95.0);
                    certificate.setMaxScore(100.0);
                    certificate.setGrade("A");
                    certificate.setCertificateNumber("CERT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
                    certificate.setIssuedBy("SkillSync - Sasken Technologies");
                    certificate.setStatus(Certificate.CertificateStatus.ISSUED);
                    certificate.setIssuedAt(LocalDateTime.now());
                    certificate.setCompletionDate(LocalDateTime.now());
                    certificate.setValidUntil(LocalDateTime.now().plusYears(2));
                    
                    certificateRepository.save(certificate);
                }
            }

            return ResponseEntity.ok(Map.of(
                "message", "Course marked as completed successfully",
                "progress", progress
            ));

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "Failed to mark course as completed: " + e.getMessage()
            ));
        }
    }

    @GetMapping("/stats/user/{userId}")
    public ResponseEntity<UserProgressStats> getUserProgressStats(@PathVariable Long userId) {
        List<Progress> userProgress = progressRepository.findByUserId(userId);
        
        double averageCompletion = userProgress.stream()
                .mapToDouble(Progress::getCompletionPercentage)
                .average()
                .orElse(0.0);
        
        long totalTimeSpent = userProgress.stream()
                .mapToLong(p -> p.getTimeSpentMinutes() != null ? p.getTimeSpentMinutes().longValue() : 0L)
                .sum();
        
        long completedCourses = userProgress.stream()
                .filter(p -> p.getCompletionPercentage() >= 100.0)
                .count();
        
        UserProgressStats stats = new UserProgressStats();
        stats.setTotalCourses(userProgress.size());
        stats.setCompletedCourses(completedCourses);
        stats.setAverageCompletion(averageCompletion);
        stats.setTotalTimeSpent(totalTimeSpent);
        
        return ResponseEntity.ok(stats);
    }

    // DTO classes
    public static class MarkCompletedRequest {
        private Long userId;
        private Long courseId;

        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        public Long getCourseId() { return courseId; }
        public void setCourseId(Long courseId) { this.courseId = courseId; }
    }

    public static class UserProgressStats {
        private long totalCourses;
        private long completedCourses;
        private double averageCompletion;
        private long totalTimeSpent;

        // Getters and setters
        public long getTotalCourses() { return totalCourses; }
        public void setTotalCourses(long totalCourses) { this.totalCourses = totalCourses; }
        public long getCompletedCourses() { return completedCourses; }
        public void setCompletedCourses(long completedCourses) { this.completedCourses = completedCourses; }
        public double getAverageCompletion() { return averageCompletion; }
        public void setAverageCompletion(double averageCompletion) { this.averageCompletion = averageCompletion; }
        public long getTotalTimeSpent() { return totalTimeSpent; }
        public void setTotalTimeSpent(long totalTimeSpent) { this.totalTimeSpent = totalTimeSpent; }
    }

    // Real-time progress update endpoint
    @PutMapping("/update-progress")
    public ResponseEntity<?> updateProgressPercentage(@RequestBody UpdateProgressRequest request) {
        try {
            // Find or create progress record
            Optional<Progress> existingProgress = progressRepository.findByUserIdAndCourseId(request.getUserId(), request.getCourseId());
            Progress progress;

            if (existingProgress.isPresent()) {
                progress = existingProgress.get();
            } else {
                // Create new progress record
                progress = new Progress();
                User user = userRepository.findById(request.getUserId()).orElse(null);
                Course course = courseRepository.findById(request.getCourseId()).orElse(null);

                if (user == null || course == null) {
                    return ResponseEntity.badRequest().body("User or Course not found");
                }

                progress.setUser(user);
                progress.setCourse(course);
                progress.setStartedAt(LocalDateTime.now());
                progress.setStatus(Progress.ProgressStatus.IN_PROGRESS);
            }

            // Update progress percentage
            progress.setCompletionPercentage(request.getCompletionPercentage());
            progress.setLastAccessedAt(LocalDateTime.now());

            // Calculate time spent based on percentage and course duration
            Course course = progress.getCourse();
            if (course != null && course.getDurationHours() != null) {
                int totalMinutes = course.getDurationHours() * 60;
                int timeSpentMinutes = (int) (totalMinutes * (request.getCompletionPercentage() / 100.0));
                progress.setTimeSpentMinutes(timeSpentMinutes);
            }

            // Update status based on completion percentage
            if (request.getCompletionPercentage() >= 100.0) {
                progress.setStatus(Progress.ProgressStatus.COMPLETED);
                progress.setCompletedAt(LocalDateTime.now());

                // Update enrollment status to completed
                Optional<Enrollment> enrollment = enrollmentRepository.findByUserIdAndCourseId(request.getUserId(), request.getCourseId());
                if (enrollment.isPresent()) {
                    Enrollment enr = enrollment.get();
                    enr.setStatus(Enrollment.EnrollmentStatus.COMPLETED);
                    enr.setCompletionPercentage(100.0);
                    enr.setCompletedAt(LocalDateTime.now());
                    enrollmentRepository.save(enr);
                }
            } else if (request.getCompletionPercentage() > 0) {
                progress.setStatus(Progress.ProgressStatus.IN_PROGRESS);

                // Update enrollment status to in progress
                Optional<Enrollment> enrollment = enrollmentRepository.findByUserIdAndCourseId(request.getUserId(), request.getCourseId());
                if (enrollment.isPresent()) {
                    Enrollment enr = enrollment.get();
                    enr.setStatus(Enrollment.EnrollmentStatus.IN_PROGRESS);
                    enr.setCompletionPercentage(request.getCompletionPercentage());
                    enrollmentRepository.save(enr);
                }
            }

            Progress savedProgress = progressRepository.save(progress);
            return ResponseEntity.ok(savedProgress);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating progress: " + e.getMessage());
        }
    }

    // Request class for progress updates
    public static class UpdateProgressRequest {
        private Long userId;
        private Long courseId;
        private Double completionPercentage;

        // Getters and setters
        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        public Long getCourseId() { return courseId; }
        public void setCourseId(Long courseId) { this.courseId = courseId; }
        public Double getCompletionPercentage() { return completionPercentage; }
        public void setCompletionPercentage(Double completionPercentage) { this.completionPercentage = completionPercentage; }
    }
}
