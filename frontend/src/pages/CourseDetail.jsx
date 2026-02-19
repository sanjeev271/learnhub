import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert, ListGroup, Badge } from 'react-bootstrap';
import { CheckCircle, PlayCircle, AccessTime, People, Star, MenuBook, Person } from '@mui/icons-material';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import CourseLogo from '../components/CourseLogo';
import '../App.css';

const CATEGORY_GRADIENTS = {
  'Web Development': 'var(--lh-gradient-indigo)',
  'Programming': 'var(--lh-gradient-blue)',
  'Data Science': 'var(--lh-gradient-orange)',
  'Design': 'var(--lh-gradient-pink)',
  'Default': 'var(--lh-gradient-hero)',
};

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/courses/${id}`).then((res) => setCourse(res.data.course)).catch(() => setCourse(null));
    if (user) {
      api.get(`/enrollments/check/${id}`).then((res) => {
        setEnrollment(res.data.enrollment);
      }).catch(() => setEnrollment(null));
    }
    setLoading(false);
  }, [id, user]);

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // If course is paid, redirect to payment page immediately
    if (!course.isFree && course.price > 0) {
      navigate(`/payment/${id}`);
      return;
    }
    
    setEnrolling(true);
    setError('');
    try {
      const res = await api.post('/enrollments', { courseId: id });
      setEnrollment(res.data.enrollment);
      navigate(`/learn/${res.data.enrollment._id}`);
    } catch (err) {
      if (err.response?.status === 402) {
        // Payment required - redirect to payment page
        navigate(`/payment/${id}`);
        return;
      } else if (err.response?.status === 400) {
        // Bad request - show specific error message
        const msg = err.response?.data?.message || 'Invalid request. Please check your input.';
        if (msg.includes('Already enrolled')) {
          // If already enrolled, redirect to learning page
          api.get(`/enrollments/check/${id}`).then((checkRes) => {
            if (checkRes.data.enrollment) {
              navigate(`/learn/${checkRes.data.enrollment._id}`);
            }
          }).catch(() => setError(msg));
        } else {
          setError(msg);
        }
      } else {
        setError(err.response?.data?.message || 'Enrollment failed. Please try again.');
      }
    } finally {
      setEnrolling(false);
    }
  };

  if (loading || !course) {
    return (
      <Container className="py-5">
        {!course && !loading ? <p>Course not found.</p> : <p>Loading...</p>}
      </Container>
    );
  }

  const totalLessons = course.sections?.reduce((acc, s) => acc + (s.lessons?.length || 0), 0) || 0;
  const totalDuration = course.totalDuration || course.sections?.reduce((acc, s) => 
    acc + (s.lessons?.reduce((sum, l) => sum + (l.duration || 0), 0) || 0), 0) || 0;
  const isEnrolled = !!enrollment;
  const rating = course.rating || 4.5;
  const ratingCount = course.ratingCount || Math.floor(Math.random() * 50) + 5;

  return (
    <Container className="py-5">
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')} className="rounded-3 border-0 mb-4" style={{ background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', border: 'none', color: '#991b1b' }}>
          <strong>Error:</strong> {error}
        </Alert>
      )}
      <Row>
        <Col lg={8}>
          <div className="mb-3 d-flex flex-wrap gap-2 align-items-center">
            <Badge className="badge-lh" style={{ background: CATEGORY_GRADIENTS[course.category] || CATEGORY_GRADIENTS.Default, color: 'white', border: 'none' }}>
              {course.category}
            </Badge>
            <Badge className={`badge badge-lh badge-${course.difficulty}`}>{course.difficulty}</Badge>
            {course.isFree && (
              <Badge className="badge-lh" style={{ background: 'var(--lh-gradient-success)', color: 'white', border: 'none' }}>
                Free
              </Badge>
            )}
          </div>
          <h1 className="mb-3 fw-bold" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', lineHeight: 1.2 }}>{course.title}</h1>
          <p className="lead mb-4" style={{ color: 'var(--lh-text-muted)', fontSize: '1.15rem' }}>
            {course.shortDescription || course.description}
          </p>
          
          {/* Course Meta Info */}
          <div className="d-flex flex-wrap gap-3 align-items-center mb-4">
            <div className="instructor-badge">
              <Person sx={{ fontSize: 18 }} />
              <span>{course.instructor?.name || 'Instructor'}</span>
            </div>
            <div className="d-flex align-items-center gap-1">
              <Star sx={{ fontSize: 18, color: '#fbbf24' }} />
              <span className="fw-semibold">{rating.toFixed(1)}</span>
              <span className="text-muted small">({ratingCount} ratings)</span>
            </div>
            <div className="course-meta-item">
              <People sx={{ fontSize: 18 }} />
              <span>{course.enrollmentCount || 0} students</span>
            </div>
          </div>

          <hr className="my-4" />

          {/* What you'll learn */}
          <div className="mb-5">
            <h4 className="fw-bold mb-3" style={{ fontSize: '1.5rem' }}>What you'll learn</h4>
            <div className="row g-3">
              {course.description.split('.').filter(s => s.trim()).slice(0, 4).map((point, idx) => (
                <div key={idx} className="col-md-6">
                  <div className="d-flex align-items-start">
                    <CheckCircle sx={{ fontSize: 20, color: 'var(--lh-accent-green)', marginRight: '0.5rem', marginTop: '0.25rem', flexShrink: 0 }} />
                    <span className="text-muted">{point.trim()}.</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Course content */}
          <div className="mb-4">
            <h4 className="fw-bold mb-3" style={{ fontSize: '1.5rem' }}>Course content</h4>
            <Card className="card-panel border-0 mb-0">
              <ListGroup variant="flush">
                {course.sections?.map((section, si) => {
                  const sectionLessons = section.lessons?.length || 0;
                  const sectionDuration = section.lessons?.reduce((sum, l) => sum + (l.duration || 0), 0) || 0;
                  return (
                    <ListGroup.Item key={si} className="border-0 border-bottom px-0 py-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <strong className="d-block" style={{ fontSize: '1.05rem' }}>{section.title}</strong>
                        <span className="text-muted small">{sectionLessons} lessons · {sectionDuration} min</span>
                      </div>
                      <ul className="mb-0 small text-muted list-unstyled">
                        {section.lessons?.map((lesson, li) => (
                          <li key={li} className="py-1 d-flex align-items-center">
                            <PlayCircle sx={{ fontSize: 14, marginRight: '0.5rem', color: 'var(--lh-text-muted)' }} />
                            <span>{lesson.title}</span>
                            {lesson.duration && (
                              <span className="ms-auto text-muted">{lesson.duration} min</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </ListGroup.Item>
                  );
                })}
              </ListGroup>
            </Card>
            {totalLessons === 0 && (
              <div className="text-center py-4 card-panel">
                <p className="text-muted mb-0">No sections added yet.</p>
              </div>
            )}
          </div>
        </Col>
        <Col lg={4}>
          <Card className="border-0 shadow-lg sticky-top" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', top: '100px' }}>
            <div className="course-thumb-placeholder" style={{ height: '220px', background: CATEGORY_GRADIENTS[course.category] || CATEGORY_GRADIENTS.Default }}>
              {course.thumbnail ? (
                <img src={course.thumbnail} alt="" className="w-100 h-100" style={{ objectFit: 'cover' }} />
              ) : (
                <CourseLogo course={course} size={80} />
              )}
            </div>
            <Card.Body className="p-4">
              <div className="mb-4">
                <div className="d-flex align-items-baseline gap-2 mb-2">
                  <h3 className="mb-0 fw-bold" style={{ color: 'var(--lh-primary)', fontSize: '2rem' }}>
                    {course.isFree ? 'Free' : `₹${course.price}`}
                  </h3>
                  {!course.isFree && (
                    <span className="text-decoration-line-through text-muted" style={{ fontSize: '1rem' }}>
                      ₹{Math.round(course.price * 1.5)}
                    </span>
                  )}
                </div>
                {!course.isFree && (
                  <Badge className="badge-lh" style={{ background: 'var(--lh-gradient-success)', color: 'white', border: 'none' }}>
                    Save {Math.round((1 - course.price / (course.price * 1.5)) * 100)}%
                  </Badge>
                )}
              </div>
              {isEnrolled ? (
                <Button as={Link} to={`/learn/${enrollment._id}`} className="btn-lh-primary w-100 py-3 mb-3" style={{ fontSize: '1.05rem', fontWeight: 600 }}>
                  Continue Learning
                </Button>
              ) : (
                <Button 
                  className="w-100 py-3 mb-3 btn-lh-primary" 
                  onClick={handleEnroll} 
                  disabled={enrolling || loading}
                  style={{ fontSize: '1.05rem', fontWeight: 600 }}
                >
                  {enrolling ? 'Enrolling...' : course.isFree ? 'Enroll for Free' : `Buy Now - ₹${course.price}`}
                </Button>
              )}
              <div className="border-top pt-3">
                <h6 className="fw-bold mb-3 small text-uppercase" style={{ color: 'var(--lh-text-muted)', letterSpacing: '0.05em' }}>
                  This course includes:
                </h6>
                <ul className="list-unstyled small mb-0">
                  <li className="py-2 d-flex align-items-center">
                    <MenuBook sx={{ fontSize: 18, color: 'var(--lh-primary)', marginRight: '0.75rem' }} />
                    <span>{totalLessons} on-demand video lessons</span>
                  </li>
                  <li className="py-2 d-flex align-items-center">
                    <AccessTime sx={{ fontSize: 18, color: 'var(--lh-primary)', marginRight: '0.75rem' }} />
                    <span>{totalDuration} minutes of content</span>
                  </li>
                  <li className="py-2 d-flex align-items-center">
                    <CheckCircle sx={{ fontSize: 18, color: 'var(--lh-accent-green)', marginRight: '0.75rem' }} />
                    <span>Certificate of completion</span>
                  </li>
                  <li className="py-2 d-flex align-items-center">
                    <People sx={{ fontSize: 18, color: 'var(--lh-primary)', marginRight: '0.75rem' }} />
                    <span>{course.enrollmentCount || 0} students enrolled</span>
                  </li>
                </ul>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
