import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import api from '../api/axios';
import '../App.css';

export default function Certificates() {
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    api.get('/certificates/me').then((res) => setCertificates(res.data.certificates || []));
  }, []);

  return (
    <Container className="py-5">
      <h1 className="mb-2 fw-bold" style={{ fontSize: '1.85rem' }}>My Certificates</h1>
      <p className="text-muted mb-4">Your earned credentials</p>
      <Row xs={1} md={2} className="g-4">
        {certificates.map((cert) => (
          <Col key={cert._id}>
            <Card className="card-course border-0 h-100" style={{ position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'var(--lh-gradient-success)' }}></div>
              <Card.Body className="text-center p-5">
                <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow" style={{ width: 80, height: 80, background: 'var(--lh-gradient-success)', color: 'white', fontSize: '2.5rem' }}>
                  🏆
                </div>
                <h5 className="fw-bold mb-2">{cert.course?.title}</h5>
                <p className="text-muted small mb-2">ID: {cert.certificateId}</p>
                <p className="small text-muted mb-3">Issued {new Date(cert.issuedAt).toLocaleDateString()}</p>
                <Button as={Link} to={`/certificates/verify/${cert.certificateId}`} className="btn-lh-outline btn-sm">
                  View certificate
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      {certificates.length === 0 && (
        <Card className="border-0 shadow-sm p-5 text-center card-panel">
          <p className="text-muted mb-4">No certificates yet. Complete a course to earn one.</p>
          <Button as={Link} to="/courses" className="btn-lh-primary px-4">
            Browse Courses
          </Button>
        </Card>
      )}
    </Container>
  );
}
