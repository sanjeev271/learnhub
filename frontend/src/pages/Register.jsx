import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import '../App.css';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(name, email, password, role);
      navigate(role === 'teacher' ? '/teacher' : '/dashboard');
    } catch (err) {
      if (err.response?.status === 400) {
        const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Invalid input. Please check all fields.';
        setError(msg);
      } else {
        setError(err.response?.data?.message || 'Registration failed. Please try again.');
      }
    }
  };

  return (
    <Container className="py-5 d-flex justify-content-center align-items-center min-vh-75">
      <Card className="border-0 shadow-lg w-100" style={{ maxWidth: '420px', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <div style={{ height: 4, background: 'var(--lh-gradient-hero)' }}></div>
        <Card.Body className="p-5">
          <div className="text-center mb-4">
            <h2 className="fw-bold mb-1">Create account</h2>
            <p className="text-muted small">Start learning or teaching today</p>
          </div>
          {error && (
            <Alert variant="danger" className="rounded-3 border-0 mb-3" style={{ background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', border: 'none', color: '#991b1b' }}>
              <strong>Error:</strong> {error}
            </Alert>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Full Name</Form.Label>
              <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} required className="py-2" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Email</Form.Label>
              <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="py-2" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Password (min 6 characters)</Form.Label>
              <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required className="py-2" />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold">I want to</Form.Label>
              <Form.Select value={role} onChange={(e) => setRole(e.target.value)} className="py-2">
                <option value="student">Learn (Student)</option>
                <option value="teacher">Teach (Instructor)</option>
              </Form.Select>
            </Form.Group>
            <Button type="submit" className="btn-lh-primary w-100 py-2">
              Sign Up
            </Button>
          </Form>
          <p className="text-center mt-4 mb-0 text-muted small">
            Already have an account? <Link to="/login" className="fw-semibold" style={{ color: 'var(--lh-primary)' }}>Login</Link>
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
}
