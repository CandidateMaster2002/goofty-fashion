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
    [RentalStatus.Reserved]: 'bg-blue-100 text-blue-800',
    [RentalStatus.Active]: 'bg-green-100 text-green-800',
    [RentalStatus.Returned]: 'bg-gray-100 text-gray-800',
    [RentalStatus.Late]: 'bg-red-100 text-red-800',
    [RentalStatus.Cancelled]: 'bg-yellow-100 text-yellow-800',
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
      
      <div className="grid grid-cols-7 border-t border-l border-stone-200">
        {weekdays.map(day => (
          <div key={day} className="p-2 text-center font-semibold border-b border-r border-stone-200 bg-stone-50">
            {day}
          </div>
        ))}
        
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="border-b border-r border-stone-200"></div>
        ))}
        
        {daysOfMonth.map(day => {
          const rentals = getRentalsForDay(day);
          const isToday = areDatesSameDay(day, new Date());
          return (
            <div key={day.toString()} className="min-h-[120px] p-2 border-b border-r border-stone-200 relative">
              <span className={`absolute top-2 right-2 text-sm font-semibold ${isToday ? 'bg-teal-600 text-white rounded-full h-6 w-6 flex items-center justify-center' : ''}`}>
                {day.getDate()}
              </span>
              <div className="mt-8 space-y-1">
                {rentals.map(rental => (
                    <div key={rental.id} className={`text-xs p-1 rounded-md overflow-hidden truncate ${statusColorMap[rental.status]}`}>
                        #{rental.id.slice(-4)} - {data?.customers.find(c => c.id === rental.customer_id)?.name.split(' ')[0]}
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
