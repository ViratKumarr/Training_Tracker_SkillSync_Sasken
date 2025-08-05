import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Alert } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { useAppData } from '../context/AppDataContext';
import ProgressScrollbar from '../components/ProgressScrollbar';

const Enrollments = ({ user }) => {
  const { getUserEnrollments, loading: contextLoading } = useAppData();
  const [error, setError] = useState(null);
  const location = useLocation();

  // Get user-specific enrollments from context
  const enrollments = getUserEnrollments(user.id);

  // Filter enrollments based on URL parameter
  const getFilteredEnrollments = () => {
    const urlParams = new URLSearchParams(location.search);
    const filterParam = urlParams.get('filter');
    
    let filtered = [...enrollments];

    if (filterParam === 'completed') {
      filtered = filtered.filter(e => e.status === 'COMPLETED');
    } else if (filterParam === 'in-progress') {
      filtered = filtered.filter(e => e.status === 'IN_PROGRESS');
    }

    return filtered;
  };

  // Sort enrollments: IN_PROGRESS first, then ENROLLED, then COMPLETED
  const sortedEnrollments = getFilteredEnrollments().sort((a, b) => {
    const statusPriority = { 'IN_PROGRESS': 0, 'ENROLLED': 1, 'COMPLETED': 2 };
    const statusA = statusPriority[a.status] || 3;
    const statusB = statusPriority[b.status] || 3;

    if (statusA !== statusB) {
      return statusA - statusB;
    }

    // If same status, sort by enrollment date (newest first)
    return new Date(b.enrolledAt) - new Date(a.enrolledAt);
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleViewDetails = (enrollment) => {
    console.log('View details for:', enrollment);
  };

  if (contextLoading) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <h2>
            <i className="fas fa-user-graduate me-2"></i>
            My Course Enrollments
          </h2>
          <p className="text-muted">Track your learning progress and manage your course enrollments</p>
        </Col>
      </Row>

      {error && (
        <Row className="mb-4">
          <Col>
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          </Col>
        </Row>
      )}

      {/* Main Enrollments Section */}
      <Row className="mb-4">
        <Col>
          <Card className="dashboard-card">
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-list me-2"></i>
                My Enrollments ({sortedEnrollments.length})
              </h5>
            </Card.Header>
            <Card.Body>
              {sortedEnrollments.length === 0 ? (
                <div className="text-center py-4">
                  <i className="fas fa-user-graduate fa-3x text-muted mb-3"></i>
                  <h5>No Enrollments Yet</h5>
                  <p className="text-muted">Enroll in courses from the Courses section to see them here.</p>
                </div>
              ) : (
                <div>
                  {/* In Progress Courses Section with Interactive Progress Scrollbars */}
                  {sortedEnrollments.filter(e => e.status === 'IN_PROGRESS' || e.status === 'ENROLLED').length > 0 && (
                    <div className="mb-4">
                      <h6 className="text-warning mb-3">
                        <i className="fas fa-play-circle me-2"></i>
                        In Progress ({sortedEnrollments.filter(e => e.status === 'IN_PROGRESS' || e.status === 'ENROLLED').length})
                      </h6>
                      <Row>
                        {sortedEnrollments
                          .filter(e => e.status === 'IN_PROGRESS' || e.status === 'ENROLLED')
                          .map((enrollment) => (
                            <Col md={6} lg={4} key={enrollment.id} className="mb-3">
                              <Card className="h-100 border-warning">
                                <Card.Body>
                                  <div className="d-flex justify-content-between align-items-start mb-2">
                                    <Badge bg="warning" text="dark">
                                      {enrollment.status === 'IN_PROGRESS' ? 'In Progress' : 'Enrolled'}
                                    </Badge>
                                    <small className="text-muted">
                                      {formatDate(enrollment.enrolledAt)}
                                    </small>
                                  </div>
                                  <h6 className="card-title">{enrollment.course.title}</h6>
                                  <p className="card-text text-muted small">
                                    {enrollment.course.description?.substring(0, 100)}...
                                  </p>
                                  
                                  {/* Interactive Progress Scrollbar */}
                                  <ProgressScrollbar 
                                    enrollment={enrollment}
                                    user={user}
                                  />
                                  
                                  <div className="mt-3 d-flex gap-2">
                                    <Button 
                                      variant="outline-primary" 
                                      size="sm"
                                      onClick={() => handleViewDetails(enrollment)}
                                    >
                                      View Details
                                    </Button>
                                    <Button 
                                      variant="primary" 
                                      size="sm"
                                      onClick={() => {
                                        if (enrollment.course?.materials) {
                                          window.open(enrollment.course.materials, '_blank');
                                        }
                                      }}
                                    >
                                      Go to Course
                                    </Button>
                                  </div>
                                </Card.Body>
                              </Card>
                            </Col>
                          ))}
                      </Row>
                    </div>
                  )}

                  {/* Completed Courses Section */}
                  {sortedEnrollments.filter(e => e.status === 'COMPLETED').length > 0 && (
                    <div>
                      <h6 className="text-success mb-3">
                        <i className="fas fa-check-circle me-2"></i>
                        Completed ({sortedEnrollments.filter(e => e.status === 'COMPLETED').length})
                      </h6>
                      <Row>
                        {sortedEnrollments
                          .filter(e => e.status === 'COMPLETED')
                          .map((enrollment) => (
                            <Col md={6} lg={4} key={enrollment.id} className="mb-3">
                              <Card className="h-100 border-success">
                                <Card.Body>
                                  <div className="d-flex justify-content-between align-items-start mb-2">
                                    <Badge bg="success">Completed</Badge>
                                    <small className="text-muted">
                                      {enrollment.completedAt ? formatDate(enrollment.completedAt) : 'N/A'}
                                    </small>
                                  </div>
                                  <h6 className="card-title">{enrollment.course.title}</h6>
                                  <p className="card-text text-muted small">
                                    {enrollment.course.description?.substring(0, 100)}...
                                  </p>
                                  
                                  {/* Completed Progress Bar */}
                                  <div className="mb-3">
                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                      <small className="text-muted">Progress</small>
                                      <small className="text-success fw-bold">100%</small>
                                    </div>
                                    <div className="progress" style={{ height: '8px' }}>
                                      <div 
                                        className="progress-bar bg-success" 
                                        style={{ width: '100%' }}
                                      ></div>
                                    </div>
                                  </div>
                                  
                                  <div className="mt-3 d-flex gap-2">
                                    <Button 
                                      variant="outline-primary" 
                                      size="sm"
                                      onClick={() => handleViewDetails(enrollment)}
                                    >
                                      View Details
                                    </Button>
                                    <Button 
                                      variant="success" 
                                      size="sm"
                                      onClick={() => {
                                        if (enrollment.course?.materials) {
                                          window.open(enrollment.course.materials, '_blank');
                                        }
                                      }}
                                    >
                                      View Course
                                    </Button>
                                  </div>
                                </Card.Body>
                              </Card>
                            </Col>
                          ))}
                      </Row>
                    </div>
                  )}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Enrollments;
