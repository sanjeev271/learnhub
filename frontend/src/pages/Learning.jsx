import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, ListGroup, ProgressBar, Alert, Form, Badge } from 'react-bootstrap';
import { ArrowBack, CheckCircle, PlayCircle, MenuBook, Quiz, Description, Assignment, ArrowForward, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import api from '../api/axios';
import '../App.css';

function RequestCertificateButton({ enrollmentId, onIssued }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const handleRequest = async () => {
    setLoading(true);
    try {
      await api.post('/certificates', { enrollmentId });
      setDone(true);
      onIssued?.();
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to issue certificate');
    } finally {
      setLoading(false);
    }
  };
  if (done) return <Button as={Link} to="/certificates" className="btn-lh-primary">View My Certificates</Button>;
  return <Button className="btn-lh-primary" onClick={handleRequest} disabled={loading}>{loading ? 'Issuing...' : 'Get certificate'}</Button>;
}

export default function Learning() {
  const { enrollmentId } = useParams();
  const [enrollment, setEnrollment] = useState(null);
  const [progress, setProgress] = useState(null);
  const [course, setCourse] = useState(null);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [lessonIndex, setLessonIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({}); // { questionIndex: selectedOptionIndex }
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    api.get('/enrollments/me').then((res) => {
      const en = res.data.enrollments.find((e) => e._id === enrollmentId);
      setEnrollment(en);
      if (en?.course) {
        setCourse(en.course);
        // If course has no sections, fetch full course so we get lessons
        const hasSections = en.course.sections?.length > 0;
        if (!hasSections && en.course._id) {
          api.get(`/courses/${en.course._id}`).then((cRes) => {
            if (cRes.data?.course?.sections?.length) setCourse(cRes.data.course);
          }).catch(() => {});
        }
      }
    });
    api.get(`/progress/${enrollmentId}`).then((res) => {
      setProgress(res.data.progress);
      if (res.data.progress) {
        setSectionIndex(res.data.progress.sectionIndex ?? 0);
        setLessonIndex(res.data.progress.lessonIndex ?? 0);
      }
    }).catch(() => setProgress({ sectionIndex: 0, lessonIndex: 0, completedLessons: [] }));
  }, [enrollmentId]);

  // Reset quiz state when lesson changes
  useEffect(() => {
    setQuizAnswers({});
    setQuizSubmitted(false);
  }, [sectionIndex, lessonIndex]);

  const updateProgress = (si, li, markComplete) => {
    setSaving(true);
    api.put(`/progress/${enrollmentId}`, { sectionIndex: si, lessonIndex: li, markComplete })
      .then((res) => setProgress(res.data.progress))
      .finally(() => setSaving(false));
  };

  const isCompleted = (si, li) =>
    progress?.completedLessons?.some((l) => l.sectionIndex === si && l.lessonIndex === li);

  if (!enrollment || !course) {
    return (
      <Container className="py-5">
        <p>Loading...</p>
      </Container>
    );
  }

  const sections = course.sections || [];
  const currentSection = sections[sectionIndex];
  const currentLesson = currentSection?.lessons?.[lessonIndex];
  const totalLessons = sections.reduce((acc, s) => acc + (s.lessons?.length || 0), 0);
  const completedCount = progress?.completedLessons?.length || 0;
  const progressPercent = totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0;

  const goNext = () => {
    const lessons = currentSection?.lessons || [];
    if (lessonIndex < lessons.length - 1) {
      const ni = lessonIndex + 1;
      setLessonIndex(ni);
      updateProgress(sectionIndex, ni, false);
    } else if (sectionIndex < sections.length - 1) {
      const nsi = sectionIndex + 1;
      setSectionIndex(nsi);
      setLessonIndex(0);
      updateProgress(nsi, 0, false);
    }
  };

  const goPrev = () => {
    if (lessonIndex > 0) {
      const ni = lessonIndex - 1;
      setLessonIndex(ni);
      updateProgress(sectionIndex, ni, false);
    } else if (sectionIndex > 0) {
      const nsi = sectionIndex - 1;
      const prevLessons = sections[nsi]?.lessons || [];
      setSectionIndex(nsi);
      setLessonIndex(prevLessons.length - 1);
      updateProgress(nsi, prevLessons.length - 1, false);
    }
  };

  const markComplete = () => {
    if (currentLesson?.type === 'quiz' && currentLesson?.quizQuestions?.length > 0) {
      if (!quizSubmitted) {
        alert('Please complete the quiz first by submitting your answers.');
        return;
      }
      const allAnswered = currentLesson.quizQuestions.every((_, qi) => quizAnswers[qi] !== undefined);
      if (!allAnswered) {
        alert('Please answer all questions before completing.');
        return;
      }
    }
    updateProgress(sectionIndex, lessonIndex, true);
  };

  const handleQuizSubmit = () => {
    if (!currentLesson?.quizQuestions) return;
    const allAnswered = currentLesson.quizQuestions.every((_, qi) => quizAnswers[qi] !== undefined);
    if (!allAnswered) {
      alert('Please answer all questions.');
      return;
    }
    setQuizSubmitted(true);
    const correct = currentLesson.quizQuestions.filter((q, qi) => quizAnswers[qi] === q.correctAnswer).length;
    const total = currentLesson.quizQuestions.length;
    const score = Math.round((correct / total) * 100);
    alert(`Quiz submitted! Score: ${correct}/${total} (${score}%). ${score >= 70 ? 'Great job!' : 'Review the material and try again.'}`);
  };

  const getLessonIcon = (type) => {
    switch(type) {
      case 'quiz': return <Quiz sx={{ fontSize: 16 }} />;
      case 'video': return <PlayCircle sx={{ fontSize: 16 }} />;
      case 'reading': return <MenuBook sx={{ fontSize: 16 }} />;
      case 'assignment': return <Assignment sx={{ fontSize: 16 }} />;
      default: return <Description sx={{ fontSize: 16 }} />;
    }
  };

  return (
    <Container fluid className="py-4" style={{ background: 'var(--lh-bg)', minHeight: '100vh' }}>
      <Row>
        <Col md={4} lg={3} className="mb-4">
          <Card className="border-0 shadow-lg card-panel sticky-top" style={{ top: '100px', borderRadius: 'var(--radius-lg)' }}>
            <Card.Header className="bg-white border-0 pt-4 pb-3" style={{ borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }}>
              <Link to="/dashboard" className="text-decoration-none small fw-semibold d-flex align-items-center gap-1 mb-3" style={{ color: 'var(--lh-primary)' }}>
                <ArrowBack sx={{ fontSize: 16 }} />
                Back to Dashboard
              </Link>
              <h6 className="mb-3 fw-bold" style={{ fontSize: '1.1rem', lineHeight: 1.3 }}>{course.title}</h6>
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="small fw-semibold text-muted">Progress</span>
                  <span className="small fw-bold" style={{ color: 'var(--lh-primary)' }}>{progressPercent}%</span>
                </div>
                <ProgressBar now={progressPercent} className="mb-2" />
                <p className="small text-muted mb-0">
                  {completedCount} of {totalLessons} lessons completed
                </p>
              </div>
              {totalLessons > 0 && progressPercent >= 100 && (
                <Alert className="alert-lh-success mb-0 py-2" style={{ fontSize: '0.85rem' }}>
                  <CheckCircle sx={{ fontSize: 16 }} className="me-1" />
                  Course completed! Get your certificate.
                </Alert>
              )}
            </Card.Header>
            <ListGroup variant="flush" className="px-3 pb-3" style={{ maxHeight: 'calc(100vh - 300px)', overflowY: 'auto' }}>
              {sections.map((section, si) => {
                const sectionLessons = section.lessons?.length || 0;
                const sectionCompleted = section.lessons?.filter((_, li) => isCompleted(si, li)).length || 0;
                return (
                  <ListGroup.Item key={si} className="border-0 px-0 mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <strong className="d-block" style={{ fontSize: '0.95rem', color: 'var(--lh-text)' }}>
                        {section.title}
                      </strong>
                      <Badge className="badge-lh" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--lh-primary)', border: 'none' }}>
                        {sectionCompleted}/{sectionLessons}
                      </Badge>
                    </div>
                    <ul className="list-unstyled mb-0">
                      {section.lessons?.map((lesson, li) => (
                        <li
                          key={li}
                          className={`lesson-item ${si === sectionIndex && li === lessonIndex ? 'active' : ''} ${isCompleted(si, li) ? 'completed' : ''}`}
                          onClick={() => {
                            setSectionIndex(si);
                            setLessonIndex(li);
                            updateProgress(si, li, false);
                            setQuizSubmitted(false);
                            setQuizAnswers({});
                          }}
                        >
                          <div className="d-flex align-items-center gap-2 flex-grow-1">
                            {getLessonIcon(lesson.type)}
                            <span className="flex-grow-1">{lesson.title}</span>
                          </div>
                          {lesson.duration && (
                            <span className="lesson-duration">{lesson.duration}m</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </Card>
        </Col>
        <Col md={8} lg={9}>
          {!currentLesson ? (
            <Card className="border-0 shadow-lg card-panel p-5 text-center" style={{ borderRadius: 'var(--radius-lg)' }}>
              {totalLessons === 0 ? (
                <>
                  <MenuBook sx={{ fontSize: 64, color: 'var(--lh-text-muted)', marginBottom: '1rem', opacity: 0.3 }} />
                  <h5 className="fw-bold mb-2">No Lessons Available</h5>
                  <p className="text-muted">This course has no lessons yet. The instructor will add content soon.</p>
                  <p className="small text-muted mb-0">Complete all lessons once they are added to earn your certificate.</p>
                </>
              ) : (
                <>
                  <PlayCircle sx={{ fontSize: 64, color: 'var(--lh-text-muted)', marginBottom: '1rem', opacity: 0.3 }} />
                  <h5 className="fw-bold mb-2">Select a Lesson</h5>
                  <p className="text-muted">Choose a lesson from the sidebar to begin learning.</p>
                  <p className="small text-muted mb-0">Complete all {totalLessons} lesson(s) to unlock your certificate.</p>
                  {totalLessons > 0 && progressPercent >= 100 && (
                    <Alert className="alert-lh-success mt-4">
                      <CheckCircle sx={{ fontSize: 20 }} className="me-2" />
                      You've completed all lessons! Request your certificate below.
                      <div className="mt-3">
                        <RequestCertificateButton enrollmentId={enrollmentId} onIssued={() => window.location.href = '/certificates'} />
                      </div>
                    </Alert>
                  )}
                </>
              )}
            </Card>
          ) : (
            <Card className="border-0 shadow-lg card-panel" style={{ borderRadius: 'var(--radius-lg)' }}>
              <Card.Body className="p-4">
                <div className="d-flex flex-wrap align-items-center gap-2 mb-3 pb-3 border-bottom">
                  <div className="d-flex align-items-center gap-2 flex-grow-1">
                    {getLessonIcon(currentLesson.type)}
                    <div>
                      <h4 className="mb-0 fw-bold" style={{ fontSize: '1.5rem' }}>{currentLesson.title}</h4>
                      <p className="text-muted small mb-0 mt-1">
                        {currentSection.title} · Lesson {lessonIndex + 1} of {currentSection.lessons?.length}
                        {currentLesson.duration && ` · ${currentLesson.duration} min`}
                      </p>
                    </div>
                  </div>
                  <Badge className="badge-lh" style={{ 
                    background: currentLesson.type === 'quiz' ? 'var(--lh-gradient-orange)' : 
                                currentLesson.type === 'video' ? 'var(--lh-gradient-indigo)' : 
                                currentLesson.type === 'reading' ? 'var(--lh-gradient-blue)' : 
                                'var(--lh-gradient-teal)', 
                    color: 'white',
                    fontSize: '0.85rem',
                    padding: '0.5rem 0.75rem'
                  }}>
                    {currentLesson.type === 'quiz' ? 'Quiz' : currentLesson.type === 'video' ? 'Video' : currentLesson.type === 'reading' ? 'Reading' : 'Assignment'}
                  </Badge>
                </div>
                
                {currentLesson.type === 'quiz' && currentLesson.quizQuestions?.length > 0 ? (
                  <div className="mb-4">
                    <h5 className="mb-3">Quiz Questions</h5>
                    <div className="mb-4">
                      <h5 className="fw-bold mb-3">Quiz Questions ({currentLesson.quizQuestions.length} questions)</h5>
                      {currentLesson.quizQuestions.map((q, qi) => {
                        const isCorrect = quizAnswers[qi] === q.correctAnswer;
                        const isAnswered = quizAnswers[qi] !== undefined;
                        return (
                          <Card key={qi} className="mb-3 border-0 shadow-sm" style={{ 
                            borderRadius: 'var(--radius)',
                            border: quizSubmitted ? (isCorrect ? '2px solid #10b981' : isAnswered ? '2px solid #f43f5e' : 'none') : 'none'
                          }}>
                            <Card.Body className="p-4">
                              <div className="d-flex align-items-start gap-2 mb-3">
                                <Badge className="badge-lh" style={{ 
                                  background: 'var(--lh-gradient-indigo)', 
                                  color: 'white', 
                                  border: 'none',
                                  minWidth: '32px',
                                  height: '32px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}>
                                  {qi + 1}
                                </Badge>
                                <p className="fw-bold mb-0 flex-grow-1" style={{ fontSize: '1.05rem' }}>{q.question}</p>
                              </div>
                              <div className="ps-4">
                                {q.options.map((option, oi) => {
                                  const isSelected = quizAnswers[qi] === oi;
                                  const isCorrectOption = oi === q.correctAnswer;
                                  return (
                                    <div
                                      key={oi}
                                      className={`mb-2 p-3 rounded ${isSelected ? 'border' : 'border'} ${quizSubmitted ? (isCorrectOption ? 'border-success bg-light' : isSelected ? 'border-danger bg-light' : 'border-secondary') : 'border-secondary'} ${!quizSubmitted && isSelected ? 'bg-light' : ''}`}
                                      style={{ 
                                        cursor: quizSubmitted ? 'default' : 'pointer',
                                        transition: 'all 0.2s ease'
                                      }}
                                      onClick={() => !quizSubmitted && setQuizAnswers({ ...quizAnswers, [qi]: oi })}
                                    >
                                      <Form.Check
                                        type="radio"
                                        name={`quiz-${sectionIndex}-${lessonIndex}-q${qi}`}
                                        id={`q${qi}-opt${oi}`}
                                        label={option}
                                        checked={isSelected}
                                        onChange={() => !quizSubmitted && setQuizAnswers({ ...quizAnswers, [qi]: oi })}
                                        disabled={quizSubmitted}
                                        className={`${quizSubmitted && isCorrectOption ? 'text-success fw-bold' : quizSubmitted && isSelected && !isCorrectOption ? 'text-danger' : ''}`}
                                      />
                                    </div>
                                  );
                                })}
                              </div>
                              {quizSubmitted && (
                                <div className={`mt-3 ps-4 d-flex align-items-center gap-2 ${isCorrect ? 'text-success' : 'text-danger'}`}>
                                  {isCorrect ? (
                                    <>
                                      <CheckCircle sx={{ fontSize: 20 }} />
                                      <strong>Correct!</strong>
                                    </>
                                  ) : (
                                    <>
                                      <span style={{ fontSize: '1.2rem' }}>✗</span>
                                      <span><strong>Incorrect.</strong> Correct answer: {q.options[q.correctAnswer]}</span>
                                    </>
                                  )}
                                </div>
                              )}
                            </Card.Body>
                          </Card>
                        );
                      })}
                    </div>
                    {!quizSubmitted ? (
                      <Button onClick={handleQuizSubmit} className="btn-lh-primary mb-3 px-4 py-2" style={{ fontSize: '1rem' }}>
                        Submit Quiz
                      </Button>
                    ) : (
                      <Alert className="alert-lh-success mb-3">
                        <CheckCircle sx={{ fontSize: 20 }} className="me-2" />
                        Quiz completed! Review your answers above. Mark this lesson as complete to continue.
                      </Alert>
                    )}
                  </div>
                ) : (
                  <>
                    {currentLesson.type === 'video' && currentLesson.videoUrl && (
                      <div className="ratio ratio-16x9 mb-3">
                        <iframe src={currentLesson.videoUrl} title={currentLesson.title} allowFullScreen />
                      </div>
                    )}
                    {currentLesson.content && (
                      <div className="mb-4" dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
                    )}
                    {currentLesson.type === 'reading' && !currentLesson.content && (
                      <Alert className="alert-lh-info">Read the content above carefully. Mark complete when finished.</Alert>
                    )}
                    {currentLesson.type === 'assignment' && !currentLesson.content && (
                      <Alert className="alert-lh-warning">Complete the assignment as instructed. Mark complete when done.</Alert>
                    )}
                    {currentLesson.type === 'quiz' && (!currentLesson.quizQuestions || currentLesson.quizQuestions.length === 0) && (
                      <Alert className="alert-lh-warning">This quiz has no questions yet. The instructor will add them soon.</Alert>
                    )}
                    {!currentLesson.videoUrl && !currentLesson.content && currentLesson.type !== 'quiz' && (
                      <p className="text-muted">Content for this lesson will be available soon.</p>
                    )}
                  </>
                )}
                
                <div className="d-flex justify-content-between align-items-center mt-4 pt-4 border-top">
                  <Button 
                    variant="outline-secondary" 
                    onClick={goPrev} 
                    disabled={sectionIndex === 0 && lessonIndex === 0}
                    className="d-flex align-items-center gap-2"
                  >
                    <ArrowBackIcon sx={{ fontSize: 18 }} />
                    Previous
                  </Button>
                  <div className="d-flex align-items-center gap-2">
                    {isCompleted(sectionIndex, lessonIndex) && (
                      <Badge className="badge-lh" style={{ background: 'var(--lh-gradient-success)', color: 'white', border: 'none' }}>
                        <CheckCircle sx={{ fontSize: 14 }} className="me-1" />
                        Completed
                      </Badge>
                    )}
                    <Button 
                      className="btn-lh-primary" 
                      onClick={markComplete} 
                      disabled={saving || isCompleted(sectionIndex, lessonIndex) || (currentLesson.type === 'quiz' && currentLesson.quizQuestions?.length > 0 && !quizSubmitted)}
                    >
                      {isCompleted(sectionIndex, lessonIndex) ? (
                        <>
                          <CheckCircle sx={{ fontSize: 18 }} className="me-1" />
                          Completed
                        </>
                      ) : currentLesson.type === 'quiz' && currentLesson.quizQuestions?.length > 0 && !quizSubmitted ? (
                        'Complete quiz first'
                      ) : (
                        <>
                          <CheckCircle sx={{ fontSize: 18 }} className="me-1" />
                          Mark Complete
                        </>
                      )}
                    </Button>
                  </div>
                  <Button 
                    className="btn-lh-primary" 
                    onClick={goNext}
                    disabled={sectionIndex === sections.length - 1 && lessonIndex === (currentSection?.lessons?.length || 0) - 1}
                  >
                    Next
                    <ArrowForward sx={{ fontSize: 18 }} className="ms-1" />
                  </Button>
                </div>
                {totalLessons > 0 && progressPercent >= 100 && (
                  <div className="mt-4 pt-4 border-top">
                    <Alert className="alert-lh-success mb-0">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <CheckCircle sx={{ fontSize: 20 }} className="me-2" />
                          <strong>Congratulations!</strong> You've completed all lessons. Get your certificate now!
                        </div>
                        <RequestCertificateButton enrollmentId={enrollmentId} onIssued={() => window.location.href = '/certificates'} />
                      </div>
                    </Alert>
                  </div>
                )}
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
}
