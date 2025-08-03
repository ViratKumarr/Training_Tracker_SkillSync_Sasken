import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Badge } from 'react-bootstrap';
import { useAppData } from '../context/AppDataContext';
import apiClient from '../services/apiClient';

const Feedback = ({ user }) => {
  const { feedback, courses, addFeedback, updateFeedback, deleteFeedback, loading: contextLoading } = useAppData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [formData, setFormData] = useState({
    courseId: '',
    contentRating: 5,
    instructorRating: 5,
    facilityRating: 5,
    overallSatisfaction: 5,
    wouldRecommend: true,
    comments: '',
    suggestions: ''
  });

  useEffect(() => {
    loadFeedback();
    loadCourses();
  }, []);

  const loadFeedback = async () => {
    try {
      setLoading(true);
      // Try to sync with API in background
      const response = await apiClient.get('/feedback');
      // API data is available, but we're using context data for display
    } catch (err) {
      console.log('API not available, using context data for feedback');
    } finally {
      setLoading(false);
    }
  };

  const loadCourses = async () => {
    try {
      // Try to sync with API in background
      const response = await apiClient.get('/courses');
      // API data is available, but we're using context data for display
    } catch (err) {
      console.log('API not available, using context data for courses');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const selectedCourse = courses.find(c => c.id == formData.courseId);

      if (editingFeedback) {
        // Update existing feedback
        const updatedFeedback = {
          ...editingFeedback,
          courseName: selectedCourse.title,
          ...formData,
          status: 'SUBMITTED' // Reset status when edited
        };

        updateFeedback(editingFeedback.id, updatedFeedback);
        setEditingFeedback(null);
        alert('Feedback updated successfully!');
      } else {
        // Create new feedback
        const newFeedback = {
          courseName: selectedCourse.title,
          userName: `${user.firstName} ${user.lastName}`,
          userEmail: user.email,
          ...formData
        };

        addFeedback(newFeedback);
        alert('Feedback submitted successfully!');
      }

      setShowForm(false);
      resetForm();
    } catch (err) {
      setError('Failed to submit feedback');
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      courseId: '',
      contentRating: 5,
      instructorRating: 5,
      facilityRating: 5,
      overallSatisfaction: 5,
      wouldRecommend: true,
      comments: '',
      suggestions: ''
    });
    setEditingFeedback(null);
  };

  const handleEdit = (feedback) => {
    const course = courses.find(c => c.title === feedback.courseName);
    setFormData({
      courseId: course ? course.id : '',
      contentRating: feedback.contentRating,
      instructorRating: feedback.instructorRating,
      facilityRating: feedback.facilityRating,
      overallSatisfaction: feedback.overallSatisfaction,
      wouldRecommend: feedback.wouldRecommend,
      comments: feedback.comments,
      suggestions: feedback.suggestions
    });
    setEditingFeedback(feedback);
    setShowForm(true);
  };

  const handleDelete = (feedbackId) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      deleteFeedback(feedbackId);
    }
  };

  const handleCancelEdit = () => {
    setShowForm(false);
    resetForm();
  };

  const getStatusBadge = (status) => {
    const variants = {
      'SUBMITTED': 'primary',
      'REVIEWED': 'info',
      'APPROVED': 'success',
      'REJECTED': 'danger'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const getRatingStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
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
            <i className="fas fa-comments me-2"></i>
            Course Feedback
          </h1>
          <p className="text-muted">Share your thoughts and suggestions about courses</p>
        </Col>
        <Col xs="auto">
          <Button 
            variant="primary" 
            onClick={() => setShowForm(true)}
            className="d-flex align-items-center"
          >
            <i className="fas fa-plus me-2"></i>
            Submit Feedback
          </Button>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      {/* Feedback Form Modal */}
      {showForm && (
        <Card className="mb-4">
          <Card.Header>
            <h5 className="mb-0">
              <i className={`fas ${editingFeedback ? 'fa-edit' : 'fa-plus'} me-2`}></i>
              {editingFeedback ? 'Edit Course Feedback' : 'Submit Course Feedback'}
            </h5>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Select Course</Form.Label>
                    <Form.Select 
                      value={formData.courseId} 
                      onChange={(e) => setFormData({...formData, courseId: e.target.value})}
                      required
                    >
                      <option value="">Choose a course...</option>
                      {courses.map(course => (
                        <option key={course.id} value={course.id}>
                          {course.title}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Content Quality</Form.Label>
                    <Form.Select 
                      value={formData.contentRating} 
                      onChange={(e) => setFormData({...formData, contentRating: parseInt(e.target.value)})}
                    >
                      {[1,2,3,4,5].map(rating => (
                        <option key={rating} value={rating}>
                          {rating} {rating === 1 ? 'Star' : 'Stars'}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Instructor Quality</Form.Label>
                    <Form.Select 
                      value={formData.instructorRating} 
                      onChange={(e) => setFormData({...formData, instructorRating: parseInt(e.target.value)})}
                    >
                      {[1,2,3,4,5].map(rating => (
                        <option key={rating} value={rating}>
                          {rating} {rating === 1 ? 'Star' : 'Stars'}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Facility Quality</Form.Label>
                    <Form.Select 
                      value={formData.facilityRating} 
                      onChange={(e) => setFormData({...formData, facilityRating: parseInt(e.target.value)})}
                    >
                      {[1,2,3,4,5].map(rating => (
                        <option key={rating} value={rating}>
                          {rating} {rating === 1 ? 'Star' : 'Stars'}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Overall Satisfaction</Form.Label>
                    <Form.Select 
                      value={formData.overallSatisfaction} 
                      onChange={(e) => setFormData({...formData, overallSatisfaction: parseInt(e.target.value)})}
                    >
                      {[1,2,3,4,5].map(rating => (
                        <option key={rating} value={rating}>
                          {rating} {rating === 1 ? 'Star' : 'Stars'}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Check 
                  type="checkbox" 
                  label="Would you recommend this course to others?"
                  checked={formData.wouldRecommend}
                  onChange={(e) => setFormData({...formData, wouldRecommend: e.target.checked})}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Comments</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={3}
                  value={formData.comments}
                  onChange={(e) => setFormData({...formData, comments: e.target.value})}
                  placeholder="Share your experience with this course..."
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Suggestions for Improvement</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={3}
                  value={formData.suggestions}
                  onChange={(e) => setFormData({...formData, suggestions: e.target.value})}
                  placeholder="Any suggestions to improve this course..."
                />
              </Form.Group>

              <div className="d-flex gap-2">
                <Button type="submit" variant="primary">
                  <i className={`fas ${editingFeedback ? 'fa-save' : 'fa-paper-plane'} me-1`}></i>
                  {editingFeedback ? 'Update Feedback' : 'Submit Feedback'}
                </Button>
                <Button variant="secondary" onClick={handleCancelEdit}>
                  <i className="fas fa-times me-1"></i>
                  Cancel
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      )}

      {/* Feedback List */}
      <Row>
        <Col>
          <Card className="dashboard-card">
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-list me-2"></i>
                Recent Feedback
              </h5>
            </Card.Header>
            <Card.Body>
              {feedback.length === 0 ? (
                <div className="text-center py-4">
                  <i className="fas fa-comments fa-3x text-muted mb-3"></i>
                  <h5>No Feedback Yet</h5>
                  <p className="text-muted">Be the first to share your thoughts about courses.</p>
                </div>
              ) : (
                <div>
                  {feedback.map((feedbackItem) => (
                    <div key={feedbackItem.id} className="mb-4 p-3 border rounded">
                      <Row>
                        <Col md={8}>
                          <h6 className="mb-1">{feedbackItem.courseName}</h6>
                          <p className="text-muted mb-2">
                            <small>
                              <i className="fas fa-user me-1"></i>
                              {feedbackItem.userName} ({feedbackItem.userEmail})
                            </small>
                          </p>
                          <div className="mb-2">
                            <small className="text-muted">Ratings:</small>
                            <div className="d-flex gap-3 mt-1">
                              <span>Content: <span style={{color: '#ffc107'}}>{getRatingStars(feedbackItem.contentRating)}</span></span>
                              <span>Instructor: <span style={{color: '#ffc107'}}>{getRatingStars(feedbackItem.instructorRating)}</span></span>
                              <span>Facility: <span style={{color: '#ffc107'}}>{getRatingStars(feedbackItem.facilityRating)}</span></span>
                              <span>Overall: <span style={{color: '#ffc107'}}>{getRatingStars(feedbackItem.overallSatisfaction)}</span></span>
                            </div>
                          </div>
                          {feedbackItem.comments && (
                            <div className="mb-2">
                              <strong>Comments:</strong>
                              <p className="mb-1">{feedbackItem.comments}</p>
                            </div>
                          )}
                          {feedbackItem.suggestions && (
                            <div className="mb-2">
                              <strong>Suggestions:</strong>
                              <p className="mb-1">{feedbackItem.suggestions}</p>
                            </div>
                          )}
                        </Col>
                        <Col md={4} className="text-end">
                          <div className="mb-2">
                            {getStatusBadge(feedbackItem.status)}
                          </div>
                          <small className="text-muted d-block mb-2">
                            {new Date(feedbackItem.submittedAt).toLocaleDateString()}
                          </small>
                          {feedbackItem.wouldRecommend && (
                            <div className="mb-2">
                              <Badge bg="success">
                                <i className="fas fa-thumbs-up me-1"></i>
                                Would Recommend
                              </Badge>
                            </div>
                          )}

                          {/* Action Buttons - Only show for current user's feedback */}
                          {feedbackItem.userEmail === user.email && (
                            <div className="d-flex gap-1 justify-content-end mt-2">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => handleEdit(feedbackItem)}
                                title="Edit Feedback"
                              >
                                <i className="fas fa-edit"></i>
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDelete(feedbackItem.id)}
                                title="Delete Feedback"
                              >
                                <i className="fas fa-trash"></i>
                              </Button>
                            </div>
                          )}
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

export default Feedback; 