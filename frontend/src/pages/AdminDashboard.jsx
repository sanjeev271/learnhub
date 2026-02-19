import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Form } from 'react-bootstrap';
import api from '../api/axios';
import '../App.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ userCount: 0, courseCount: 0, enrollmentCount: 0 });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get('/admin/stats').then((res) => setStats(res.data.stats || {}));
    api.get('/admin/users').then((res) => setUsers(res.data.users || []));
  }, []);

  const updateRole = async (userId, role) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role });
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role } : u)));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update role');
    }
  };

  return (
    <Container className="py-5">
      <h1 className="mb-2 fw-bold" style={{ fontSize: '1.85rem' }}>Admin Dashboard</h1>
      <p className="text-muted mb-4">Platform overview and user management</p>
      <Row className="mb-4 g-3">
        <Col md={4}>
          <Card className="border-0 shadow" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <Card.Body className="p-4" style={{ background: 'var(--lh-gradient-indigo)', color: 'white' }}>
              <h3 className="fw-bold mb-1 text-white">{stats.userCount}</h3>
              <p className="mb-0 small opacity-90">Users</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <Card.Body className="p-4" style={{ background: 'var(--lh-gradient-success)', color: 'white' }}>
              <h3 className="fw-bold mb-1 text-white">{stats.courseCount}</h3>
              <p className="mb-0 small opacity-90">Courses</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <Card.Body className="p-4" style={{ background: 'var(--lh-gradient-blue)', color: 'white' }}>
              <h3 className="fw-bold mb-1 text-white">{stats.enrollmentCount}</h3>
              <p className="mb-0 small opacity-90">Enrollments</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Card className="card-panel border-0">
        <Card.Header className="bg-white border-bottom fw-bold">Users</Card.Header>
        <Table responsive className="mb-0">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Change role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <Form.Select size="sm" style={{ width: '140px' }} value={u.role} onChange={(e) => updateRole(u._id, e.target.value)}>
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
                  </Form.Select>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </Container>
  );
}
