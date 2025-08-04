import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Alert } from 'react-bootstrap';
import { useAppData } from '../context/AppDataContext';
import apiClient from '../services/apiClient';

const Reports = ({ user }) => {
  const { users, courses, enrollments, progress, loading: contextLoading } = useAppData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadReportData();
  }, []);

  const loadReportData = async () => {
    try {
      setLoading(true);
      // Try to sync with API in background
      await Promise.all([
        apiClient.get('/users'),
        apiClient.get('/courses'),
        apiClient.get('/enrollments'),
        apiClient.get('/progress')
      ]);

      // API data is available, but we're using context data for display
    } catch (err) {
      console.log('API not available, using context data for reports');
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role) => {
    const variants = {
      'ADMIN': 'danger',
      'MANAGER': 'warning',
      'TRAINER': 'info',
      'EMPLOYEE': 'primary'
    };
    return <Badge bg={variants[role] || 'secondary'}>{role}</Badge>;
  };

  // const getStatusBadge = (status) => {
  //   const variants = {
  //     'COMPLETED': 'success',
  //     'IN_PROGRESS': 'warning',
  //     'ENROLLED': 'primary',
  //     'NOT_STARTED': 'secondary'
  //   };
  //   return <Badge bg={variants[status] || 'secondary'}>{status.replace('_', ' ')}</Badge>;
  // };

  // const getCategoryBadge = (category) => {
  //   const colors = {
  //     'TECHNICAL': 'primary',
  //     'SOFT_SKILLS': 'success',
  //     'COMPLIANCE': 'warning',
  //     'LEADERSHIP': 'info',
  //     'PRODUCTIVITY': 'secondary'
  //   };
  //   return <Badge bg={colors[category] || 'secondary'}>{category.replace('_', ' ')}</Badge>;
  // };

  const formatTime = (minutes) => {
    if (!minutes) return '0h 0m';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const calculateTotalTimeSpent = () => {
    return progress.reduce((total, p) => total + (p.timeSpentMinutes || 0), 0);
  };

  const calculateAverageCompletion = () => {
    if (progress.length === 0) return 0;
    const total = progress.reduce((sum, p) => sum + (p.completionPercentage || 0), 0);
    return total / progress.length;
  };

  // const getEnrollmentStatusBreakdown = () => {
  //   const statusCounts = enrollments.reduce((acc, enrollment) => {
  //     acc[enrollment.status] = (acc[enrollment.status] || 0) + 1;
  //     return acc;
  //   }, {});
  //   return statusCounts;
  // };

  const getUserDistribution = () => {
    const userStats = users.map(user => {
      const userEnrollments = enrollments.filter(e => e.user.id === user.id);
      const completed = userEnrollments.filter(e => e.status === 'COMPLETED').length;
      const inProgress = userEnrollments.filter(e => e.status === 'IN_PROGRESS').length;
      return {
        ...user,
        totalEnrollments: userEnrollments.length,
        completed,
        inProgress
      };
    });
    return userStats;
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

  const totalTimeSpent = calculateTotalTimeSpent();
  const averageCompletion = calculateAverageCompletion();
  // const enrollmentStatusBreakdown = getEnrollmentStatusBreakdown();
  const userDistribution = getUserDistribution();

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h1 className="fw-bold text-primary">
            <i className="fas fa-chart-bar me-2"></i>
            Reports & Analytics
          </h1>
          <p className="text-muted">Comprehensive training analytics and insights</p>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      {/* Overall Report */}
      <Row className="mt-4">
        <Col>
          <Card className="dashboard-card">
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-chart-line me-2"></i>
                Overall Report
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3} className="text-center">
                  <h4 className="text-primary">{users.length}</h4>
                  <p className="text-muted mb-0">Total Users</p>
                </Col>
                <Col md={3} className="text-center">
                  <h4 className="text-success">{courses.length}</h4>
                  <p className="text-muted mb-0">Total Courses Available</p>
                </Col>
                <Col md={3} className="text-center">
                  <h4 className="text-info">{enrollments.length}</h4>
                  <p className="text-muted mb-0">Total Enrollments</p>
                  <small className="text-success">{enrollments.filter(e => e.status === 'COMPLETED').length} completed so far</small>
                </Col>
                <Col md={3} className="text-center">
                  <h4 className="text-warning">{formatTime(totalTimeSpent)}</h4>
                  <p className="text-muted mb-0">Total Time Spent</p>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col md={6} className="text-center">
                  <h4 className="text-info">{averageCompletion.toFixed(1)}%</h4>
                  <p className="text-muted mb-0">Average Completion</p>
                </Col>
                <Col md={6} className="text-center">
                  <h4 className="text-success">{enrollments.filter(e => e.status === 'COMPLETED').length}</h4>
                  <p className="text-muted mb-0">Completed Courses</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Enrollment Status Breakdown */}
      <Row className="mt-4">
        <Col>
          <Card className="dashboard-card">
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-chart-pie me-2"></i>
                Enrollment Status Breakdown
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4} className="text-center">
                  <h4 className="text-primary">{enrollments.filter(e => e.status === 'ENROLLED').length}</h4>
                  <p className="text-muted mb-0">Newly Enrolled</p>
                </Col>
                <Col md={4} className="text-center">
                  <h4 className="text-warning">{enrollments.filter(e => e.status === 'IN_PROGRESS').length}</h4>
                  <p className="text-muted mb-0">In Progress</p>
                </Col>
                <Col md={4} className="text-center">
                  <h4 className="text-success">{enrollments.filter(e => e.status === 'COMPLETED').length}</h4>
                  <p className="text-muted mb-0">Completed</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* User Distribution */}
      <Row className="mt-4">
        <Col>
          <Card className="dashboard-card">
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-users me-2"></i>
                User Distribution
              </h5>
            </Card.Header>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Department</th>
                    <th>Enrollments</th>
                    <th>Completed</th>
                    <th>In Progress</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {userDistribution.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <strong>{user.firstName} {user.lastName}</strong>
                      </td>
                      <td>{getRoleBadge(user.role)}</td>
                      <td>{user.department}</td>
                      <td>{user.totalEnrollments}</td>
                      <td>
                        <Badge bg="success">{user.completed}</Badge>
                      </td>
                      <td>
                        <Badge bg="warning">{user.inProgress}</Badge>
                      </td>
                      <td>
                        {user.completed > 0 && (
                          <Badge bg="success" className="me-1">1 course completed</Badge>
                        )}
                        {user.inProgress > 0 && (
                          <Badge bg="warning">{user.inProgress} in progress</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Course Analytics */}
      <Row className="mt-4">
        <Col>
          <Card className="dashboard-card">
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-book me-2"></i>
                Course Analytics
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3} className="text-center">
                  <h4 className="text-primary">{courses.filter(c => c.category === 'TECHNICAL').length}</h4>
                  <p className="text-muted mb-0">Technical Courses</p>
                </Col>
                <Col md={3} className="text-center">
                  <h4 className="text-success">{courses.filter(c => c.type === 'VIRTUAL').length}</h4>
                  <p className="text-muted mb-0">Virtual Courses</p>
                </Col>
                <Col md={3} className="text-center">
                  <h4 className="text-info">{courses.filter(c => c.type === 'SELF_PACED').length}</h4>
                  <p className="text-muted mb-0">Self-Paced</p>
                </Col>
                <Col md={3} className="text-center">
                  <h4 className="text-warning">{courses.filter(c => c.type === 'HYBRID').length}</h4>
                  <p className="text-muted mb-0">Hybrid Courses</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Progress Analytics */}
      <Row className="mt-4">
        <Col>
          <Card className="dashboard-card">
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-chart-line me-2"></i>
                Progress Analytics
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4} className="text-center">
                  <h4 className="text-success">{formatTime(totalTimeSpent)}</h4>
                  <p className="text-muted mb-0">Total Time Spent on Courses</p>
                </Col>
                <Col md={4} className="text-center">
                  <h4 className="text-info">{averageCompletion.toFixed(1)}%</h4>
                  <p className="text-muted mb-0">Average Completion</p>
                </Col>
                <Col md={4} className="text-center">
                  <h4 className="text-primary">{progress.length}</h4>
                  <p className="text-muted mb-0">Active Progress</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>


    </Container>
  );
};

export default Reports; 