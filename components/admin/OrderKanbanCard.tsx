import React from 'react';
import { CustomOrder, Customer, User, CustomOrderStatus } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ChevronLeft, ChevronRight, User as UserIcon, Calendar } from 'lucide-react';
import { KANBAN_STAGES } from '../../constants';

interface OrderKanbanCardProps {
  order: CustomOrder;
  customer?: Customer;
  tailor?: User;
  onUpdateStatus: (orderId: string, newStatus: CustomOrderStatus) => void;
}

export const OrderKanbanCard: React.FC<OrderKanbanCardProps> = ({ order, customer, tailor, onUpdateStatus }) => {
  const currentStageIndex = KANBAN_STAGES.indexOf(order.status);
  
  const canMoveBack = currentStageIndex > 0;
  const canMoveForward = currentStageIndex < KANBAN_STAGES.length - 1;

  const move = (direction: 'back' | 'forward') => {
    const newIndex = direction === 'forward' ? currentStageIndex + 1 : currentStageIndex - 1;
    onUpdateStatus(order.id, KANBAN_STAGES[newIndex]);
  };

  return (
    <Card className="mb-4 bg-white hover:bg-slate-50">
      <h4 className="font-bold text-base text-slate-800">{order.title}</h4>
      <div className="text-sm text-slate-600 mt-2 space-y-1">
        <p className="flex items-center"><UserIcon size={14} className="mr-2 text-slate-500"/> {customer?.name || 'N/A'}</p>
        <p className="flex items-center"><Calendar size={14} className="mr-2 text-slate-500"/> Due: {new Date(order.due_date).toLocaleDateString()}</p>
      </div>
      {tailor && <p className="text-xs mt-2 text-slate-500">Assigned: {tailor.name}</p>}
      
      <div className="flex justify-between items-center mt-4 border-t pt-3">
        <Button size="sm" variant="secondary" onClick={() => move('back')} disabled={!canMoveBack} className="p-2 h-8 w-8">
          <ChevronLeft size={16} />
        </Button>
        <Button size="sm" variant="secondary" onClick={() => move('forward')} disabled={!canMoveForward} className="p-2 h-8 w-8">
          <ChevronRight size={16} />
        </Button>
      </div>
    </Card>
  );
};