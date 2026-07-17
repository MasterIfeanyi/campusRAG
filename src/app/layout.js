import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProvider from './_components/SessionProvider'
import { ThemeProvider } from "./_components/ThemeProvider"
import NavbarLayout from "@/components/Navbar/NavbarLayout";
import QueryProvider from "./_components/QueryProvider";
import { I18nProvider } from "@/i18n/I18nProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "GIST",
  description: "The most real place on the internet.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
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
              </ThemeProvider>
            </QueryProvider>
          </SessionProvider>
        </I18nProvider>
        <div id="modal-root"></div>
      </body>
    </html>
  );
}
