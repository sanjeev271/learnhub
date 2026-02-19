import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { Search, PlayCircle, People, EmojiEvents, MenuBook } from '@mui/icons-material';
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

const CATEGORY_COLORS = {
  'Web Development': { bg: 'rgba(99, 102, 241, 0.15)', color: '#4f46e5' },
  'Programming': { bg: 'rgba(14, 165, 233, 0.15)', color: '#0284c7' },
  'Data Science': { bg: 'rgba(245, 158, 11, 0.15)', color: '#b45309' },
  'Design': { bg: 'rgba(244, 63, 94, 0.15)', color: '#be123c' },
  'Default': { bg: 'rgba(100, 116, 139, 0.15)', color: '#475569' },
};

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState({ totalCourses: 0, totalStudents: 0, totalInstructors: 0 });

  useEffect(() => {
    api.get('/courses').then((res) => {
      const coursesData = res.data.courses || [];
      setCourses(coursesData);
      setStats(prev => ({ ...prev, totalCourses: coursesData.length }));
    });
    api.get('/courses/categories').then((res) => setCategories(res.data.categories || []));
    // Public stats for landing page (no auth required)
    api.get('/stats').then((res) => {
      if (res.data) {
        setStats({
          totalCourses: res.data.totalCourses ?? 0,
          totalStudents: res.data.totalStudents ?? 0,
          totalInstructors: res.data.totalInstructors ?? 0,
        });
      }
    }).catch(() => {});
  }, []);

  const featured = courses.slice(0, 6);
  const getCategoryStyle = (cat) => CATEGORY_COLORS[cat] || CATEGORY_COLORS.Default;

  return (
    <>
      <section className="section-hero py-5" style={{ minHeight: '500px', display: 'flex', alignItems: 'center' }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={7}>
              <div className="mb-3">
                <span className="badge badge-lh mb-3" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>
                  🎓 LearnHub Platform
                </span>
              </div>
              <h1 className="display-4 fw-bold mb-3 text-white" style={{ letterSpacing: '-0.03em', lineHeight: 1.2, fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
                Your Center for Skill Enhancement
              </h1>
              <p className="lead mb-4 text-white" style={{ opacity: 0.95, fontSize: '1.15rem', maxWidth: '600px' }}>
                Learn at your own pace with courses from industry experts. Enroll, track progress, and earn certificates.
              </p>
              <div className="d-flex flex-wrap gap-3 mb-4">
                <div className="d-flex align-items-center text-white" style={{ fontSize: '0.9rem' }}>
                  <PlayCircle sx={{ fontSize: 20 }} className="me-2" style={{ opacity: 0.9 }} />
                  <span>1000+ Video Lessons</span>
                </div>
                <div className="d-flex align-items-center text-white" style={{ fontSize: '0.9rem' }}>
                  <People sx={{ fontSize: 20 }} className="me-2" style={{ opacity: 0.9 }} />
                  <span>Expert Instructors</span>
                </div>
                <div className="d-flex align-items-center text-white" style={{ fontSize: '0.9rem' }}>
                  <EmojiEvents sx={{ fontSize: 20 }} className="me-2" style={{ opacity: 0.9 }} />
                  <span>Certificates</span>
                </div>
              </div>
              <Form className="d-flex gap-2 mt-4 search-input-enhanced" onSubmit={(e) => e.preventDefault()}>
                <div style={{ position: 'relative', flex: 1, maxWidth: '500px' }}>
                  <Search sx={{ fontSize: 20 }} className="search-icon" />
                  <Form.Control
                    type="search"
                    placeholder="Search courses, topics, instructors..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="rounded-pill border-0 shadow-lg"
                    style={{ padding: '0.75rem 1.25rem 0.75rem 3rem', fontSize: '1rem' }}
                  />
                </div>
                <Button as={Link} to={`/courses?search=${encodeURIComponent(search)}`} className="btn-lh-primary rounded-pill px-4 fw-semibold border-0" style={{ whiteSpace: 'nowrap' }}>
                  Search
                </Button>
              </Form>
            </Col>
            <Col lg={5} className="text-center d-none d-lg-block">
              <div className="position-relative">
                <div className="rounded-4 bg-white bg-opacity-10 p-5 d-inline-block" style={{ backdropFilter: 'blur(10px)' }}>
                  <div className="course-logo mx-auto" style={{ background: 'rgba(255,255,255,0.95)', width: 120, height: 120, fontSize: '3rem', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                    LH
                  </div>
                </div>
                <div className="position-absolute" style={{ top: '-20px', right: '-20px', width: '80px', height: '80px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', backdropFilter: 'blur(10px)' }}></div>
                <div className="position-absolute" style={{ bottom: '-20px', left: '-20px', width: '60px', height: '60px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', backdropFilter: 'blur(10px)' }}></div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Statistics Section */}
      <section className="py-4 bg-white border-bottom">
        <Container>
          <Row className="g-4">
            <Col md={4}>
              <div className="stat-card text-center">
                <div className="stat-number">{stats.totalCourses}+</div>
                <div className="stat-label">Courses Available</div>
              </div>
            </Col>
            <Col md={4}>
              <div className="stat-card text-center">
                <div className="stat-number">{stats.totalStudents}+</div>
                <div className="stat-label">Students Enrolled</div>
              </div>
            </Col>
            <Col md={4}>
              <div className="stat-card text-center">
                <div className="stat-number">{stats.totalInstructors}+</div>
                <div className="stat-label">Expert Instructors</div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {categories.length > 0 && (
        <section className="py-4 bg-white border-bottom" style={{ boxShadow: '0 1px 0 var(--lh-border)' }}>
          <Container>
            <div className="d-flex flex-wrap gap-2 justify-content-center align-items-center">
              <span className="small fw-semibold text-muted me-2">Categories:</span>
              <Button as={Link} to="/courses" variant="outline-none" size="sm" className="rounded-pill px-3 py-2 fw-semibold" style={{ background: 'var(--lh-gradient-hero)', color: 'white', border: 'none' }}>
                All
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat}
                  as={Link}
                  to={`/courses?category=${encodeURIComponent(cat)}`}
                  variant="outline-none"
                  size="sm"
                  className="rounded-pill px-3 py-2"
                  style={{ background: CATEGORY_GRADIENTS[cat] || CATEGORY_GRADIENTS.Default, color: 'white', border: 'none', fontWeight: 600 }}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </Container>
        </section>
      )}

      <section className="py-5">
        <Container>
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
            <h2 className="mb-0 fw-bold" style={{ fontSize: '1.75rem' }}>Featured Courses</h2>
            <Button as={Link} to="/courses" className="btn-lh-outline btn-sm">
              View all
            </Button>
          </div>
          <Row xs={1} md={2} lg={3} className="g-4">
            {featured.map((course) => {
              const totalLessons = course.sections?.reduce((acc, s) => acc + (s.lessons?.length || 0), 0) || 0;
              const rating = course.rating || 4.5;
              const ratingCount = course.ratingCount || Math.floor(Math.random() * 100) + 10;
              return (
                <Col key={course._id}>
                  <Card className="card-course h-100 border-0">
                    <div className="course-thumb-placeholder" style={{ background: CATEGORY_GRADIENTS[course.category] || CATEGORY_GRADIENTS.Default }}>
                      {course.thumbnail ? (
                        <img src={course.thumbnail} alt="" className="w-100 h-100" style={{ objectFit: 'cover' }} />
                      ) : (
                        <CourseLogo course={course} size={80} />
                      )}
                    </div>
                    <Card.Body className="p-4">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <span className={`badge badge-lh badge-${course.difficulty}`}>{course.difficulty}</span>
                        <span className="badge badge-lh" style={{ background: CATEGORY_GRADIENTS[course.category] || CATEGORY_GRADIENTS.Default, color: 'white', border: 'none' }}>
                          {course.category}
                        </span>
                      </div>
                      <Card.Title className="mb-2 fw-bold" style={{ fontSize: '1.1rem', lineHeight: 1.4, minHeight: '3em' }}>
                        {course.title}
                      </Card.Title>
                      <p className="text-muted small mb-2">
                        <span className="instructor-badge">{course.instructor?.name || 'Instructor'}</span>
                      </p>
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <div className="rating-stars">
                          <span className="star">★</span>
                          <span className="star">★</span>
                          <span className="star">★</span>
                          <span className="star">★</span>
                          <span className="star">★</span>
                        </div>
                        <span className="text-muted small">{rating.toFixed(1)}</span>
                        <span className="text-muted small">({ratingCount})</span>
                      </div>
                      <div className="course-meta mb-3">
                        <span className="course-meta-item">
                          <MenuBook sx={{ fontSize: 14 }} />
                          {totalLessons} lessons
                        </span>
                        {course.totalDuration && (
                          <span className="course-meta-item">
                            <PlayCircle sx={{ fontSize: 14 }} />
                            {course.totalDuration} min
                          </span>
                        )}
                      </div>
                      <div className="d-flex justify-content-between align-items-center mt-auto pt-2 border-top">
                        <span className="fw-bold" style={{ color: 'var(--lh-primary)', fontSize: '1.25rem' }}>
                          {course.isFree ? 'Free' : `₹${course.price}`}
                        </span>
                        <Button as={Link} to={`/courses/${course._id}`} className="btn-lh-primary btn-sm">
                          View course
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
          <div className="text-center mt-5">
            <Button as={Link} to="/courses" className="btn-lh-primary px-4 py-2">
              Browse All Courses
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
