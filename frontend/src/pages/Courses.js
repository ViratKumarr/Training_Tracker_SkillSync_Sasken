import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert } from 'react-bootstrap';
import { useAppData } from '../context/AppDataContext';
import apiClient from '../services/apiClient';

const Courses = ({ user }) => {
  const { courses, enrollments, enrollInCourse, loading } = useAppData();
  const [enrolling, setEnrolling] = useState(null);
  const [message, setMessage] = useState(null);

  const isEnrolled = (courseId) => {
    return enrollments.some(e => e.user.id === user.id && e.course.id === courseId);
  };

  const fetchCourses = async () => {
    try {
      // Try to fetch from API first
      const response = await apiClient.get('/courses');
      // If API is available, we could update the context here
    } catch (error) {
      console.log('API not available, using context data for courses');


    }
  };

  const handleEnroll = async (courseId) => {
    try {
      setEnrolling(courseId);
      setMessage(null);

      // Check if already enrolled
      if (isEnrolled(courseId)) {
        setMessage({ type: 'warning', text: 'You are already enrolled in this course!' });
        return;
      }

      // Use context to enroll
      const newEnrollment = enrollInCourse(user.id, courseId, user);
      setMessage({ type: 'success', text: 'Successfully enrolled in course! Check Enrollments section for progress.' });

      // Try to sync with API in background
      try {
        const enrollmentData = {
          userId: user.id,
          courseId: courseId,
          status: 'ENROLLED',
          type: 'OPTIONAL',
          enrolledAt: new Date().toISOString(),
          completionPercentage: 0,
          notes: 'Enrolled from Courses section'
        };
        await apiClient.post('/enrollments', enrollmentData);
      } catch (apiError) {
        console.log('API sync failed, but enrollment saved locally');
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
      setMessage({ type: 'danger', text: 'Failed to enroll in course. Please try again.' });
    } finally {
      setEnrolling(null);
    }
  };

  const getCategoryBadge = (category) => {
    const colors = {
      'TECHNICAL': 'primary',
      'SOFT_SKILLS': 'success',
      'COMPLIANCE': 'warning',
      'LEADERSHIP': 'info',
      'PRODUCTIVITY': 'secondary'
    };
    return <Badge bg={colors[category] || 'secondary'}>{category.replace('_', ' ')}</Badge>;
  };

  const getTypeBadge = (type) => {
    const colors = {
      'IN_PERSON': 'primary',
      'VIRTUAL': 'success',
      'HYBRID': 'warning',
      'SELF_PACED': 'info'
    };
    return <Badge bg={colors[type] || 'secondary'}>{type.replace('_', ' ')}</Badge>;
  };

  const getPlatformBadge = (materials) => {
    if (!materials) return null;
    
    if (materials.includes('udemy.com')) {
      return <Badge bg="purple">Udemy</Badge>;
    } else if (materials.includes('hackerrank.com')) {
      return <Badge bg="orange">HackerRank</Badge>;
    } else if (materials.includes('intershala.com')) {
      return <Badge bg="blue">Internshala</Badge>;
    } else if (materials.includes('coursera.org')) {
      return <Badge bg="teal">Coursera</Badge>;
    } else if (materials.includes('edx.org')) {
      return <Badge bg="dark">edX</Badge>;
    }
    return <Badge bg="secondary">Online</Badge>;
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
            <i className="fas fa-book me-2"></i>
            Courses
          </h1>
          <p className="text-muted">Browse and enroll in training courses</p>
        </Col>
      </Row>

      {message && (
        <Alert variant={message.type} onClose={() => setMessage(null)} dismissible>
          {message.text}
        </Alert>
      )}

      {/* Courses Grid */}
      <Row>
        {courses.map((course) => (
          <Col md={6} lg={4} key={course.id} className="mb-4">
            <Card className="course-card h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h5 className="card-title mb-0">{course.title}</h5>
                  <div>
                    {course.isMandatory && (
                      <Badge bg="danger" className="me-1">Mandatory</Badge>
                    )}
                    {getPlatformBadge(course.materials)}
                  </div>
                </div>
                
                <p className="card-text text-muted small mb-3">
                  {course.description}
                </p>
                
                <div className="mb-3">
                  {getCategoryBadge(course.category)}
                  <span className="mx-1">•</span>
                  {getTypeBadge(course.type)}
                </div>
                
                <div className="mb-3">
                  <small className="text-muted">
                    <i className="fas fa-clock me-1"></i>
                    {course.durationHours} hours
                  </small>
                  {course.trainer && (
                    <small className="text-muted ms-3">
                      <i className="fas fa-user me-1"></i>
                      {course.trainer.firstName} {course.trainer.lastName}
                    </small>
                  )}
                </div>
                
                {course.prerequisites && (
                  <div className="mb-3">
                    <small className="text-muted">
                      <strong>Prerequisites:</strong> {course.prerequisites}
                    </small>
                  </div>
                )}
                
                <div className="mt-auto">
                  <Button 
                    variant="primary" 
                    size="sm" 
                    className="me-2"
                    onClick={() => {
                      if (course.materials && course.materials.startsWith('http')) {
                        window.open(course.materials, '_blank');
                      } else {
                        // For internal materials, show course details
                        alert(`Course: ${course.title}\nDescription: ${course.description}\nDuration: ${course.durationHours} hours\nCategory: ${course.category}\nType: ${course.type}`);
                      }
                    }}
                  >
                    <i className="fas fa-eye me-1"></i>
                    View Details
                  </Button>
                  {isEnrolled(course.id) ? (
                    <Button
                      variant="success"
                      size="sm"
                      disabled
                    >
                      <i className="fas fa-check me-1"></i>
                      Enrolled
                    </Button>
                  ) : (
                    <Button
                      variant="outline-success"
                      size="sm"
                      onClick={() => handleEnroll(course.id)}
                      disabled={enrolling === course.id}
                    >
                      {enrolling === course.id ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                          Enrolling...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-plus me-1"></i>
                          Enroll
                        </>
                      )}
                    </Button>
                  )}
                  {course.materials && course.materials.startsWith('http') && (
                    <Button 
                      variant="outline-info" 
                      size="sm" 
                      className="ms-2"
                      onClick={() => window.open(course.materials, '_blank')}
                    >
                      <i className="fas fa-external-link-alt me-1"></i>
                      Go to Course
                    </Button>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Course Statistics */}
      <Row className="mt-5">
        <Col>
          <Card className="dashboard-card">
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-chart-pie me-2"></i>
                Course Statistics
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3} className="text-center">
                  <h4 className="text-primary">{courses.length}</h4>
                  <p className="text-muted mb-0">Total Courses</p>
                </Col>
                <Col md={3} className="text-center">
                  <h4 className="text-success">{courses.filter(c => c.isMandatory).length}</h4>
                  <p className="text-muted mb-0">Mandatory Courses</p>
                </Col>
                <Col md={3} className="text-center">
                  <h4 className="text-info">{courses.filter(c => c.category === 'TECHNICAL').length}</h4>
                  <p className="text-muted mb-0">Technical Courses</p>
                </Col>
                <Col md={3} className="text-center">
                  <h4 className="text-warning">{courses.filter(c => c.type === 'VIRTUAL').length}</h4>
                  <p className="text-muted mb-0">Virtual Courses</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Courses; 