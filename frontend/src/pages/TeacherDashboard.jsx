import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Card, Button, Table, Form, Modal } from 'react-bootstrap';
import api from '../api/axios';
import '../App.css';

export default function TeacherDashboard() {
  const [courses, setCourses] = useState([]);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    shortDescription: '',
    category: 'Web Development',
    difficulty: 'beginner',
    isFree: true,
    price: 0,
  });

  useEffect(() => {
    api.get('/courses/instructor/mine').then((res) => setCourses(res.data.courses || []));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/courses', form);
      setCourses((prev) => [res.data.course, ...prev]);
      setShow(false);
      setForm({ title: '', description: '', shortDescription: '', category: 'Web Development', difficulty: 'beginner', isFree: true, price: 0 });
      alert('Course created! It is now visible in the course catalog for all users.');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create course');
    }
  };

  const togglePublish = async (course) => {
    try {
      await api.put(`/courses/${course._id}`, { isPublished: !course.isPublished });
      setCourses((prev) => prev.map((c) => (c._id === course._id ? { ...c, isPublished: !c.isPublished } : c)));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update');
    }
  };

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h1 className="mb-0 fw-bold" style={{ fontSize: '1.85rem' }}>My Courses</h1>
          <p className="text-muted small mb-0 mt-1">Add and manage your courses. New courses appear in the catalog for all users.</p>
        </div>
        <Button onClick={() => setShow(true)} className="btn-lh-primary">Add Course</Button>
      </div>

      <Card className="card-panel border-0 overflow-hidden">
      <Table responsive className="mb-0">
        <thead style={{ background: 'var(--lh-gradient-hero)', color: 'white' }}>
          <tr>
            <th className="text-white border-0">Title</th>
            <th className="text-white border-0">Category</th>
            <th className="text-white border-0">Difficulty</th>
            <th className="text-white border-0">Enrollments</th>
            <th className="text-white border-0">Status</th>
            <th className="text-white border-0">Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((c) => (
            <tr key={c._id}>
              <td>{c.title}</td>
              <td>{c.category}</td>
              <td>{c.difficulty}</td>
              <td>{c.enrollmentCount || 0}</td>
              <td>{c.isPublished ? 'Published' : 'Draft'}</td>
              <td>
                <Button size="sm" variant="outline-primary" as={Link} to={`/teacher/courses/${c._id}/edit`} className="me-1">Add content</Button>
                <Button size="sm" variant="outline-primary" as={Link} to={`/courses/${c._id}`} className="me-1">View</Button>
                <Button size="sm" variant="outline-secondary" onClick={() => togglePublish(c)}>
                  {c.isPublished ? 'Unpublish' : 'Publish'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      </Card>

      {courses.length === 0 && (
        <Card className="card-panel border-0 p-5 text-center">
          <p className="text-muted mb-4">You haven't created any courses yet.</p>
          <Button onClick={() => setShow(true)} className="btn-lh-primary">Add your first course</Button>
        </Card>
      )}

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton><Modal.Title>Add Course</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreate}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Difficulty</Form.Label>
              <Form.Select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check type="checkbox" label="Free course" checked={form.isFree} onChange={(e) => setForm({ ...form, isFree: e.target.checked })} />
            </Form.Group>
            {!form.isFree && (
              <Form.Group className="mb-3">
                <Form.Label>Price (₹)</Form.Label>
                <Form.Control type="number" min={0} value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
              </Form.Group>
            )}
            <Button type="submit" className="btn-lh-primary">Create</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
