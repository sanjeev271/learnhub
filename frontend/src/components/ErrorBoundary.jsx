import React from 'react';
import { Container, Button } from 'react-bootstrap';
import './ErrorBoundary.css';

/**
 * Error Boundary: catches JavaScript errors in child component tree,
 * logs them, and displays a fallback UI instead of crashing.
 * @see https://reactjs.org/docs/error-boundaries.html
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback({ error: this.state.error, retry: this.handleRetry });
      }
      return (
        <Container className="py-5 text-center">
          <h2 className="text-danger mb-3">Something went wrong</h2>
          <p className="text-muted mb-3">
            We're sorry. You can try refreshing the page or go back home.
          </p>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <pre className="text-start text-muted small p-3 bg-light rounded mb-3 overflow-auto">
              {this.state.error.toString()}
            </pre>
          )}
          <div className="error-boundary-actions">
            <Button className="me-2" style={{ background: 'var(--lh-gradient-hero)', border: 'none', color: 'white' }} onClick={this.handleRetry}>
              Try again
            </Button>
            <Button variant="outline-secondary" href="/">
              Go home
            </Button>
          </div>
        </Container>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
