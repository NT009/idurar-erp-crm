"use client";

import {
  MenuOutlined,
  HomeOutlined,
  ProjectOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar } from "antd";
import Link from "next/link";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
        <div className="flex items-center space-x-4">
          <button
            className="md:hidden text-2xl"
            onClick={() => setSidebarOpen((prev) => !prev)}
          >
            <MenuOutlined />
          </button>
          <h1 className="text-xl font-semibold hidden md:block">
            My Dashboard
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <Avatar size="large" icon={<UserOutlined />} />
        </div>
      </header>

      {/* Layout */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`fixed md:relative top-16 md:top-0 left-0 z-40 w-64 bg-white shadow-md transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 transition-transform duration-200 ease-in-out`}
        >
          <div className="p-6 font-bold text-lg border-b border-gray-200">
            Navigation
          </div>
          <nav className="p-4 space-y-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-blue-100 text-gray-700"
            >
              <HomeOutlined />
              Home
            </Link>
            <Link
              href="/dashboard/projects"
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-blue-100 text-gray-700"
            >
              <ProjectOutlined />
              Projects
            </Link>
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black opacity-25 backdrop-blur-3xl bg-opacity-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
