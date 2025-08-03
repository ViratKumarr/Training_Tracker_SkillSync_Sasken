package com.sasken.skillsync.controller;

import com.sasken.skillsync.model.Certificate;
import com.sasken.skillsync.model.Enrollment;
import com.sasken.skillsync.model.User;
import com.sasken.skillsync.repository.CertificateRepository;
import com.sasken.skillsync.repository.EnrollmentRepository;
import com.sasken.skillsync.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.Map;

@RestController
@RequestMapping("/certificates")
@CrossOrigin(origins = "*")
public class CertificateController {

    @Autowired
    private CertificateRepository certificateRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Certificate>> getAllCertificates() {
        List<Certificate> certificates = certificateRepository.findAll();
        return ResponseEntity.ok(certificates);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Certificate>> getCertificatesByUser(@PathVariable Long userId) {
        List<Certificate> certificates = certificateRepository.findByUserId(userId);
        return ResponseEntity.ok(certificates);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Certificate> getCertificateById(@PathVariable Long id) {
        Optional<Certificate> certificate = certificateRepository.findById(id);
        return certificate.map(ResponseEntity::ok)
                        .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('TRAINER')")
    public ResponseEntity<Certificate> createCertificate(@Valid @RequestBody CreateCertificateRequest request) {
        Optional<User> user = userRepository.findById(request.getUserId());
        if (user.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Certificate certificate = new Certificate();
        certificate.setUser(user.get());
        certificate.setCompletionPercentage(request.getCompletionPercentage());
        certificate.setScore(request.getScore());
        certificate.setMaxScore(request.getMaxScore());
        certificate.setGrade(request.getGrade());
        certificate.setCertificateNumber("CERT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        certificate.setIssuedBy(request.getIssuedBy());
        certificate.setStatus(Certificate.CertificateStatus.ISSUED);
        certificate.setIssuedAt(LocalDateTime.now());
        certificate.setCompletionDate(LocalDateTime.now());

        Certificate savedCertificate = certificateRepository.save(certificate);
        return ResponseEntity.ok(savedCertificate);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<Certificate> updateCertificateStatus(@PathVariable Long id, @RequestBody UpdateCertificateStatusRequest request) {
        Optional<Certificate> certificateOpt = certificateRepository.findById(id);
        if (certificateOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Certificate certificate = certificateOpt.get();
        certificate.setStatus(request.getStatus());
        certificate.setNotes(request.getNotes());

        Certificate savedCertificate = certificateRepository.save(certificate);
        return ResponseEntity.ok(savedCertificate);
    }

    @PostMapping("/generate-from-enrollments")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('TRAINER')")
    public ResponseEntity<?> generateCertificatesFromCompletedEnrollments() {
        List<Enrollment> completedEnrollments = enrollmentRepository.findByStatus(Enrollment.EnrollmentStatus.COMPLETED);
        int generatedCount = 0;

        for (Enrollment enrollment : completedEnrollments) {
            // Check if certificate already exists
            if (certificateRepository.findByUserIdAndCourseId(enrollment.getUser().getId(), enrollment.getCourse().getId()).isEmpty()) {
                Certificate certificate = new Certificate();
                certificate.setUser(enrollment.getUser());
                certificate.setCourse(enrollment.getCourse());
                certificate.setCompletionPercentage(100.0);
                certificate.setScore(enrollment.getGrade() != null ? Double.parseDouble(enrollment.getGrade()) : 90.0);
                certificate.setMaxScore(100.0);
                certificate.setGrade(enrollment.getGrade() != null ? enrollment.getGrade() : "A");
                certificate.setCertificateNumber("CERT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
                certificate.setIssuedBy("SkillSync System");
                certificate.setStatus(Certificate.CertificateStatus.ISSUED);
                certificate.setIssuedAt(LocalDateTime.now());
                certificate.setCompletionDate(enrollment.getCompletedAt() != null ? enrollment.getCompletedAt() : LocalDateTime.now());

                certificateRepository.save(certificate);
                generatedCount++;
            }
        }

        return ResponseEntity.ok(Map.of("message", "Generated " + generatedCount + " certificates"));
    }

    public static class CreateCertificateRequest {
        private Long userId;
        private Long courseId;
        private Double completionPercentage;
        private Double score;
        private Double maxScore;
        private String grade;
        private String issuedBy;

        // Getters and Setters
        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }

        public Long getCourseId() { return courseId; }
        public void setCourseId(Long courseId) { this.courseId = courseId; }

        public Double getCompletionPercentage() { return completionPercentage; }
        public void setCompletionPercentage(Double completionPercentage) { this.completionPercentage = completionPercentage; }

        public Double getScore() { return score; }
        public void setScore(Double score) { this.score = score; }

        public Double getMaxScore() { return maxScore; }
        public void setMaxScore(Double maxScore) { this.maxScore = maxScore; }

        public String getGrade() { return grade; }
        public void setGrade(String grade) { this.grade = grade; }

        public String getIssuedBy() { return issuedBy; }
        public void setIssuedBy(String issuedBy) { this.issuedBy = issuedBy; }
    }

    public static class UpdateCertificateStatusRequest {
        private Certificate.CertificateStatus status;
        private String notes;

        // Getters and Setters
        public Certificate.CertificateStatus getStatus() { return status; }
        public void setStatus(Certificate.CertificateStatus status) { this.status = status; }

        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
    }
} 