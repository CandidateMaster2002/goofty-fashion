import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../../hooks/useAppData';
import { Button } from '../../components/ui/Button';
import { Trash2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Invoice, Rental, RentalStatus, InvoiceItem } from '../../types';

export const CheckoutPage: React.FC = () => {
  const { cart, removeFromCart, updateCartItemQuantity, clearCart, data, updateData } = useAppData();
  const navigate = useNavigate();

  const calculateRentalDays = (startDate?: string, endDate?: string): number => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const cartSummary = React.useMemo(() => {
    const subtotal = cart.reduce((total, cartItem) => {
      if (cartItem.type === 'buy') {
        return total + cartItem.item.buy_price * cartItem.quantity;
      }
      // It's a rental
      const days = calculateRentalDays(cartItem.startDate, cartItem.endDate);
      return total + cartItem.item.rent_price_per_day * days * cartItem.quantity;
    }, 0);
    
    const tax = subtotal * 0.18; // 18% tax
    const total = subtotal + tax;

    return { subtotal, tax, total };
  }, [cart]);

  const handlePlaceOrder = async () => {
    if (!data) return;

    // For demo, we'll use the first customer
    const customer = data.customers[0];
    if (!customer) {
        alert("No customer found to place order.");
        return;
    }

    const newRentals: Rental[] = [];
    const newInvoiceItems: InvoiceItem[] = [];
    const updatedItems = JSON.parse(JSON.stringify(data.items)); // Deep copy

    cart.forEach(cartItem => {
        if (cartItem.type === 'rent') {
            const rentalDays = calculateRentalDays(cartItem.startDate, cartItem.endDate);
            const rentalTotal = cartItem.item.rent_price_per_day * rentalDays * cartItem.quantity;
            
            const newRental: Rental = {
                id: `rent-${Date.now()}-${Math.random().toString(16).slice(2)}`,
                customer_id: customer.id,
                items: [{
                    item_id: cartItem.item.id,
                    qty: cartItem.quantity,
                    price_per_day: cartItem.item.rent_price_per_day
                }],
                start_date: new Date(cartItem.startDate!).toISOString(),
                end_date: new Date(cartItem.endDate!).toISOString(),
                deposit_amount: cartItem.item.buy_price * 0.25, // 25% deposit
                total_amount: rentalTotal,
                status: RentalStatus.Reserved,
            };
            newRentals.push(newRental);
            newInvoiceItems.push({
                item_id: cartItem.item.id,
                description: `Rental: ${cartItem.item.title} (${rentalDays} days)`,
                qty: cartItem.quantity,
                unit_price: rentalTotal / cartItem.quantity,
                total: rentalTotal,
            });
        } else { // type === 'buy'
            const itemIndex = updatedItems.findIndex((i: { id: string; }) => i.id === cartItem.item.id);
            if (itemIndex > -1) {
                updatedItems[itemIndex].qty -= cartItem.quantity;
            }
            newInvoiceItems.push({
                item_id: cartItem.item.id,
                description: `Purchase: ${cartItem.item.title}`,
                qty: cartItem.quantity,
                unit_price: cartItem.item.buy_price,
                total: cartItem.item.buy_price * cartItem.quantity,
            });
        }
    });

    const newInvoice: Invoice = {
        id: `inv-${Date.now()}`,
        customer_id: customer.id,
        related_ref: newRentals.length > 0 ? newRentals[0].id : `sale-${Date.now()}`,
        amount: cartSummary.subtotal,
        tax: cartSummary.tax,
        discount: 0,
        total_amount: cartSummary.total,
        payment_method: 'Card', // Simulated
        paid: true, // Simulated
        paid_at: new Date().toISOString(),
        items: newInvoiceItems,
        created_at: new Date().toISOString(),
    };
    
    const updatedData = {
        ...data,
        rentals: [...data.rentals, ...newRentals],
        invoices: [...data.invoices, newInvoice],
        items: updatedItems,
    };
    
    await updateData(updatedData);
    
    alert('Order placed successfully!');
    clearCart();
    navigate('/');
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <Button onClick={() => navigate('/shop')}>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <ul className="divide-y divide-stone-200">
              {cart.map(cartItem => {
                const rentalDays = calculateRentalDays(cartItem.startDate, cartItem.endDate);
                const itemPrice = cartItem.type === 'buy' 
                    ? cartItem.item.buy_price
                    : cartItem.item.rent_price_per_day * rentalDays;

                return (
                  <li key={cartItem.id} className="flex py-6">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-stone-200">
                      <img src={cartItem.item.images[0]} alt={cartItem.item.title} className="h-full w-full object-cover object-center" />
                    </div>
                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-stone-900">
                          <h3>{cartItem.item.title}</h3>
                          <p className="ml-4">₹{(itemPrice * cartItem.quantity).toLocaleString('en-IN')}</p>
                        </div>
                        <p className="mt-1 text-sm text-stone-500 capitalize">{cartItem.type}</p>
                        {cartItem.type === 'rent' && (
                          <p className="mt-1 text-sm text-stone-500">
                            {cartItem.startDate} to {cartItem.endDate} ({rentalDays} days)
                          </p>
                        )}
                      </div>
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <div className="flex items-center">
                          <label htmlFor={`quantity-${cartItem.id}`} className="mr-2">Qty:</label>
                          <input
                            id={`quantity-${cartItem.id}`}
                            type="number"
                            min="1"
                            value={cartItem.quantity}
                            onChange={(e) => updateCartItemQuantity(cartItem.id, parseInt(e.target.value))}
                            className="w-16 rounded border border-stone-300 py-1 text-center"
                          />
                        </div>
                        <div className="flex">
                          <button
                            type="button"
                            onClick={() => removeFromCart(cartItem.id)}
                            className="font-medium text-red-600 hover:text-red-500"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{cartSummary.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes (18%)</span>
                <span>₹{cartSummary.tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                <span>Total</span>
                <span>₹{cartSummary.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
            <div className="mt-6">
              {/* In a real app, a customer info form would go here */}
              <p className="text-sm text-stone-500 mb-4">
                  Order will be placed for demo customer: <strong>{data?.customers[0]?.name}</strong>
              </p>
              <Button size="lg" className="w-full" onClick={handlePlaceOrder}>
                Place Order (Simulated)
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
