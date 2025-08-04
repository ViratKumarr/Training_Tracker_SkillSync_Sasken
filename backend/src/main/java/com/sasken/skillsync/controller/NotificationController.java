package com.sasken.skillsync.controller;

import com.sasken.skillsync.model.Notification;
import com.sasken.skillsync.repository.NotificationRepository;
import com.sasken.skillsync.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<List<Notification>> getAllNotifications() {
        List<Notification> notifications = notificationRepository.findAll();
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Notification> getNotificationById(@PathVariable Long id) {
        Optional<Notification> notification = notificationRepository.findById(id);
        return notification.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Notification>> getNotificationsByUser(@PathVariable Long userId) {
        List<Notification> notifications = notificationRepository.findByUserIdOrderBySentAtDesc(userId);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<List<Notification>> getUnreadNotificationsByUser(@PathVariable Long userId) {
        List<Notification> notifications = notificationRepository.findByUserIdAndIsReadFalseOrderBySentAtDesc(userId);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/user/{userId}/count/unread")
    public ResponseEntity<Long> getUnreadNotificationCount(@PathVariable Long userId) {
        long count = notificationRepository.countByUserIdAndIsReadFalse(userId);
        return ResponseEntity.ok(count);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<Notification> createNotification(@Valid @RequestBody CreateNotificationRequest request) {
        Notification notification = new Notification();
        notification.setUser(userRepository.findById(request.getUserId()).orElse(null));
        notification.setTitle(request.getTitle());
        notification.setMessage(request.getMessage());
        notification.setType(request.getType());
        notification.setPriority(request.getPriority());
        notification.setStatus(Notification.NotificationStatus.PENDING);
        notification.setRead(false);
        notification.setScheduledFor(request.getScheduledFor());
        notification.setRelatedEntityType(request.getRelatedEntityType());
        notification.setRelatedEntityId(request.getRelatedEntityId());
        
        Notification savedNotification = notificationRepository.save(notification);
        return ResponseEntity.ok(savedNotification);
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(@PathVariable Long id) {
        Optional<Notification> notificationOpt = notificationRepository.findById(id);
        if (notificationOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Notification notification = notificationOpt.get();
        notification.setRead(true);
        notification.setReadAt(LocalDateTime.now());

        Notification savedNotification = notificationRepository.save(notification);
        return ResponseEntity.ok(savedNotification);
    }

    @PutMapping("/user/{userId}/read-all")
    public ResponseEntity<?> markAllAsReadForUser(@PathVariable Long userId) {
        List<Notification> unreadNotifications = notificationRepository.findByUserIdAndIsReadFalse(userId);
        LocalDateTime now = LocalDateTime.now();
        
        for (Notification notification : unreadNotifications) {
            notification.setRead(true);
            notification.setReadAt(now);
        }
        
        notificationRepository.saveAll(unreadNotifications);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteNotification(@PathVariable Long id) {
        if (!notificationRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        notificationRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    public static class CreateNotificationRequest {
        private Long userId;
        private String title;
        private String message;
        private Notification.NotificationType type;
        private Notification.NotificationPriority priority;
        private LocalDateTime scheduledFor;
        private String relatedEntityType;
        private Long relatedEntityId;

        // Getters and setters
        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        public Notification.NotificationType getType() { return type; }
        public void setType(Notification.NotificationType type) { this.type = type; }
        public Notification.NotificationPriority getPriority() { return priority; }
        public void setPriority(Notification.NotificationPriority priority) { this.priority = priority; }
        public LocalDateTime getScheduledFor() { return scheduledFor; }
        public void setScheduledFor(LocalDateTime scheduledFor) { this.scheduledFor = scheduledFor; }
        public String getRelatedEntityType() { return relatedEntityType; }
        public void setRelatedEntityType(String relatedEntityType) { this.relatedEntityType = relatedEntityType; }
        public Long getRelatedEntityId() { return relatedEntityId; }
        public void setRelatedEntityId(Long relatedEntityId) { this.relatedEntityId = relatedEntityId; }
    }
}
