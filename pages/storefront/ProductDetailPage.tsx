import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppData } from '../../hooks/useAppData';
import { Button } from '../../components/ui/Button';
import { ShoppingCart, Calendar } from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, loading, addToCart } = useAppData();
  
  const [quantity, setQuantity] = useState(1);
  const [purchaseType, setPurchaseType] = useState<'buy' | 'rent'>('buy');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const item = useMemo(() => data?.items.find(i => i.id === id), [data, id]);
  console.log(item.images[0]);
  
  const rentalDays = useMemo(() => {
    if (purchaseType === 'rent' && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 1;
    }
    return 0;
  }, [purchaseType, startDate, endDate]);

  const handleAddToCart = () => {
    if (!item) return;
    
    if (purchaseType === 'rent' && (!startDate || !endDate)) {
      alert('Please select rental dates.');
      return;
    }
    
    const cartItem = {
      id: purchaseType === 'buy' ? `${item.id}-buy` : `${item.id}-rent-${startDate}-${endDate}`,
      type: purchaseType,
      item: item,
      quantity: quantity,
      ...(purchaseType === 'rent' && { startDate, endDate }),
    };
    addToCart(cartItem);
    navigate('/checkout');
  };
  if (loading) return <div>Loading...</div>;
  if (!item) return <div>Product not found.</div>;
  
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <img src={item.images[0]} alt={item.title} className="w-full rounded-lg shadow-lg" />
        </div>
        <div>
          <h1 className="text-4xl font-bold mb-2">{item.title}</h1>
          <p className="text-lg text-stone-500 mb-4">{item.category}</p>
          <p className="text-3xl font-semibold text-teal-700 mb-6">₹{item.buy_price.toLocaleString('en-IN')}</p>
          
          <div className="prose max-w-none text-stone-600 mb-6">
            <p>{item.description}</p>
          </div>

          <div className="flex items-center space-x-4 mb-6">
            <label>Sizes:</label>
            <div className="flex space-x-2">
              {item.sizes.map(size => (
                <span key={size} className="px-3 py-1 border border-stone-300 rounded-md">{size}</span>
              ))}
            </div>
          </div>

          <div className="bg-stone-100 p-6 rounded-lg">
            <div className="flex border-b border-stone-300 mb-4">
              <button onClick={() => setPurchaseType('buy')} className={`flex-1 py-2 text-lg font-semibold ${purchaseType === 'buy' ? 'text-teal-700 border-b-2 border-teal-700' : 'text-stone-500'}`}>Buy</button>
              <button onClick={() => setPurchaseType('rent')} className={`flex-1 py-2 text-lg font-semibold ${purchaseType === 'rent' ? 'text-teal-700 border-b-2 border-teal-700' : 'text-stone-500'}`}>Rent</button>
            </div>
            
            {purchaseType === 'buy' ? (
              <div>
                <p className="text-2xl font-bold">₹{item.buy_price.toLocaleString('en-IN')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-lg">Rent for <strong>₹{item.rent_price_per_day}/day</strong></p>
                <div className="flex items-center space-x-4">
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-stone-700">Start Date</label>
                    <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} className="mt-1 block w-full p-2 border border-stone-300 rounded-md"/>
                  </div>
                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-stone-700">End Date</label>
                    <input type="date" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} className="mt-1 block w-full p-2 border border-stone-300 rounded-md"/>
                  </div>
                </div>
                {rentalDays > 0 && (
                  <p className="text-xl font-bold">Total Rent: ₹{(rentalDays * item.rent_price_per_day).toLocaleString('en-IN')} for {rentalDays} days</p>
                )}
              </div>
            )}
            
            <div className="flex items-center space-x-4 mt-6">
              <div>
                  <label htmlFor="quantity" className="sr-only">Quantity</label>
                  <input type="number" id="quantity" value={quantity} onChange={e => setQuantity(Math.max(1, parseInt(e.target.value)))} min="1" className="w-20 p-2 border border-stone-300 rounded-md"/>
              </div>
              <Button size="lg" onClick={handleAddToCart} className="flex-1">
                <ShoppingCart size={20} className="mr-2"/>
                Add to Cart
              </Button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
