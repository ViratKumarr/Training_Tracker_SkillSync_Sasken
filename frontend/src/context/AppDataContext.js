import React, { createContext, useContext, useState, useEffect } from 'react';
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

  // Initialize data
  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      setLoading(true);
      
      // Initialize users
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

      // Initialize courses
      const initialCourses = [
        {
          id: 1,
          title: 'Java Programming Fundamentals',
          description: 'Learn core Java concepts and object-oriented programming',
          category: 'TECHNICAL',
          type: 'VIRTUAL',
          durationHours: 40,
          materials: 'https://www.udemy.com/course/java-programming-tutorial-for-beginners/',
          prerequisites: 'Basic computer knowledge',
          isMandatory: true
        },
        {
          id: 2,
          title: 'Spring Boot Development',
          description: 'Master Spring Boot framework for building web applications',
          category: 'TECHNICAL',
          type: 'HYBRID',
          durationHours: 60,
          materials: 'https://www.udemy.com/course/spring-boot-tutorial-for-beginners/',
          prerequisites: 'Java Programming Fundamentals',
          isMandatory: true
        },
        {
          id: 3,
          title: 'React.js for Beginners',
          description: 'Learn React.js for building modern web applications',
          category: 'TECHNICAL',
          type: 'SELF_PACED',
          durationHours: 35,
          materials: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/',
          prerequisites: 'JavaScript basics',
          isMandatory: false
        },
        {
          id: 4,
          title: 'Leadership Skills',
          description: 'Develop essential leadership and management skills',
          category: 'LEADERSHIP',
          type: 'IN_PERSON',
          durationHours: 20,
          materials: 'Internal materials',
          prerequisites: 'None',
          isMandatory: false
        },
        {
          id: 5,
          title: 'Cybersecurity Awareness',
          description: 'Learn about cybersecurity best practices',
          category: 'COMPLIANCE',
          type: 'VIRTUAL',
          durationHours: 15,
          materials: 'https://www.udemy.com/course/cybersecurity-awareness-training/',
          prerequisites: 'None',
          isMandatory: true
        }
      ];

      setUsers(initialUsers);
      setCourses(initialCourses);
      
      // Initialize with existing enrollments
      const initialEnrollments = [
        {
          id: 1,
          user: { id: 4, firstName: 'Employee', lastName: 'User' },
          course: { id: 1, title: 'Java Programming Fundamentals', materials: 'https://www.udemy.com/course/java-programming-tutorial-for-beginners/' },
          status: 'COMPLETED',
          enrolledAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
          completedAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
          grade: 'A+'
        },
        {
          id: 2,
          user: { id: 4, firstName: 'Employee', lastName: 'User' },
          course: { id: 3, title: 'React.js for Beginners', materials: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/' },
          status: 'IN_PROGRESS',
          enrolledAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 3,
          user: { id: 4, firstName: 'Employee', lastName: 'User' },
          course: { id: 5, title: 'Cybersecurity Awareness', materials: 'https://www.udemy.com/course/cybersecurity-awareness-training/' },
          status: 'IN_PROGRESS',
          enrolledAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 4,
          user: { id: 3, firstName: 'Trainer', lastName: 'User' },
          course: { id: 2, title: 'Spring Boot Development', materials: 'https://www.udemy.com/course/spring-boot-tutorial-for-beginners/' },
          status: 'COMPLETED',
          enrolledAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          completedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
          grade: 'A+'
        }
      ];

      setEnrollments(initialEnrollments);
      
      // Initialize progress data
      const initialProgress = [
        {
          id: 1,
          user: { id: 4 },
          course: { id: 1, title: 'Java Programming Fundamentals' },
          completionPercentage: 100,
          lastAccessedAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
          timeSpentMinutes: 2400
        },
        {
          id: 2,
          user: { id: 4 },
          course: { id: 3, title: 'React.js for Beginners' },
          completionPercentage: 65,
          lastAccessedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          timeSpentMinutes: 1365
        },
        {
          id: 3,
          user: { id: 4 },
          course: { id: 5, title: 'Cybersecurity Awareness' },
          completionPercentage: 45,
          lastAccessedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          timeSpentMinutes: 405
        },
        {
          id: 4,
          user: { id: 3 },
          course: { id: 2, title: 'Spring Boot Development' },
          completionPercentage: 100,
          lastAccessedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
          timeSpentMinutes: 3600
        }
      ];

      setProgress(initialProgress);

      // Initialize notifications
      const initialNotifications = [
        {
          id: 1,
          title: 'Course Assignment',
          message: 'You have been assigned to Spring Boot Development course. Please complete it within 30 days.',
          type: 'COURSE_ASSIGNMENT',
          priority: 'HIGH',
          status: 'SENT',
          isRead: false,
          sentAt: '2024-01-26T09:00:00Z',
          relatedEntityType: 'COURSE',
          relatedEntityId: 2
        }
      ];

      setNotifications(initialNotifications);
      
      // Initialize certificates
      const initialCertificates = [
        {
          id: 1,
          certificateNumber: 'CERT-2024-001',
          grade: 'A+',
          score: 95.0,
          maxScore: 100.0,
          completionPercentage: 100.0,
          issuedBy: 'SkillSync Training',
          status: 'ISSUED',
          issuedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          completionDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          course: {
            id: 1,
            title: 'Java Programming Fundamentals',
            description: 'Learn core Java concepts and object-oriented programming',
            durationHours: 40,
            category: 'TECHNICAL'
          },
          user: {
            id: 4,
            firstName: 'Employee',
            lastName: 'User'
          }
        }
      ];

      setCertificates(initialCertificates);

      // Initialize feedback
      const initialFeedback = [
        {
          id: 1,
          courseName: 'Java Programming Fundamentals',
          userName: 'Employee User',
          userEmail: 'employee@sasken.com',
          contentRating: 5,
          instructorRating: 4,
          facilityRating: 5,
          overallSatisfaction: 4,
          wouldRecommend: true,
          comments: 'Excellent course! The instructor was very knowledgeable and the content was well-structured.',
          suggestions: 'Could include more hands-on exercises.',
          submittedAt: '2024-01-15T10:30:00Z',
          status: 'SUBMITTED'
        }
      ];

      setFeedback(initialFeedback);

    } catch (error) {
      console.log('Error initializing data:', error);
    } finally {
      setLoading(false);
    }
  };

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
      throw new Error('Already enrolled in this course');
    }

    // Create new enrollment
    const newEnrollment = {
      id: Date.now(),
      user: { id: user.id, firstName: user.firstName, lastName: user.lastName },
      course: {
        id: course.id,
        title: course.title,
        materials: course.materials,
        category: course.category,
        type: course.type,
        durationHours: course.durationHours
      },
      status: 'ENROLLED',
      enrolledAt: new Date().toISOString(),
      type: course.isMandatory ? 'MANDATORY' : 'OPTIONAL'
    };

    // Create initial progress
    const newProgress = {
      id: Date.now() + 1,
      user: { id: user.id },
      course: { id: course.id, title: course.title },
      completionPercentage: 0,
      lastAccessedAt: new Date().toISOString(),
      timeSpentMinutes: 0,
      status: 'IN_PROGRESS'
    };

    // Create enrollment notification
    const newNotification = {
      id: Date.now() + 2,
      title: 'Course Enrollment',
      message: `You have successfully enrolled in ${course.title}. Start learning now!`,
      type: 'COURSE_ASSIGNMENT',
      priority: 'MEDIUM',
      status: 'SENT',
      isRead: false,
      sentAt: new Date().toISOString(),
      relatedEntityType: 'COURSE',
      relatedEntityId: courseId,
      userId: userId
    };

    // Update state
    setEnrollments(prev => [...prev, newEnrollment]);
    setProgress(prev => [...prev, newProgress]);
    setNotifications(prev => [newNotification, ...prev]);

    return newEnrollment;
  };

  // Update progress
  const updateProgress = (userId, courseId, progressData) => {
    setProgress(prev => prev.map(p =>
      p.user.id === userId && p.course.id === courseId
        ? { ...p, ...progressData, lastAccessedAt: new Date().toISOString() }
        : p
    ));

    // If course is completed, update enrollment status
    if (progressData.completionPercentage === 100) {
      setEnrollments(prev => prev.map(e =>
        e.user.id === userId && e.course.id === courseId
          ? { ...e, status: 'COMPLETED', completedAt: new Date().toISOString(), grade: 'A' }
          : e
      ));

      // Create completion notification
      const course = courses.find(c => c.id === courseId);
      const completionNotification = {
        id: Date.now() + 3,
        title: 'Course Completion',
        message: `Congratulations! You have completed ${course?.title}. Your certificate is ready for download.`,
        type: 'COURSE_COMPLETION',
        priority: 'HIGH',
        status: 'SENT',
        isRead: false,
        sentAt: new Date().toISOString(),
        relatedEntityType: 'COURSE',
        relatedEntityId: courseId,
        userId: userId
      };

      setNotifications(prev => [completionNotification, ...prev]);

      // Generate certificate
      generateCertificate(userId, courseId);
    }
  };

  // Generate certificate
  const generateCertificate = (userId, courseId) => {
    const user = users.find(u => u.id === userId);
    const course = courses.find(c => c.id === courseId);
    const enrollment = enrollments.find(e => e.user.id === userId && e.course.id === courseId);

    if (user && course && enrollment) {
      const newCertificate = {
        id: Date.now() + 4,
        certificateNumber: `CERT-${Date.now()}`,
        grade: enrollment.grade || 'A',
        score: 95.0,
        maxScore: 100.0,
        completionPercentage: 100.0,
        issuedBy: 'SkillSync Training',
        status: 'ISSUED',
        issuedAt: new Date(),
        completionDate: new Date(),
        course: {
          id: course.id,
          title: course.title,
          description: course.description,
          durationHours: course.durationHours,
          category: course.category
        },
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName
        }
      };

      setCertificates(prev => [...prev, newCertificate]);
    }
  };

  // Add feedback
  const addFeedback = (feedbackData) => {
    const newFeedback = {
      id: Date.now() + 5,
      ...feedbackData,
      submittedAt: new Date().toISOString(),
      status: 'SUBMITTED'
    };

    setFeedback(prev => [newFeedback, ...prev]);
    return newFeedback;
  };

  // Update feedback
  const updateFeedback = (feedbackId, feedbackData) => {
    setFeedback(prev => prev.map(f =>
      f.id === feedbackId
        ? { ...f, ...feedbackData, status: 'SUBMITTED' }
        : f
    ));
  };

  // Delete feedback
  const deleteFeedback = (feedbackId) => {
    setFeedback(prev => prev.filter(f => f.id !== feedbackId));
  };

  // Mark notification as read
  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev => prev.map(n =>
      n.id === notificationId
        ? { ...n, isRead: true }
        : n
    ));
  };

  // Mark all notifications as read
  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // Delete notification
  const deleteNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  // Get user-specific data
  const getUserEnrollments = (userId) => {
    return enrollments.filter(e => e.user.id === userId);
  };

  const getUserProgress = (userId) => {
    return progress.filter(p => p.user.id === userId);
  };

  const getUserNotifications = (userId) => {
    return notifications.filter(n => n.userId === userId || !n.userId);
  };

  const getUserCertificates = (userId) => {
    return certificates.filter(c => c.user.id === userId);
  };

  const value = {
    // Data
    users,
    courses,
    enrollments,
    progress,
    notifications,
    certificates,
    feedback,
    loading,

    // Actions
    enrollInCourse,
    updateProgress,
    addFeedback,
    updateFeedback,
    deleteFeedback,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,

    // Getters
    getUserEnrollments,
    getUserProgress,
    getUserNotifications,
    getUserCertificates
  };

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
};
