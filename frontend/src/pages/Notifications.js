import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Alert } from 'react-bootstrap';
import { useAppData } from '../context/AppDataContext';
import apiClient from '../services/apiClient';

const Notifications = ({ user }) => {
  const { getUserNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification, loading: contextLoading } = useAppData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get user-specific notifications from context
  const notifications = getUserNotifications(user.id);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      // Try to sync with API in background
      await apiClient.get('/notifications');
      // API data is available, but we're using context data for display
    } catch (err) {
      console.log('API not available, using context data for notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (notificationId) => {
    markNotificationAsRead(notificationId);
  };

  const markAllAsRead = () => {
    markAllNotificationsAsRead();
  };

  const handleDeleteNotification = (notificationId) => {
    deleteNotification(notificationId);
  };

  const getTypeIcon = (type) => {
    const icons = {
      'COURSE_ASSIGNMENT': 'fas fa-book',
      'SESSION_REMINDER': 'fas fa-clock',
      'COURSE_COMPLETION': 'fas fa-certificate',
      'FEEDBACK_REQUEST': 'fas fa-comments',
      'SYSTEM_ANNOUNCEMENT': 'fas fa-bullhorn',
      'ATTENDANCE_REMINDER': 'fas fa-user-check',
      'CERTIFICATE_ISSUED': 'fas fa-award',
      'OVERDUE_TRAINING': 'fas fa-exclamation-triangle'
    };
    return icons[type] || 'fas fa-bell';
  };

  const getPriorityBadge = (priority) => {
    const variants = {
      'LOW': 'secondary',
      'MEDIUM': 'info',
      'HIGH': 'warning',
      'URGENT': 'danger'
    };
    return <Badge bg={variants[priority] || 'secondary'}>{priority}</Badge>;
  };

  const getTypeBadge = (type) => {
    const variants = {
      'COURSE_ASSIGNMENT': 'primary',
      'SESSION_REMINDER': 'warning',
      'COURSE_COMPLETION': 'success',
      'FEEDBACK_REQUEST': 'info',
      'SYSTEM_ANNOUNCEMENT': 'secondary',
      'ATTENDANCE_REMINDER': 'dark',
      'CERTIFICATE_ISSUED': 'success',
      'OVERDUE_TRAINING': 'danger'
    };
    return <Badge bg={variants[type] || 'secondary'}>{type.replace('_', ' ')}</Badge>;
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

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
            <i className="fas fa-bell me-2"></i>
            Notifications
          </h1>
          <p className="text-muted">Stay updated with your learning progress and course activities</p>
        </Col>
        <Col xs="auto">
          <div className="d-flex gap-2">
            <Button 
              variant="outline-primary" 
              size="sm"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              <i className="fas fa-check-double me-1"></i>
              Mark All Read
            </Button>
            <Badge bg="danger" className="d-flex align-items-center">
              {unreadCount} {unreadCount === 1 ? 'Unread' : 'Unread'}
            </Badge>
          </div>
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
                Recent Notifications
              </h5>
            </Card.Header>
            <Card.Body>
              {notifications.length === 0 ? (
                <div className="text-center py-4">
                  <i className="fas fa-bell fa-3x text-muted mb-3"></i>
                  <h5>No Notifications</h5>
                  <p className="text-muted">You're all caught up! No new notifications.</p>
                </div>
              ) : (
                <div>
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`mb-3 p-3 border rounded ${!notification.isRead ? 'bg-light' : ''}`}
                    >
                      <Row className="align-items-start">
                        <Col md={1} className="text-center">
                          <i className={`${getTypeIcon(notification.type)} fa-2x text-primary`}></i>
                        </Col>
                        <Col md={8}>
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h6 className="mb-1">{notification.title}</h6>
                            <div className="d-flex gap-1">
                              {getPriorityBadge(notification.priority)}
                              {getTypeBadge(notification.type)}
                            </div>
                          </div>
                          <p className="mb-2">{notification.message}</p>
                          <small className="text-muted">
                            {new Date(notification.sentAt).toLocaleString()}
                          </small>
                        </Col>
                        <Col md={3} className="text-end">
                          <div className="d-flex flex-column gap-1">
                            {!notification.isRead && (
                              <Button 
                                size="sm" 
                                variant="outline-success"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <i className="fas fa-check me-1"></i>
                                Mark Read
                              </Button>
                            )}
                            <Button 
                              size="sm" 
                              variant="outline-danger"
                              onClick={() => handleDeleteNotification(notification.id)}
                            >
                              <i className="fas fa-trash"></i>
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

      {/* Notification Statistics */}
      <Row className="mt-4">
        <Col>
          <Card className="dashboard-card">
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-chart-pie me-2"></i>
                Notification Statistics
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3} className="text-center">
                  <h4 className="text-primary">{notifications.length}</h4>
                  <p className="text-muted mb-0">Total Notifications</p>
                </Col>
                <Col md={3} className="text-center">
                  <h4 className="text-warning">{unreadCount}</h4>
                  <p className="text-muted mb-0">Unread</p>
                </Col>
                <Col md={3} className="text-center">
                  <h4 className="text-success">{notifications.filter(n => n.priority === 'HIGH' || n.priority === 'URGENT').length}</h4>
                  <p className="text-muted mb-0">High Priority</p>
                </Col>
                <Col md={3} className="text-center">
                  <h4 className="text-info">{notifications.filter(n => n.type === 'COURSE_ASSIGNMENT').length}</h4>
                  <p className="text-muted mb-0">Course Assignments</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Notifications; 