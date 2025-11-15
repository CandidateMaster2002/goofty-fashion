import React, { useMemo } from 'react';
import { useAppData } from '../../hooks/useAppData';
import { Card } from '../../components/ui/Card';
import { CustomOrderStatus } from '../../types';

// A small, local component for displaying a single statistic.
const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; iconBgColor: string; }> = ({ title, value, icon, iconBgColor }) => (
    <Card className="flex items-center p-4 transition-all duration-300 ease-in-out hover:shadow-md hover:-translate-y-1">
        <div className={`p-3 rounded-full mr-4 text-3xl flex items-center justify-center ${iconBgColor}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
        </div>
    </Card>
);

// A more advanced BarChart component for visualization.
const BarChart: React.FC<{ data: { label: string; value: number; change?: number }[], title: string, formatter?: (value: number) => string, barColor?: string }> = ({ data, title, formatter = (v) => v.toLocaleString(), barColor = 'bg-sky-500' }) => {
    const maxValue = Math.max(...data.map(d => d.value), 1); // Avoid division by zero
    
    if (data.length === 0) {
        return (
            <Card>
                <h2 className="text-xl font-semibold mb-4 text-slate-700">{title}</h2>
                <div className="flex items-center justify-center h-48">
                  <p className="text-slate-500">No data available for this report.</p>
                </div>
            </Card>
        )
    }

    return (
        <Card>
            <h2 className="text-xl font-semibold mb-4 text-slate-700">{title}</h2>
            <div className="space-y-3">
                {data.map(item => (
                    <div key={item.label} className="flex items-center text-sm" title={`${item.label}: ${formatter(item.value)}`}>
                        <span className="w-1/4 text-slate-600 truncate">{item.label}</span>
                        <div className="w-3/4 flex items-center">
                             <div className={`${barColor} h-6 rounded-md transition-all duration-500`} style={{ width: `${(item.value / maxValue) * 100}%` }}></div>
                             <span className="ml-3 font-semibold w-24 text-slate-700">{formatter(item.value)}</span>
                             {item.change !== undefined && item.change !== 0 && (
                                <span className={`flex items-center text-xs font-semibold ${item.change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {item.change >= 0 ? '▲' : '▼'} {Math.abs(item.change).toFixed(1)}%
                                </span>
                             )}
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    )
}


export const ReportsPage: React.FC = () => {
    const { data, loading } = useAppData();

    const keyMetrics = useMemo(() => {
        if (!data) return { totalRevenue: 0, totalRentals: 0, totalSales: 0, pendingOrders: 0 };

        const totalRevenue = data.invoices
            .filter(i => i.paid)
            .reduce((sum, i) => sum + i.total_amount, 0);
        
        const totalRentals = data.rentals.length;
        
        const totalSalesCount = new Set<string>();
        data.invoices.forEach(inv => {
            if (inv.paid) {
                for (const item of inv.items) {
                    if (item.description.toLowerCase().includes('purchase') || item.description.toLowerCase().includes('sale')) {
                        totalSalesCount.add(inv.id);
                        break;
                    }
                }
            }
        });
        const totalSales = totalSalesCount.size;

        const pendingOrders = data.customOrders.filter(o => o.status !== CustomOrderStatus.Delivered).length;

        return {
            totalRevenue,
            totalRentals,
            totalSales,
            pendingOrders,
        };
    }, [data]);

    const salesByMonth = useMemo(() => {
        if (!data?.invoices) return [];
        const monthlySales: Record<string, number> = {};
        
        data.invoices.filter(inv => inv.paid).forEach(inv => {
            const date = new Date(inv.paid_at || inv.created_at);
            const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            monthlySales[month] = (monthlySales[month] || 0) + inv.total_amount;
        });

        const sortedMonths = Object.keys(monthlySales).sort();
        
        return sortedMonths.map((label, index) => {
            const value = monthlySales[label];
            const prevMonthLabel = sortedMonths[index - 1];
            const prevValue = prevMonthLabel ? monthlySales[prevMonthLabel] : 0;
            const change = prevValue > 0 ? ((value - prevValue) / prevValue) * 100 : (value > 0 ? 100 : 0);
            return { label, value, change };
        });
    }, [data?.invoices]);
    
    const topRentedItems = useMemo(() => {
        if (!data?.rentals || !data?.items) return [];
        const rentalCounts: Record<string, number> = {};

        data.rentals.forEach(rental => {
            rental.items.forEach(itemInfo => {
                rentalCounts[itemInfo.item_id] = (rentalCounts[itemInfo.item_id] || 0) + itemInfo.qty;
            })
        });

        return Object.entries(rentalCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([itemId, value]) => ({
                label: data.items.find(i => i.id === itemId)?.title || 'Unknown',
                value
            }));
    }, [data?.rentals, data?.items]);

    const topPurchasedItems = useMemo(() => {
        if (!data?.invoices || !data?.items) return [];
        const purchaseCounts: Record<string, number> = {};

        data.invoices.forEach(invoice => {
            if (invoice.paid) {
                invoice.items.forEach(itemInfo => {
                    if (itemInfo.description.toLowerCase().includes('purchase') || itemInfo.description.toLowerCase().includes('sale')) {
                        purchaseCounts[itemInfo.item_id] = (purchaseCounts[itemInfo.item_id] || 0) + itemInfo.qty;
                    }
                });
            }
        });

        return Object.entries(purchaseCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([itemId, value]) => ({
                label: data.items.find(i => i.id === itemId)?.title || 'Unknown',
                value
            }));
    }, [data?.invoices, data?.items]);

    const topCustomersByRevenue = useMemo(() => {
        if (!data?.invoices || !data?.customers) return [];
        const customerSpending: Record<string, number> = {};

        data.invoices.filter(inv => inv.paid).forEach(inv => {
            customerSpending[inv.customer_id] = (customerSpending[inv.customer_id] || 0) + inv.total_amount;
        });

        return Object.entries(customerSpending)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([customerId, value]) => ({
                label: data.customers.find(c => c.id === customerId)?.name || 'Unknown',
                value
            }));
    }, [data?.invoices, data?.customers]);


    if (loading || !data) {
        return <div>Loading reports...</div>
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-slate-800">Reports Dashboard</h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Revenue" value={`₹${keyMetrics.totalRevenue.toLocaleString('en-IN')}`} icon="💰" iconBgColor="bg-yellow-100" />
                <StatCard title="Total Rentals Booked" value={keyMetrics.totalRentals} icon="🛍️" iconBgColor="bg-indigo-100"/>
                <StatCard title="Total Sales Transactions" value={keyMetrics.totalSales} icon="🛒" iconBgColor="bg-emerald-100"/>
                <StatCard title="Pending Custom Orders" value={keyMetrics.pendingOrders} icon="✂️" iconBgColor="bg-rose-100"/>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <BarChart data={salesByMonth} title="Sales by Month (with MoM comparison)" formatter={(v) => `₹${Math.round(v).toLocaleString('en-IN')}`} barColor="bg-sky-500" />
                <BarChart data={topCustomersByRevenue} title="Top 5 Customers by Revenue" formatter={(v) => `₹${Math.round(v).toLocaleString('en-IN')}`} barColor="bg-emerald-500" />
                <BarChart data={topRentedItems} title="Top 5 Rented Items (by units rented)" barColor="bg-amber-500" />
                <BarChart data={topPurchasedItems} title="Top 5 Purchased Items (by units sold)" barColor="bg-violet-500" />
            </div>
        </div>
    );
};