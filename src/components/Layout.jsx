import React from 'react';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans" dir="rtl">
      {/* Sidebar on the right */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Topbar Placeholder */}
        <header className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center z-10">
          <h1 className="text-xl font-bold text-gray-800">نظام إدارة المركز</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">مرحباً, السكرتيرة</span>
            <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
              س
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 p-6 z-0">
          {children}
        </main>
      </div>
    </div>
  );
}
