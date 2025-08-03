package com.sasken.skillsync.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "courses")
public class Course {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Size(max = 100)
    @Column(name = "title")
    private String title;
    
    @Size(max = 500)
    @Column(name = "description")
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "category")
    private CourseCategory category;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private CourseType type;
    
    @Column(name = "duration_hours")
    private Integer durationHours;
    
    @Column(name = "max_participants")
    private Integer maxParticipants;
    
    @Column(name = "prerequisites")
    private String prerequisites;
    
    @Column(name = "materials")
    private String materials;
    
    @Column(name = "is_mandatory")
    private boolean isMandatory = false;
    
    @Column(name = "is_active")
    private boolean isActive = true;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trainer_id")
    private User trainer;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
    private Set<Enrollment> enrollments = new HashSet<>();
    
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
    private Set<Progress> progressRecords = new HashSet<>();
    
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
    private Set<Feedback> feedbacks = new HashSet<>();
    
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
    private Set<Session> sessions = new HashSet<>();
    
    public enum CourseCategory {
        TECHNICAL, SOFT_SKILLS, COMPLIANCE, LEADERSHIP, PRODUCTIVITY
    }
    
    public enum CourseType {
        IN_PERSON, VIRTUAL, HYBRID, SELF_PACED
    }
    
    // Constructors
    public Course() {}
    
    public Course(String title, String description, CourseCategory category, CourseType type) {
        this.title = title;
        this.description = description;
        this.category = category;
        this.type = type;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public CourseCategory getCategory() {
        return category;
    }
    
    public void setCategory(CourseCategory category) {
        this.category = category;
    }
    
    public CourseType getType() {
        return type;
    }
    
    public void setType(CourseType type) {
        this.type = type;
    }
    
    public Integer getDurationHours() {
        return durationHours;
    }
    
    public void setDurationHours(Integer durationHours) {
        this.durationHours = durationHours;
    }
    
    public Integer getMaxParticipants() {
        return maxParticipants;
    }
    
    public void setMaxParticipants(Integer maxParticipants) {
        this.maxParticipants = maxParticipants;
    }
    
    public String getPrerequisites() {
        return prerequisites;
    }
    
    public void setPrerequisites(String prerequisites) {
        this.prerequisites = prerequisites;
    }
    
    public String getMaterials() {
        return materials;
    }
    
    public void setMaterials(String materials) {
        this.materials = materials;
    }
    
    public boolean isMandatory() {
        return isMandatory;
    }
    
    public void setMandatory(boolean mandatory) {
        isMandatory = mandatory;
    }
    
    public boolean isActive() {
        return isActive;
    }
    
    public void setActive(boolean active) {
        isActive = active;
    }
    
    public User getTrainer() {
        return trainer;
    }
    
    public void setTrainer(User trainer) {
        this.trainer = trainer;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public Set<Enrollment> getEnrollments() {
        return enrollments;
    }
    
    public void setEnrollments(Set<Enrollment> enrollments) {
        this.enrollments = enrollments;
    }
    
    public Set<Progress> getProgressRecords() {
        return progressRecords;
    }
    
    public void setProgressRecords(Set<Progress> progressRecords) {
        this.progressRecords = progressRecords;
    }
    
    public Set<Feedback> getFeedbacks() {
        return feedbacks;
    }
    
    public void setFeedbacks(Set<Feedback> feedbacks) {
        this.feedbacks = feedbacks;
    }
    
    public Set<Session> getSessions() {
        return sessions;
    }
    
    public void setSessions(Set<Session> sessions) {
        this.sessions = sessions;
    }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
} 