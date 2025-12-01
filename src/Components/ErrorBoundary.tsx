import React, { Component } from 'react';

interface Props {
  children: React.ReactNode;
}



class ErrorBoundary extends Component<Props> {
  public state = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error, errorInfo: null };
  }
  public componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', border: '1px solid red', margin: '20px' }}>
          <h2>Oops! There was an error loading this section.</h2>
          <p>We are sorry for the inconvenience.</p>
          {this.state.error && <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error.message}
            <br />
            {this.state.errorInfo?.componentStack}
          </details>}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
