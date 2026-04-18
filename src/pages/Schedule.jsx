import React, { useState, useEffect } from 'react';
import { getSpecialists } from '../services/specialistService';
import { getSessionsByDate, addSession } from '../services/sessionService';
import { getChildren } from '../services/childService';
import { generateDailySlots } from '../utils/scheduleLogic';
import { format, addDays, getDay } from 'date-fns';
import { Calendar as CalendarIcon, ChevronRight, ChevronLeft, X, Clock } from 'lucide-react';

export default function Schedule() {
  const [date, setDate] = useState(new Date());
  const [specialists, setSpecialists] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null); // { time, specialist }
  const [bookingChild, setBookingChild] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    loadData();
  }, [date]);

  const loadData = async () => {
    setLoading(true);
    const [specs, sess, childs] = await Promise.all([
      getSpecialists(),
      getSessionsByDate(date),
      getChildren()
    ]);
    
    const dayOfWeek = getDay(date);
    const availableSpecs = specs.filter(s => Array.isArray(s.workingDays) && s.workingDays.includes(dayOfWeek));
    
    setSpecialists(availableSpecs);
    setSessions(sess);
    setChildren(childs);
    setLoading(false);
  };

  const handleNextDay = () => setDate(d => addDays(d, 1));
  const handlePrevDay = () => setDate(d => addDays(d, -1));

  const openBookingModal = (time, spec) => {
    setSelectedSlot({ time, specialist: spec });
    setBookingChild('');
    setIsModalOpen(true);
  };

  const handleBook = async () => {
    if (!bookingChild) return alert('الرجاء اختيار الطفل');
    setIsBooking(true);
    
    const newSession = {
      childId: bookingChild,
      specialistId: selectedSlot.specialist.id,
      date: format(date, 'yyyy-MM-dd'),
      startTime: selectedSlot.time,
      status: 'scheduled'
    };

    await addSession(newSession);
    await loadData(); // refresh sessions to turn it red
    
    setIsBooking(false);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 flex flex-col h-[calc(100vh-100px)]">
      {/* Header controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border shrink-0">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <CalendarIcon className="text-primary" />
          جدول المواعيد
        </h2>
        
        <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-lg border">
          <button onClick={handlePrevDay} className="p-1 hover:bg-gray-200 rounded text-gray-600">
            <ChevronRight size={24} />
          </button>
          <span className="font-bold text-lg text-gray-900 w-32 text-center" dir="ltr">
            {format(date, 'yyyy-MM-dd')}
          </span>
          <button onClick={handleNextDay} className="p-1 hover:bg-gray-200 rounded text-gray-600">
            <ChevronLeft size={24} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : specialists.length === 0 ? (
        <div className="flex-1 flex flex-col justify-center items-center text-gray-500 bg-white rounded-xl shadow-sm border p-12 shrink-0">
          <CalendarIcon size={64} className="opacity-20 mb-4" />
          <p className="text-xl">لا يوجد أخصائيين يعملون في هذا اليوم.</p>
        </div>
      ) : (
        <div className="flex-1 overflow-x-auto bg-gray-100 rounded-xl border p-4">
          <div className="flex gap-4 min-w-max">
            {specialists.map(spec => {
               // Generate specifically for this specialist
               const slots = generateDailySlots(spec.startHour, spec.endHour, 45);
               
               return (
                 <div key={spec.id} className="w-80 bg-white rounded-xl shadow-sm border flex flex-col overflow-hidden">
                   <div className="bg-blue-50 border-b p-4 text-center shrink-0">
                     <h3 className="font-bold text-lg text-gray-900">{spec.name}</h3>
                     <span className="text-sm text-blue-600 bg-blue-100 px-3 py-1 rounded-full mt-2 inline-block">
                       {spec.specialization}
                     </span>
                     <div className="mt-2 text-xs text-gray-500 flex justify-center items-center gap-1" dir="ltr">
                       <Clock size={12} />
                       {spec.startHour} - {spec.endHour}
                     </div>
                   </div>
                   
                   <div className="p-4 flex-1 overflow-y-auto space-y-3">
                     {slots.map(timeStr => {
                       const isBooked = sessions.find(s => s.specialistId === spec.id && s.startTime === timeStr);
                       
                       if (isBooked) {
                         const bookedChild = children.find(c => c.id === isBooked.childId);
                         return (
                           <div key={timeStr} className="p-3 bg-red-50 border border-red-200 rounded-lg flex flex-col relative select-none">
                             <div className="flex justify-between items-center mb-1">
                               <span className="font-bold text-red-700" dir="ltr">{timeStr}</span>
                               <span className="text-xs bg-red-200 text-red-800 px-2 py-0.5 rounded">محجوز</span>
                             </div>
                             <span className="text-sm font-medium text-red-900">{bookedChild?.name || 'طفل غير معروف'}</span>
                           </div>
                         );
                       }
                       
                       return (
                         <button 
                           key={timeStr} 
                           onClick={() => openBookingModal(timeStr, spec)}
                           className="w-full text-right p-3 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg flex justify-between items-center transition-colors group"
                         >
                           <span className="font-bold text-green-700" dir="ltr">{timeStr}</span>
                           <span className="text-sm font-medium text-green-600 group-hover:text-green-800 transition-colors">
                             متاح للحجز
                           </span>
                         </button>
                       );
                     })}
                     {slots.length === 0 && (
                       <p className="text-center text-gray-400 text-sm mt-4">لا توجد أوقات متاحة</p>
                     )}
                   </div>
                 </div>
               );
            })}
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-4 border-b bg-gray-50 rounded-t-2xl">
              <h3 className="text-xl font-bold text-gray-800">حجز موعد جديد</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700 p-1 rounded-md transition-colors"><X size={20} /></button>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3 border-b border-blue-100 pb-2">
                  <span className="text-blue-500"><CalendarIcon size={18} /></span>
                  <span className="font-bold text-blue-900" dir="ltr">{format(date, 'yyyy-MM-dd')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">الأخصائي:</span>
                  <span className="font-bold text-blue-900">{selectedSlot?.specialist?.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">الوقت:</span>
                  <span className="font-bold text-blue-900 text-lg bg-white px-2 py-1 rounded shadow-sm border border-blue-200" dir="ltr">{selectedSlot?.time}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">اختر الطفل</label>
                <select 
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  value={bookingChild}
                  onChange={(e) => setBookingChild(e.target.value)}
                >
                  <option value="">-- يرجى الاختيار --</option>
                  {children.map(child => (
                    <option key={child.id} value={child.id}>{child.name}</option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex gap-3">
                <button 
                  className="flex-1 bg-primary hover:bg-blue-600 focus:ring-4 focus:ring-blue-200 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
                  onClick={handleBook}
                  disabled={isBooking || !bookingChild}
                >
                  {isBooking ? 'جاري الحجز...' : 'تأكيد الحجز'}
                </button>
                <button 
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 rounded-lg transition-colors border border-gray-200"
                  onClick={() => setIsModalOpen(false)}
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
