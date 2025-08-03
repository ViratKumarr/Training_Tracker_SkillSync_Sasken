import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Modal, Form, Alert, InputGroup } from 'react-bootstrap';
import { useAppData } from '../context/AppDataContext';
import apiClient from '../services/apiClient';

const Users = ({ user }) => {
  const { users, enrollments, progress, loading: contextLoading } = useAppData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');

  useEffect(() => {
    loadUsers();
    loadEnrollments();
    loadProgress();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/users');
      // API data is available, but we're using context data for display
    } catch (err) {
      console.log('API not available, using context data for users');

    } finally {
      setLoading(false);
    }
  };

  const loadEnrollments = async () => {
    try {
      const response = await apiClient.get('/enrollments');
      // API data is available, but we're using context data for display
    } catch (err) {
      console.log('API not available, using context data for enrollments');

    }
  };

  const loadProgress = async () => {
    try {
      const response = await apiClient.get('/progress');
      // API data is available, but we're using context data for display
    } catch (err) {
      console.log('API not available, using context data for progress');

    }
  };

  const getUserEnrollments = (userId) => {
    return enrollments.filter(e => e.user?.id === userId);
  };

  const getUserProgress = (userId) => {
    return progress.filter(p => p.user?.id === userId);
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

  const getStatusBadge = (userData) => {
    // If this is the current logged-in user, always show as active
    const isCurrentUser = user && (userData.email === user.email || userData.id === user.id);
    const isActive = isCurrentUser || userData.isActive;

    return isActive ?
      <Badge bg="success">
        {isCurrentUser ? 'Active (Current User)' : 'Active'}
      </Badge> :
      <Badge bg="secondary">Inactive</Badge>;
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

  const handleViewUser = (userData) => {
    setSelectedUser(userData);
    setShowUserModal(true);
  };

  const filteredUsers = users.filter(userData => {
    const matchesSearch = 
      userData.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userData.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userData.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userData.employeeId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !filterRole || userData.role === filterRole;
    const matchesDepartment = !filterDepartment || userData.department === filterDepartment;
    return matchesSearch && matchesRole && matchesDepartment;
  });

  if (loading) {
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
            <i className="fas fa-users me-2"></i>
            User Management
          </h1>
          <p className="text-muted">Manage users, their credentials, and training activities</p>
        </Col>
      </Row>

      {/* Current User Info */}
      <Row className="mb-4">
        <Col>
          <Card className="dashboard-card">
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-user me-2"></i>
                Current User Information
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <h6>Personal Information</h6>
                  <div className="mb-2">
                    <strong>Name:</strong> {user.firstName} {user.lastName}
                  </div>
                  <div className="mb-2">
                    <strong>Email:</strong> {user.email}
                  </div>
                  <div className="mb-2">
                    <strong>Phone:</strong> {user.phoneNumber || 'N/A'}
                  </div>
                  <div className="mb-2">
                    <strong>Employee ID:</strong> {user.employeeId}
                  </div>
                </Col>
                <Col md={6}>
                  <h6>Account Information</h6>
                  <div className="mb-2">
                    <strong>Role:</strong> {getRoleBadge(user.role)}
                  </div>
                  <div className="mb-2">
                    <strong>Department:</strong> {user.department}
                  </div>
                  <div className="mb-2">
                    <strong>Status:</strong> {getStatusBadge(user)}
                  </div>
                  <div className="mb-2">
                    <strong>Created:</strong> {user.createdAt ? 
                      new Date(user.createdAt).toLocaleDateString() : 
                      'N/A'
                    }
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Row className="mb-4">
        <Col md={4}>
          <InputGroup>
            <InputGroup.Text>
              <i className="fas fa-search"></i>
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={3}>
          <Form.Select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="MANAGER">Manager</option>
            <option value="TRAINER">Trainer</option>
            <option value="EMPLOYEE">Employee</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
          >
            <option value="">All Departments</option>
            <option value="IT">IT</option>
            <option value="HR">HR</option>
            <option value="Engineering">Engineering</option>
            <option value="Training">Training</option>
          </Form.Select>
        </Col>
        <Col md={2}>
          <Button 
            variant="outline-secondary" 
            onClick={() => {
              setSearchTerm('');
              setFilterRole('');
              setFilterDepartment('');
            }}
          >
            Clear
          </Button>
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
                All Users ({filteredUsers.length} users)
              </h5>
            </Card.Header>
            <Card.Body>
              {filteredUsers.length === 0 ? (
                <div className="text-center py-4">
                  <i className="fas fa-users fa-3x text-muted mb-3"></i>
                  <h5>No Users Found</h5>
                  <p className="text-muted">
                    {searchTerm || filterRole || filterDepartment 
                      ? 'No users match the selected filters.' 
                      : 'No users found.'
                    }
                  </p>
                </div>
              ) : (
                <Table responsive striped>
                  <thead>
                    <tr>
                      <th>User Information</th>
                      <th>Credentials</th>
                      <th>Department & Role</th>
                      <th>Training Activity</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((userData) => {
                      const userEnrollments = getUserEnrollments(userData.id);
                      const userProgress = getUserProgress(userData.id);
                      const completedCourses = userEnrollments.filter(e => e.status === 'COMPLETED').length;
                      const inProgressCourses = userEnrollments.filter(e => e.status === 'IN_PROGRESS').length;
                      
                      return (
                        <tr key={userData.id}>
                          <td>
                            <div>
                              <strong>{userData.firstName} {userData.lastName}</strong>
                              <br />
                              <small className="text-muted">
                                ID: {userData.employeeId}
                                <br />
                                Created: {userData.createdAt ? 
                                  new Date(userData.createdAt).toLocaleDateString() : 
                                  'N/A'
                                }
                              </small>
                            </div>
                          </td>
                          <td>
                            <div>
                              <small className="text-muted">Email</small>
                              <br />
                              <strong>{userData.email}</strong>
                              <br />
                              <small className="text-muted">
                                Phone: {userData.phoneNumber || 'N/A'}
                              </small>
                            </div>
                          </td>
                          <td>
                            <div>
                              <div className="mb-1">
                                {getRoleBadge(userData.role)}
                              </div>
                              <small className="text-muted">
                                {userData.department}
                              </small>
                            </div>
                          </td>
                          <td>
                            <div>
                              <div className="mb-1">
                                <small className="text-muted">Courses: {userEnrollments.length}</small>
                                <br />
                                <small className="text-success">Completed: {completedCourses}</small>
                                <br />
                                <small className="text-warning">In Progress: {inProgressCourses}</small>
                              </div>
                              <div className="d-flex flex-wrap gap-1">
                                {userEnrollments.slice(0, 3).map((enrollment, index) => (
                                  <span key={index} className="badge bg-light text-dark">
                                    {getPlatformBadge(enrollment.course?.materials)}
                                  </span>
                                ))}
                                {userEnrollments.length > 3 && (
                                  <span className="badge bg-secondary">+{userEnrollments.length - 3}</span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>
                            {getStatusBadge(userData)}
                          </td>
                          <td>
                            <Button 
                              size="sm" 
                              variant="outline-primary"
                              onClick={() => handleViewUser(userData)}
                              title="View Details"
                            >
                              <i className="fas fa-eye me-1"></i>
                              Details
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* User Details Modal */}
      <Modal 
        show={showUserModal} 
        onHide={() => setShowUserModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div>
              <Row className="mb-4">
                <Col md={6}>
                  <h6>Personal Information</h6>
                  <div className="mb-2">
                    <strong>Name:</strong> {selectedUser.firstName} {selectedUser.lastName}
                  </div>
                  <div className="mb-2">
                    <strong>Email:</strong> {selectedUser.email}
                  </div>
                  <div className="mb-2">
                    <strong>Phone:</strong> {selectedUser.phoneNumber || 'N/A'}
                  </div>
                  <div className="mb-2">
                    <strong>Employee ID:</strong> {selectedUser.employeeId}
                  </div>
                </Col>
                <Col md={6}>
                  <h6>Account Information</h6>
                  <div className="mb-2">
                    <strong>Role:</strong> {getRoleBadge(selectedUser.role)}
                  </div>
                  <div className="mb-2">
                    <strong>Department:</strong> {selectedUser.department}
                  </div>
                  <div className="mb-2">
                    <strong>Status:</strong> {getStatusBadge(selectedUser)}
                  </div>
                  <div className="mb-2">
                    <strong>Created:</strong> {selectedUser.createdAt ? 
                      new Date(selectedUser.createdAt).toLocaleDateString() : 
                      'N/A'
                    }
                  </div>
                </Col>
              </Row>

              <Row className="mb-4">
                <Col>
                  <h6>Training Activity</h6>
                  {(() => {
                    const userEnrollments = getUserEnrollments(selectedUser.id);
                    const userProgress = getUserProgress(selectedUser.id);
                    
                    return (
                      <div>
                        <div className="row mb-3">
                          <div className="col-md-3">
                            <div className="text-center">
                              <div className="h4 text-primary">{userEnrollments.length}</div>
                              <small className="text-muted">Total Enrollments</small>
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="text-center">
                              <div className="h4 text-success">
                                {userEnrollments.filter(e => e.status === 'COMPLETED').length}
                              </div>
                              <small className="text-muted">Completed</small>
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="text-center">
                              <div className="h4 text-warning">
                                {userEnrollments.filter(e => e.status === 'IN_PROGRESS').length}
                              </div>
                              <small className="text-muted">In Progress</small>
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="text-center">
                              <div className="h4 text-info">
                                {userProgress.length}
                              </div>
                              <small className="text-muted">Active Progress</small>
                            </div>
                          </div>
                        </div>

                        {userEnrollments.length > 0 && (
                          <div>
                            <h6>Recent Enrollments</h6>
                            <div className="table-responsive">
                              <Table size="sm">
                                <thead>
                                  <tr>
                                    <th>Course</th>
                                    <th>Platform</th>
                                    <th>Status</th>
                                    <th>Enrolled Date</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {userEnrollments.slice(0, 5).map((enrollment) => (
                                    <tr key={enrollment.id}>
                                      <td>{enrollment.course?.title}</td>
                                      <td>{getPlatformBadge(enrollment.course?.materials)}</td>
                                      <td>
                                        <Badge bg={enrollment.status === 'COMPLETED' ? 'success' : 'primary'}>
                                          {enrollment.status.replace('_', ' ')}
                                        </Badge>
                                      </td>
                                      <td>
                                        {enrollment.enrolledAt ? 
                                          new Date(enrollment.enrolledAt).toLocaleDateString() : 
                                          'N/A'
                                        }
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </Table>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUserModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Users; 