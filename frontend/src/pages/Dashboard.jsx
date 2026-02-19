import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, ProgressBar, Badge } from 'react-bootstrap';
import { PlayCircle, CheckCircle, TrendingUp, MenuBook } from '@mui/icons-material';
import api from '../api/axios';
import CourseLogo from '../components/CourseLogo';
import '../App.css';

const CATEGORY_GRADIENTS = {
  'Web Development': 'var(--lh-gradient-indigo)',
  'Programming': 'var(--lh-gradient-blue)',
  'Data Science': 'var(--lh-gradient-orange)',
  'Design': 'var(--lh-gradient-pink)',
  'Default': 'var(--lh-gradient-hero)',
};

export default function Dashboard() {
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    api.get('/enrollments/me').then((res) => setEnrollments(res.data.enrollments || []));
  }, []);

  const completedCount = enrollments.filter(e => e.progress >= 100).length;
  const inProgressCount = enrollments.filter(e => e.progress > 0 && e.progress < 100).length;
  const totalProgress = enrollments.length > 0 
    ? Math.round(enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / enrollments.length)
    : 0;

  return (
    <Container className="py-5">
      <div className="mb-4">
        <h1 className="mb-2 fw-bold" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.25rem)' }}>My Learning</h1>
        <p className="text-muted mb-4">Continue where you left off</p>
      </div>

      {/* Statistics */}
      {enrollments.length > 0 && (
        <Row className="g-4 mb-5">
          <Col md={4}>
            <div className="stat-card">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <MenuBook sx={{ fontSize: 32, color: 'var(--lh-primary)', opacity: 0.8 }} />
                <div className="stat-number">{enrollments.length}</div>
              </div>
              <div className="stat-label">Enrolled Courses</div>
            </div>
          </Col>
          <Col md={4}>
            <div className="stat-card">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <TrendingUp sx={{ fontSize: 32, color: 'var(--lh-accent-green)', opacity: 0.8 }} />
                <div className="stat-number">{totalProgress}%</div>
              </div>
              <div className="stat-label">Average Progress</div>
            </div>
          </Col>
          <Col md={4}>
            <div className="stat-card">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <CheckCircle sx={{ fontSize: 32, color: 'var(--lh-accent-green)', opacity: 0.8 }} />
                <div className="stat-number">{completedCount}</div>
              </div>
              <div className="stat-label">Completed Courses</div>
            </div>
          </Col>
        </Row>
      )}

      {/* Course Cards */}
      <Row xs={1} md={2} lg={3} className="g-4">
        {enrollments.map((en) => {
          const totalLessons = en.course?.sections?.reduce((acc, s) => acc + (s.lessons?.length || 0), 0) || 0;
          const completedLessons = Math.round((en.progress || 0) / 100 * totalLessons);
          return (
            <Col key={en._id}>
              <Card className="card-course h-100 border-0">
                <div className="course-thumb-placeholder" style={{ background: CATEGORY_GRADIENTS[en.course?.category] || CATEGORY_GRADIENTS.Default }}>
                  {en.course?.thumbnail ? (
                    <img src={en.course.thumbnail} alt="" className="w-100 h-100" style={{ objectFit: 'cover' }} />
                  ) : (
                    <CourseLogo course={en.course} size={80} />
                  )}
                  {en.progress >= 100 && (
                    <div className="position-absolute top-0 end-0 m-2">
                      <Badge className="badge-lh" style={{ background: 'var(--lh-gradient-success)', color: 'white', border: 'none' }}>
                        <CheckCircle sx={{ fontSize: 14 }} className="me-1" />
                        Completed
                      </Badge>
                    </div>
                  )}
                </div>
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Badge className={`badge badge-lh badge-${en.course?.difficulty}`}>
                      {en.course?.difficulty}
                    </Badge>
                    <Badge className="badge-lh" style={{ background: CATEGORY_GRADIENTS[en.course?.category] || CATEGORY_GRADIENTS.Default, color: 'white', border: 'none' }}>
                      {en.course?.category}
                    </Badge>
                  </div>
                  <Card.Title className="mb-2 fw-bold" style={{ fontSize: '1.1rem', lineHeight: 1.4, minHeight: '3em' }}>
                    {en.course?.title}
                  </Card.Title>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="small text-muted">Progress</span>
                      <span className="small fw-semibold" style={{ color: 'var(--lh-primary)' }}>
                        {en.progress || 0}%
                      </span>
                    </div>
                    <ProgressBar now={en.progress || 0} className="mb-2" />
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="small text-muted">
                        <PlayCircle sx={{ fontSize: 14 }} className="me-1" />
                        {completedLessons} of {totalLessons} lessons
                      </span>
                    </div>
                  </div>
                  <Button as={Link} to={`/learn/${en._id}`} className="btn-lh-primary btn-sm w-100">
                    {en.progress >= 100 ? (
                      <>
                        <CheckCircle sx={{ fontSize: 16 }} className="me-1" />
                        Review Course
                      </>
                    ) : (
                      <>
                        <PlayCircle sx={{ fontSize: 16 }} className="me-1" />
                        Continue Learning
                      </>
                    )}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
      {enrollments.length === 0 && (
        <Card className="border-0 shadow-sm p-5 text-center card-panel">
          <MenuBook sx={{ fontSize: 64, color: 'var(--lh-text-muted)', marginBottom: '1rem', opacity: 0.3 }} />
          <h5 className="fw-bold mb-2">Start Your Learning Journey</h5>
          <p className="text-muted mb-4">You haven't enrolled in any courses yet. Browse our catalog to find courses that interest you.</p>
          <Button as={Link} to="/courses" className="btn-lh-primary px-4 py-2">
            Browse Courses
          </Button>
        </Card>
      )}
    </Container>
  );
}
