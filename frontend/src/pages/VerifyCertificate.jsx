import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card } from 'react-bootstrap';
import api from '../api/axios';
import '../App.css';

export default function VerifyCertificate() {
  const { certificateId } = useParams();
  const [cert, setCert] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/certificates/verify/${certificateId}`)
      .then((res) => setCert(res.data.certificate))
      .catch(() => setError('Certificate not found'));
  }, [certificateId]);

  if (error) return <Container className="py-5"><p className="text-danger">{error}</p></Container>;
  if (!cert) return <Container className="py-5">Verifying...</Container>;

  return (
    <Container className="py-5 d-flex justify-content-center">
      <Card className="border-0 shadow-lg text-center w-100" style={{ maxWidth: '560px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6, background: 'var(--lh-gradient-success)' }}></div>
        <Card.Body className="p-5">
          <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-4 shadow" style={{ width: 100, height: 100, background: 'var(--lh-gradient-success)', color: 'white', fontSize: '3rem' }}>
            🏆
          </div>
          <h3 className="fw-bold mb-2">Certificate of Completion</h3>
          <p className="lead mb-2">{cert.course?.title}</p>
          <p className="mb-1">Awarded to <strong>{cert.user?.name}</strong></p>
          <p className="text-muted small mb-1">ID: {cert.certificateId}</p>
          <p className="small text-muted">Issued on {new Date(cert.issuedAt).toLocaleDateString()}</p>
        </Card.Body>
      </Card>
    </Container>
  );
}
