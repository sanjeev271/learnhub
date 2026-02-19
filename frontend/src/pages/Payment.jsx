import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import api from '../api/axios';
import '../App.css';

export default function Payment() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/courses/${courseId}`).then((res) => setCourse(res.data.course)).finally(() => setLoading(false));
  }, [courseId]);

  const handlePay = async (e) => {
    e.preventDefault();
    setPaying(true);
    setError('');
    try {
      // Step 1: Create payment record
      await api.post('/payments', { courseId, amount: course?.price, transactionId: 'SIM-' + Date.now() });
      
      // Step 2: Enroll in course (should work now that payment exists)
      try {
        const enrollRes = await api.post('/enrollments', { courseId });
        navigate(`/learn/${enrollRes.data.enrollment._id}`);
        return;
      } catch (enrollErr) {
        // If enrollment still fails, try to get enrollment via check endpoint
        if (enrollErr.response?.status === 400 && enrollErr.response?.data?.message?.includes('Already enrolled')) {
          const enRes = await api.get(`/enrollments/check/${courseId}`);
          if (enRes.data.enrollment) {
            navigate(`/learn/${enRes.data.enrollment._id}`);
            return;
          }
        }
        throw enrollErr;
      }
    } catch (err) {
      if (err.response?.status === 400) {
        const msg = err.response?.data?.message || 'Invalid payment request. Please try again.';
        setError(msg);
      } else if (err.response?.status === 402) {
        setError('Payment was processed but enrollment failed. Please try enrolling again from the course page.');
      } else {
        setError(err.response?.data?.message || 'Payment failed. Please check your connection and try again.');
      }
    } finally {
      setPaying(false);
    }
  };

  if (loading || !course) return <Container className="py-5">Loading...</Container>;

  return (
    <Container className="py-5 d-flex justify-content-center">
      <Card className="border-0 shadow-lg w-100" style={{ maxWidth: '440px', borderRadius: 'var(--radius-lg)' }}>
        <Card.Body className="p-5">
          <h2 className="fw-bold mb-2">Complete Payment</h2>
          <p className="text-muted mb-3">{course.title}</p>
          <div className="mb-4 p-3 rounded-3" style={{ background: 'var(--lh-gradient-hero)', color: 'white' }}>
            <h4 className="fw-bold mb-0">₹{course.price}</h4>
            <small className="opacity-90">One-time payment</small>
          </div>
          {error && (
            <Alert variant="danger" className="rounded-3 border-0 mb-3" style={{ background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', border: 'none', color: '#991b1b' }}>
              <strong>Error:</strong> {error}
            </Alert>
          )}
          <Form onSubmit={handlePay}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Card (simulation)</Form.Label>
              <Form.Control placeholder="4242 4242 4242 4242" disabled className="py-2" />
            </Form.Group>
            <Form.Text className="text-muted small d-block mb-4">
              Demo mode. Click Pay to simulate success and enroll.
            </Form.Text>
            <Button type="submit" className="btn-lh-primary w-100 py-2" disabled={paying}>
              {paying ? 'Processing...' : 'Pay & Enroll'}
            </Button>
          </Form>
          <p className="text-center mt-4 mb-0">
            <Link to={`/courses/${courseId}`} className="small" style={{ color: 'var(--lh-primary)' }}>Back to course</Link>
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
}
