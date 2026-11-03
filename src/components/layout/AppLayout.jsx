import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Toast from '../common/Toast';

export default function AppLayout() {
  return (
    <div className="flex h-screen bg-eda-bg text-slate-100 overflow-hidden">
      {/* Fixed Left Sidebar */}
      <Sidebar />

      {/* Main Content Workspace Column */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto px-6 py-6 scroll-smooth bg-eda-bg/60">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Global Toast Notifications */}
      <Toast />
    </div>
  );
}
