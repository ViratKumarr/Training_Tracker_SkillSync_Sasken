package com.sasken.skillsync.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "feedback")
public class Feedback {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;
    
    @Column(name = "rating")
    @Min(1)
    @Max(5)
    private Integer rating;
    
    @Column(name = "content_rating")
    @Min(1)
    @Max(5)
    private Integer contentRating;
    
    @Column(name = "instructor_rating")
    @Min(1)
    @Max(5)
    private Integer instructorRating;
    
    @Column(name = "facility_rating")
    @Min(1)
    @Max(5)
    private Integer facilityRating;
    
    @Column(name = "overall_satisfaction")
    @Min(1)
    @Max(5)
    private Integer overallSatisfaction;
    
    @Column(name = "comments", length = 1000)
    private String comments;
    
    @Column(name = "suggestions", length = 1000)
    private String suggestions;
    
    @Column(name = "would_recommend")
    private Boolean wouldRecommend;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private FeedbackStatus status;
    
    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;
    
    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;
    
    @Column(name = "reviewed_by")
    private String reviewedBy;
    
    @Column(name = "review_notes")
    private String reviewNotes;
    
    public enum FeedbackStatus {
        SUBMITTED, REVIEWED, APPROVED, REJECTED
    }
    
    // Constructors
    public Feedback() {}
    
    public Feedback(User user, Course course) {
        this.user = user;
        this.course = course;
        this.status = FeedbackStatus.SUBMITTED;
        this.submittedAt = LocalDateTime.now();
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
    
    public Integer getRating() {
        return rating;
    }
    
    public void setRating(Integer rating) {
        this.rating = rating;
    }
    
    public Integer getContentRating() {
        return contentRating;
    }
    
    public void setContentRating(Integer contentRating) {
        this.contentRating = contentRating;
    }
    
    public Integer getInstructorRating() {
        return instructorRating;
    }
    
    public void setInstructorRating(Integer instructorRating) {
        this.instructorRating = instructorRating;
    }
    
    public Integer getFacilityRating() {
        return facilityRating;
    }
    
    public void setFacilityRating(Integer facilityRating) {
        this.facilityRating = facilityRating;
    }
    
    public Integer getOverallSatisfaction() {
        return overallSatisfaction;
    }
    
    public void setOverallSatisfaction(Integer overallSatisfaction) {
        this.overallSatisfaction = overallSatisfaction;
    }
    
    public String getComments() {
        return comments;
    }
    
    public void setComments(String comments) {
        this.comments = comments;
    }
    
    public String getSuggestions() {
        return suggestions;
    }
    
    public void setSuggestions(String suggestions) {
        this.suggestions = suggestions;
    }
    
    public Boolean getWouldRecommend() {
        return wouldRecommend;
    }
    
    public void setWouldRecommend(Boolean wouldRecommend) {
        this.wouldRecommend = wouldRecommend;
    }
    
    public FeedbackStatus getStatus() {
        return status;
    }
    
    public void setStatus(FeedbackStatus status) {
        this.status = status;
    }
    
    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }
    
    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }
    
    public LocalDateTime getReviewedAt() {
        return reviewedAt;
    }
    
    public void setReviewedAt(LocalDateTime reviewedAt) {
        this.reviewedAt = reviewedAt;
    }
    
    public String getReviewedBy() {
        return reviewedBy;
    }
    
    public void setReviewedBy(String reviewedBy) {
        this.reviewedBy = reviewedBy;
    }
    
    public String getReviewNotes() {
        return reviewNotes;
    }
    
    public void setReviewNotes(String reviewNotes) {
        this.reviewNotes = reviewNotes;
    }
} 