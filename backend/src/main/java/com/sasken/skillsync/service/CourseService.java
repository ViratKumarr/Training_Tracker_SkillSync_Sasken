package com.sasken.skillsync.service;

import com.sasken.skillsync.model.Course;
import com.sasken.skillsync.model.User;
import com.sasken.skillsync.repository.CourseRepository;
import com.sasken.skillsync.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Course> getAllActiveCourses() {
        return courseRepository.findByIsActive(true);
    }

    public Optional<Course> getCourseById(Long id) {
        return courseRepository.findById(id);
    }

    public List<Course> getCoursesByCategory(Course.CourseCategory category) {
        return courseRepository.findActiveCoursesByCategory(category);
    }

    public List<Course> getCoursesByType(Course.CourseType type) {
        return courseRepository.findActiveCoursesByType(type);
    }

    public List<Course> getCoursesByTrainer(Long trainerId) {
        return courseRepository.findActiveCoursesByTrainer(trainerId);
    }

    public List<Course> getMandatoryCourses() {
        return courseRepository.findActiveMandatoryCourses();
    }

    public List<Course> searchCourses(String keyword) {
        return courseRepository.searchCoursesByKeyword(keyword);
    }

    public Course createCourse(Course course) {
        course.setCreatedAt(LocalDateTime.now());
        course.setUpdatedAt(LocalDateTime.now());
        course.setActive(true);
        return courseRepository.save(course);
    }

    public Optional<Course> updateCourse(Long id, Course courseDetails) {
        return courseRepository.findById(id).map(course -> {
            course.setTitle(courseDetails.getTitle());
            course.setDescription(courseDetails.getDescription());
            course.setCategory(courseDetails.getCategory());
            course.setType(courseDetails.getType());
            course.setDurationHours(courseDetails.getDurationHours());
            course.setMaxParticipants(courseDetails.getMaxParticipants());
            course.setPrerequisites(courseDetails.getPrerequisites());
            course.setMaterials(courseDetails.getMaterials());
            course.setMandatory(courseDetails.isMandatory());
            course.setUpdatedAt(LocalDateTime.now());
            
            if (courseDetails.getTrainer() != null) {
                course.setTrainer(courseDetails.getTrainer());
            }
            
            return courseRepository.save(course);
        });
    }

    public boolean deleteCourse(Long id) {
        return courseRepository.findById(id).map(course -> {
            course.setActive(false);
            course.setUpdatedAt(LocalDateTime.now());
            courseRepository.save(course);
            return true;
        }).orElse(false);
    }

    public long getCourseCountByCategory(Course.CourseCategory category) {
        return courseRepository.countByCategory(category);
    }

    public long getCourseCountByType(Course.CourseType type) {
        return courseRepository.countByType(type);
    }

    public List<Course> getCoursesForUser(Long userId) {
        // This would typically involve enrollment logic
        // For now, return all active courses
        return getAllActiveCourses();
    }
} 