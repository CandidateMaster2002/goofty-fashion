import React, { useState, useMemo } from 'react';
import { useAppData } from '../../hooks/useAppData';
import { Rental, RentalStatus } from '../../types';
import { getDaysInMonth, getMonthName, getWeekdays, addMonths, areDatesSameDay } from '../../utils/date';
import { Button } from '../../components/ui/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const RentalsPage: React.FC = () => {
  const { data, loading } = useAppData();
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysOfMonth = useMemo(() => getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth()), [currentDate]);
  const weekdays = getWeekdays();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const handleMonthChange = (offset: number) => {
    setCurrentDate(prev => addMonths(prev, offset));
  };

  const getRentalsForDay = (day: Date): Rental[] => {
    if (!data?.rentals) return [];
    return data.rentals.filter(rental => {
      const start = new Date(rental.start_date);
      const end = new Date(rental.end_date);
      start.setHours(0,0,0,0);
      end.setHours(0,0,0,0);
      day.setHours(0,0,0,0);
      return day >= start && day <= end;
    });
  };

  const statusColorMap: Record<RentalStatus, string> = {
    [RentalStatus.Reserved]: 'bg-indigo-100 text-indigo-800 border-l-4 border-indigo-500',
    [RentalStatus.Active]: 'bg-emerald-100 text-emerald-800 border-l-4 border-emerald-500',
    [RentalStatus.Returned]: 'bg-slate-200 text-slate-800 border-l-4 border-slate-500',
    [RentalStatus.Late]: 'bg-rose-100 text-rose-800 border-l-4 border-rose-500',
    [RentalStatus.Cancelled]: 'bg-amber-100 text-amber-800 border-l-4 border-amber-500',
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Rental Calendar</h1>
        <div className="flex items-center space-x-4">
          <Button variant="secondary" onClick={() => handleMonthChange(-1)}><ChevronLeft size={16}/></Button>
          <h2 className="text-xl font-semibold w-40 text-center">
            {getMonthName(currentDate.getMonth())} {currentDate.getFullYear()}
          </h2>
          <Button variant="secondary" onClick={() => handleMonthChange(1)}><ChevronRight size={16}/></Button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 border-t border-l border-slate-200 bg-white rounded-lg shadow-lg overflow-hidden">
        {weekdays.map(day => (
          <div key={day} className="p-2 text-center font-semibold border-b border-r border-slate-200 bg-slate-50 text-slate-600">
            {day}
          </div>
        ))}
        
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="border-b border-r border-slate-200 bg-slate-50"></div>
        ))}
        
        {daysOfMonth.map(day => {
          const rentals = getRentalsForDay(day);
          const isToday = areDatesSameDay(day, new Date());
          return (
            <div key={day.toString()} className={`min-h-[140px] p-2 border-b border-r border-slate-200 relative transition-colors ${isToday ? 'bg-primary-50' : 'hover:bg-slate-50'}`}>
              <span className={`text-sm font-semibold ${isToday ? 'bg-primary-600 text-white rounded-full h-7 w-7 flex items-center justify-center' : 'text-slate-600'}`}>
                {day.getDate()}
              </span>
              <div className="mt-2 space-y-1">
                {rentals.map(rental => (
                    <div key={rental.id} className={`text-xs p-1.5 rounded-md overflow-hidden truncate ${statusColorMap[rental.status]}`}>
                        <span className="font-bold">#{rental.id.slice(-4)}</span> - {data?.customers.find(c => c.id === rental.customer_id)?.name.split(' ')[0]}
                    </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};