import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-white bg-gradient-to-br from-red-400 to-red-600">
          <div className="bg-white/20 backdrop-blur-xl shadow-2xl rounded-xl p-8 text-center max-w-lg">
            <h2 className="text-3xl font-bold mb-4">Oops! Something went wrong</h2>
            <p className="text-lg mb-6">
              The Math Genius Challenge encountered an unexpected error.
            </p>
            <button
              className="bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-lg text-lg shadow-md transform transition-transform duration-150 hover:scale-105"
              onClick={() => window.location.reload()}
            >
              Restart Game
            </button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-yellow-300">Error Details (Dev Mode)</summary>
                <pre className="mt-2 p-2 bg-black/30 rounded text-xs overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 