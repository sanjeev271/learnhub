import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Badge } from 'react-bootstrap';
import { Search, FilterList, Star, MenuBook, PlayCircle, People } from '@mui/icons-material';
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

export default function CourseCatalog() {
  const [searchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [difficulty, setDifficulty] = useState(searchParams.get('difficulty') || '');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sort, setSort] = useState('popularity');

  useEffect(() => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (difficulty) params.set('difficulty', difficulty);
    if (search) params.set('search', search);
    params.set('sort', sort);
    api.get(`/courses?${params}`).then((res) => setCourses(res.data.courses || []));
  }, [category, difficulty, search, sort]);

  useEffect(() => {
    api.get('/courses/categories').then((res) => setCategories(res.data.categories || []));
  }, []);

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h1 className="mb-2 fw-bold" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.25rem)' }}>Course Catalog</h1>
          <p className="text-muted mb-0">Find the right course for your goals. {courses.length} courses available.</p>
        </div>
      </div>
      <Row>
        <Col md={3} className="mb-4">
          <Card className="card-panel border-0 h-100 sticky-top" style={{ top: '100px' }}>
            <Card.Body className="p-4">
              <div className="d-flex align-items-center gap-2 mb-4">
                <FilterList sx={{ fontSize: 20, color: 'var(--lh-primary)' }} />
                <h6 className="fw-bold mb-0 text-uppercase small" style={{ color: 'var(--lh-text-muted)', letterSpacing: '0.05em' }}>
                  Filters
                </h6>
              </div>
              <Form.Group className="mb-4">
                <Form.Label className="fw-semibold small mb-2 d-block">Category</Form.Label>
                <Form.Select value={category} onChange={(e) => setCategory(e.target.value)} className="shadow-sm">
                  <option value="">All categories</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label className="fw-semibold small mb-2 d-block">Difficulty</Form.Label>
                <Form.Select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="shadow-sm">
                  <option value="">All levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </Form.Select>
              </Form.Group>
              <Form.Group>
                <Form.Label className="fw-semibold small mb-2 d-block">Sort by</Form.Label>
                <Form.Select value={sort} onChange={(e) => setSort(e.target.value)} className="shadow-sm">
                  <option value="popularity">Popularity</option>
                  <option value="newest">Newest</option>
                  <option value="rating">Rating</option>
                </Form.Select>
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>
        <Col md={9}>
          <div className="search-input-enhanced mb-4">
            <Search sx={{ fontSize: 20 }} className="search-icon" />
            <Form.Control
              type="search"
              placeholder="Search by name, description, or instructor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-pill border shadow-sm"
              style={{ padding: '0.75rem 1.25rem 0.75rem 3rem', fontSize: '1rem' }}
            />
          </div>
          <Row xs={1} md={2} className="g-4">
            {courses.map((course) => {
              const totalLessons = course.sections?.reduce((acc, s) => acc + (s.lessons?.length || 0), 0) || 0;
              const rating = course.rating || 4.5;
              const ratingCount = course.ratingCount || Math.floor(Math.random() * 50) + 5;
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
                        <Badge className={`badge badge-lh badge-${course.difficulty}`}>{course.difficulty}</Badge>
                        <Badge className="badge-lh" style={{ background: CATEGORY_GRADIENTS[course.category] || CATEGORY_GRADIENTS.Default, color: 'white', border: 'none' }}>
                          {course.category}
                        </Badge>
                      </div>
                      <Card.Title className="mb-2 fw-bold" style={{ fontSize: '1.1rem', lineHeight: 1.4, minHeight: '3em' }}>
                        {course.title}
                      </Card.Title>
                      <p className="text-muted small mb-2">{course.instructor?.name || 'Instructor'}</p>
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
                        <span className="course-meta-item">
                          <People sx={{ fontSize: 14 }} />
                          {course.enrollmentCount || 0}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center border-top pt-3">
                        <span className="fw-bold" style={{ color: 'var(--lh-primary)', fontSize: '1.25rem' }}>
                          {course.isFree ? 'Free' : `₹${course.price}`}
                        </span>
                        <Button as={Link} to={`/courses/${course._id}`} className="btn-lh-primary btn-sm">
                          View Details
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
          {courses.length === 0 && (
            <div className="text-center py-5 card-panel">
              <Search sx={{ fontSize: 48, color: 'var(--lh-text-muted)', marginBottom: '1rem', opacity: 0.5 }} />
              <p className="text-muted mb-0" style={{ fontSize: '1.1rem' }}>No courses match your filters.</p>
              <p className="text-muted small mt-2">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}
