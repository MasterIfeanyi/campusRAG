import SessionProvider from "./SessionProvider";
import { ThemeProvider } from "./ThemeProvider";
import QueryProvider from "./QueryProvider";
import { I18nProvider } from "@/i18n/I18nProvider";
import NavbarLayout from "@/components/Navbar/NavbarLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
            <NavbarLayout>
              {children}
            </NavbarLayout>
            <ToastContainer position="top-right" theme="colored" />
          </ThemeProvider>
        </QueryProvider>
      </SessionProvider>
    </I18nProvider>
  );
}