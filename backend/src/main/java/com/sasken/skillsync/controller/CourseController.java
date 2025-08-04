package com.sasken.skillsync.controller;

import com.sasken.skillsync.model.Course;
import com.sasken.skillsync.model.User;
import com.sasken.skillsync.repository.CourseRepository;
import com.sasken.skillsync.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/courses")
@CrossOrigin(origins = "*")
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses() {
        System.out.println("CourseController: Getting all courses...");
        List<Course> courses = courseRepository.findByIsActive(true);
        System.out.println("CourseController: Found " + courses.size() + " active courses");
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        Optional<Course> course = courseRepository.findById(id);
        return course.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Course>> getCoursesByCategory(@PathVariable Course.CourseCategory category) {
        List<Course> courses = courseRepository.findActiveCoursesByCategory(category);
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<Course>> getCoursesByType(@PathVariable Course.CourseType type) {
        List<Course> courses = courseRepository.findActiveCoursesByType(type);
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/trainer/{trainerId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('TRAINER')")
    public ResponseEntity<List<Course>> getCoursesByTrainer(@PathVariable Long trainerId) {
        List<Course> courses = courseRepository.findActiveCoursesByTrainer(trainerId);
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/mandatory")
    public ResponseEntity<List<Course>> getMandatoryCourses() {
        List<Course> courses = courseRepository.findActiveMandatoryCourses();
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Course>> searchCourses(@RequestParam String keyword) {
        List<Course> courses = courseRepository.searchActiveCoursesByKeyword(keyword);
        return ResponseEntity.ok(courses);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('TRAINER')")
    public ResponseEntity<Course> createCourse(@Valid @RequestBody CreateCourseRequest request) {
        Course course = new Course();
        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setCategory(request.getCategory());
        course.setType(request.getType());
        course.setDurationHours(request.getDurationHours());
        course.setMaxParticipants(request.getMaxParticipants());
        course.setPrerequisites(request.getPrerequisites());
        course.setMaterials(request.getMaterials());
        course.setMandatory(request.isMandatory());

        if (request.getTrainerId() != null) {
            Optional<User> trainer = userRepository.findById(request.getTrainerId());
            if (trainer.isPresent()) {
                course.setTrainer(trainer.get());
            }
        }

        Course savedCourse = courseRepository.save(course);
        return ResponseEntity.ok(savedCourse);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('TRAINER')")
    public ResponseEntity<Course> updateCourse(@PathVariable Long id, @Valid @RequestBody UpdateCourseRequest request) {
        Optional<Course> courseOpt = courseRepository.findById(id);
        if (courseOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Course course = courseOpt.get();
        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setCategory(request.getCategory());
        course.setType(request.getType());
        course.setDurationHours(request.getDurationHours());
        course.setMaxParticipants(request.getMaxParticipants());
        course.setPrerequisites(request.getPrerequisites());
        course.setMaterials(request.getMaterials());
        course.setMandatory(request.isMandatory());

        if (request.getTrainerId() != null) {
            Optional<User> trainer = userRepository.findById(request.getTrainerId());
            if (trainer.isPresent()) {
                course.setTrainer(trainer.get());
            }
        }

        Course savedCourse = courseRepository.save(course);
        return ResponseEntity.ok(savedCourse);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
        Optional<Course> courseOpt = courseRepository.findById(id);
        if (courseOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Course course = courseOpt.get();
        course.setActive(false);
        courseRepository.save(course);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/activate")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<Course> activateCourse(@PathVariable Long id) {
        Optional<Course> courseOpt = courseRepository.findById(id);
        if (courseOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Course course = courseOpt.get();
        course.setActive(true);
        Course savedCourse = courseRepository.save(course);
        return ResponseEntity.ok(savedCourse);
    }

    public static class CreateCourseRequest {
        private String title;
        private String description;
        private Course.CourseCategory category;
        private Course.CourseType type;
        private Integer durationHours;
        private Integer maxParticipants;
        private String prerequisites;
        private String materials;
        private boolean isMandatory;
        private Long trainerId;

        // Getters and Setters
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public Course.CourseCategory getCategory() { return category; }
        public void setCategory(Course.CourseCategory category) { this.category = category; }

        public Course.CourseType getType() { return type; }
        public void setType(Course.CourseType type) { this.type = type; }

        public Integer getDurationHours() { return durationHours; }
        public void setDurationHours(Integer durationHours) { this.durationHours = durationHours; }

        public Integer getMaxParticipants() { return maxParticipants; }
        public void setMaxParticipants(Integer maxParticipants) { this.maxParticipants = maxParticipants; }

        public String getPrerequisites() { return prerequisites; }
        public void setPrerequisites(String prerequisites) { this.prerequisites = prerequisites; }

        public String getMaterials() { return materials; }
        public void setMaterials(String materials) { this.materials = materials; }

        public boolean isMandatory() { return isMandatory; }
        public void setMandatory(boolean mandatory) { isMandatory = mandatory; }

        public Long getTrainerId() { return trainerId; }
        public void setTrainerId(Long trainerId) { this.trainerId = trainerId; }
    }

    public static class UpdateCourseRequest {
        private String title;
        private String description;
        private Course.CourseCategory category;
        private Course.CourseType type;
        private Integer durationHours;
        private Integer maxParticipants;
        private String prerequisites;
        private String materials;
        private boolean isMandatory;
        private Long trainerId;

        // Getters and Setters
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public Course.CourseCategory getCategory() { return category; }
        public void setCategory(Course.CourseCategory category) { this.category = category; }

        public Course.CourseType getType() { return type; }
        public void setType(Course.CourseType type) { this.type = type; }

        public Integer getDurationHours() { return durationHours; }
        public void setDurationHours(Integer durationHours) { this.durationHours = durationHours; }

        public Integer getMaxParticipants() { return maxParticipants; }
        public void setMaxParticipants(Integer maxParticipants) { this.maxParticipants = maxParticipants; }

        public String getPrerequisites() { return prerequisites; }
        public void setPrerequisites(String prerequisites) { this.prerequisites = prerequisites; }

        public String getMaterials() { return materials; }
        public void setMaterials(String materials) { this.materials = materials; }

        public boolean isMandatory() { return isMandatory; }
        public void setMandatory(boolean mandatory) { isMandatory = mandatory; }

        public Long getTrainerId() { return trainerId; }
        public void setTrainerId(Long trainerId) { this.trainerId = trainerId; }
    }
} 