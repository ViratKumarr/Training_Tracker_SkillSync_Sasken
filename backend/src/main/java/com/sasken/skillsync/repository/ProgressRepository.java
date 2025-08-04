package com.sasken.skillsync.repository;

import com.sasken.skillsync.model.Progress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProgressRepository extends JpaRepository<Progress, Long> {
    
    List<Progress> findByUserId(Long userId);
    
    List<Progress> findByCourseId(Long courseId);
    
    List<Progress> findByStatus(Progress.ProgressStatus status);
    
    @Query("SELECT p FROM Progress p WHERE p.user.id = :userId AND p.course.id = :courseId")
    Optional<Progress> findByUserIdAndCourseId(@Param("userId") Long userId, @Param("courseId") Long courseId);
    
    @Query("SELECT p FROM Progress p WHERE p.user.id = :userId AND p.status = :status")
    List<Progress> findByUserIdAndStatus(@Param("userId") Long userId, @Param("status") Progress.ProgressStatus status);
    
    @Query("SELECT p FROM Progress p WHERE p.course.id = :courseId AND p.status = :status")
    List<Progress> findByCourseIdAndStatus(@Param("courseId") Long courseId, @Param("status") Progress.ProgressStatus status);
    
    @Query("SELECT p FROM Progress p WHERE p.completionPercentage >= :minPercentage")
    List<Progress> findByCompletionPercentageGreaterThanEqual(@Param("minPercentage") Double minPercentage);
    
    @Query("SELECT p FROM Progress p WHERE p.completionPercentage = 100.0")
    List<Progress> findCompletedProgress();
    
    @Query("SELECT p FROM Progress p WHERE p.lastAccessedAt >= :startDate AND p.lastAccessedAt <= :endDate")
    List<Progress> findByLastAccessedDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT AVG(p.completionPercentage) FROM Progress p WHERE p.course.id = :courseId")
    Double getAverageCompletionPercentageByCourse(@Param("courseId") Long courseId);
    
    @Query("SELECT AVG(p.completionPercentage) FROM Progress p WHERE p.user.id = :userId")
    Double getAverageCompletionPercentageByUser(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(p) FROM Progress p WHERE p.course.id = :courseId AND p.status = 'COMPLETED'")
    long countCompletedProgressByCourse(@Param("courseId") Long courseId);
    
    @Query("SELECT COUNT(p) FROM Progress p WHERE p.user.id = :userId AND p.status = 'COMPLETED'")
    long countCompletedProgressByUser(@Param("userId") Long userId);
    
    boolean existsByUserIdAndCourseId(Long userId, Long courseId);

    // Additional methods needed by services
    @Query("SELECT AVG(p.completionPercentage) FROM Progress p WHERE p.user.id = :userId")
    Double getAverageCompletionPercentageByUserId(@Param("userId") Long userId);

    @Query("SELECT AVG(p.completionPercentage) FROM Progress p WHERE p.course.id = :courseId")
    Double getAverageCompletionPercentageByCourseId(@Param("courseId") Long courseId);

    @Query("SELECT SUM(p.timeSpentMinutes) FROM Progress p WHERE p.user.id = :userId")
    Integer getTotalTimeSpentByUserId(@Param("userId") Long userId);

    @Query("SELECT SUM(p.timeSpentMinutes) FROM Progress p WHERE p.course.id = :courseId")
    Integer getTotalTimeSpentByCourseId(@Param("courseId") Long courseId);

    @Query("SELECT p FROM Progress p WHERE p.lastAccessedAt >= :startDate AND p.lastAccessedAt <= :endDate")
    List<Progress> findByLastAccessedAtBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT p FROM Progress p JOIN p.user u WHERE u.department = :department")
    List<Progress> findByUserDepartment(@Param("department") String department);

    @Query("SELECT COUNT(p) FROM Progress p WHERE p.user.id = :userId AND p.status = :status")
    long countByUserIdAndStatus(@Param("userId") Long userId, @Param("status") Progress.ProgressStatus status);

    @Query("SELECT AVG(p.quizScore) FROM Progress p WHERE p.user.id = :userId")
    Double getAverageQuizScoreByUserId(@Param("userId") Long userId);

    @Query("SELECT AVG(p.quizScore) FROM Progress p WHERE p.course.id = :courseId")
    Double getAverageQuizScoreByCourseId(@Param("courseId") Long courseId);

    @Query("SELECT p FROM Progress p WHERE p.course.id = :courseId ORDER BY p.completionPercentage DESC")
    List<Progress> findTopPerformersByCourseId(@Param("courseId") Long courseId);

    @Query("SELECT p FROM Progress p WHERE p.user.id = :userId ORDER BY p.lastAccessedAt DESC")
    List<Progress> findRecentActivityByUserId(@Param("userId") Long userId);
}