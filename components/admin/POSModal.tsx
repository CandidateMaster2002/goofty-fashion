import React, { useState, useMemo } from 'react';
import { useAppData } from '../../hooks/useAppData';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Item, CartItem, Invoice, InvoiceItem, AppData } from '../../types';

interface POSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const POSModal: React.FC<POSModalProps> = ({ isOpen, onClose }) => {
  const { data, updateData } = useAppData();
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);

  const searchResults = useMemo(() => {
    if (!searchTerm || !data?.items) return [];
    return data.items.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5);
  }, [searchTerm, data?.items]);

  const addToPosCart = (item: Item) => {
    const cartItem = {
      id: `${item.id}-buy`,
      type: 'buy' as const,
      item: item,
      quantity: 1,
    };
    
    setCart(prevCart => {
      const existing = prevCart.find(i => i.id === cartItem.id);
      if (existing) {
        return prevCart.map(i => i.id === cartItem.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prevCart, cartItem];
    });
    setSearchTerm('');
  };
  
  const total = useMemo(() => {
      return cart.reduce((sum, item) => sum + item.item.buy_price * item.quantity, 0);
  }, [cart]);

  const handleCompleteSale = async () => {
    if (!data || cart.length === 0) return;
    
    const customer = data.customers[0]; // Demo customer

    const newInvoiceItems: InvoiceItem[] = cart.map(cartItem => ({
        item_id: cartItem.item.id,
        description: `Sale: ${cartItem.item.title}`,
        qty: cartItem.quantity,
        unit_price: cartItem.item.buy_price,
        total: cartItem.item.buy_price * cartItem.quantity,
    }));
    
    const tax = total * 0.18;
    const totalAmount = total + tax;

    const newInvoice: Invoice = {
      id: `inv-pos-${Date.now()}`,
      customer_id: customer.id,
      related_ref: `sale-pos-${Date.now()}`,
      amount: total,
      tax,
      discount: 0,
      total_amount: totalAmount,
      payment_method: 'Cash',
      paid: true,
      paid_at: new Date().toISOString(),
      items: newInvoiceItems,
      created_at: new Date().toISOString(),
    };
    
    const updatedItems = JSON.parse(JSON.stringify(data.items));
    cart.forEach(cartItem => {
        const itemIndex = updatedItems.findIndex((i: Item) => i.id === cartItem.item.id);
        if (itemIndex > -1) {
            updatedItems[itemIndex].qty -= cartItem.quantity;
        }
    });

    const updatedData: AppData = {
        ...data,
        invoices: [...data.invoices, newInvoice],
        items: updatedItems,
    };

    await updateData(updatedData);
    alert('Sale Completed!');
    setCart([]);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Point of Sale (POS)" size="lg">
      <div className="space-y-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-stone-700">Search Product (SKU or Name)</label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="mt-1 block w-full p-2 border border-stone-300 rounded-md"
          />
          {searchResults.length > 0 && (
            <ul className="border border-stone-300 rounded-md mt-1 max-h-40 overflow-y-auto">
              {searchResults.map(item => (
                <li key={item.id} onClick={() => addToPosCart(item)} className="p-2 hover:bg-stone-100 cursor-pointer">
                  {item.title} ({item.sku}) - ₹{item.buy_price}
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="max-h-60 overflow-y-auto border-t border-b py-2">
            {cart.length === 0 ? <p className="text-stone-500 text-center py-4">Cart is empty</p> :
            <ul className="divide-y divide-stone-200">
                {cart.map(item => (
                    <li key={item.id} className="py-2 flex justify-between items-center">
                        <div>
                            <p className="font-semibold">{item.item.title}</p>
                            <p className="text-sm text-stone-600">Qty: {item.quantity} x ₹{item.item.buy_price}</p>
                        </div>
                        <p className="font-bold">₹{item.item.buy_price * item.quantity}</p>
                    </li>
                ))}
            </ul>
            }
        </div>

        {cart.length > 0 && (
            <div className="text-right">
                <p className="text-xl font-bold">Total: ₹{total.toLocaleString('en-IN')}</p>
            </div>
        )}

        <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button onClick={handleCompleteSale} disabled={cart.length === 0}>Complete Sale</Button>
        </div>
      </div>
    </Modal>
  );
};
