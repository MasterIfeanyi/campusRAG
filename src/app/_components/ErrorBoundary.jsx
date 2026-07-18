"use client";

import { Component } from "react";
import MascotState from "@/components/ui/Mascot/Mascot";
import { useTranslate } from "@/hooks/useTranslate";

class ErrorBoundaryClass extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Uncaught render error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <MascotState
            title={this.props.title}
            message={this.props.message}
            actionLabel={this.props.refreshLabel}
            onAction={() => window.location.reload()}
          />
        </div>
      );
    }
    return this.props.children;
  }
}

// Functional shell — pulls translated copy via the hook, since the
// class component itself can't call hooks directly.
export default function ErrorBoundary({ children }) {
  const dictionary = useTranslate();
  const t = dictionary.errorBoundary;

  return (
    <ErrorBoundaryClass title={t.title} message={t.message} refreshLabel={t.refresh}>
      {children}
    </ErrorBoundaryClass>
  );
}