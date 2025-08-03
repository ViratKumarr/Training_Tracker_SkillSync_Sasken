package com.sasken.skillsync.repository;

import com.sasken.skillsync.model.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    
    List<Attendance> findByUserId(Long userId);
    
    List<Attendance> findBySessionId(Long sessionId);
    
    List<Attendance> findByStatus(Attendance.AttendanceStatus status);
    
    @Query("SELECT a FROM Attendance a WHERE a.user.id = :userId AND a.session.id = :sessionId")
    Optional<Attendance> findByUserIdAndSessionId(@Param("userId") Long userId, @Param("sessionId") Long sessionId);
    
    @Query("SELECT a FROM Attendance a WHERE a.user.id = :userId AND a.status = :status")
    List<Attendance> findByUserIdAndStatus(@Param("userId") Long userId, @Param("status") Attendance.AttendanceStatus status);
    
    @Query("SELECT a FROM Attendance a WHERE a.session.id = :sessionId AND a.status = :status")
    List<Attendance> findBySessionIdAndStatus(@Param("sessionId") Long sessionId, @Param("status") Attendance.AttendanceStatus status);
    
    @Query("SELECT a FROM Attendance a WHERE a.checkInTime >= :startDate AND a.checkInTime <= :endDate")
    List<Attendance> findByCheckInDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.session.id = :sessionId AND a.status = 'PRESENT'")
    long countPresentAttendanceBySession(@Param("sessionId") Long sessionId);
    
    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.user.id = :userId AND a.status = 'PRESENT'")
    long countPresentAttendanceByUser(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.session.id = :sessionId")
    long countTotalAttendanceBySession(@Param("sessionId") Long sessionId);
    
    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.user.id = :userId")
    long countTotalAttendanceByUser(@Param("userId") Long userId);
    
    boolean existsByUserIdAndSessionId(Long userId, Long sessionId);
} 