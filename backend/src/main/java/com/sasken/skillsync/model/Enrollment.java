package com.sasken.skillsync.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

@Entity
@Table(name = "enrollments")
public class Enrollment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;
    
    @NotNull
    @Enumerated(EnumType.STRING)
    private EnrollmentStatus status;
    
    @Enumerated(EnumType.STRING)
    private EnrollmentType type;
    
    @Column(name = "enrolled_at")
    private LocalDateTime enrolledAt;
    
    @Column(name = "started_at")
    private LocalDateTime startedAt;
    
    @Column(name = "completed_at")
    private LocalDateTime completedAt;
    
    @Column(name = "completion_percentage")
    private Double completionPercentage = 0.0;
    
    private String grade;
    
    @Column(name = "last_accessed_at")
    private LocalDateTime lastAccessedAt;
    
    @Column(name = "total_time_spent")
    private Integer totalTimeSpent = 0; // in minutes
    
    @Column(name = "certificate_earned")
    private Boolean certificateEarned = false;
    
    @Column(name = "certificate_id")
    private String certificateId;
    
    @Column(name = "notes")
    private String notes;

    public enum EnrollmentStatus {
        PENDING, ENROLLED, IN_PROGRESS, COMPLETED, DROPPED, SUSPENDED
    }
    
    public enum EnrollmentType {
        MANDATORY, OPTIONAL, SELF_ENROLLED, MANAGER_ASSIGNED
    }

    // Constructors
    public Enrollment() {}

    public Enrollment(User user, Course course, EnrollmentType type) {
        this.user = user;
        this.course = course;
        this.type = type;
        this.status = EnrollmentStatus.ENROLLED;
        this.enrolledAt = LocalDateTime.now();
        this.completionPercentage = 0.0;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public EnrollmentStatus getStatus() {
        return status;
    }

    public void setStatus(EnrollmentStatus status) {
        this.status = status;
    }

    public EnrollmentType getType() {
        return type;
    }

    public void setType(EnrollmentType type) {
        this.type = type;
    }

    public LocalDateTime getEnrolledAt() {
        return enrolledAt;
    }

    public void setEnrolledAt(LocalDateTime enrolledAt) {
        this.enrolledAt = enrolledAt;
    }

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(LocalDateTime startedAt) {
        this.startedAt = startedAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public Double getCompletionPercentage() {
        return completionPercentage;
    }

    public void setCompletionPercentage(Double completionPercentage) {
        this.completionPercentage = completionPercentage;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public LocalDateTime getLastAccessedAt() {
        return lastAccessedAt;
    }

    public void setLastAccessedAt(LocalDateTime lastAccessedAt) {
        this.lastAccessedAt = lastAccessedAt;
    }

    public Integer getTotalTimeSpent() {
        return totalTimeSpent;
    }

    public void setTotalTimeSpent(Integer totalTimeSpent) {
        this.totalTimeSpent = totalTimeSpent;
    }

    public Boolean getCertificateEarned() {
        return certificateEarned;
    }

    public void setCertificateEarned(Boolean certificateEarned) {
        this.certificateEarned = certificateEarned;
    }

    public String getCertificateId() {
        return certificateId;
    }

    public void setCertificateId(String certificateId) {
        this.certificateId = certificateId;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    // Helper methods
    public boolean isCompleted() {
        return status == EnrollmentStatus.COMPLETED;
    }
    
    public boolean isInProgress() {
        return status == EnrollmentStatus.IN_PROGRESS;
    }
    
    public boolean isEnrolled() {
        return status == EnrollmentStatus.ENROLLED;
    }

    @PrePersist
    protected void onCreate() {
        if (enrolledAt == null) {
            enrolledAt = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        lastAccessedAt = LocalDateTime.now();
    }

    @Override
    public String toString() {
        return "Enrollment{" +
                "id=" + id +
                ", user=" + (user != null ? user.getId() : null) +
                ", course=" + (course != null ? course.getId() : null) +
                ", status=" + status +
                ", type=" + type +
                ", completionPercentage=" + completionPercentage +
                '}';
    }
} 