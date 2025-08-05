import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, ProgressBar, Badge, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../context/AppDataContext';


const Dashboard = ({ user }) => {
  const navigate = useNavigate();
  const {
    courses,
    getUserEnrollments,
    getUserCertificates,
    getUserNotifications,
    loading: contextLoading
  } = useAppData();

  const [loading, setLoading] = useState(true);

  // Get real-time data from context
  const enrollments = getUserEnrollments(user.id);
  const certificates = getUserCertificates(user.id);
  const notifications = getUserNotifications(user.id);

  // Calculate real-time stats
  const stats = {
    totalCourses: courses.length, // Show total available courses (15)
    enrolledCourses: enrollments.length, // Real-time enrolled count
    completedCourses: enrollments.filter(e => e.status === 'COMPLETED').length, // Real-time completed count
    inProgressCourses: enrollments.filter(e => e.status === 'IN_PROGRESS' || e.status === 'ENROLLED').length, // Real-time in-progress count
    certificates: certificates.length, // Real-time certificate count
    notifications: notifications.filter(n => !n.read).length // Real-time unread notification count
  };

  // Calculate recent courses (last 5 enrolled)
  const recentCourses = enrollments
    .sort((a, b) => new Date(b.enrolledAt) - new Date(a.enrolledAt))
    .slice(0, 5);



  useEffect(() => {
    // Data is now real-time from context, just set loading to false
    setLoading(contextLoading);
  }, [contextLoading]);

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'Administrator';
      case 'MANAGER':
        return 'Manager';
      case 'TRAINER':
        return 'Trainer';
      case 'EMPLOYEE':
        return 'Employee';
      default:
        return role;
    }
  };

  const getProgressPercentage = (enrollment) => {
    // Find progress for this enrollment
    const progress = recentCourses.find(p => p.course.id === enrollment.course.id);
    return progress ? progress.completionPercentage || 0 : 0;
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'browse':
        navigate('/courses');
        break;
      case 'progress':
        navigate('/progress');
        break;
      case 'certificates':
        navigate('/certificates');
        break;
      case 'notifications':
        navigate('/notifications');
        break;
      default:
        break;
    }
  };

  const handleStatCardClick = (cardType) => {
    switch (cardType) {
      case 'totalCourses':
        navigate('/courses');
        break;
      case 'enrolledCourses':
        navigate('/enrollments');
        break;
      case 'completedCourses':
        navigate('/enrollments?filter=completed');
        break;
      case 'inProgressCourses':
        navigate('/enrollments?filter=in-progress');
        break;
      case 'certificates':
        navigate('/certificates');
        break;
      case 'notifications':
        navigate('/notifications');
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <Container>
        <div className="loading-container">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h1 className="fw-bold text-primary">
            <i className="fas fa-tachometer-alt me-2"></i>
            Welcome back, {user.firstName}!
          </h1>
          <p className="text-muted">
            {getRoleDisplayName(user.role)} • {user.department}
          </p>
        </Col>
      </Row>

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={4} className="mb-3">
          <div
            className="stat-card clickable-card"
            onClick={() => handleStatCardClick('totalCourses')}
            style={{ cursor: 'pointer' }}
            title="Click to view all courses"
          >
            <h3>{stats.totalCourses}</h3>
            <p className="mb-0">Total Courses</p>
            <i className="fas fa-external-link-alt card-icon"></i>
          </div>
        </Col>
        <Col md={4} className="mb-3">
          <div
            className="stat-card clickable-card"
            onClick={() => handleStatCardClick('enrolledCourses')}
            style={{ cursor: 'pointer' }}
            title="Click to view your enrollments"
          >
            <h3>{stats.enrolledCourses}</h3>
            <p className="mb-0">Enrolled Courses</p>
            <i className="fas fa-external-link-alt card-icon"></i>
          </div>
        </Col>
        <Col md={4} className="mb-3">
          <div
            className="stat-card clickable-card"
            onClick={() => handleStatCardClick('completedCourses')}
            style={{ cursor: 'pointer' }}
            title="Click to view completed courses"
          >
            <h3>{stats.completedCourses}</h3>
            <p className="mb-0">Completed Courses</p>
            <i className="fas fa-external-link-alt card-icon"></i>
          </div>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={4} className="mb-3">
          <div
            className="stat-card clickable-card"
            onClick={() => handleStatCardClick('inProgressCourses')}
            style={{ cursor: 'pointer' }}
            title="Click to view courses in progress"
          >
            <h3>{stats.inProgressCourses}</h3>
            <p className="mb-0">In Progress</p>
            <i className="fas fa-external-link-alt card-icon"></i>
          </div>
        </Col>
        <Col md={4} className="mb-3">
          <div
            className="stat-card clickable-card"
            onClick={() => handleStatCardClick('certificates')}
            style={{ cursor: 'pointer' }}
            title="Click to view your certificates"
          >
            <h3>{stats.certificates}</h3>
            <p className="mb-0">Certificates</p>
            <i className="fas fa-external-link-alt card-icon"></i>
          </div>
        </Col>
        <Col md={4} className="mb-3">
          <div
            className="stat-card clickable-card"
            onClick={() => handleStatCardClick('notifications')}
            style={{ cursor: 'pointer' }}
            title="Click to view your notifications"
          >
            <h3>{stats.notifications}</h3>
            <p className="mb-0">Notifications</p>
            <i className="fas fa-external-link-alt card-icon"></i>
          </div>
        </Col>
      </Row>

      {/* Recent Courses */}
      <Row>
        <Col>
          <Card className="dashboard-card">
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-book me-2"></i>
                Recent Courses
              </h5>
            </Card.Header>
            <Card.Body>
              {recentCourses.length > 0 ? (
                recentCourses.map((enrollment, index) => (
                  <div key={index} className="mb-3 p-3 border rounded">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="mb-0">{enrollment.course.title}</h6>
                      <Badge bg={enrollment.status === 'COMPLETED' ? 'success' : 
                                enrollment.status === 'IN_PROGRESS' ? 'warning' : 'secondary'}>
                        {enrollment.status}
                      </Badge>
                    </div>
                    <p className="text-muted small mb-2">{enrollment.course.description}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        {enrollment.course.category} • {enrollment.course.type}
                      </small>
                      <div className="d-flex align-items-center">
                        <small className="me-2">Progress:</small>
                        <ProgressBar 
                          now={getProgressPercentage(enrollment)} 
                          style={{ width: '100px' }}
                        />
                        <small className="ms-2">{getProgressPercentage(enrollment)}%</small>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <i className="fas fa-book-open"></i>
                  <p>No courses enrolled yet.</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row className="mt-4">
        <Col>
          <Card className="dashboard-card">
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-bolt me-2"></i>
                Quick Actions
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3} className="mb-3">
                  <Button 
                    variant="outline-primary" 
                    className="w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3"
                    onClick={() => handleQuickAction('browse')}
                    style={{ minHeight: '120px' }}
                  >
                    <i className="fas fa-search fa-2x mb-2"></i>
                    <span>Browse Courses</span>
                  </Button>
                </Col>
                <Col md={3} className="mb-3">
                  <Button 
                    variant="outline-success" 
                    className="w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3"
                    onClick={() => handleQuickAction('progress')}
                    style={{ minHeight: '120px' }}
                  >
                    <i className="fas fa-chart-line fa-2x mb-2"></i>
                    <span>View Progress</span>
                  </Button>
                </Col>
                <Col md={3} className="mb-3">
                  <Button 
                    variant="outline-warning" 
                    className="w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3"
                    onClick={() => handleQuickAction('certificates')}
                    style={{ minHeight: '120px' }}
                  >
                    <i className="fas fa-certificate fa-2x mb-2"></i>
                    <span>My Certificates</span>
                  </Button>
                </Col>
                <Col md={3} className="mb-3">
                  <Button 
                    variant="outline-info" 
                    className="w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3"
                    onClick={() => handleQuickAction('notifications')}
                    style={{ minHeight: '120px' }}
                  >
                    <i className="fas fa-bell fa-2x mb-2"></i>
                    <span>Notifications</span>
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard; 