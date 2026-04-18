import React, { useState, useEffect } from 'react';
import { getChildren } from '../services/childService';
import { PlusCircle, Users } from 'lucide-react';

export default function Children() {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await getChildren();
    setChildren(data);
    setLoading(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">الأطفال</h2>
        <button className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
          <PlusCircle size={20} />
          <span>إضافة طفل</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full text-right pointer-events-none">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-bold text-gray-600">الاسم</th>
              <th className="p-4 font-bold text-gray-600">العمر</th>
              <th className="p-4 font-bold text-gray-600">التشخيص</th>
              <th className="p-4 font-bold text-gray-600">درجة الذكاء</th>
              <th className="p-4 font-bold text-gray-600 text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y pointer-events-auto">
            {loading ? (
              <tr><td colSpan="5" className="p-8 text-center text-gray-500">جاري التحميل...</td></tr>
            ) : (
              children.map(child => (
                <tr key={child.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">{child.name}</td>
                  <td className="p-4 text-gray-600">{child.age} سنوات</td>
                  <td className="p-4">
                    <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                      {child.diagnosis}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">{child.iqScore || 'غير محدد'}</td>
                  <td className="p-4 text-center">
                    <button className="text-primary hover:text-blue-700 font-medium">عرض الملف</button>
                  </td>
                </tr>
              ))
            )}
            {(!loading && children.length === 0) && (
              <tr><td colSpan="5" className="p-8 text-center text-gray-500">لا يوجد أطفال مضافين بعد</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
