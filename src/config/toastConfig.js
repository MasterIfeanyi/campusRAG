export const toastOptions = {
  duration: 4000,
  style: {
    background: "var(--card)",
    color: "var(--card-foreground)",
    border: "1px solid var(--border)",
    borderRadius: "0.75rem",
    padding: "12px 16px",
    fontSize: "0.875rem",
  },
  success: {
    iconTheme: {
      primary: "var(--primary)",
      secondary: "var(--primary-foreground)",
    },
  },
  error: {
    iconTheme: {
      primary: "var(--destructive)",
      secondary: "var(--destructive-foreground)",
    },
  },
};