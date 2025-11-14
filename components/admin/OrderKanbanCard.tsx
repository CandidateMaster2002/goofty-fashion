import React from 'react';
import { CustomOrder, Customer, User, CustomOrderStatus } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
    <Card className="mb-4 bg-stone-50">
      <h4 className="font-bold">{order.title}</h4>
      <p className="text-sm text-stone-600">For: {customer?.name || 'N/A'}</p>
      <p className="text-sm text-stone-500">Due: {new Date(order.due_date).toLocaleDateString()}</p>
      {tailor && <p className="text-xs mt-2">Assigned to: {tailor.name}</p>}
      
      <div className="flex justify-between items-center mt-3">
        <Button size="sm" variant="secondary" onClick={() => move('back')} disabled={!canMoveBack}>
          <ChevronLeft size={16} />
        </Button>
        <span className="text-xs font-semibold">{order.status}</span>
        <Button size="sm" variant="secondary" onClick={() => move('forward')} disabled={!canMoveForward}>
          <ChevronRight size={16} />
        </Button>
      </div>
    </Card>
  );
};
