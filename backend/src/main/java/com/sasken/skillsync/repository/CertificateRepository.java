package com.sasken.skillsync.repository;

import com.sasken.skillsync.model.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Long> {
    
    List<Certificate> findByUserId(Long userId);
    
    List<Certificate> findByCourseId(Long courseId);
    
    List<Certificate> findByStatus(Certificate.CertificateStatus status);
    
    Optional<Certificate> findByCertificateNumber(String certificateNumber);
    
    @Query("SELECT c FROM Certificate c WHERE c.user.id = :userId AND c.course.id = :courseId")
    Optional<Certificate> findByUserIdAndCourseId(@Param("userId") Long userId, @Param("courseId") Long courseId);
    
    @Query("SELECT c FROM Certificate c WHERE c.user.id = :userId AND c.status = :status")
    List<Certificate> findByUserIdAndStatus(@Param("userId") Long userId, @Param("status") Certificate.CertificateStatus status);
    
    @Query("SELECT c FROM Certificate c WHERE c.course.id = :courseId AND c.status = :status")
    List<Certificate> findByCourseIdAndStatus(@Param("courseId") Long courseId, @Param("status") Certificate.CertificateStatus status);
    
    @Query("SELECT c FROM Certificate c WHERE c.issuedAt >= :startDate AND c.issuedAt <= :endDate")
    List<Certificate> findByIssuedDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT c FROM Certificate c WHERE c.validUntil <= :now AND c.status = 'ISSUED'")
    List<Certificate> findExpiredCertificates(@Param("now") LocalDateTime now);
    
    @Query("SELECT c FROM Certificate c WHERE c.validUntil > :now AND c.status = 'ISSUED'")
    List<Certificate> findValidCertificates(@Param("now") LocalDateTime now);
    
    @Query("SELECT COUNT(c) FROM Certificate c WHERE c.user.id = :userId")
    long countByUser(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(c) FROM Certificate c WHERE c.course.id = :courseId")
    long countByCourse(@Param("courseId") Long courseId);
    
    @Query("SELECT COUNT(c) FROM Certificate c WHERE c.status = :status")
    long countByStatus(@Param("status") Certificate.CertificateStatus status);
    
    boolean existsByCertificateNumber(String certificateNumber);
} 