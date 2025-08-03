package com.sasken.skillsync.repository;

import com.sasken.skillsync.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    
    List<Course> findByCategory(Course.CourseCategory category);
    
    List<Course> findByType(Course.CourseType type);
    
    List<Course> findByIsActive(boolean isActive);
    
    List<Course> findByIsMandatory(boolean isMandatory);
    
    List<Course> findByTrainerId(Long trainerId);
    
    @Query("SELECT c FROM Course c WHERE c.trainer.id = :trainerId AND c.isActive = true")
    List<Course> findActiveCoursesByTrainer(@Param("trainerId") Long trainerId);
    
    @Query("SELECT c FROM Course c WHERE c.category = :category AND c.isActive = true")
    List<Course> findActiveCoursesByCategory(@Param("category") Course.CourseCategory category);
    
    @Query("SELECT c FROM Course c WHERE c.type = :type AND c.isActive = true")
    List<Course> findActiveCoursesByType(@Param("type") Course.CourseType type);
    
    @Query("SELECT c FROM Course c WHERE c.isMandatory = true AND c.isActive = true")
    List<Course> findActiveMandatoryCourses();
    
    @Query("SELECT c FROM Course c WHERE c.isActive = true AND (LOWER(c.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(c.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(c.materials) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(c.prerequisites) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Course> searchActiveCoursesByKeyword(@Param("keyword") String keyword);
    
    @Query("SELECT c FROM Course c WHERE LOWER(c.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(c.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(c.materials) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(c.prerequisites) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Course> searchCoursesByKeyword(@Param("keyword") String keyword);
    
    @Query("SELECT COUNT(c) FROM Course c WHERE c.category = :category")
    long countByCategory(@Param("category") Course.CourseCategory category);
    
    @Query("SELECT COUNT(c) FROM Course c WHERE c.type = :type")
    long countByType(@Param("type") Course.CourseType type);
} 