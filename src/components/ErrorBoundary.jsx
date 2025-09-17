import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center p-6">
          <div className="bg-red-900/20 backdrop-blur-xl border border-red-500/20 rounded-2xl p-8 max-w-2xl w-full">
            <h1 className="text-2xl font-bold text-red-400 mb-4">Something went wrong</h1>
            <div className="text-slate-300 mb-4">
              <p className="mb-2">An error occurred while rendering the application:</p>
              <pre className="bg-black/40 p-4 rounded-lg text-sm overflow-auto text-red-300">
                {this.state.error && this.state.error.toString()}
              </pre>
            </div>
            <details className="text-slate-400 text-sm">
              <summary className="cursor-pointer hover:text-slate-300 mb-2">Error Details</summary>
              <pre className="bg-black/40 p-4 rounded-lg overflow-auto">
                {this.state.errorInfo?.componentStack || 'No component stack available'}
              </pre>
            </details>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-2 rounded-lg transition-all duration-200"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;