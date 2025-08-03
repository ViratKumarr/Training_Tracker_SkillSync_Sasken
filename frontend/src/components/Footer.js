import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <Container>
        <Row>
          <Col md={6}>
            <h5 className="text-primary">SkillSync Training Tracker</h5>
            <p className="mb-0">
              Comprehensive training management system for tracking employee learning and development.
            </p>
          </Col>
          <Col md={6} className="text-md-end">
            <p className="mb-1">
              <strong>Developed by Sasken Technologies</strong>
            </p>
            <p className="mb-0">
              © {new Date().getFullYear()} Virat Kumar. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
