import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert } from 'react-bootstrap';
import html2canvas from 'html2canvas';
import { useAppData } from '../context/AppDataContext';
import apiClient from '../services/apiClient';

const Certificates = ({ user }) => {
  const { getUserCertificates, loading: contextLoading } = useAppData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get user-specific certificates from context
  const certificates = getUserCertificates(user.id);

  const loadCertificates = useCallback(async () => {
    try {
      setLoading(true);
      // Try to sync with API in background
      await apiClient.get(`/certificates/user/${user.id}`);
      // API data is available, but we're using context data for display
    } catch (err) {
      console.log('API not available, using context data for certificates');
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    loadCertificates();
  }, [loadCertificates]);

  const downloadCertificate = async (certificate) => {
    try {
      // Create enhanced certificate HTML with inspiring design
      const certificateHTML = `
        <div id="certificate-${certificate.id}" style="
          width: 1200px;
          height: 850px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          color: #333;
          padding: 0;
          font-family: 'Georgia', serif;
          text-align: center;
          border-radius: 25px;
          box-shadow: 0 25px 50px rgba(0,0,0,0.4);
          position: relative;
          overflow: hidden;
        ">
          <!-- Decorative Border -->
          <div style="
            position: absolute;
            top: 15px;
            left: 15px;
            right: 15px;
            bottom: 15px;
            border: 3px solid rgba(255,255,255,0.3);
            border-radius: 20px;
          "></div>

          <!-- Background Pattern -->
          <div style="
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.1)"/><circle cx="10" cy="60" r="0.5" fill="rgba(255,255,255,0.1)"/><circle cx="90" cy="40" r="0.5" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
            opacity: 0.3;
          "></div>

          <!-- Main Content -->
          <div style="
            position: relative;
            z-index: 2;
            padding: 50px 60px;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            background: rgba(255,255,255,0.98);
            margin: 30px;
            border-radius: 20px;
            box-shadow: inset 0 0 30px rgba(0,0,0,0.1);
          ">
            <!-- Decorative Header -->
            <div style="margin-bottom: 30px;">
              <div style="
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 20px;
              ">
                <div style="
                  width: 100px;
                  height: 100px;
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  margin-right: 25px;
                  box-shadow: 0 15px 30px rgba(0,0,0,0.3);
                  border: 4px solid rgba(255,255,255,0.8);
                ">
                  <span style="
                    color: white;
                    font-size: 32px;
                    font-weight: bold;
                  ">🏆</span>
                </div>
                <div style="text-align: left;">
                  <h1 style="
                    font-size: 32px;
                    color: #333;
                    margin: 0;
                    font-weight: bold;
                  ">SkillSync</h1>
                  <p style="
                    font-size: 16px;
                    color: #666;
                    margin: 0;
                  ">Training Platform</p>
                </div>
              </div>
              
              <h2 style="
                font-size: 42px;
                color: #667eea;
                margin-bottom: 10px;
                font-weight: bold;
                text-transform: uppercase;
                letter-spacing: 2px;
              ">Certificate of Completion</h2>
              
              <p style="
                font-size: 18px;
                color: #666;
                margin-bottom: 40px;
              ">This is to certify that</p>
            </div>
            
            <!-- Student Name -->
            <div style="margin-bottom: 40px;">
              <h3 style="
                font-size: 36px;
                color: #333;
                margin-bottom: 20px;
                font-weight: bold;
                text-transform: uppercase;
                letter-spacing: 1px;
              ">${certificate.user?.firstName} ${certificate.user?.lastName}</h3>
              
              <p style="
                font-size: 20px;
                color: #666;
                margin-bottom: 30px;
              ">has successfully completed the course</p>
              
              <h4 style="
                font-size: 32px;
                color: #667eea;
                margin-bottom: 20px;
                font-weight: bold;
                line-height: 1.3;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
              ">${certificate.course?.title}</h4>

              <!-- Inspiring Quote -->
              <div style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 25px;
                border-radius: 15px;
                margin: 30px 0;
                box-shadow: 0 10px 20px rgba(0,0,0,0.2);
                position: relative;
              ">
                <div style="
                  font-size: 20px;
                  font-style: italic;
                  margin-bottom: 10px;
                  line-height: 1.4;
                ">"Excellence is not a skill, it's an attitude. Your dedication to learning and growth is truly commendable."</div>
                <div style="
                  font-size: 16px;
                  text-align: right;
                  opacity: 0.9;
                ">- SkillSync Team</div>
                <div style="
                  position: absolute;
                  top: -10px;
                  left: 30px;
                  font-size: 40px;
                  opacity: 0.3;
                ">"</div>
              </div>
            </div>

            <!-- Course Details -->
            <div style="
              background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
              padding: 35px;
              border-radius: 20px;
              margin-bottom: 25px;
              border: 2px solid rgba(102, 126, 234, 0.1);
              border-radius: 15px;
              margin-bottom: 30px;
            ">
              <div style="
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                text-align: left;
              ">
                <div>
                  <p style="margin: 5px 0; font-size: 16px;">
                    <strong style="color: #667eea;">Course Duration:</strong> ${certificate.course?.durationHours} hours
                  </p>
                  <p style="margin: 5px 0; font-size: 16px;">
                    <strong style="color: #667eea;">Time Spent:</strong> ${certificate.course?.durationHours} hours
                  </p>
                  <p style="margin: 5px 0; font-size: 16px;">
                    <strong style="color: #667eea;">Grade:</strong> <span style="color: #28a745; font-weight: bold;">${certificate.grade}</span>
                  </p>
                </div>
                <div>
                  <p style="margin: 5px 0; font-size: 16px;">
                    <strong style="color: #667eea;">Score:</strong> ${certificate.score}/${certificate.maxScore}
                  </p>
                  <p style="margin: 5px 0; font-size: 16px;">
                    <strong style="color: #667eea;">Completion:</strong> ${certificate.completionPercentage}%
                  </p>
                  <p style="margin: 5px 0; font-size: 16px;">
                    <strong style="color: #667eea;">Certificate ID:</strong> ${certificate.certificateNumber}
                  </p>
                </div>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              margin-top: 30px;
              padding-top: 25px;
              border-top: 3px solid #667eea;
            ">
              <div style="text-align: left;">
                <div style="
                  width: 180px;
                  height: 60px;
                  border-bottom: 2px solid #333;
                  margin-bottom: 8px;
                  display: flex;
                  align-items: end;
                  justify-content: center;
                  font-size: 18px;
                  font-weight: bold;
                  color: #667eea;
                ">SkillSync Team</div>
                <p style="font-size: 14px; color: #666; margin: 0; text-align: center;">Authorized Signature</p>
                <p style="font-size: 12px; color: #999; margin: 0; text-align: center;">Training Platform</p>
              </div>

              <div style="text-align: center;">
                <div style="
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  color: white;
                  padding: 15px 25px;
                  border-radius: 50px;
                  font-size: 16px;
                  font-weight: bold;
                  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
                ">🌟 CERTIFIED 🌟</div>
              </div>

              <div style="text-align: right;">
                <p style="
                  font-size: 16px;
                  font-weight: bold;
                  color: #667eea;
                  margin-bottom: 5px;
                  color: #667eea;
                  margin: 0;
                  font-weight: bold;
                ">📅 ${new Date(certificate.completionDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
                <p style="font-size: 14px; color: #666; margin: 0;">Date of Completion</p>
              </div>
            </div>

            <!-- Decorative Elements -->
            <div style="
              position: absolute;
              top: 40px;
              right: 40px;
              font-size: 60px;
              opacity: 0.1;
              color: #667eea;
            ">🎓</div>

            <div style="
              position: absolute;
              bottom: 40px;
              left: 40px;
              font-size: 40px;
              opacity: 0.1;
              color: #764ba2;
            ">⭐</div>
            </div>
          </div>
        </div>
      `;

      // Create a temporary div to render the certificate
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = certificateHTML;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      document.body.appendChild(tempDiv);

      // Convert to canvas and download
      const canvas = await html2canvas(tempDiv.querySelector(`#certificate-${certificate.id}`));
      const link = document.createElement('a');
      link.download = `certificate-${certificate.course?.title?.replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL();
      link.click();

      // Clean up
      document.body.removeChild(tempDiv);
    } catch (error) {
      console.error('Error downloading certificate:', error);
      alert('Failed to download certificate. Please try again.');
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      'ISSUED': 'success',
      'PENDING': 'warning',
      'REVOKED': 'danger'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const getGradeBadge = (grade) => {
    const variants = {
      'A+': 'success',
      'A': 'primary',
      'B': 'info',
      'C': 'warning',
      'D': 'danger'
    };
    return <Badge bg={variants[grade] || 'secondary'}>{grade}</Badge>;
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
            <i className="fas fa-certificate me-2"></i>
            My Certificates
          </h1>
          <p className="text-muted">View and download your earned certificates</p>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      {/* Demo Certificate Design - Always Visible */}
      <Row className="mb-4">
        <Col>
          <Card className="border-primary">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">
                <i className="fas fa-award me-2"></i>
                Certificate Design Preview
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="text-center mb-3">
                <div style={{
                  width: '100%',
                  maxWidth: '600px',
                  height: '400px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                  margin: '0 auto',
                  borderRadius: '15px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: 'white',
                  fontFamily: 'Georgia, serif',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    right: '20px',
                    bottom: '20px',
                    border: '3px solid rgba(255,255,255,0.3)',
                    borderRadius: '10px'
                  }}></div>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '28px', fontWeight: 'bold' }}>Certificate of Completion</h3>
                  <p style={{ margin: '0 0 20px 0', fontSize: '16px', opacity: 0.9 }}>This certifies that</p>
                  <h2 style={{ margin: '0 0 20px 0', fontSize: '32px', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>Your Name</h2>
                  <p style={{ margin: '0 0 10px 0', fontSize: '16px', opacity: 0.9 }}>has successfully completed</p>
                  <h4 style={{ margin: '0 0 15px 0', fontSize: '20px', fontWeight: 'bold' }}>Course Title</h4>
                  <p style={{ margin: '0 0 15px 0', fontSize: '14px', opacity: 0.8, fontStyle: 'italic' }}>
                    "Learning never exhausts the mind" - Leonardo da Vinci
                  </p>
                  <p style={{ margin: '0 0 5px 0', fontSize: '14px', opacity: 0.8 }}>Date: {new Date().toLocaleDateString()}</p>
                  <p style={{ margin: '0', fontSize: '14px', opacity: 0.8 }}>SkillSync - Sasken Technologies</p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-muted">
                  <i className="fas fa-info-circle me-2"></i>
                  Complete any course to earn a certificate with this beautiful design!
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Real Certificates Section */}
      <Row>
        <Col>
          <Card className="dashboard-card">
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-download me-2"></i>
                Your Earned Certificates ({certificates.length})
              </h5>
            </Card.Header>
            <Card.Body>
              {certificates.length === 0 ? (
                <div className="text-center py-4">
                  <i className="fas fa-certificate fa-3x text-muted mb-3"></i>
                  <h5>No Certificates Earned Yet</h5>
                  <p className="text-muted">Complete courses with 100% progress to earn certificates and see them here!</p>
                  <Button variant="outline-primary" href="/progress">
                    Track Your Progress
                  </Button>
                </div>
              ) : (
                <div>
                  {certificates.map((certificate) => (
                    <div key={certificate.id} className="mb-4 p-4 border rounded shadow-sm">
                      <Row className="align-items-center mb-3">
                        <Col md={6}>
                          <h5 className="mb-2">{certificate.course?.title}</h5>
                          <p className="text-muted mb-2">{certificate.course?.description}</p>
                          <div className="d-flex align-items-center gap-2 mb-2">
                            <Badge bg="secondary">{certificate.course?.category}</Badge>
                            <Badge bg="info">{certificate.course?.type}</Badge>
                            <small className="text-muted">
                              <i className="fas fa-clock me-1"></i>
                              {certificate.course?.durationHours} hours
                            </small>
                          </div>
                          <small className="text-muted">
                            Certificate ID: {certificate.certificateNumber}
                          </small>
                        </Col>
                        <Col md={2}>
                          <div className="text-center">
                            {getGradeBadge(certificate.grade)}
                            <br />
                            <small className="text-muted">Grade</small>
                          </div>
                        </Col>
                        <Col md={2}>
                          <div className="text-center">
                            <div className="h5 mb-1 text-success">
                              {certificate.score}/{certificate.maxScore}
                            </div>
                            <small className="text-muted">Score</small>
                          </div>
                        </Col>
                        <Col md={2}>
                          <div className="text-center">
                            {new Date(certificate.completionDate).toLocaleDateString()}
                            <br />
                            <small className="text-muted">Completed</small>
                          </div>
                        </Col>
                      </Row>
                      
                      <Row className="mb-3">
                        <Col>
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <strong>Course Statistics:</strong>
                              <br />
                              <small className="text-muted">
                                Completion: {certificate.completionPercentage}% • 
                                Duration: {certificate.course?.durationHours} hours • 
                                Time Spent: {certificate.course?.durationHours} hours • 
                                Issued by: {certificate.issuedBy}
                              </small>
                            </div>
                            <div className="d-flex gap-2">
                              {getStatusBadge(certificate.status)}
                              <Button 
                                variant="outline-primary" 
                                size="sm"
                                onClick={() => downloadCertificate(certificate)}
                              >
                                <i className="fas fa-download me-1"></i>
                                Download Certificate
                              </Button>
                            </div>
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

      {/* Certificate Statistics */}
      <Row className="mt-4">
        <Col>
          <Card className="dashboard-card">
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-chart-pie me-2"></i>
                Certificate Statistics
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3} className="text-center">
                  <h4 className="text-primary">{certificates.length}</h4>
                  <p className="text-muted mb-0">Total Certificates</p>
                </Col>
                <Col md={3} className="text-center">
                  <h4 className="text-success">{certificates.filter(c => c.status === 'ISSUED').length}</h4>
                  <p className="text-muted mb-0">Issued</p>
                </Col>
                <Col md={3} className="text-center">
                  <h4 className="text-warning">{certificates.filter(c => c.grade === 'A+').length}</h4>
                  <p className="text-muted mb-0">A+ Grades</p>
                </Col>
                <Col md={3} className="text-center">
                  <h4 className="text-info">{certificates.filter(c => c.grade === 'A').length}</h4>
                  <p className="text-muted mb-0">A Grades</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Certificates; 