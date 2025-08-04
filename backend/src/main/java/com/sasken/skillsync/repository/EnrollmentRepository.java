package com.sasken.skillsync.repository;

import com.sasken.skillsync.model.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    
    List<Enrollment> findByUserId(Long userId);
    
    List<Enrollment> findByCourseId(Long courseId);
    
    List<Enrollment> findByStatus(Enrollment.EnrollmentStatus status);
    
    List<Enrollment> findByType(Enrollment.EnrollmentType type);
    
    @Query("SELECT e FROM Enrollment e WHERE e.user.id = :userId AND e.course.id = :courseId")
    Optional<Enrollment> findByUserIdAndCourseId(@Param("userId") Long userId, @Param("courseId") Long courseId);
    
    @Query("SELECT e FROM Enrollment e WHERE e.user.id = :userId AND e.status = :status")
    List<Enrollment> findByUserIdAndStatus(@Param("userId") Long userId, @Param("status") Enrollment.EnrollmentStatus status);
    
    @Query("SELECT e FROM Enrollment e WHERE e.course.id = :courseId AND e.status = :status")
    List<Enrollment> findByCourseIdAndStatus(@Param("courseId") Long courseId, @Param("status") Enrollment.EnrollmentStatus status);
    
    @Query("SELECT e FROM Enrollment e WHERE e.user.id = :userId AND e.type = :type")
    List<Enrollment> findByUserIdAndType(@Param("userId") Long userId, @Param("type") Enrollment.EnrollmentType type);
    
    @Query("SELECT e FROM Enrollment e WHERE e.course.id = :courseId AND e.type = :type")
    List<Enrollment> findByCourseIdAndType(@Param("courseId") Long courseId, @Param("type") Enrollment.EnrollmentType type);
    
    @Query("SELECT COUNT(e) FROM Enrollment e WHERE e.course.id = :courseId AND e.status = 'COMPLETED'")
    long countCompletedEnrollmentsByCourse(@Param("courseId") Long courseId);
    
    @Query("SELECT COUNT(e) FROM Enrollment e WHERE e.user.id = :userId AND e.status = 'COMPLETED'")
    long countCompletedEnrollmentsByUser(@Param("userId") Long userId);
    
    @Query("SELECT e FROM Enrollment e WHERE e.enrolledAt >= :startDate AND e.enrolledAt <= :endDate")
    List<Enrollment> findByEnrollmentDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT e FROM Enrollment e WHERE e.completedAt >= :startDate AND e.completedAt <= :endDate")
    List<Enrollment> findByCompletionDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(e) FROM Enrollment e WHERE e.status = :status")
    long countByStatus(@Param("status") Enrollment.EnrollmentStatus status);
    
    boolean existsByUserIdAndCourseId(Long userId, Long courseId);

    // Additional methods needed by services
    @Query("SELECT COUNT(e) FROM Enrollment e WHERE e.course.id = :courseId AND e.status IN ('ENROLLED', 'IN_PROGRESS')")
    long countActiveByCourseId(@Param("courseId") Long courseId);

    @Query("SELECT e FROM Enrollment e WHERE e.enrolledAt < :deadline AND e.status = 'IN_PROGRESS'")
    List<Enrollment> findOverdueEnrollments(@Param("deadline") LocalDateTime deadline);

    @Query("SELECT e FROM Enrollment e WHERE e.completedAt >= :startDate AND e.completedAt <= :endDate AND e.status = 'COMPLETED'")
    List<Enrollment> findCompletedEnrollmentsByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT AVG(e.completionPercentage) FROM Enrollment e WHERE e.course.id = :courseId")
    Double getAverageCompletionPercentageByCourseId(@Param("courseId") Long courseId);

    @Query("SELECT e FROM Enrollment e JOIN e.user u WHERE u.department = :department")
    List<Enrollment> findByUserDepartment(@Param("department") String department);

    @Query("SELECT e FROM Enrollment e WHERE e.user.id = :userId AND e.type = 'MANDATORY'")
    List<Enrollment> findMandatoryEnrollmentsByUserId(@Param("userId") Long userId);

    @Query("SELECT e FROM Enrollment e WHERE e.user.id = :userId AND e.type = 'OPTIONAL'")
    List<Enrollment> findOptionalEnrollmentsByUserId(@Param("userId") Long userId);
}