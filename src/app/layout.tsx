import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NeoUrban Dashboard",
  description: "A Smart City Services Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex h-screen bg-gray-50 text-gray-900`}
      >
        {/* Sidebar */}
        <aside className="w-64 bg-slate-800 text-white p-6 flex flex-col shadow-lg">
          <h1 className="text-2xl font-bold mb-8 text-white">NeoUrban</h1>
          <nav className="space-y-4">
            <Link href="/" className="block hover:text-blue-400">
              Dashboard
            </Link>
            <Link href="/citizens" className="block hover:text-blue-400">
              Citizens
            </Link>
            <Link href="/services" className="block hover:text-blue-400">
              Services
            </Link>
            <Link href="/requests" className="block hover:text-blue-400">
              Requests
            </Link>
            <Link href="/transport" className="block hover:text-blue-400">
              Transport
            </Link>
            <Link href="/healthcare" className="block hover:text-blue-400">
              Healthcare
            </Link>
            <Link href="/utilities" className="block hover:text-blue-400">
              Utilities
            </Link>
            <Link href="/events" className="block hover:text-blue-400">
              Events
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
