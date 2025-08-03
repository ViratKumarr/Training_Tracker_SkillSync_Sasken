package com.sasken.skillsync.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "certificates")
public class Certificate {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "certificate_number", unique = true)
    private String certificateNumber;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;
    
    @Column(name = "completion_date")
    private LocalDateTime completionDate;
    
    @Column(name = "grade")
    private String grade;
    
    @Column(name = "score")
    private Double score;
    
    @Column(name = "max_score")
    private Double maxScore;
    
    @Column(name = "completion_percentage")
    private Double completionPercentage;
    
    @Column(name = "valid_until")
    private LocalDateTime validUntil;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private CertificateStatus status;
    
    @Column(name = "issued_at")
    private LocalDateTime issuedAt;
    
    @Column(name = "issued_by")
    private String issuedBy;
    
    @Column(name = "pdf_path")
    private String pdfPath;
    
    @Column(name = "notes")
    private String notes;
    
    public enum CertificateStatus {
        ISSUED, EXPIRED, REVOKED, PENDING
    }
    
    // Constructors
    public Certificate() {}
    
    public Certificate(User user, Course course, String certificateNumber) {
        this.user = user;
        this.course = course;
        this.certificateNumber = certificateNumber;
        this.status = CertificateStatus.ISSUED;
        this.issuedAt = LocalDateTime.now();
        this.completionDate = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getCertificateNumber() {
        return certificateNumber;
    }
    
    public void setCertificateNumber(String certificateNumber) {
        this.certificateNumber = certificateNumber;
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
    
    public LocalDateTime getCompletionDate() {
        return completionDate;
    }
    
    public void setCompletionDate(LocalDateTime completionDate) {
        this.completionDate = completionDate;
    }
    
    public String getGrade() {
        return grade;
    }
    
    public void setGrade(String grade) {
        this.grade = grade;
    }
    
    public Double getScore() {
        return score;
    }
    
    public void setScore(Double score) {
        this.score = score;
    }
    
    public Double getMaxScore() {
        return maxScore;
    }
    
    public void setMaxScore(Double maxScore) {
        this.maxScore = maxScore;
    }
    
    public Double getCompletionPercentage() {
        return completionPercentage;
    }
    
    public void setCompletionPercentage(Double completionPercentage) {
        this.completionPercentage = completionPercentage;
    }
    
    public LocalDateTime getValidUntil() {
        return validUntil;
    }
    
    public void setValidUntil(LocalDateTime validUntil) {
        this.validUntil = validUntil;
    }
    
    public CertificateStatus getStatus() {
        return status;
    }
    
    public void setStatus(CertificateStatus status) {
        this.status = status;
    }
    
    public LocalDateTime getIssuedAt() {
        return issuedAt;
    }
    
    public void setIssuedAt(LocalDateTime issuedAt) {
        this.issuedAt = issuedAt;
    }
    
    public String getIssuedBy() {
        return issuedBy;
    }
    
    public void setIssuedBy(String issuedBy) {
        this.issuedBy = issuedBy;
    }
    
    public String getPdfPath() {
        return pdfPath;
    }
    
    public void setPdfPath(String pdfPath) {
        this.pdfPath = pdfPath;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
    }
} 