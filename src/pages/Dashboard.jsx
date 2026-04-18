import React, { useEffect, useState } from 'react';
import { getSpecialists } from '../services/specialistService';
import { getChildren } from '../services/childService';
import { getSessionsByDate } from '../services/sessionService';
import { Users, UserRound, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    specialistsCount: 0,
    childrenCount: 0,
    todaySessions: 0,
    completedToday: 0
  });

  useEffect(() => {
    async function loadStats() {
      // In a real app we might use aggregate queries or count
      const specs = await getSpecialists();
      const childs = await getChildren();
      const todaySessions = await getSessionsByDate(new Date());
      
      setStats({
        specialistsCount: specs.length,
        childrenCount: childs.length,
        todaySessions: todaySessions.length,
        completedToday: todaySessions.filter(s => s.status === 'completed').length
      });
    }
    loadStats();
  }, []);

  const statCards = [
    { title: 'إجمالي الأخصائيين', value: stats.specialistsCount, icon: <UserRound className="text-blue-500" size={32} />, color: 'bg-blue-50 border-blue-100' },
    { title: 'إجمالي الأطفال', value: stats.childrenCount, icon: <Users className="text-purple-500" size={32} />, color: 'bg-purple-50 border-purple-100' },
    { title: 'جلسات اليوم', value: stats.todaySessions, icon: <CalendarIcon className="text-orange-500" size={32} />, color: 'bg-orange-50 border-orange-100' },
    { title: 'مكتملة اليوم', value: stats.completedToday, icon: <CheckCircle2 className="text-green-500" size={32} />, color: 'bg-green-50 border-green-100' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">نظرة عامة</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <div key={idx} className={`p-6 rounded-2xl border ${card.color} shadow-sm flex items-center justify-between`}>
            <div>
              <p className="text-gray-600 font-medium mb-1">{card.title}</p>
              <h3 className="text-3xl font-bold text-gray-900">{card.value}</h3>
            </div>
            <div className="p-3 bg-white rounded-xl shadow-sm">
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="col-span-2 bg-white rounded-2xl shadow-sm border p-6">
          <h3 className="text-lg font-bold mb-4">النشاط اليومي</h3>
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <CalendarIcon size={48} className="mb-4 opacity-50" />
            <p>سيتم عرض رسم بياني هنا لاحقاً</p>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h3 className="text-lg font-bold mb-4">تحديثات سريعة</h3>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg text-sm border border-yellow-100">
              تذكير: هناك 3 جلسات غير مؤكدة لغداً.
            </div>
            <div className="p-4 bg-green-50 text-green-800 rounded-lg text-sm border border-green-100">
              تم إضافة الأخصائي "أحمد" بنجاح.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
