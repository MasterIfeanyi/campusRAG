import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProvider from './_components/SessionProvider'
import { ThemeProvider } from "./_components/ThemeProvider"
import NavbarLayout from "@/components/Navbar/NavbarLayout";


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
        <SessionProvider>
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
        </SessionProvider>
        <div id="modal-root"></div>
      </body>
    </html>
  );
}
