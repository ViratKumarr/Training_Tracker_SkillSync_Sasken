package com.sasken.skillsync.service;

import com.sasken.skillsync.model.Course;
import com.sasken.skillsync.model.Notification;
import com.sasken.skillsync.model.User;
import com.sasken.skillsync.repository.NotificationRepository;
import com.sasken.skillsync.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired(required = false)
    private JavaMailSender mailSender;

    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    public List<Notification> getNotificationsByUser(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Notification> getUnreadNotificationsByUser(Long userId) {
        return notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
    }

    public Optional<Notification> getNotificationById(Long id) {
        return notificationRepository.findById(id);
    }

    public Notification createNotification(Long userId, String title, String message, 
                                         Notification.NotificationType type, 
                                         Notification.NotificationPriority priority,
                                         String relatedEntityType, Long relatedEntityId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        notification.setPriority(priority);
        notification.setStatus(Notification.NotificationStatus.PENDING);
        notification.setRelatedEntityType(relatedEntityType);
        notification.setRelatedEntityId(relatedEntityId);
        notification.setRead(false);
        notification.setSentAt(LocalDateTime.now());

        Notification savedNotification = notificationRepository.save(notification);

        // Send email notification asynchronously
        sendEmailNotificationAsync(user, title, message);

        return savedNotification;
    }

    public Notification markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found with id: " + notificationId));

        notification.setRead(true);
        notification.setReadAt(LocalDateTime.now());
        return notificationRepository.save(notification);
    }

    public void markAllAsRead(Long userId) {
        List<Notification> unreadNotifications = notificationRepository.findByUserIdAndIsReadFalse(userId);
        for (Notification notification : unreadNotifications) {
            notification.setRead(true);
            notification.setReadAt(LocalDateTime.now());
        }
        notificationRepository.saveAll(unreadNotifications);
    }

    public void deleteNotification(Long notificationId) {
        notificationRepository.deleteById(notificationId);
    }

    public void deleteAllNotificationsByUser(Long userId) {
        notificationRepository.deleteByUserId(userId);
    }

    // Specific notification methods
    public void sendEnrollmentNotification(User user, Course course, String action) {
        String title = "Course " + action.substring(0, 1).toUpperCase() + action.substring(1);
        String message = String.format("You have %s in the course: %s", action, course.getTitle());
        
        createNotification(
            user.getId(),
            title,
            message,
            Notification.NotificationType.COURSE_ASSIGNMENT,
            Notification.NotificationPriority.MEDIUM,
            "COURSE",
            course.getId()
        );
    }

    public void sendCertificateNotification(User user, Course course, String certificateId) {
        String title = "Certificate Issued";
        String message = String.format("Your certificate for %s has been issued. Certificate ID: %s", 
                                      course.getTitle(), certificateId);
        
        createNotification(
            user.getId(),
            title,
            message,
            Notification.NotificationType.CERTIFICATE_ISSUED,
            Notification.NotificationPriority.HIGH,
            "CERTIFICATE",
            course.getId()
        );
    }

    public void sendCourseReminderNotification(User user, Course course, String reminderType) {
        String title = "Course Reminder";
        String message = String.format("Reminder: Your course '%s' %s", 
                                      course.getTitle(), reminderType);
        
        createNotification(
            user.getId(),
            title,
            message,
            Notification.NotificationType.COURSE_REMINDER,
            Notification.NotificationPriority.MEDIUM,
            "COURSE",
            course.getId()
        );
    }

    public void sendOverdueNotification(User user, Course course) {
        String title = "Overdue Training";
        String message = String.format("Your training '%s' is overdue. Please complete it as soon as possible.", 
                                      course.getTitle());
        
        createNotification(
            user.getId(),
            title,
            message,
            Notification.NotificationType.COURSE_REMINDER,
            Notification.NotificationPriority.URGENT,
            "COURSE",
            course.getId()
        );
    }

    @Async
    public void sendEmailNotificationAsync(User user, String subject, String message) {
        try {
            if (mailSender != null) {
                SimpleMailMessage email = new SimpleMailMessage();
                email.setTo(user.getEmail());
                email.setSubject("[SkillSync] " + subject);
                email.setText(message + "\n\nBest regards,\nSkillSync Training Team");
                email.setFrom("noreply@skillsync.com");

                mailSender.send(email);
            } else {
                // Log that email service is not configured
                System.out.println("Email notification would be sent to " + user.getEmail() + ": " + subject);
            }
        } catch (Exception e) {
            // Log error but don't fail the notification creation
            System.err.println("Failed to send email notification: " + e.getMessage());
        }
    }

    // Scheduled task to send reminder notifications
    @Scheduled(cron = "0 0 9 * * ?") // Daily at 9 AM
    public void sendDailyReminders() {
        // This would be implemented to check for upcoming deadlines
        // and send appropriate reminders
        System.out.println("Sending daily reminder notifications...");
    }

    public long getUnreadNotificationCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    public List<Notification> getNotificationsByType(Notification.NotificationType type) {
        return notificationRepository.findByType(type);
    }

    public List<Notification> getNotificationsByPriority(Notification.NotificationPriority priority) {
        return notificationRepository.findByPriority(priority);
    }

    public List<Notification> getRecentNotifications(int limit) {
        return notificationRepository.findTopNByOrderByCreatedAtDesc(limit);
    }
}
