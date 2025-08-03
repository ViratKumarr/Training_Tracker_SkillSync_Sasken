import React from 'react';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';

const NavigationBar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

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

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand href="/dashboard" className="fw-bold">
          <i className="fas fa-graduation-cap me-2"></i>
          SkillSync
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              href="/dashboard" 
              className={isActive('/dashboard') ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                navigate('/dashboard');
              }}
            >
              <i className="fas fa-tachometer-alt me-1"></i>
              Dashboard
            </Nav.Link>
            
            <Nav.Link 
              href="/courses" 
              className={isActive('/courses') ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                navigate('/courses');
              }}
            >
              <i className="fas fa-book me-1"></i>
              Courses
            </Nav.Link>
            
            <Nav.Link 
              href="/enrollments" 
              className={isActive('/enrollments') ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                navigate('/enrollments');
              }}
            >
              <i className="fas fa-user-graduate me-1"></i>
              Enrollments
            </Nav.Link>
            
            <Nav.Link 
              href="/progress" 
              className={isActive('/progress') ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                navigate('/progress');
              }}
            >
              <i className="fas fa-chart-line me-1"></i>
              Progress
            </Nav.Link>
            
            <Nav.Link 
              href="/certificates" 
              className={isActive('/certificates') ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                navigate('/certificates');
              }}
            >
              <i className="fas fa-certificate me-1"></i>
              Certificates
            </Nav.Link>
            
            <Nav.Link 
              href="/feedback" 
              className={isActive('/feedback') ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                navigate('/feedback');
              }}
            >
              <i className="fas fa-comments me-1"></i>
              Feedback
            </Nav.Link>
            
            <Nav.Link 
              href="/notifications" 
              className={isActive('/notifications') ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                navigate('/notifications');
              }}
            >
              <i className="fas fa-bell me-1"></i>
              Notifications
            </Nav.Link>
            
            {(user.role === 'ADMIN' || user.role === 'MANAGER') && (
              <>
                <Nav.Link 
                  href="/users" 
                  className={isActive('/users') ? 'active' : ''}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/users');
                  }}
                >
                  <i className="fas fa-users me-1"></i>
                  Users
                </Nav.Link>
                
                <Nav.Link 
                  href="/reports" 
                  className={isActive('/reports') ? 'active' : ''}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/reports');
                  }}
                >
                  <i className="fas fa-chart-bar me-1"></i>
                  Reports
                </Nav.Link>
              </>
            )}
          </Nav>
          
          <Nav className="ms-auto">
            <Dropdown align="end">
              <Dropdown.Toggle variant="outline-light" id="dropdown-basic">
                <i className="fas fa-user-circle me-1"></i>
                {user.firstName} {user.lastName}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Header>
                  <div className="text-muted small">{getRoleDisplayName(user.role)}</div>
                  <div className="text-muted small">{user.department}</div>
                </Dropdown.Header>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt me-2"></i>
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar; 