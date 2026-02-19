import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Form, Row, Col, Collapse } from 'react-bootstrap';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [saving, setSaving] = useState(false);
  const [expandedQuizzes, setExpandedQuizzes] = useState({}); // { 'si-li': true }

  useEffect(() => {
    api.get(`/courses/${id}`).then((res) => {
      setCourse(res.data.course);
      const raw = res.data.course?.sections || [];
      setSections(raw.length ? raw.map((s, i) => ({ title: s.title || 'Section', order: i, lessons: (s.lessons || []).map((l, j) => ({ title: l.title || 'Lesson', type: l.type || 'video', order: j, duration: l.duration || 0, content: l.content || '', videoUrl: l.videoUrl || '', quizQuestions: l.quizQuestions || [] })) })) : []);
    }).catch(() => setCourse(null));
  }, [id]);

  const addSection = () => {
    setSections((prev) => [...prev, { title: 'New Section', order: prev.length, lessons: [{ title: 'New Lesson', type: 'video', order: 0, duration: 0 }] }]);
  };

  const updateSection = (si, field, value) => {
    setSections((prev) => {
      const next = prev.map((s, i) => (i === si ? { ...s, [field]: value } : s));
      return next;
    });
  };

  const removeSection = (si) => {
    setSections((prev) => prev.filter((_, i) => i !== si).map((s, i) => ({ ...s, order: i })));
  };

  const addLesson = (sectionIndex) => {
    setSections((prev) => {
      const section = prev[sectionIndex];
      const lessons = [...(section.lessons || []), { title: 'New Lesson', type: 'video', order: (section.lessons?.length || 0), duration: 0, quizQuestions: [] }];
      return prev.map((s, i) => (i === sectionIndex ? { ...s, lessons } : s));
    });
  };

  const addQuizQuestion = (sectionIndex, lessonIndex) => {
    setSections((prev) => {
      return prev.map((s, i) => {
        if (i !== sectionIndex) return s;
        const lessons = (s.lessons || []).map((l, li) => {
          if (li !== lessonIndex) return l;
          const questions = [...(l.quizQuestions || []), { question: '', options: ['', '', '', ''], correctAnswer: 0 }];
          return { ...l, quizQuestions: questions };
        });
        return { ...s, lessons };
      });
    });
  };

  const updateQuizQuestion = (sectionIndex, lessonIndex, questionIndex, field, value) => {
    setSections((prev) => {
      return prev.map((s, i) => {
        if (i !== sectionIndex) return s;
        const lessons = (s.lessons || []).map((l, li) => {
          if (li !== lessonIndex) return l;
          const questions = (l.quizQuestions || []).map((q, qi) => {
            if (qi !== questionIndex) return q;
            if (field === 'option') {
              const optIndex = value.optIndex;
              const newOptions = [...q.options];
              newOptions[optIndex] = value.text;
              return { ...q, options: newOptions };
            }
            return { ...q, [field]: value };
          });
          return { ...l, quizQuestions: questions };
        });
        return { ...s, lessons };
      });
    });
  };

  const removeQuizQuestion = (sectionIndex, lessonIndex, questionIndex) => {
    setSections((prev) => {
      return prev.map((s, i) => {
        if (i !== sectionIndex) return s;
        const lessons = (s.lessons || []).map((l, li) => {
          if (li !== lessonIndex) return l;
          const questions = (l.quizQuestions || []).filter((_, qi) => qi !== questionIndex);
          return { ...l, quizQuestions: questions };
        });
        return { ...s, lessons };
      });
    });
  };

  const updateLesson = (sectionIndex, lessonIndex, field, value) => {
    setSections((prev) => {
      return prev.map((s, i) => {
        if (i !== sectionIndex) return s;
        const lessons = (s.lessons || []).map((l, li) => (li === lessonIndex ? { ...l, [field]: value } : l));
        return { ...s, lessons };
      });
    });
  };

  const removeLesson = (sectionIndex, lessonIndex) => {
    setSections((prev) => {
      return prev.map((s, i) => {
        if (i !== sectionIndex) return s;
        const lessons = (s.lessons || []).filter((_, li) => li !== lessonIndex).map((l, li) => ({ ...l, order: li }));
        return { ...s, lessons };
      });
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!course) return;
    setSaving(true);
    try {
      await api.put(`/courses/${id}`, { sections });
      alert('Course content saved. Students must complete all lessons to earn a certificate.');
      navigate('/teacher');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (!course) return <Container className="py-5">Loading...</Container>;
  const isInstructor = user?.role === 'admin' || course.instructor?._id === user?.id || course.instructor === user?.id;
  if (!isInstructor) {
    navigate('/teacher');
    return null;
  }

  const totalLessons = sections.reduce((acc, s) => acc + (s.lessons?.length || 0), 0);

  return (
    <Container className="py-5">
      <Link to="/teacher" className="text-decoration-none small d-inline-block mb-3">← Back to My Courses</Link>
      <h1 className="mb-2">Edit course: {course.title}</h1>
      <p className="text-muted small mb-4">Add sections and lessons. Students must complete all lessons to get a certificate.</p>

      <Form onSubmit={handleSave}>
        {sections.map((section, si) => (
          <Card key={si} className="mb-4 border-0 shadow-sm" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <Card.Header className="d-flex justify-content-between align-items-center flex-wrap gap-2" style={{ background: 'var(--lh-gradient-hero)' }}>
              <Form.Control
                value={section.title}
                onChange={(e) => updateSection(si, 'title', e.target.value)}
                placeholder="Section title"
                className="w-auto"
                style={{ background: 'white' }}
              />
              <Button type="button" variant="light" size="sm" onClick={() => removeSection(si)} style={{ color: '#dc3545' }}>Remove section</Button>
            </Card.Header>
            <Card.Body>
              <strong className="small text-muted">Lessons</strong>
              {(section.lessons || []).map((lesson, li) => (
                <div key={li} className="mb-3 p-3 border rounded">
                  <Row className="align-items-center g-2 mb-2">
                    <Col md={5}>
                      <Form.Control
                        value={lesson.title}
                        onChange={(e) => updateLesson(si, li, 'title', e.target.value)}
                        placeholder="Lesson title"
                      />
                    </Col>
                    <Col md={2}>
                      <Form.Select value={lesson.type} onChange={(e) => updateLesson(si, li, 'type', e.target.value)}>
                        <option value="video">Video</option>
                        <option value="reading">Reading</option>
                        <option value="assignment">Assignment</option>
                        <option value="quiz">Quiz</option>
                      </Form.Select>
                    </Col>
                    <Col md={2}>
                      <Form.Control type="number" min={0} value={lesson.duration || 0} onChange={(e) => updateLesson(si, li, 'duration', Number(e.target.value))} placeholder="Min" />
                    </Col>
                    <Col md={2}>
                      <Button type="button" variant="outline-danger" size="sm" onClick={() => removeLesson(si, li)}>Remove</Button>
                    </Col>
                  </Row>
                  {lesson.type === 'quiz' && (
                    <>
                      <Button
                        type="button"
                        className="btn-lh-outline btn-sm mb-2"
                        onClick={() => setExpandedQuizzes({ ...expandedQuizzes, [`${si}-${li}`]: !expandedQuizzes[`${si}-${li}`] })}
                      >
                        {expandedQuizzes[`${si}-${li}`] ? '▼' : '▶'} Quiz Questions ({(lesson.quizQuestions || []).length})
                      </Button>
                      <Collapse in={expandedQuizzes[`${si}-${li}`]}>
                        <div>
                          {(lesson.quizQuestions || []).map((q, qi) => (
                            <Card key={qi} className="mb-2 border-0 shadow-sm" style={{ borderRadius: 'var(--radius)' }}>
                              <Card.Body>
                                <div className="d-flex justify-content-between mb-2">
                                  <strong>Question {qi + 1}</strong>
                                  <Button type="button" variant="outline-danger" size="sm" onClick={() => removeQuizQuestion(si, li, qi)}>Remove</Button>
                                </div>
                                <Form.Control
                                  value={q.question}
                                  onChange={(e) => updateQuizQuestion(si, li, qi, 'question', e.target.value)}
                                  placeholder="Question text"
                                  className="mb-2"
                                />
                                {q.options.map((opt, oi) => (
                                  <div key={oi} className="d-flex align-items-center gap-2 mb-1">
                                    <Form.Check
                                      type="radio"
                                      name={`correct-${si}-${li}-${qi}`}
                                      checked={q.correctAnswer === oi}
                                      onChange={() => updateQuizQuestion(si, li, qi, 'correctAnswer', oi)}
                                    />
                                    <Form.Control
                                      value={opt}
                                      onChange={(e) => updateQuizQuestion(si, li, qi, 'option', { optIndex: oi, text: e.target.value })}
                                      placeholder={`Option ${oi + 1}`}
                                      className={q.correctAnswer === oi ? 'border-success' : ''}
                                    />
                                  </div>
                                ))}
                              </Card.Body>
                            </Card>
                          ))}
                          <Button type="button" className="btn-lh-outline btn-sm" onClick={() => addQuizQuestion(si, li)}>+ Add question</Button>
                        </div>
                      </Collapse>
                    </>
                  )}
                </div>
              ))}
              <Button type="button" className="btn-lh-outline btn-sm mt-1" onClick={() => addLesson(si)}>+ Add lesson</Button>
            </Card.Body>
          </Card>
        ))}

        <div className="mb-4">
          <Button type="button" className="btn-lh-outline" onClick={addSection}>+ Add section</Button>
        </div>

        <p className="small text-muted mb-3">{totalLessons} lesson(s) total. Students need to complete all to earn a certificate.</p>
        <Button type="submit" className="btn-lh-primary" disabled={saving}>{saving ? 'Saving...' : 'Save course content'}</Button>
      </Form>
    </Container>
  );
}
