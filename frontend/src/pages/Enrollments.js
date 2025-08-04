import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Badge, Button, Alert } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { useAppData } from '../context/AppDataContext';
import ProgressScrollbar from '../components/ProgressScrollbar';
import apiClient from '../services/apiClient';

const Enrollments = ({ user }) => {
  const { getUserEnrollments, loading: contextLoading } = useAppData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);
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

  const getStatusBadge = (status) => {
    const variants = {
      'ENROLLED': 'primary',
      'IN_PROGRESS': 'warning',
      'COMPLETED': 'success',
      'DROPPED': 'danger'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status.replace('_', ' ')}</Badge>;
  };

  const handleContinueLearning = (enrollment) => {
    if (enrollment.course?.materials) {
      window.open(enrollment.course.materials, '_blank');
    }
  };

  const handleViewDetails = (enrollment) => {
    console.log('View details for:', enrollment);
  };

  const handleDeleteEnrollment = async (enrollmentId) => {
    try {
      setDeleting(enrollmentId);
      // API call would go here
      console.log('Delete enrollment:', enrollmentId);
    } catch (error) {
      setError('Failed to delete enrollment');
    } finally {
      setDeleting(null);
    }
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
                        <i className="fas fa-spinner me-2"></i>
                        In Progress Courses - Interactive Progress Tracking
                      </h6>
                      {sortedEnrollments
                        .filter(e => e.status === 'IN_PROGRESS' || e.status === 'ENROLLED')
                        .map((enrollment) => (
                          <ProgressScrollbar
                            key={enrollment.id}
                            enrollment={enrollment}
                            onProgressUpdate={(newProgress) => {
                              console.log(`Progress updated to ${newProgress}% for course ${enrollment.course.title}`);
                            }}
                          />
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
                          <div key={enrollment.id} className="mb-3 p-3 border rounded" style={{ borderLeft: '4px solid #28a745' }}>
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <h6 className="mb-1">{enrollment.course?.title}</h6>
                                <small className="text-muted">
                                  Completed: {formatDate(enrollment.completedAt)} | 
                                  Duration: {enrollment.course?.durationHours}h | 
                                  Grade: {enrollment.grade || 'A'}
                                </small>
                              </div>
                              <div className="text-end">
                                <Badge bg="success">100% Complete</Badge>
                                <br />
                                <Button size="sm" variant="outline-primary" className="mt-1" onClick={() => handleViewDetails(enrollment)}>
                                  View Certificate
                                </Button>
                              </div>
                            </div>
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
