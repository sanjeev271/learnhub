import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import '../App.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Invalid email or password. Please check your credentials.');
      } else if (err.response?.status === 400) {
        setError(err.response?.data?.message || 'Invalid input. Please check your email and password.');
      } else {
        setError(err.response?.data?.message || 'Login failed. Please try again.');
      }
    }
  };

  return (
    <Container className="py-5 d-flex justify-content-center align-items-center min-vh-75">
      <Card className="border-0 shadow-lg w-100" style={{ maxWidth: '420px', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <div style={{ height: 4, background: 'var(--lh-gradient-hero)' }}></div>
        <Card.Body className="p-5">
          <div className="text-center mb-4">
            <h2 className="fw-bold mb-1">Welcome back</h2>
            <p className="text-muted small">Sign in to continue learning</p>
          </div>
          {error && (
            <Alert variant="danger" className="rounded-3 border-0 mb-3" style={{ background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', border: 'none', color: '#991b1b' }}>
              <strong>Error:</strong> {error}
            </Alert>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Email</Form.Label>
              <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="py-2" />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold">Password</Form.Label>
              <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="py-2" />
            </Form.Group>
            <Button type="submit" className="btn-lh-primary w-100 py-2">
              Sign In
            </Button>
          </Form>
          <p className="text-center mt-4 mb-0 text-muted small">
            Don't have an account? <Link to="/register" className="fw-semibold" style={{ color: 'var(--lh-primary)' }}>Sign up</Link>
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
}
