import React, { Component } from 'react';
import { RefreshCw, Compass, Sparkles, ChevronDown, ChevronUp, Copy, Check, HeartHandshake } from 'lucide-react';
import haptic from '../utils/haptics';

/**
 * Sanctuary Respite & Error Boundary Component
 * Designed from scratch in accordance with design-highlights-50 principles:
 * - Linear Pick #24 surface ladder with crisp 1px hairlines
 * - Claude Pick #9 warm sanctuary parchment and obsidian palette
 * - Apple Pick #3 literary typography with empathetic, calming messaging
 * - Raycast Pick #39 monospace technical diagnostics and collapsible stack drawer
 * - Sensory haptic feedback on restorative actions and clipboard copies
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      isRetrying: false,
      isDetailsOpen: false,
      copied: false,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Keep diagnostics logged for debugging
    if (typeof console !== 'undefined' && console.error) {
      console.error('Sanctuary Error Boundary caught an unexpected exception:', error, errorInfo);
    }
    this.setState({ errorInfo });
  }

  handleRetry = () => {
    haptic.medium();
    this.setState({ isRetrying: true });

    setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        isRetrying: false,
      });
    }, 200);
  };

  handleGoHome = (e) => {
    e.preventDefault();
    haptic.light();
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  toggleDetails = () => {
    haptic.selection();
    this.setState((prev) => ({ isDetailsOpen: !prev.isDetailsOpen }));
  };

  handleCopyDiagnostics = () => {
    haptic.light();
    const details = [
      this.state.error?.toString() || 'Unknown Sanctuary Exception',
      this.state.errorInfo?.componentStack || '',
    ].filter(Boolean).join('\n');

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(details).then(() => {
        this.setState({ copied: true });
        setTimeout(() => this.setState({ copied: false }), 2000);
      }).catch(() => {});
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const contextualMessage =
        this.props.message ||
        (this.props.routeName
          ? `We encountered a momentary pause loading the ${this.props.routeName}. Your reflections remain safe in the sanctuary.`
          : 'A momentary pause occurred while rendering this reflection. Take a quiet breath; we can gently restore your space.');

      const isDev =
        typeof process !== 'undefined' &&
        process.env &&
        process.env.NODE_ENV === 'development';

      return (
        <div className="min-h-[440px] w-full flex items-center justify-center p-4 sm:p-8 bg-[#FAF5EF]/60 dark:bg-[#0F0E0C]/60 backdrop-blur-sm">
          <div className="
            relative max-w-lg w-full text-center
            bg-[#FFFDF9] dark:bg-[#141210]
            border border-[#E8DDD0] dark:border-[#2D2621]
            rounded-3xl p-6 sm:p-9
            shadow-[0_16px_44px_rgba(20,10,5,0.08)] dark:shadow-[0_16px_44px_rgba(0,0,0,0.55)]
            overflow-hidden animate-fade-in
          ">
            {/* Ambient Background Warmth */}
            <div
              className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#C85828]/10 dark:bg-amber-400/5 rounded-full blur-3xl pointer-events-none"
              aria-hidden="true"
            />

            {/* Sanctuary Respite Beacon Glyph */}
            <div className="relative inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#FAF5EF] dark:bg-[#1C1815] border border-[#E8DDD0] dark:border-[#2D2621] mb-5 shadow-sm">
              <span className="relative flex h-2 w-2 absolute top-2 right-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C85828] dark:bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C85828] dark:bg-amber-400" />
              </span>
              <Sparkles className="w-6 h-6 text-[#C85828] dark:text-amber-400" strokeWidth={1.75} />
            </div>

            {/* Empathetic Headline & Narrative */}
            <h2 className="font-stories text-2xl sm:text-3xl font-normal text-stone-900 dark:text-stone-100 tracking-tight mb-2.5">
              A quiet pause in the sanctuary
            </h2>
            <p className="font-body text-xs sm:text-[14.5px] text-stone-600 dark:text-stone-400 leading-relaxed max-w-md mx-auto mb-7">
              {contextualMessage}
            </p>

            {/* Restorative Action Hub */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
              <button
                type="button"
                onClick={this.handleRetry}
                disabled={this.state.isRetrying}
                data-testid="error-retry-button"
                className="
                  w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl
                  bg-[#C85828] hover:bg-[#B34B1E] text-[#FFFDF9]
                  font-heading font-medium text-xs sm:text-sm
                  shadow-[0_4px_16px_rgba(200,88,40,0.25)] hover:shadow-[0_6px_20px_rgba(200,88,40,0.35)]
                  active:scale-95 transition-all duration-200
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C85828]
                "
              >
                <RefreshCw className={`w-4 h-4 ${this.state.isRetrying ? 'animate-spin' : ''}`} />
                <span>{this.state.isRetrying ? 'Restoring space...' : 'Gently Restore'}</span>
              </button>

              <a
                href="/"
                onClick={this.handleGoHome}
                data-testid="error-home-link"
                className="
                  w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl
                  bg-[#FAF5EF] dark:bg-[#1C1815] hover:bg-[#F2E8DC] dark:hover:bg-[#25201B]
                  border border-[#E8DDD0] dark:border-[#2D2621]
                  text-stone-800 dark:text-stone-200
                  font-heading font-medium text-xs sm:text-sm
                  active:scale-95 transition-all duration-200
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C85828]
                "
              >
                <Compass className="w-4 h-4 text-[#8C3A16] dark:text-[#E8A87C]" />
                <span>Return to Sanctuary</span>
              </a>
            </div>

            {/* Collapsible Diagnostic Trace (Raycast Pick #39) */}
            {(isDev || this.state.error) && (
              <div className="text-left border-t border-[#E8DDD0]/70 dark:border-[#2D2621]/70 pt-4 mt-5">
                <div className="flex items-center justify-between mb-2">
                  <button
                    type="button"
                    onClick={this.toggleDetails}
                    data-testid="error-details-toggle"
                    className="
                      inline-flex items-center gap-1.5 text-xs font-mono
                      text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200
                      transition-colors focus:outline-none
                    "
                  >
                    {this.state.isDetailsOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    <span>Diagnostic reflection report</span>
                  </button>

                  {this.state.isDetailsOpen && (
                    <button
                      type="button"
                      onClick={this.handleCopyDiagnostics}
                      data-testid="error-copy-button"
                      className="
                        inline-flex items-center gap-1 px-2 py-0.5 rounded-md
                        bg-[#FAF5EF] dark:bg-[#1C1815] border border-[#E8DDD0] dark:border-[#2D2621]
                        text-[11px] font-mono text-stone-600 dark:text-stone-300
                        hover:border-[#C85828]/50 transition-colors
                      "
                    >
                      {this.state.copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{this.state.copied ? 'Copied' : 'Copy log'}</span>
                    </button>
                  )}
                </div>

                {this.state.isDetailsOpen && (
                  <div
                    data-testid="error-details-content"
                    className="
                      p-3 rounded-xl bg-[#141210] dark:bg-[#0B0A09]
                      border border-[#2D2621] text-stone-300
                      font-mono text-[11px] leading-relaxed max-h-48 overflow-y-auto
                    "
                  >
                    <div className="text-[#E8A87C] font-semibold mb-1">
                      {this.state.error?.toString() || 'Unknown Error'}
                    </div>
                    {this.state.errorInfo?.componentStack && (
                      <pre className="text-stone-400 text-[10px] whitespace-pre-wrap font-mono">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Quiet Crisis Support Reassurance Bar */}
            <div className="border-t border-[#E8DDD0]/50 dark:border-[#2D2621]/50 pt-4 mt-5 flex items-center justify-center gap-2 text-stone-500 dark:text-stone-400 text-[11px]">
              <HeartHandshake className="w-3.5 h-3.5 text-[#C85828] dark:text-amber-400 shrink-0" />
              <span>Free, confidential mental wellness helplines are always active if you need immediate care.</span>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Route-specific Error Boundary with contextual sanctuary messaging
 */
export function RouteErrorBoundary({ children, routeName, fallback, message }) {
  return (
    <ErrorBoundary
      routeName={routeName}
      fallback={fallback}
      message={message || `There was a problem loading the ${routeName || 'sanctuary space'}. Please try gently restoring.`}
    >
      {children}
    </ErrorBoundary>
  );
}

export default ErrorBoundary;
