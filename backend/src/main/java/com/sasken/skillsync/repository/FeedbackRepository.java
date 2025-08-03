package com.sasken.skillsync.repository;

import com.sasken.skillsync.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    
    List<Feedback> findByUserId(Long userId);
    
    List<Feedback> findByCourseId(Long courseId);
    
    List<Feedback> findByStatus(Feedback.FeedbackStatus status);
    
    @Query("SELECT f FROM Feedback f WHERE f.user.id = :userId AND f.course.id = :courseId")
    List<Feedback> findByUserIdAndCourseId(@Param("userId") Long userId, @Param("courseId") Long courseId);
    
    @Query("SELECT f FROM Feedback f WHERE f.course.id = :courseId AND f.status = :status")
    List<Feedback> findByCourseIdAndStatus(@Param("courseId") Long courseId, @Param("status") Feedback.FeedbackStatus status);
    
    @Query("SELECT f FROM Feedback f WHERE f.rating >= :minRating")
    List<Feedback> findByRatingGreaterThanEqual(@Param("minRating") Integer minRating);
    
    @Query("SELECT f FROM Feedback f WHERE f.overallSatisfaction >= :minSatisfaction")
    List<Feedback> findByOverallSatisfactionGreaterThanEqual(@Param("minSatisfaction") Integer minSatisfaction);
    
    @Query("SELECT f FROM Feedback f WHERE f.submittedAt >= :startDate AND f.submittedAt <= :endDate")
    List<Feedback> findBySubmissionDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT AVG(f.rating) FROM Feedback f WHERE f.course.id = :courseId")
    Double getAverageRatingByCourse(@Param("courseId") Long courseId);
    
    @Query("SELECT AVG(f.overallSatisfaction) FROM Feedback f WHERE f.course.id = :courseId")
    Double getAverageSatisfactionByCourse(@Param("courseId") Long courseId);
    
    @Query("SELECT AVG(f.contentRating) FROM Feedback f WHERE f.course.id = :courseId")
    Double getAverageContentRatingByCourse(@Param("courseId") Long courseId);
    
    @Query("SELECT AVG(f.instructorRating) FROM Feedback f WHERE f.course.id = :courseId")
    Double getAverageInstructorRatingByCourse(@Param("courseId") Long courseId);
    
    @Query("SELECT COUNT(f) FROM Feedback f WHERE f.course.id = :courseId")
    long countByCourse(@Param("courseId") Long courseId);
    
    @Query("SELECT COUNT(f) FROM Feedback f WHERE f.user.id = :userId")
    long countByUser(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(f) FROM Feedback f WHERE f.wouldRecommend = true AND f.course.id = :courseId")
    long countRecommendationsByCourse(@Param("courseId") Long courseId);
} 