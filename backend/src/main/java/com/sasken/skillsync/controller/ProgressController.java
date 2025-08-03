package com.sasken.skillsync.controller;

import com.sasken.skillsync.model.Progress;
import com.sasken.skillsync.model.User;
import com.sasken.skillsync.model.Course;
import com.sasken.skillsync.repository.ProgressRepository;
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
@RequestMapping("/progress")
@CrossOrigin(origins = "*")
public class ProgressController {

    @Autowired
    private ProgressRepository progressRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('TRAINER')")
    public ResponseEntity<List<Progress>> getAllProgress() {
        List<Progress> progressList = progressRepository.findAll();
        return ResponseEntity.ok(progressList);
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('TRAINER') or #userId == authentication.principal.id")
    public ResponseEntity<List<Progress>> getProgressByUser(@PathVariable Long userId) {
        List<Progress> progressList = progressRepository.findByUserId(userId);
        return ResponseEntity.ok(progressList);
    }

    @GetMapping("/course/{courseId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('TRAINER')")
    public ResponseEntity<List<Progress>> getProgressByCourse(@PathVariable Long courseId) {
        List<Progress> progressList = progressRepository.findByCourseId(courseId);
        return ResponseEntity.ok(progressList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Progress> getProgressById(@PathVariable Long id) {
        Optional<Progress> progress = progressRepository.findById(id);
        return progress.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('TRAINER')")
    public ResponseEntity<Progress> createProgress(@RequestBody CreateProgressRequest request) {
        Optional<User> user = userRepository.findById(request.getUserId());
        Optional<Course> course = courseRepository.findById(request.getCourseId());

        if (user.isEmpty() || course.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Progress progress = new Progress();
        progress.setUser(user.get());
        progress.setCourse(course.get());
        progress.setCompletionPercentage(request.getCompletionPercentage());
        progress.setTimeSpentMinutes(request.getTimeSpentMinutes());
        progress.setLastAccessedAt(LocalDateTime.now());
        progress.setCreatedAt(LocalDateTime.now());
        progress.setUpdatedAt(LocalDateTime.now());

        Progress savedProgress = progressRepository.save(progress);
        return ResponseEntity.ok(savedProgress);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('TRAINER')")
    public ResponseEntity<Progress> updateProgress(
            @PathVariable Long id,
            @RequestBody UpdateProgressRequest request) {
        
        return progressRepository.findById(id).map(progress -> {
            progress.setCompletionPercentage(request.getCompletionPercentage());
            progress.setTimeSpentMinutes(request.getTimeSpentMinutes());
            progress.setLastAccessedAt(LocalDateTime.now());
            progress.setUpdatedAt(LocalDateTime.now());
            
            if (request.getQuizScore() != null) {
                progress.setQuizScore(request.getQuizScore());
            }
            if (request.getMaxQuizScore() != null) {
                progress.setMaxQuizScore(request.getMaxQuizScore());
            }
            
            return ResponseEntity.ok(progressRepository.save(progress));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<?> deleteProgress(@PathVariable Long id) {
        return progressRepository.findById(id).map(progress -> {
            progressRepository.delete(progress);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/stats/user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('TRAINER') or #userId == authentication.principal.id")
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

    // DTO classes for requests
    public static class CreateProgressRequest {
        private Long userId;
        private Long courseId;
        private Double completionPercentage;
        private Integer timeSpentMinutes;

        // Getters and setters
        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        public Long getCourseId() { return courseId; }
        public void setCourseId(Long courseId) { this.courseId = courseId; }
        public Double getCompletionPercentage() { return completionPercentage; }
        public void setCompletionPercentage(Double completionPercentage) { this.completionPercentage = completionPercentage; }
        public Integer getTimeSpentMinutes() { return timeSpentMinutes; }
        public void setTimeSpentMinutes(Integer timeSpentMinutes) { this.timeSpentMinutes = timeSpentMinutes; }
    }

    public static class UpdateProgressRequest {
        private Double completionPercentage;
        private Integer timeSpentMinutes;
        private Double quizScore;
        private Double maxQuizScore;

        // Getters and setters
        public Double getCompletionPercentage() { return completionPercentage; }
        public void setCompletionPercentage(Double completionPercentage) { this.completionPercentage = completionPercentage; }
        public Integer getTimeSpentMinutes() { return timeSpentMinutes; }
        public void setTimeSpentMinutes(Integer timeSpentMinutes) { this.timeSpentMinutes = timeSpentMinutes; }
        public Double getQuizScore() { return quizScore; }
        public void setQuizScore(Double quizScore) { this.quizScore = quizScore; }
        public Double getMaxQuizScore() { return maxQuizScore; }
        public void setMaxQuizScore(Double maxQuizScore) { this.maxQuizScore = maxQuizScore; }
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
} 