import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, ProgressBar, Badge, Button, Alert } from 'react-bootstrap';
import { useAppData } from '../context/AppDataContext';
import ProgressScrollbar from '../components/ProgressScrollbar';
import apiClient from '../services/apiClient';

const Progress = ({ user }) => {
  const { getUserProgress, getUserEnrollments, updateProgress, loading: contextLoading } = useAppData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [markingComplete, setMarkingComplete] = useState(null);

  // Get user-specific data from context
  const progressData = getUserProgress(user.id);
  const enrollments = getUserEnrollments(user.id);

  // Calculate real-time stats based on actual user data
  const stats = {
    totalCourses: enrollments.length, // Total enrolled courses
    completedCourses: enrollments.filter(e => e.status === 'COMPLETED').length,
    averageCompletion: enrollments.length > 0
      ? enrollments.reduce((sum, e) => sum + (e.completionPercentage || 0), 0) / enrollments.length
      : 0,
    totalTimeSpent: progressData.reduce((sum, p) => sum + (p.timeSpentMinutes || 0), 0)
  };

  const loadProgressData = useCallback(async () => {
    try {
      setLoading(true);
      // Try to sync with API in background
      await apiClient.get(`/progress/user/${user.id}`);
      // API data is available, but we're using context data for display
    } catch (err) {
      console.log('API not available, using context data for progress');
      // API not available, using context data

    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    loadProgressData();
  }, [loadProgressData]);

  const markAsCompleted = async (progressId, courseId) => {
    try {
      setMarkingComplete(progressId);
      setError(null);

      // Call the new mark as completed API endpoint
      const response = await apiClient.post('/progress/mark-completed', {
        userId: user.id,
        courseId: courseId
      });

      if (response.data) {
        // Update context data
        await updateProgress(user.id, courseId, {
          completionPercentage: 100,
          status: 'COMPLETED',
          completedAt: new Date().toISOString()
        });

        // Reload data
        await loadProgressData();

        // Show success message
        setError(null);
        console.log('Course marked as completed successfully!');
      }

    } catch (err) {
      setError('Failed to mark course as completed. Please try again.');
      console.error('Error marking course as completed:', err);
    } finally {
      setMarkingComplete(null);
    }
  };

  const getProgressVariant = (percentage) => {
    if (percentage >= 100) return 'success';
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'warning';
    if (percentage >= 40) return 'info';
    return 'danger';
  };

  const formatTime = (minutes) => {
    if (!minutes) return '0h 0m';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getGradeBadge = (grade) => {
    if (!grade) return null;
    const variants = {
      'A': 'success',
      'B': 'info',
      'C': 'warning',
      'D': 'danger',
      'F': 'danger'
    };
    return <Badge bg={variants[grade] || 'secondary'}>{grade}</Badge>;
  };

  const getStatusBadge = (status) => {
    const variants = {
      'NOT_STARTED': 'secondary',
      'IN_PROGRESS': 'warning',
      'COMPLETED': 'success',
      'PAUSED': 'info'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status.replace('_', ' ')}</Badge>;
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

  const filteredProgress = progressData.filter(progress => {
    if (!filterStatus) return true;
    return progress.status === filterStatus;
  });

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
            <i className="fas fa-chart-line me-2"></i>
            Learning Progress
          </h1>
          <p className="text-muted">Track your learning progress and achievements</p>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      {/* Progress Stats - Real-time Data */}
      <Row className="mb-4">
          <Col md={3}>
            <Card className="dashboard-card text-center">
              <Card.Body>
                <i className="fas fa-book fa-2x text-primary mb-2"></i>
                <h4>{stats.totalCourses}</h4>
                <p className="text-muted mb-0">Total Courses</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="dashboard-card text-center">
              <Card.Body>
                <i className="fas fa-check-circle fa-2x text-success mb-2"></i>
                <h4>{stats.completedCourses}</h4>
                <p className="text-muted mb-0">Completed</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="dashboard-card text-center">
              <Card.Body>
                <i className="fas fa-percentage fa-2x text-info mb-2"></i>
                <h4>{stats.averageCompletion.toFixed(1)}%</h4>
                <p className="text-muted mb-0">Avg Completion</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="dashboard-card text-center">
              <Card.Body>
                <i className="fas fa-clock fa-2x text-warning mb-2"></i>
                <h4>{formatTime(stats.totalTimeSpent)}</h4>
                <p className="text-muted mb-0">Total Time</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

      {/* Progress Bar Graph */}
      <Row className="mb-4">
        <Col>
          <Card className="dashboard-card">
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-chart-bar me-2"></i>
                Progress Overview
              </h5>
            </Card.Header>
            <Card.Body>
              {enrollments.length === 0 ? (
                <div className="text-center py-4">
                  <i className="fas fa-graduation-cap fa-3x text-muted mb-3"></i>
                  <h5 className="text-muted">No Course Enrollments</h5>
                  <p className="text-muted">Enroll in courses to start tracking your progress!</p>
                  <Button variant="primary" href="/courses">
                    Browse Courses
                  </Button>
                </div>
              ) : (
                enrollments.map((enrollment) => (
                  <ProgressScrollbar
                    key={enrollment.id}
                    enrollment={enrollment}
                    onProgressUpdate={(newProgress) => {
                      console.log(`Progress updated to ${newProgress}% for course ${enrollment.course.title}`);
                    }}
                  />
                ))
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filter */}
      <Row className="mb-4">
        <Col md={4}>
          <select 
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="NOT_STARTED">Not Started</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="PAUSED">Paused</option>
          </select>
        </Col>
        <Col md={8}>
          <div className="d-flex justify-content-end">
            <Button 
              variant="outline-secondary" 
              size="sm"
              onClick={() => setFilterStatus('')}
            >
              Clear Filter
            </Button>
          </div>
        </Col>
      </Row>

      {/* Course Progress */}
      <Row>
        <Col>
          <Card className="dashboard-card">
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-list me-2"></i>
                Course Progress ({filteredProgress.length} courses)
              </h5>
            </Card.Header>
            <Card.Body>
              {filteredProgress.length === 0 ? (
                <div className="text-center py-4">
                  <i className="fas fa-chart-line fa-3x text-muted mb-3"></i>
                  <h5>No Progress Data</h5>
                  <p className="text-muted">
                    {filterStatus 
                      ? `No courses with status "${filterStatus.replace('_', ' ')}" found.` 
                      : 'Start learning to see your progress here.'
                    }
                  </p>
                  {filterStatus && (
                    <Button variant="outline-primary" onClick={() => setFilterStatus('')}>
                      Clear Filter
                    </Button>
                  )}
                </div>
              ) : (
                <div>
                  {filteredProgress.map((progress) => (
                    <div key={progress.id} className="mb-4 p-4 border rounded shadow-sm">
                      <Row className="align-items-center mb-3">
                        <Col md={6}>
                          <div className="d-flex align-items-center">
                            <div className="me-3">
                              <i className="fas fa-graduation-cap fa-2x text-primary"></i>
                            </div>
                            <div>
                              <h6 className="mb-1 fw-bold">{progress.course?.title}</h6>
                              <div className="d-flex align-items-center gap-2">
                                <small className="text-muted">{progress.course?.category}</small>
                                <span>•</span>
                                <small className="text-muted">{progress.course?.type}</small>
                                <span>•</span>
                                {getPlatformBadge(progress.course?.materials)}
                              </div>
                            </div>
                          </div>
                        </Col>
                        <Col md={3}>
                          <div className="text-center">
                            <div className="h4 mb-1 text-primary">
                              {progress.completionPercentage?.toFixed(1)}%
                            </div>
                            <small className="text-muted">Completion</small>
                          </div>
                        </Col>
                        <Col md={3}>
                          <div className="text-center">
                            <div className="h6 mb-1">
                              {formatTime(progress.timeSpentMinutes)}
                            </div>
                            <small className="text-muted">Time Spent</small>
                          </div>
                        </Col>
                      </Row>

                      {/* Progress Bar */}
                      <Row className="mb-3">
                        <Col>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <small className="text-muted">Progress</small>
                            <div className="d-flex align-items-center gap-2">
                              {getStatusBadge(progress.status)}
                              {getGradeBadge(progress.grade)}
                            </div>
                          </div>
                          <ProgressBar 
                            now={progress.completionPercentage || 0} 
                            variant={getProgressVariant(progress.completionPercentage || 0)}
                            className="mb-2"
                            style={{ height: '12px' }}
                          />
                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">
                              Started: {progress.startedAt ?
                                new Date(progress.startedAt).toLocaleDateString() :
                                'N/A'
                              }
                            </small>
                            <small className="text-muted">
                              Last accessed: {progress.lastAccessedAt ? 
                                new Date(progress.lastAccessedAt).toLocaleDateString() : 
                                'N/A'
                              }
                            </small>
                          </div>
                        </Col>
                      </Row>

                      {/* Quiz Score */}
                      {progress.quizScore && (
                        <Row className="mb-3">
                          <Col>
                            <div className="bg-light p-3 rounded">
                              <div className="d-flex justify-content-between align-items-center">
                                <div>
                                  <strong>Quiz Score</strong>
                                  <br />
                                  <small className="text-muted">
                                    {progress.quizScore}/{progress.maxQuizScore} 
                                    ({((progress.quizScore / progress.maxQuizScore) * 100).toFixed(1)}%)
                                  </small>
                                </div>
                                <div className="text-end">
                                  <div className="h5 mb-0 text-success">
                                    {((progress.quizScore / progress.maxQuizScore) * 100).toFixed(1)}%
                                  </div>
                                  <small className="text-muted">Score</small>
                                </div>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      )}

                      {/* Actions */}
                      <Row>
                        <Col>
                          <div className="d-flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline-primary"
                              title="Continue Learning"
                            >
                              <i className="fas fa-play me-1"></i>
                              Continue
                            </Button>
                            {progress.course?.materials && progress.course.materials.startsWith('http') && (
                              <Button
                                size="sm"
                                variant="outline-info"
                                title="Go to Course"
                                onClick={() => window.open(progress.course.materials, '_blank')}
                              >
                                <i className="fas fa-external-link-alt me-1"></i>
                                Go to Course
                              </Button>
                            )}
                            {progress.completionPercentage < 100 && (
                              <Button
                                size="sm"
                                variant="success"
                                title="Mark as Completed"
                                onClick={() => markAsCompleted(progress.id, progress.course.id)}
                                disabled={markingComplete === progress.id}
                              >
                                {markingComplete === progress.id ? (
                                  <>
                                    <i className="fas fa-spinner fa-spin me-1"></i>
                                    Completing...
                                  </>
                                ) : (
                                  <>
                                    <i className="fas fa-check-circle me-1"></i>
                                    Mark as Completed
                                  </>
                                )}
                              </Button>
                            )}
                            <Button 
                              size="sm" 
                              variant="outline-secondary"
                              title="View Details"
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
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Progress; 