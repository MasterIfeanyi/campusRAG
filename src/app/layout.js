import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Providers from "./_components/Providers";

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
        <Script id="performance-patch" strategy="beforeInteractive">
          {`
            if (typeof window !== 'undefined' && window.performance && window.performance.measure) {
              const origMeasure = window.performance.measure.bind(window.performance);
              window.performance.measure = function(name, startMark, endMark) {
                try {
                  return origMeasure(name, startMark, endMark);
                } catch (e) {}
              };
            }
          `}
        </Script>
        <Providers>{children}</Providers>
        <div id="modal-root"></div>
      </body>
    </html>
  );
}