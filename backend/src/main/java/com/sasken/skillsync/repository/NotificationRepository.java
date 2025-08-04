package com.sasken.skillsync.repository;

import com.sasken.skillsync.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    List<Notification> findByUserId(Long userId);
    
    List<Notification> findByType(Notification.NotificationType type);
    
    List<Notification> findByStatus(Notification.NotificationStatus status);
    
    List<Notification> findByIsRead(boolean isRead);
    
    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId AND n.isRead = false")
    List<Notification> findUnreadByUserId(@Param("userId") Long userId);
    
    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId AND n.type = :type")
    List<Notification> findByUserIdAndType(@Param("userId") Long userId, @Param("type") Notification.NotificationType type);
    
    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId AND n.status = :status")
    List<Notification> findByUserIdAndStatus(@Param("userId") Long userId, @Param("status") Notification.NotificationStatus status);
    
    @Query("SELECT n FROM Notification n WHERE n.sentAt >= :startDate AND n.sentAt <= :endDate")
    List<Notification> findBySentDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT n FROM Notification n WHERE n.scheduledFor <= :now AND n.status = 'PENDING'")
    List<Notification> findPendingScheduledNotifications(@Param("now") LocalDateTime now);
    
    @Query("SELECT n FROM Notification n WHERE n.emailSent = false AND n.status = 'SENT'")
    List<Notification> findUnsentEmailNotifications();
    
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.user.id = :userId AND n.isRead = false")
    long countUnreadByUserId(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.type = :type")
    long countByType(@Param("type") Notification.NotificationType type);
    
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.status = :status")
    long countByStatus(@Param("status") Notification.NotificationStatus status);

    // Additional methods needed by services and controllers
    List<Notification> findByUserIdOrderBySentAtDesc(Long userId);

    List<Notification> findByUserIdAndIsReadFalseOrderBySentAtDesc(Long userId);

    long countByUserIdAndIsReadFalse(Long userId);

    List<Notification> findByUserIdAndIsReadFalse(Long userId);

    void deleteByUserId(Long userId);

    List<Notification> findByPriority(Notification.NotificationPriority priority);

    @Query("SELECT n FROM Notification n ORDER BY n.sentAt DESC")
    List<Notification> findTopNByOrderBySentAtDesc(@Param("limit") int limit);
}