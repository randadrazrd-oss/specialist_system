import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, UserRound, CalendarDays } from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    { name: 'لوحة القيادة', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'الجدول والمواعيد', path: '/schedule', icon: <CalendarDays size={20} /> },
    { name: 'الأخصائيين', path: '/specialists', icon: <UserRound size={20} /> },
    { name: 'الأطفال', path: '/children', icon: <Users size={20} /> },
  ];

  return (
    <div className="w-64 bg-white border-l shadow-sm flex flex-col z-20">
      <div className="p-6 border-b flex items-center justify-center">
        <h2 className="text-2xl font-bold text-primary">المركز الشامل</h2>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            {item.icon}
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t text-center text-sm text-gray-500">
        الإصدار 1.0.0
      </div>
    </div>
  );
}
