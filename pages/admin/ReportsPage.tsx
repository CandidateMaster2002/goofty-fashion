import React, { useMemo } from 'react';
import { useAppData } from '../../hooks/useAppData';
import { Card } from '../../components/ui/Card';
import { Item, Invoice } from '../../types';

const BarChart: React.FC<{ data: { label: string; value: number }[], title: string }> = ({ data, title }) => {
    const maxValue = Math.max(...data.map(d => d.value), 0);
    return (
        <Card>
            <h2 className="text-xl font-semibold mb-4">{title}</h2>
            <div className="space-y-2">
                {data.map(item => (
                    <div key={item.label} className="flex items-center">
                        <span className="w-1/3 text-sm text-stone-600 truncate">{item.label}</span>
                        <div className="w-2/3 flex items-center">
                             <div className="bg-teal-500 h-6 rounded-r-md" style={{ width: `${(item.value / maxValue) * 100}%` }}></div>
                             <span className="ml-2 font-semibold">{item.value.toLocaleString()}</span>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    )
}


export const ReportsPage: React.FC = () => {
    const { data, loading } = useAppData();

    const salesByMonth = useMemo(() => {
        if (!data?.invoices) return [];
        const monthlySales: Record<string, number> = {};
        
        data.invoices.filter(inv => inv.paid).forEach(inv => {
            const date = new Date(inv.paid_at || inv.created_at);
            const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            if (!monthlySales[month]) {
                monthlySales[month] = 0;
            }
            monthlySales[month] += inv.total_amount;
        });

        return Object.entries(monthlySales)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([label, value]) => ({ label, value }));

    }, [data?.invoices]);
    
    const topRentedItems = useMemo(() => {
        if (!data?.rentals || !data?.items) return [];
        const rentalCounts: Record<string, number> = {};

        data.rentals.forEach(rental => {
            rental.items.forEach(itemInfo => {
                if(!rentalCounts[itemInfo.item_id]) rentalCounts[itemInfo.item_id] = 0;
                rentalCounts[itemInfo.item_id] += 1;
            })
        });

        return Object.entries(rentalCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([itemId, value]) => {
                const item = data.items.find(i => i.id === itemId);
                return { label: item?.title || 'Unknown Item', value };
            });

    }, [data?.rentals, data?.items]);


    if (loading || !data) {
        return <div>Loading reports...</div>
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Reports</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <BarChart data={salesByMonth} title="Sales by Month (₹)" />
                <BarChart data={topRentedItems} title="Top 5 Rented Items (by # of rentals)" />
            </div>
        </div>
    );
};
