import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Alert } from 'react-bootstrap';
import { useAppData } from '../context/AppDataContext';
import apiClient from '../services/apiClient';

const Enrollments = ({ user }) => {
  const { getUserEnrollments, getUserProgress, updateProgress, loading: contextLoading } = useAppData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);

  // Get user-specific data from context
  const enrollments = getUserEnrollments(user.id);
  const progress = getUserProgress(user.id);

  useEffect(() => {
    loadEnrollments();
  }, []);

  const loadEnrollments = async () => {
    try {
      setLoading(true);
      // Try to sync with API in background
      const response = await apiClient.get(`/enrollments/user/${user.id}`);
      // API data is available, but we're using context data for display
    } catch (err) {
      console.log('API not available, using context data for enrollments');

    } finally {
      setLoading(false);
    }
  };

  // Helper function to get progress for an enrollment
  const getEnrollmentProgress = (enrollmentId, courseId) => {
    return progress.find(p => p.user.id === user.id && p.course.id === courseId);
  };

  // Sort enrollments: IN_PROGRESS first, then ENROLLED, then COMPLETED
  const sortedEnrollments = [...enrollments].sort((a, b) => {
    const statusPriority = { 'IN_PROGRESS': 0, 'ENROLLED': 1, 'COMPLETED': 2 };
    const statusA = statusPriority[a.status] || 3;
    const statusB = statusPriority[b.status] || 3;

    if (statusA !== statusB) {
      return statusA - statusB;
    }

    // Then sort by date (newest first)
    const dateA = new Date(a.enrolledAt || 0);
    const dateB = new Date(b.enrolledAt || 0);
    return dateB - dateA;
  });



  const getStatusBadge = (status) => {
    const variants = {
      'ENROLLED': 'primary',
      'IN_PROGRESS': 'warning',
      'COMPLETED': 'success',
      'DROPPED': 'danger'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status.replace('_', ' ')}</Badge>;
  };

  const getTypeBadge = (type) => {
    const variants = {
      'MANDATORY': 'danger',
      'OPTIONAL': 'info',
      'RECOMMENDED': 'warning'
    };
    return <Badge bg={variants[type] || 'secondary'}>{type}</Badge>;
  };

  const getDifficultyBadge = (difficulty) => {
    const variants = {
      'BEGINNER': 'success',
      'INTERMEDIATE': 'warning',
      'ADVANCED': 'danger'
    };
    return <Badge bg={variants[difficulty] || 'secondary'}>{difficulty}</Badge>;
  };

  const getPlatformBadge = (materials) => {
    if (!materials) return <Badge bg="secondary">Internal</Badge>;
    
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
    } else if (materials.includes('http')) {
      return <Badge bg="info">External</Badge>;
    }
    return <Badge bg="secondary">Internal</Badge>;
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleContinueLearning = (enrollment) => {
    if (enrollment.course?.materials && enrollment.course.materials.startsWith('http')) {
      window.open(enrollment.course.materials, '_blank');
    } else {
      alert(`Course: ${enrollment.course?.title}\nDescription: ${enrollment.course?.description}\nDuration: ${enrollment.course?.durationHours} hours\nCategory: ${enrollment.course?.category}\nType: ${enrollment.course?.type}`);
    }
  };

  const handleViewDetails = (enrollment) => {
    if (enrollment.course?.materials && enrollment.course.materials.startsWith('http')) {
      window.open(enrollment.course.materials, '_blank');
    } else {
      alert(`Course Details:\n\nTitle: ${enrollment.course?.title}\nDescription: ${enrollment.course?.description}\nDuration: ${enrollment.course?.durationHours} hours\nCategory: ${enrollment.course?.category}\nType: ${enrollment.course?.type}\nDifficulty: ${enrollment.course?.difficultyLevel}\nCompletion Rate: ${enrollment.course?.completionRate}%\nRating: ${enrollment.course?.averageRating} ⭐ (${enrollment.course?.reviewCount} reviews)`);
    }
  };

  if (loading || contextLoading) {
    return (
      <Container>
        <Row className="justify-content-center">
          <Col md={6} className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h1 className="fw-bold text-primary">
            <i className="fas fa-user-graduate me-2"></i>
            Enrollment History
          </h1>
          <p className="text-muted">Track your course enrollments and progress</p>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      <Row>
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
                  {/* Newly Enrolled Courses Section */}
                  {sortedEnrollments.filter(e => e.status === 'ENROLLED').length > 0 && (
                    <div className="mb-4">
                      <h6 className="text-primary mb-3">
                        <i className="fas fa-star me-2"></i>
                        Recently Enrolled Courses
                      </h6>
                      {sortedEnrollments
                        .filter(e => e.status === 'ENROLLED')
                        .map((enrollment) => (
                          <div key={enrollment.id} className="mb-4 p-4 border rounded shadow-sm" style={{ borderLeft: '4px solid #007bff' }}>
                            <Row className="align-items-center mb-3">
                              <Col md={6}>
                                <h5 className="mb-2">{enrollment.course?.title}</h5>
                                <p className="text-muted mb-2">{enrollment.course?.description}</p>
                                <div className="d-flex align-items-center gap-2 mb-2">
                                  <Badge bg="secondary">{enrollment.course?.category}</Badge>
                                  <Badge bg="info">{enrollment.course?.type}</Badge>
                                  <small className="text-muted">
                                    <i className="fas fa-clock me-1"></i>
                                    {enrollment.course?.durationHours} hours
                                  </small>
                                </div>
                                <small className="text-muted">
                                  Enrolled: {formatDate(enrollment.enrolledAt)}
                                </small>
                              </Col>
                              <Col md={2}>
                                <div className="text-center">
                                  {getStatusBadge(enrollment.status)}
                                  <br />
                                  <small className="text-muted">Status</small>
                                </div>
                              </Col>
                              <Col md={2}>
                                <div className="text-center">
                                  <div className="h5 mb-1 text-primary">
                                    {enrollment.completionPercentage?.toFixed(1) || 0}%
                                  </div>
                                  <small className="text-muted">Progress</small>
                                </div>
                              </Col>
                              <Col md={2}>
                                <div className="text-center">
                                  <small className="text-muted">No grade yet</small>
                                  <br />
                                  <small className="text-muted">Grade</small>
                                </div>
                              </Col>
                            </Row>
                            
                            {/* Course Details */}
                            <Row className="mb-3">
                              <Col>
                                <div className="bg-light p-3 rounded">
                                  <Row>
                                    <Col md={3}>
                                      <small className="text-muted">
                                        <strong>Difficulty:</strong><br />
                                        {getDifficultyBadge(enrollment.course?.difficultyLevel)}
                                      </small>
                                    </Col>
                                    <Col md={3}>
                                      <small className="text-muted">
                                        <strong>Completion Rate:</strong><br />
                                        {enrollment.course?.completionRate}%
                                      </small>
                                    </Col>
                                    <Col md={3}>
                                      <small className="text-muted">
                                        <strong>Rating:</strong><br />
                                        ⭐ {enrollment.course?.averageRating} ({enrollment.course?.reviewCount} reviews)
                                      </small>
                                    </Col>
                                    <Col md={3}>
                                      <small className="text-muted">
                                        <strong>Platform:</strong><br />
                                        {getPlatformBadge(enrollment.course?.materials)}
                                      </small>
                                    </Col>
                                  </Row>
                                </div>
                              </Col>
                            </Row>
                            
                            {/* Progress Bar */}
                            <Row className="mb-3">
                              <Col>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                  <small className="text-muted">Progress</small>
                                  <div className="d-flex align-items-center gap-2">
                                    {getTypeBadge(enrollment.type)}
                                  </div>
                                </div>
                                <div className="progress" style={{ height: '12px' }}>
                                  <div
                                    className="progress-bar"
                                    style={{ width: `${enrollment.completionPercentage || 0}%` }}
                                  ></div>
                                </div>
                              </Col>
                            </Row>
                            
                            {/* Actions */}
                            <Row>
                              <Col>
                                <div className="d-flex gap-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline-primary"
                                    title="Continue Learning"
                                    onClick={() => handleContinueLearning(enrollment)}
                                  >
                                    <i className="fas fa-play me-1"></i>
                                    Continue
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline-secondary"
                                    title="View Details"
                                    onClick={() => handleViewDetails(enrollment)}
                                  >
                                    <i className="fas fa-eye me-1"></i>
                                    Details
                                  </Button>

                                </div>
                              </Col>
                            </Row>
                          </div>
                        ))}
                    </div>
                  )}

                  {/* In Progress Courses Section */}
                  {sortedEnrollments.filter(e => e.status === 'IN_PROGRESS').length > 0 && (
                    <div className="mb-4">
                      <h6 className="text-warning mb-3">
                        <i className="fas fa-spinner me-2"></i>
                        In Progress Courses
                      </h6>
                      {sortedEnrollments
                        .filter(e => e.status === 'IN_PROGRESS')
                        .map((enrollment) => (
                          <div key={enrollment.id} className="mb-4 p-4 border rounded shadow-sm" style={{ borderLeft: '4px solid #ffc107' }}>
                            <Row className="align-items-center mb-3">
                              <Col md={6}>
                                <h5 className="mb-2">{enrollment.course?.title}</h5>
                                <p className="text-muted mb-2">{enrollment.course?.description}</p>
                                <div className="d-flex align-items-center gap-2 mb-2">
                                  <Badge bg="secondary">{enrollment.course?.category}</Badge>
                                  <Badge bg="info">{enrollment.course?.type}</Badge>
                                  <small className="text-muted">
                                    <i className="fas fa-clock me-1"></i>
                                    {enrollment.course?.durationHours} hours
                                  </small>
                                </div>
                                <small className="text-muted">
                                  Enrolled: {formatDate(enrollment.enrolledAt)}
                                </small>
                              </Col>
                              <Col md={2}>
                                <div className="text-center">
                                  {getStatusBadge(enrollment.status)}
                                  <br />
                                  <small className="text-muted">Status</small>
                                </div>
                              </Col>
                              <Col md={2}>
                                <div className="text-center">
                                  <div className="h5 mb-1 text-primary">
                                    {enrollment.completionPercentage?.toFixed(1) || 0}%
                                  </div>
                                  <small className="text-muted">Progress</small>
                                </div>
                              </Col>
                              <Col md={2}>
                                <div className="text-center">
                                  {enrollment.grade ? (
                                    <Badge bg="success">{enrollment.grade}</Badge>
                                  ) : (
                                    <small className="text-muted">No grade yet</small>
                                  )}
                                  <br />
                                  <small className="text-muted">Grade</small>
                                </div>
                              </Col>
                            </Row>
                            
                            {/* Course Details */}
                            <Row className="mb-3">
                              <Col>
                                <div className="bg-light p-3 rounded">
                                  <Row>
                                    <Col md={3}>
                                      <small className="text-muted">
                                        <strong>Difficulty:</strong><br />
                                        {getDifficultyBadge(enrollment.course?.difficultyLevel)}
                                      </small>
                                    </Col>
                                    <Col md={3}>
                                      <small className="text-muted">
                                        <strong>Completion Rate:</strong><br />
                                        {enrollment.course?.completionRate}%
                                      </small>
                                    </Col>
                                    <Col md={3}>
                                      <small className="text-muted">
                                        <strong>Rating:</strong><br />
                                        ⭐ {enrollment.course?.averageRating} ({enrollment.course?.reviewCount} reviews)
                                      </small>
                                    </Col>
                                    <Col md={3}>
                                      <small className="text-muted">
                                        <strong>Platform:</strong><br />
                                        {getPlatformBadge(enrollment.course?.materials)}
                                      </small>
                                    </Col>
                                  </Row>
                                </div>
                              </Col>
                            </Row>
                            
                            {/* Progress Bar */}
                            <Row className="mb-3">
                              <Col>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                  <small className="text-muted">Progress</small>
                                  <div className="d-flex align-items-center gap-2">
                                    {getTypeBadge(enrollment.type)}
                                    {enrollment.certificateEarned && (
                                      <Badge bg="success">
                                        <i className="fas fa-certificate me-1"></i>
                                        Certificate
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <div className="progress" style={{ height: '12px' }}>
                                  <div
                                    className="progress-bar"
                                    style={{ width: `${enrollment.completionPercentage || 0}%` }}
                                  ></div>
                                </div>
                              </Col>
                            </Row>
                            
                            {/* Actions */}
                            <Row>
                              <Col>
                                <div className="d-flex gap-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline-primary"
                                    title="Continue Learning"
                                    onClick={() => handleContinueLearning(enrollment)}
                                  >
                                    <i className="fas fa-play me-1"></i>
                                    Continue
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline-secondary"
                                    title="View Details"
                                    onClick={() => handleViewDetails(enrollment)}
                                  >
                                    <i className="fas fa-eye me-1"></i>
                                    Details
                                  </Button>

                                </div>
                              </Col>
                            </Row>
                          </div>
                        ))}
                    </div>
                  )}

                  {/* Completed Courses Section */}
                  {sortedEnrollments.filter(e => e.status === 'COMPLETED').length > 0 && (
                    <div className="mb-4">
                      <h6 className="text-success mb-3">
                        <i className="fas fa-check-circle me-2"></i>
                        Completed Courses
                      </h6>
                      {sortedEnrollments
                        .filter(e => e.status === 'COMPLETED')
                        .map((enrollment) => (
                          <div key={enrollment.id} className="mb-4 p-4 border rounded shadow-sm" style={{ borderLeft: '4px solid #28a745' }}>
                            <Row className="align-items-center mb-3">
                              <Col md={6}>
                                <h5 className="mb-2">{enrollment.course?.title}</h5>
                                <p className="text-muted mb-2">{enrollment.course?.description}</p>
                                <div className="d-flex align-items-center gap-2 mb-2">
                                  <Badge bg="secondary">{enrollment.course?.category}</Badge>
                                  <Badge bg="info">{enrollment.course?.type}</Badge>
                                  <small className="text-muted">
                                    <i className="fas fa-clock me-1"></i>
                                    {enrollment.course?.durationHours} hours
                                  </small>
                                </div>
                                <small className="text-muted">
                                  Enrolled: {formatDate(enrollment.enrolledAt)}
                                  {enrollment.completedAt && (
                                    <span className="ms-3">
                                      Completed: {formatDate(enrollment.completedAt)}
                                    </span>
                                  )}
                                </small>
                              </Col>
                              <Col md={2}>
                                <div className="text-center">
                                  {getStatusBadge(enrollment.status)}
                                  <br />
                                  <small className="text-muted">Status</small>
                                </div>
                              </Col>
                              <Col md={2}>
                                <div className="text-center">
                                  <div className="h5 mb-1 text-primary">
                                    {enrollment.completionPercentage?.toFixed(1) || 0}%
                                  </div>
                                  <small className="text-muted">Progress</small>
                                </div>
                              </Col>
                              <Col md={2}>
                                <div className="text-center">
                                  {enrollment.grade ? (
                                    <Badge bg="success">{enrollment.grade}</Badge>
                                  ) : (
                                    <small className="text-muted">No grade yet</small>
                                  )}
                                  <br />
                                  <small className="text-muted">Grade</small>
                                </div>
                              </Col>
                            </Row>
                            
                            {/* Course Details */}
                            <Row className="mb-3">
                              <Col>
                                <div className="bg-light p-3 rounded">
                                  <Row>
                                    <Col md={3}>
                                      <small className="text-muted">
                                        <strong>Difficulty:</strong><br />
                                        {getDifficultyBadge(enrollment.course?.difficultyLevel)}
                                      </small>
                                    </Col>
                                    <Col md={3}>
                                      <small className="text-muted">
                                        <strong>Completion Rate:</strong><br />
                                        {enrollment.course?.completionRate}%
                                      </small>
                                    </Col>
                                    <Col md={3}>
                                      <small className="text-muted">
                                        <strong>Rating:</strong><br />
                                        ⭐ {enrollment.course?.averageRating} ({enrollment.course?.reviewCount} reviews)
                                      </small>
                                    </Col>
                                    <Col md={3}>
                                      <small className="text-muted">
                                        <strong>Platform:</strong><br />
                                        {getPlatformBadge(enrollment.course?.materials)}
                                      </small>
                                    </Col>
                                  </Row>
                                </div>
                              </Col>
                            </Row>
                            
                            {/* Progress Bar */}
                            <Row className="mb-3">
                              <Col>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                  <small className="text-muted">Progress</small>
                                  <div className="d-flex align-items-center gap-2">
                                    {getTypeBadge(enrollment.type)}
                                    {enrollment.certificateEarned && (
                                      <Badge bg="success">
                                        <i className="fas fa-certificate me-1"></i>
                                        Certificate
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <div className="progress" style={{ height: '12px' }}>
                                  <div
                                    className="progress-bar"
                                    style={{ width: `${enrollment.completionPercentage || 0}%` }}
                                  ></div>
                                </div>
                              </Col>
                            </Row>
                            
                            {/* Actions */}
                            <Row>
                              <Col>
                                <div className="d-flex gap-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline-primary"
                                    title="Continue Learning"
                                    onClick={() => handleContinueLearning(enrollment)}
                                  >
                                    <i className="fas fa-play me-1"></i>
                                    Continue
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline-secondary"
                                    title="View Details"
                                    onClick={() => handleViewDetails(enrollment)}
                                  >
                                    <i className="fas fa-eye me-1"></i>
                                    Details
                                  </Button>

                                </div>
                              </Col>
                            </Row>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Enrollment Statistics */}
      <Row className="mt-4">
        <Col>
          <Card className="dashboard-card">
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-chart-pie me-2"></i>
                Enrollment Statistics
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3} className="text-center">
                  <h4 className="text-primary">{sortedEnrollments.length}</h4>
                  <p className="text-muted mb-0">Total Enrollments</p>
                </Col>
                <Col md={3} className="text-center">
                  <h4 className="text-success">{sortedEnrollments.filter(e => e.status === 'COMPLETED').length}</h4>
                  <p className="text-muted mb-0">Completed</p>
                </Col>
                <Col md={3} className="text-center">
                  <h4 className="text-warning">{sortedEnrollments.filter(e => e.status === 'IN_PROGRESS').length}</h4>
                  <p className="text-muted mb-0">In Progress</p>
                </Col>
                <Col md={3} className="text-center">
                  <h4 className="text-info">{sortedEnrollments.filter(e => e.status === 'ENROLLED').length}</h4>
                  <p className="text-muted mb-0">Newly Enrolled</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Enrollments; 