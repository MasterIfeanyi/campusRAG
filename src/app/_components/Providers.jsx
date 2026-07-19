import SessionProvider from "./SessionProvider";
import { ThemeProvider } from "./ThemeProvider";
import QueryProvider from "./QueryProvider";
import { I18nProvider } from "@/i18n/I18nProvider";
import AppShell from "@/components/AppShell/AppShell";
import { Toaster } from "react-hot-toast";
import { toastOptions } from "@/config/toastConfig";

export default function Providers({ children }) {
  return (
    <I18nProvider>
      <SessionProvider>
        <QueryProvider>
          <ThemeProvider
            attribute="data-theme"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AppShell>
              {children}
            </AppShell>
            <Toaster position="top-center" toastOptions={toastOptions} />
          </ThemeProvider>
        </QueryProvider>
      </SessionProvider>
    </I18nProvider>
  );
}