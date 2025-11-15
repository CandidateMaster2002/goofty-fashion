import React, { useMemo, useState } from 'react';
import { DollarSign, Briefcase, Clock, Scissors, Truck, Plus, ShoppingBag } from 'lucide-react';
import { useAppData } from '../../hooks/useAppData';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { POSModal } from '../../components/admin/POSModal';
import { RentalStatus, CustomOrderStatus } from '../../types';

interface KPIProps {
  title: string;
  value: string | number;
  // FIX: Provide a more specific type for the icon prop to fix cloneElement error.
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  color: string;
}

const KPICard: React.FC<KPIProps> = ({ title, value, icon, color }) => (
  <Card className="flex items-center p-4">
    <div className={`p-4 rounded-full mr-4 ${color}`}>
      {React.cloneElement(icon, { className: "text-white h-7 w-7"})}
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  </Card>
);

export const DashboardPage: React.FC = () => {
  const { data, loading } = useAppData();
  const [isPosModalOpen, setIsPosModalOpen] = useState(false);

  const kpis = useMemo(() => {
    if (!data) return null;

    const totalSales = data.invoices
      .filter(inv => inv.paid)
      .reduce((sum, inv) => sum + inv.total_amount, 0);

    const activeRentals = data.rentals.filter(r => r.status === RentalStatus.Active).length;
    
    const overdueReturns = data.rentals.filter(r => r.status === RentalStatus.Late).length;

    const pendingCustomJobs = data.customOrders.filter(co => co.status !== CustomOrderStatus.Delivered).length;

    const today = new Date();
    today.setHours(0,0,0,0);
    const todaysPickups = data.rentals.filter(r => {
        const startDate = new Date(r.start_date);
        startDate.setHours(0,0,0,0);
        return startDate.getTime() === today.getTime() && r.status === RentalStatus.Reserved;
    }).length;

    return {
      totalSales,
      activeRentals,
      overdueReturns,
      pendingCustomJobs,
      todaysPickups
    };
  }, [data]);

  if (loading && !data) {
    return <div className="p-8">Loading dashboard...</div>;
  }
  
  if (!kpis) {
     return <div className="p-8">No data available.</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <Button onClick={() => setIsPosModalOpen(true)} size="md">
          <ShoppingBag size={20} className="mr-2"/>
          New Sale (POS)
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <KPICard 
          title="Total Sales" 
          value={`₹${kpis.totalSales.toLocaleString('en-IN')}`} 
          icon={<DollarSign />}
          color="bg-emerald-500"
        />
        <KPICard 
          title="Active Rentals" 
          value={kpis.activeRentals}
          icon={<Briefcase />}
          color="bg-sky-500"
        />
        <KPICard 
          title="Overdue Returns" 
          value={kpis.overdueReturns}
          icon={<Clock />}
          color="bg-rose-500"
        />
        <KPICard 
          title="Pending Custom Jobs" 
          value={kpis.pendingCustomJobs}
          icon={<Scissors />}
          color="bg-amber-500"
        />
        <KPICard 
          title="Today's Pickups" 
          value={kpis.todaysPickups}
          icon={<Truck />}
          color="bg-violet-500"
        />
      </div>
      
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <ul className="divide-y divide-slate-200">
                {data?.rentals.slice(0, 3).map(r => (
                    <li key={r.id} className="py-3">
                        <p><strong>Rental #{r.id.split('-')[1]}</strong> status changed to <span className="font-semibold text-primary-700">{r.status}</span>.</p>
                        <p className="text-sm text-slate-500">{data?.customers.find(c => c.id === r.customer_id)?.name}</p>
                    </li>
                ))}
                {data?.customOrders.slice(0, 2).map(o => (
                    <li key={o.id} className="py-3">
                        <p><strong>Custom Order #{o.id.split('-')[1]}</strong> moved to <span className="font-semibold text-primary-700">{o.status}</span>.</p>
                        <p className="text-sm text-slate-500">{data?.customers.find(c => c.id === o.customer_id)?.name}</p>
                    </li>
                ))}
            </ul>
          </Card>
          <Card>
             <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
             <div className="space-y-3">
                <Button variant="secondary" className="w-full justify-start text-base"><Plus size={16} className="mr-2"/> New Rental</Button>
                <Button variant="secondary" className="w-full justify-start text-base"><Plus size={16} className="mr-2"/> New Custom Order</Button>
                <Button variant="secondary" className="w-full justify-start text-base"><Plus size={16} className="mr-2"/> Add Inventory Item</Button>
             </div>
          </Card>
      </div>
      <POSModal isOpen={isPosModalOpen} onClose={() => setIsPosModalOpen(false)} />
    </div>
  );
};