import { Link, useNavigate } from 'react-router-dom';
import { Navbar as BSNavbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <BSNavbar expand="lg" className="learnhub-navbar sticky-top">
      <Container>
        <BSNavbar.Brand as={Link} to="/">LearnHub</BSNavbar.Brand>
        <BSNavbar.Toggle aria-controls="navbar-nav" />
        <BSNavbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/courses">Courses</Nav.Link>
            {user && (
              <>
                <Nav.Link as={Link} to="/dashboard">My Learning</Nav.Link>
                <Nav.Link as={Link} to="/certificates">Certificates</Nav.Link>
                {(user.role === 'teacher' || user.role === 'admin') && (
                  <Nav.Link as={Link} to="/teacher">Teach</Nav.Link>
                )}
                {user.role === 'admin' && (
                  <Nav.Link as={Link} to="/admin">Admin</Nav.Link>
                )}
              </>
            )}
          </Nav>
          <Nav>
            {user ? (
              <Dropdown align="end">
                <Dropdown.Toggle variant="light" id="user-menu" className="d-flex align-items-center gap-2">
                  <span className="rounded-circle d-inline-flex align-items-center justify-content-center fw-bold" style={{ 
                    width: 36, 
                    height: 36, 
                    fontSize: '0.95rem',
                    background: 'var(--lh-gradient-hero)',
                    color: 'white',
                    boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)'
                  }}>
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                  <span className="d-none d-md-inline">{user.name}</span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/dashboard">
                    <span>📊</span> Dashboard
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/certificates">
                    <span>🏆</span> My Certificates
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>
                    <span>🚪</span> Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="me-2">Login</Nav.Link>
                <Link to="/register" className="btn btn-cta btn-sm">Sign Up</Link>
              </>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
}
