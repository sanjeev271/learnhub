import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';

export default function Footer() {
  return (
    <footer className="learnhub-footer">
      <Container>
        <Row className="py-5 g-4">
          <Col md={4}>
            <h5 className="fw-bold mb-3 text-white">LearnHub</h5>
            <p className="text-white-50 small mb-0" style={{ maxWidth: '280px' }}>
              Your center for skill enhancement. Learn at your pace, earn certificates, and grow your career.
            </p>
          </Col>
          <Col md={2}>
            <h6 className="text-white fw-semibold mb-3">Explore</h6>
            <ul className="list-unstyled small">
              <li className="mb-2"><Link to="/courses" className="text-white-50 text-decoration-none hover-light">Courses</Link></li>
              <li className="mb-2"><Link to="/" className="text-white-50 text-decoration-none hover-light">Categories</Link></li>
              <li className="mb-2"><Link to="/" className="text-white-50 text-decoration-none hover-light">Featured</Link></li>
            </ul>
          </Col>
          <Col md={2}>
            <h6 className="text-white fw-semibold mb-3">Support</h6>
            <ul className="list-unstyled small">
              <li className="mb-2"><a href="#" className="text-white-50 text-decoration-none">Help Center</a></li>
              <li className="mb-2"><a href="#" className="text-white-50 text-decoration-none">Contact</a></li>
              <li className="mb-2"><a href="#" className="text-white-50 text-decoration-none">FAQ</a></li>
            </ul>
          </Col>
          <Col md={4} className="text-md-end">
            <p className="small text-white-50 mb-0">&copy; {new Date().getFullYear()} LearnHub. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
