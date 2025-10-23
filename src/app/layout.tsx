"use client";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { useState } from "react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Note: metadata needs to be in a separate file when using "use client"
// You may need to move metadata to a page.tsx or create a separate metadata file

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <html lang="en">
      <head>
        <title>NeoUrban</title>
        <meta
          name="description"
          content="A Smart City Services Management System"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
        suppressHydrationWarning={true}
      >
        <div className="flex h-screen">
          {/* Mobile overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <aside
            className={`
              fixed lg:relative lg:translate-x-0 z-30
              w-64 bg-slate-800 text-white p-6 flex flex-col shadow-lg
              transform transition-transform duration-200 ease-in-out
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
              lg:flex
            `}
          >
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold text-white">NeoUrban</h1>
              {/* Close button for mobile */}
              <button
                className="lg:hidden p-2 rounded-md hover:bg-slate-700"
                onClick={() => setSidebarOpen(false)}
                title="Close menu"
                aria-label="Close navigation menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <nav className="space-y-4 flex-1">
              <Link
                href="/"
                className="block px-3 py-2 rounded-md hover:bg-slate-700 hover:text-blue-400 transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/citizens"
                className="block px-3 py-2 rounded-md hover:bg-slate-700 hover:text-blue-400 transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                Citizens
              </Link>
              <Link
                href="/services"
                className="block px-3 py-2 rounded-md hover:bg-slate-700 hover:text-blue-400 transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                Services
              </Link>
              <Link
                href="/requests"
                className="block px-3 py-2 rounded-md hover:bg-slate-700 hover:text-blue-400 transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                Requests
              </Link>
              <Link
                href="/transport"
                className="block px-3 py-2 rounded-md hover:bg-slate-700 hover:text-blue-400 transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                Transport
              </Link>
              <Link
                href="/tickets"
                className="block px-3 py-2 rounded-md hover:bg-slate-700 hover:text-blue-400 transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                Tickets
              </Link>
              <Link
                href="/healthcare"
                className="block px-3 py-2 rounded-md hover:bg-slate-700 hover:text-blue-400 transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                Healthcare
              </Link>
              <Link
                href="/appointments"
                className="block px-3 py-2 rounded-md hover:bg-slate-700 hover:text-blue-400 transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                Appointments
              </Link>
              <Link
                href="/bills"
                className="block px-3 py-2 rounded-md hover:bg-slate-700 hover:text-blue-400 transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                Bills
              </Link>
              <Link
                href="/utilities"
                className="block px-3 py-2 rounded-md hover:bg-slate-700 hover:text-blue-400 transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                Utilities
              </Link>
            </nav>
          </aside>

          {/* Main Content */}
          <div className="flex-1 flex flex-col lg:ml-0">
            {/* Top Navigation Bar with Hamburger Menu */}
            <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 lg:px-6">
              <div className="flex items-center justify-between">
                {/* Hamburger Menu Button */}
                <button
                  type="button"
                  className="lg:hidden p-2 rounded-md hover:bg-gray-100"
                  onClick={() => setSidebarOpen(true)}
                  title="Open navigation menu"
                  aria-label="Open navigation menu"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 p-4 lg:p-6 overflow-y-auto bg-gray-50">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
