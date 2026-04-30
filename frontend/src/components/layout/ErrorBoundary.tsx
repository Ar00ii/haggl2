'use client';

import { RotateCcw } from 'lucide-react';
import React from 'react';

interface State {
  error: Error | null;
}

/**
 * Catches React render/runtime errors so a bad page doesn't white-out
 * the whole app. Mounted at the shell + layout level. The fallback is
 * deliberately plain so a broken design system doesn't drag the error
 * UI down with it.
 */
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; label?: string },
  State
> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line no-console
      console.error(`[ErrorBoundary:${this.props.label ?? 'root'}]`, error, info);
    }
  }

  handleReset = () => {
    this.setState({ error: null });
  };

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div
        style={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          background: 'var(--bg)',
          color: 'var(--text)',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        <div
          style={{
            maxWidth: 420,
            width: '100%',
            padding: 24,
            borderRadius: 12,
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
          }}
        >
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Something went wrong</h2>
          <p
            style={{
              margin: '8px 0 20px',
              fontSize: 13,
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
            }}
          >
            A client-side error interrupted this page. The rest of the app is still running — try
            again or head back home.
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              onClick={this.handleReset}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                background: 'var(--text)',
                color: 'var(--bg)',
                border: 'none',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              <RotateCcw size={14} strokeWidth={2} />
              Try again
            </button>
            <a
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '8px 14px',
                background: 'transparent',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500,
                textDecoration: 'none',
              }}
            >
              Go home
            </a>
          </div>
          {process.env.NODE_ENV === 'development' && (
            <pre
              style={{
                marginTop: 16,
                padding: 10,
                background: 'var(--bg)',
                borderRadius: 6,
                fontSize: 11,
                color: '#fca5a5',
                overflow: 'auto',
                maxHeight: 160,
                whiteSpace: 'pre-wrap',
              }}
            >
              {this.state.error.message}
            </pre>
          )}
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
