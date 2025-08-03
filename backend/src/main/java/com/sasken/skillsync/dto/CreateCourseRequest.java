package com.sasken.skillsync.dto;

import com.sasken.skillsync.model.Course;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CreateCourseRequest {
    
    @NotBlank
    @Size(max = 100)
    private String title;
    
    @Size(max = 500)
    private String description;
    
    @NotNull
    private Course.CourseCategory category;
    
    @NotNull
    private Course.CourseType type;
    
    private Integer durationHours;
    
    private Integer maxParticipants;
    
    private String prerequisites;
    
    private String materials;
    
    private boolean isMandatory = false;
    
    private Long trainerId;
    
    // Constructors
    public CreateCourseRequest() {}
    
    // Getters and Setters
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
    
    public Course.CourseCategory getCategory() {
        return category;
    }
    
    public void setCategory(Course.CourseCategory category) {
        this.category = category;
    }
    
    public Course.CourseType getType() {
        return type;
    }
    
    public void setType(Course.CourseType type) {
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
    
    public Long getTrainerId() {
        return trainerId;
    }
    
    public void setTrainerId(Long trainerId) {
        this.trainerId = trainerId;
    }
} 