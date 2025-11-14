import React from 'react';
import { useAppData } from '../../hooks/useAppData';
import { KANBAN_STAGES } from '../../constants';
import { CustomOrderStatus, CustomOrder } from '../../types';
import { OrderKanbanCard } from '../../components/admin/OrderKanbanCard';

export const OrdersPage: React.FC = () => {
  const { data, loading, updateData } = useAppData();

  const handleUpdateStatus = async (orderId: string, newStatus: CustomOrderStatus) => {
    if (!data) return;
    
    const updatedOrders = data.customOrders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    
    const updatedWorkOrders = data.workOrders.map(wo => {
        const relatedOrder = updatedOrders.find(o => o.id === wo.custom_order_id);
        return relatedOrder ? {...wo, status: relatedOrder.status } : wo;
    });

    await updateData({ ...data, customOrders: updatedOrders, workOrders: updatedWorkOrders });
  };

  if (loading || !data) {
    return <div>Loading orders...</div>;
  }
  
  const ordersByStatus = (status: CustomOrderStatus) => {
    return data.customOrders.filter(order => order.status === status);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Custom Orders / Workorders</h1>
      </div>
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {KANBAN_STAGES.map(stage => (
          <div key={stage} className="flex-shrink-0 w-72 bg-stone-100 rounded-lg p-3">
            <h2 className="font-semibold mb-4 text-center">{stage} ({ordersByStatus(stage).length})</h2>
            <div className="space-y-3">
              {ordersByStatus(stage).map(order => (
                <OrderKanbanCard
                  key={order.id}
                  order={order}
                  customer={data.customers.find(c => c.id === order.customer_id)}
                  tailor={data.users.find(u => u.id === order.assigned_tailor_id)}
                  onUpdateStatus={handleUpdateStatus}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
