package com.sasken.skillsync.service;

import com.sasken.skillsync.model.Course;
import com.sasken.skillsync.model.Progress;
import com.sasken.skillsync.model.User;
import com.sasken.skillsync.repository.CourseRepository;
import com.sasken.skillsync.repository.ProgressRepository;
import com.sasken.skillsync.repository.UserRepository;
import com.sasken.skillsync.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProgressService {

    @Autowired
    private ProgressRepository progressRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private EnrollmentService enrollmentService;

    public List<Progress> getAllProgress() {
        return progressRepository.findAll();
    }

    public List<Progress> getProgressByUser(Long userId) {
        return progressRepository.findByUserId(userId);
    }

    public List<Progress> getProgressByCourse(Long courseId) {
        return progressRepository.findByCourseId(courseId);
    }

    public Optional<Progress> getProgressByUserAndCourse(Long userId, Long courseId) {
        return progressRepository.findByUserIdAndCourseId(userId, courseId);
    }

    public Optional<Progress> getProgressById(Long id) {
        return progressRepository.findById(id);
    }

    public Progress createOrUpdateProgress(Long userId, Long courseId, Double completionPercentage, 
                                         Integer timeSpentMinutes, Double quizScore, Double maxQuizScore, String notes) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));

        Optional<Progress> existingProgress = progressRepository.findByUserIdAndCourseId(userId, courseId);
        
        Progress progress;
        if (existingProgress.isPresent()) {
            progress = existingProgress.get();
        } else {
            progress = new Progress();
            progress.setUser(user);
            progress.setCourse(course);
            progress.setStartedAt(LocalDateTime.now());
            progress.setCreatedAt(LocalDateTime.now());
        }

        progress.setCompletionPercentage(completionPercentage);
        progress.setTimeSpentMinutes(timeSpentMinutes);
        progress.setQuizScore(quizScore);
        progress.setMaxQuizScore(maxQuizScore);
        progress.setNotes(notes);
        progress.setLastAccessedAt(LocalDateTime.now());
        progress.setUpdatedAt(LocalDateTime.now());

        // Update status based on completion percentage
        if (completionPercentage >= 100.0) {
            progress.setStatus(Progress.ProgressStatus.COMPLETED);
            progress.setCompletedAt(LocalDateTime.now());
        } else if (completionPercentage > 0.0) {
            progress.setStatus(Progress.ProgressStatus.IN_PROGRESS);
        } else {
            progress.setStatus(Progress.ProgressStatus.NOT_STARTED);
        }

        Progress savedProgress = progressRepository.save(progress);

        // Update enrollment completion percentage if enrollment exists
        try {
            // Find enrollment and update completion percentage
            var enrollmentOpt = enrollmentService.getEnrollmentsByUser(userId).stream()
                    .filter(e -> e.getCourse().getId().equals(courseId))
                    .findFirst();
            if (enrollmentOpt.isPresent()) {
                enrollmentService.updateCompletionPercentage(enrollmentOpt.get().getId(), completionPercentage);
            }
        } catch (Exception e) {
            // Log but don't fail if enrollment update fails
            System.err.println("Failed to update enrollment completion percentage: " + e.getMessage());
        }

        return savedProgress;
    }

    public Progress updateTimeSpent(Long userId, Long courseId, Integer additionalMinutes) {
        Progress progress = progressRepository.findByUserIdAndCourseId(userId, courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Progress not found for user " + userId + " and course " + courseId));

        int currentTime = progress.getTimeSpentMinutes() != null ? progress.getTimeSpentMinutes() : 0;
        progress.setTimeSpentMinutes(currentTime + additionalMinutes);
        progress.setLastAccessedAt(LocalDateTime.now());
        progress.setUpdatedAt(LocalDateTime.now());

        return progressRepository.save(progress);
    }

    public Progress updateQuizScore(Long userId, Long courseId, Double score, Double maxScore) {
        Progress progress = progressRepository.findByUserIdAndCourseId(userId, courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Progress not found for user " + userId + " and course " + courseId));

        progress.setQuizScore(score);
        progress.setMaxQuizScore(maxScore);
        progress.setLastAccessedAt(LocalDateTime.now());
        progress.setUpdatedAt(LocalDateTime.now());

        return progressRepository.save(progress);
    }

    public Progress updateCompletionPercentage(Long userId, Long courseId, Double percentage) {
        Progress progress = progressRepository.findByUserIdAndCourseId(userId, courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Progress not found for user " + userId + " and course " + courseId));

        progress.setCompletionPercentage(percentage);
        progress.setLastAccessedAt(LocalDateTime.now());
        progress.setUpdatedAt(LocalDateTime.now());

        // Update status based on completion percentage
        if (percentage >= 100.0) {
            progress.setStatus(Progress.ProgressStatus.COMPLETED);
            progress.setCompletedAt(LocalDateTime.now());
        } else if (percentage > 0.0) {
            progress.setStatus(Progress.ProgressStatus.IN_PROGRESS);
        }

        return progressRepository.save(progress);
    }

    public void deleteProgress(Long progressId) {
        progressRepository.deleteById(progressId);
    }

    public List<Progress> getProgressByStatus(Progress.ProgressStatus status) {
        return progressRepository.findByStatus(status);
    }

    public List<Progress> getCompletedProgressByUser(Long userId) {
        return progressRepository.findByUserIdAndStatus(userId, Progress.ProgressStatus.COMPLETED);
    }

    public List<Progress> getInProgressByUser(Long userId) {
        return progressRepository.findByUserIdAndStatus(userId, Progress.ProgressStatus.IN_PROGRESS);
    }

    public Double getAverageCompletionPercentageByUser(Long userId) {
        return progressRepository.getAverageCompletionPercentageByUserId(userId);
    }

    public Double getAverageCompletionPercentageByCourse(Long courseId) {
        return progressRepository.getAverageCompletionPercentageByCourseId(courseId);
    }

    public Integer getTotalTimeSpentByUser(Long userId) {
        return progressRepository.getTotalTimeSpentByUserId(userId);
    }

    public Integer getTotalTimeSpentByCourse(Long courseId) {
        return progressRepository.getTotalTimeSpentByCourseId(courseId);
    }

    public List<Progress> getProgressByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return progressRepository.findByLastAccessedAtBetween(startDate, endDate);
    }

    public List<Progress> getProgressByDepartment(String department) {
        return progressRepository.findByUserDepartment(department);
    }

    public long getCompletedCoursesCountByUser(Long userId) {
        return progressRepository.countByUserIdAndStatus(userId, Progress.ProgressStatus.COMPLETED);
    }

    public long getInProgressCoursesCountByUser(Long userId) {
        return progressRepository.countByUserIdAndStatus(userId, Progress.ProgressStatus.IN_PROGRESS);
    }

    public Double getAverageQuizScoreByUser(Long userId) {
        return progressRepository.getAverageQuizScoreByUserId(userId);
    }

    public Double getAverageQuizScoreByCourse(Long courseId) {
        return progressRepository.getAverageQuizScoreByCourseId(courseId);
    }

    public List<Progress> getTopPerformersByCourse(Long courseId, int limit) {
        List<Progress> allProgress = progressRepository.findTopPerformersByCourseId(courseId);
        return allProgress.stream().limit(limit).toList();
    }

    public List<Progress> getRecentActivityByUser(Long userId, int limit) {
        List<Progress> allProgress = progressRepository.findRecentActivityByUserId(userId);
        return allProgress.stream().limit(limit).toList();
    }
}
