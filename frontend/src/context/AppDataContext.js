import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiClient from '../services/apiClient';

const AppDataContext = createContext();

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
};

export const AppDataProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [progress, setProgress] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create 15 fallback courses if API is not available
  const createFallbackCourses = useCallback(() => {
    return [
      {
        id: 1,
        title: "Java Masterclass 2025: 130+ Hours of Expert Lessons",
        description: "Complete Java programming course from beginner to expert with 130+ hours of content",
        category: "TECHNICAL",
        type: "SELF_PACED",
        durationHours: 130,
        materials: "https://www.udemy.com/course/java-the-complete-java-developer-course/?couponCode=LETSLEARNNOW"
      },
      {
        id: 2,
        title: "Learn JAVA Programming - Beginner to Master",
        description: "Master Java programming from basics to advanced concepts with hands-on projects",
        category: "TECHNICAL",
        type: "SELF_PACED",
        durationHours: 95,
        materials: "https://www.udemy.com/course/java-se-programming/?couponCode=LETSLEARNNOW"
      },
      {
        id: 3,
        title: "Java Spring Framework 6, Spring Boot 3, Spring AI Telusko",
        description: "Learn Spring Framework 6, Spring Boot 3, and Spring AI with practical examples",
        category: "TECHNICAL",
        type: "SELF_PACED",
        durationHours: 75,
        materials: "https://www.udemy.com/course/spring-5-with-spring-boot-2/?couponCode=KEEPLEARNING"
      },
      {
        id: 4,
        title: "[NEW] Spring Boot 3, Spring 6 & Hibernate for Beginners",
        description: "Complete guide to Spring Boot 3, Spring 6, and Hibernate for beginners",
        category: "TECHNICAL",
        type: "SELF_PACED",
        durationHours: 80,
        materials: "https://www.udemy.com/course/spring-hibernate-tutorial/?couponCode=LETSLEARNNOW"
      },
      {
        id: 5,
        title: "React - The Complete Guide 2025 (incl. Next.js, Redux)",
        description: "Master React, Next.js, Redux and build modern web applications",
        category: "TECHNICAL",
        type: "SELF_PACED",
        durationHours: 90,
        materials: "https://www.udemy.com/course/react-the-complete-guide-incl-redux/?couponCode=LETSLEARNNOW"
      },
      {
        id: 6,
        title: "The Ultimate React Course 2025: React, Next.js, Redux & More",
        description: "Complete React course covering React, Next.js, Redux and modern development",
        category: "TECHNICAL",
        type: "SELF_PACED",
        durationHours: 85,
        materials: "https://www.udemy.com/course/the-ultimate-react-course/?couponCode=LETSLEARNNOW"
      },
      {
        id: 7,
        title: "The Complete Full-Stack Web Development Bootcamp",
        description: "Complete full-stack web development bootcamp covering frontend and backend",
        category: "TECHNICAL",
        type: "SELF_PACED",
        durationHours: 120,
        materials: "https://www.udemy.com/course/the-complete-web-development-bootcamp/?couponCode=KEEPLEARNING"
      },
      {
        id: 8,
        title: "The Ultimate MySQL Bootcamp: Go from SQL Beginner to Expert",
        description: "Master MySQL and SQL from beginner to expert level with practical projects",
        category: "TECHNICAL",
        type: "SELF_PACED",
        durationHours: 65,
        materials: "https://www.udemy.com/course/the-ultimate-mysql-bootcamp-go-from-sql-beginner-to-expert/?couponCode=KEEPLEARNING"
      },
      {
        id: 9,
        title: "SQL - MySQL for Data Analytics and Business Intelligence",
        description: "Learn SQL and MySQL for data analytics and business intelligence applications",
        category: "TECHNICAL",
        type: "SELF_PACED",
        durationHours: 55,
        materials: "https://www.udemy.com/course/sql-mysql-for-data-analytics-and-business-intelligence/?couponCode=KEEPLEARNING"
      },
      {
        id: 10,
        title: "100 Days of Code: The Complete Python Pro Bootcamp",
        description: "Complete Python programming bootcamp with 100 days of coding challenges",
        category: "TECHNICAL",
        type: "SELF_PACED",
        durationHours: 100,
        materials: "https://www.udemy.com/course/100-days-of-code/?couponCode=LETSLEARNNOW"
      },
      {
        id: 11,
        title: "[NEW] Ultimate AWS Certified Cloud Practitioner CLF-C02 2025",
        description: "Complete AWS Cloud Practitioner certification course for 2025",
        category: "TECHNICAL",
        type: "SELF_PACED",
        durationHours: 45,
        materials: "https://www.udemy.com/course/aws-certified-cloud-practitioner-new/?couponCode=KEEPLEARNING"
      },
      {
        id: 12,
        title: "Build Responsive Real-World Websites with HTML and CSS",
        description: "Learn to build responsive, real-world websites using HTML5 and CSS3",
        category: "TECHNICAL",
        type: "SELF_PACED",
        durationHours: 40,
        materials: "https://www.udemy.com/course/design-and-develop-a-killer-website-with-html5-and-css3/?couponCode=LETSLEARNNOW"
      },
      {
        id: 13,
        title: "C Programming For Beginners - Master the C Language",
        description: "Complete C programming course for beginners to master the C language",
        category: "TECHNICAL",
        type: "SELF_PACED",
        durationHours: 50,
        materials: "https://www.udemy.com/course/c-programming-for-beginners-/?couponCode=KEEPLEARNING"
      },
      {
        id: 14,
        title: "Python Data Structures & Algorithms + LEETCODE Exercises",
        description: "Master Python data structures and algorithms with LeetCode practice exercises",
        category: "TECHNICAL",
        type: "SELF_PACED",
        durationHours: 70,
        materials: "https://www.udemy.com/course/data-structures-algorithms-python/?couponCode=KEEPLEARNING"
      },
      {
        id: 15,
        title: "The Complete Web Development Bootcamp",
        description: "Complete web development bootcamp covering all aspects of modern web development",
        category: "TECHNICAL",
        type: "SELF_PACED",
        durationHours: 110,
        materials: "https://www.udemy.com/course/the-complete-web-development-bootcamp/?couponCode=LETSLEARNNOW"
      }
    ];
  }, []);

  // Load courses from API
  const loadCourses = useCallback(async () => {
    try {
      const response = await apiClient.get('/courses');
      setCourses(response.data);
    } catch (error) {
      console.log('Failed to load courses from API, using fallback');
      const fallbackCourses = createFallbackCourses();
      setCourses(fallbackCourses);
    }
  }, [createFallbackCourses]);

  const initializeData = useCallback(async () => {
    try {
      setLoading(true);

      // Load courses from API
      await loadCourses();

      // Initialize users only - no demo data
      const initialUsers = [
        {
          id: 1,
          firstName: 'Admin',
          lastName: 'User',
          email: 'admin@sasken.com',
          role: 'ADMIN',
          department: 'IT',
          employeeId: 'EMP001',
          phoneNumber: '+1234567890',
          isActive: true,
          createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 2,
          firstName: 'Manager',
          lastName: 'User',
          email: 'manager@sasken.com',
          role: 'MANAGER',
          department: 'HR',
          employeeId: 'EMP002',
          phoneNumber: '+1234567891',
          isActive: true,
          createdAt: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 3,
          firstName: 'Trainer',
          lastName: 'User',
          email: 'trainer@sasken.com',
          role: 'TRAINER',
          department: 'Training',
          employeeId: 'EMP003',
          phoneNumber: '+1234567892',
          isActive: true,
          createdAt: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 4,
          firstName: 'Employee',
          lastName: 'User',
          email: 'employee@sasken.com',
          role: 'EMPLOYEE',
          department: 'Engineering',
          employeeId: 'EMP004',
          phoneNumber: '+1234567893',
          isActive: true,
          createdAt: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];

      setUsers(initialUsers);
      // No demo courses, enrollments, progress, or certificates - clean start

    } catch (error) {
      console.log('Error initializing data:', error);
    } finally {
      setLoading(false);
    }
  }, [loadCourses]);

  // Initialize data
  useEffect(() => {
    initializeData();
  }, [initializeData]);





  // Enroll user in a course
  const enrollInCourse = (userId, courseId, currentUser) => {
    const user = users.find(u => u.id === userId);
    const course = courses.find(c => c.id === courseId);

    if (!user || !course) {
      throw new Error('User or course not found');
    }

    // Check if already enrolled
    const existingEnrollment = enrollments.find(e => e.user.id === userId && e.course.id === courseId);
    if (existingEnrollment) {
      throw new Error('User is already enrolled in this course');
    }

    const newEnrollment = {
      id: Date.now(),
      user: user,
      course: course,
      status: 'ENROLLED',
      enrolledAt: new Date().toISOString(),
      completionPercentage: 0,
      type: 'SELF_ENROLLED'
    };

    setEnrollments(prev => [...prev, newEnrollment]);

    // Create initial progress record
    const newProgress = {
      id: Date.now() + 1,
      user: user,
      course: course,
      completionPercentage: 0,
      status: 'NOT_STARTED',
      startedAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString(),
      timeSpentMinutes: 0
    };

    setProgress(prev => [...prev, newProgress]);

    // Generate enrollment notification
    const enrollmentNotification = {
      id: Date.now() + 2,
      user: user,
      title: `Successfully Enrolled in ${course.title}!`,
      message: `Welcome! You have successfully enrolled in ${course.title}. Start learning now and track your progress.`,
      type: 'COURSE_ENROLLMENT',
      read: false,
      sentAt: new Date().toISOString(),
      status: 'SENT',
      priority: 'MEDIUM'
    };

    setNotifications(prev => [...prev, enrollmentNotification]);

    return newEnrollment;
  };

  // Update progress with real-time calculation
  const updateProgress = (userId, courseId, completionPercentage) => {
    setProgress(prev => prev.map(p => {
      if (p.user.id === userId && p.course.id === courseId) {
        const course = courses.find(c => c.id === courseId);
        const timeSpentMinutes = course ? Math.round(course.durationHours * 60 * (completionPercentage / 100)) : 0;
        
        return {
          ...p,
          completionPercentage,
          timeSpentMinutes,
          lastAccessedAt: new Date().toISOString(),
          status: completionPercentage >= 100 ? 'COMPLETED' : completionPercentage > 0 ? 'IN_PROGRESS' : 'NOT_STARTED',
          completedAt: completionPercentage >= 100 ? new Date().toISOString() : null
        };
      }
      return p;
    }));

    // Update enrollment status
    setEnrollments(prev => prev.map(e => {
      if (e.user.id === userId && e.course.id === courseId) {
        return {
          ...e,
          completionPercentage,
          status: completionPercentage >= 100 ? 'COMPLETED' : completionPercentage > 0 ? 'IN_PROGRESS' : 'ENROLLED',
          completedAt: completionPercentage >= 100 ? new Date().toISOString() : null
        };
      }
      return e;
    }));

    // Generate certificate and notifications if completed
    if (completionPercentage >= 100) {
      const user = users.find(u => u.id === userId);
      const course = courses.find(c => c.id === courseId);

      if (user && course) {
        // Generate certificate
        const newCertificate = {
          id: Date.now() + 2,
          user: user,
          course: course,
          issuedAt: new Date().toISOString(),
          certificateNumber: `CERT-${course.title.replace(/\s+/g, '').toUpperCase()}-${userId}-${Date.now()}`,
          validUntil: new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000).toISOString(), // 2 years
          status: 'ISSUED',
          completionDate: new Date().toISOString(),
          completionPercentage: 100,
          grade: 'A',
          score: 95,
          maxScore: 100,
          issuedBy: 'SkillSync - Sasken Technologies'
        };

        setCertificates(prev => [...prev, newCertificate]);

        // Generate completion notification
        const completionNotification = {
          id: Date.now() + 3,
          user: user,
          title: `Course Completed - ${course.title}!`,
          message: `Congratulations! You have successfully completed ${course.title} with 100% completion.`,
          type: 'COURSE_COMPLETION',
          read: false,
          sentAt: new Date().toISOString(),
          status: 'SENT',
          priority: 'HIGH'
        };

        // Generate certificate notification
        const certificateNotification = {
          id: Date.now() + 4,
          user: user,
          title: `Certificate Ready - ${course.title}`,
          message: `Your certificate for ${course.title} is ready for download.`,
          type: 'CERTIFICATE_ISSUED',
          read: false,
          sentAt: new Date().toISOString(),
          status: 'SENT',
          priority: 'MEDIUM'
        };

        setNotifications(prev => [...prev, completionNotification, certificateNotification]);
      }
    }

    // Generate enrollment notification if this is the first progress update
    const existingProgress = progress.find(p => p.user.id === userId && p.course.id === courseId);
    if (!existingProgress && completionPercentage > 0) {
      const user = users.find(u => u.id === userId);
      const course = courses.find(c => c.id === courseId);

      if (user && course) {
        const enrollmentNotification = {
          id: Date.now() + 5,
          user: user,
          title: `Enrolled in ${course.title}`,
          message: `You have successfully enrolled in ${course.title}. Start learning now!`,
          type: 'COURSE_ENROLLMENT',
          read: false,
          sentAt: new Date().toISOString(),
          status: 'SENT',
          priority: 'MEDIUM'
        };

        setNotifications(prev => [...prev, enrollmentNotification]);
      }
    }
  };

  // Helper functions
  const getUserEnrollments = (userId) => {
    return enrollments.filter(e => e.user.id === userId);
  };

  const getUserProgress = (userId) => {
    return progress.filter(p => p.user.id === userId);
  };

  const getUserCertificates = (userId) => {
    return certificates.filter(c => c.user.id === userId);
  };

  const getUserNotifications = (userId) => {
    return notifications.filter(n => n.user.id === userId);
  };

  const getUserFeedback = (userId) => {
    return feedback.filter(f => f.user.id === userId);
  };

  // Notification management functions
  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev => prev.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    ));
  };

  const markAllNotificationsAsRead = (userId) => {
    setNotifications(prev => prev.map(n =>
      n.user.id === userId ? { ...n, read: true } : n
    ));
  };

  const deleteNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  // Delete enrollment function
  const deleteEnrollment = (enrollmentId) => {
    // Remove enrollment
    setEnrollments(prev => prev.filter(e => e.id !== enrollmentId));

    // Remove associated progress
    setProgress(prev => prev.filter(p => {
      const enrollment = enrollments.find(e => e.id === enrollmentId);
      if (enrollment) {
        return !(p.user.id === enrollment.user.id && p.course.id === enrollment.course.id);
      }
      return true;
    }));

    // Remove associated certificates
    setCertificates(prev => prev.filter(c => {
      const enrollment = enrollments.find(e => e.id === enrollmentId);
      if (enrollment) {
        return !(c.user.id === enrollment.user.id && c.course.id === enrollment.course.id);
      }
      return true;
    }));
  };

  // Feedback management functions
  const addFeedback = (feedbackData) => {
    const newFeedback = {
      id: Date.now(),
      user: users.find(u => u.id === feedbackData.userId),
      course: courses.find(c => c.id === feedbackData.courseId),
      contentRating: feedbackData.contentRating,
      instructorRating: feedbackData.instructorRating,
      facilityRating: feedbackData.facilityRating,
      overallSatisfaction: feedbackData.overallSatisfaction,
      wouldRecommend: feedbackData.wouldRecommend,
      comments: feedbackData.comments,
      suggestions: feedbackData.suggestions,
      submittedAt: new Date().toISOString(),
      status: 'SUBMITTED'
    };

    setFeedback(prev => [...prev, newFeedback]);
    return newFeedback;
  };

  const updateFeedback = (feedbackId, updatedData) => {
    setFeedback(prev => prev.map(f =>
      f.id === feedbackId ? { ...f, ...updatedData, updatedAt: new Date().toISOString() } : f
    ));
  };

  const deleteFeedback = (feedbackId) => {
    setFeedback(prev => prev.filter(f => f.id !== feedbackId));
  };

  const value = {
    users,
    courses,
    enrollments,
    progress,
    notifications,
    certificates,
    feedback,
    loading,
    enrollInCourse,
    updateProgress,
    getUserEnrollments,
    getUserProgress,
    getUserCertificates,
    getUserNotifications,
    getUserFeedback,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    deleteEnrollment,
    addFeedback,
    updateFeedback,
    deleteFeedback,
    setCourses,
    setEnrollments,
    setProgress,
    setNotifications,
    setCertificates,
    setFeedback
  };

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
};

export default AppDataContext;
