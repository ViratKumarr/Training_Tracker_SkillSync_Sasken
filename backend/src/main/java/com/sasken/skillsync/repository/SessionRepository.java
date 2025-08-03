package com.sasken.skillsync.repository;

import com.sasken.skillsync.model.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {
    
    List<Session> findByCourseId(Long courseId);
    
    List<Session> findByType(Session.SessionType type);
    
    List<Session> findByIsActive(boolean isActive);
    
    @Query("SELECT s FROM Session s WHERE s.course.id = :courseId AND s.isActive = true")
    List<Session> findActiveSessionsByCourse(@Param("courseId") Long courseId);
    
    @Query("SELECT s FROM Session s WHERE s.startTime >= :startDate AND s.startTime <= :endDate")
    List<Session> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT s FROM Session s WHERE s.startTime >= :now")
    List<Session> findUpcomingSessions(@Param("now") LocalDateTime now);
    
    @Query("SELECT s FROM Session s WHERE s.startTime <= :now AND s.endTime >= :now")
    List<Session> findOngoingSessions(@Param("now") LocalDateTime now);
    
    @Query("SELECT s FROM Session s WHERE s.endTime < :now")
    List<Session> findPastSessions(@Param("now") LocalDateTime now);
    
    @Query("SELECT COUNT(s) FROM Session s WHERE s.course.id = :courseId")
    long countByCourse(@Param("courseId") Long courseId);
    
    @Query("SELECT COUNT(s) FROM Session s WHERE s.type = :type")
    long countByType(@Param("type") Session.SessionType type);
} 