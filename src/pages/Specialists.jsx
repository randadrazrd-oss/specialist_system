import React, { useState, useEffect } from 'react';
import { getSpecialists, addSpecialist } from '../services/specialistService';
import { PlusCircle, UserRound } from 'lucide-react';

export default function Specialists() {
  const [specialists, setSpecialists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await getSpecialists();
    setSpecialists(data);
    setLoading(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">الأخصائيين</h2>
        <button className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
          <PlusCircle size={20} />
          <span>إضافة أخصائي</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specialists.map(spec => (
            <div key={spec.id} className="bg-white rounded-2xl shadow-sm border p-6 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
                <UserRound size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">{spec.name}</h3>
              <p className="text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full mt-2 text-sm">
                {spec.specialization}
              </p>
              
              <div className="w-full border-t mt-4 pt-4 text-sm text-gray-600 space-y-2">
                <div className="flex justify-between">
                  <span>ساعات العمل:</span>
                  <span className="font-medium text-gray-900" dir="ltr">{spec.startHour} - {spec.endHour}</span>
                </div>
                <div className="flex justify-between">
                  <span>أيام العمل:</span>
                  <span className="font-medium text-gray-900">{spec.workingDays?.length} أيام الأسبوع</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
