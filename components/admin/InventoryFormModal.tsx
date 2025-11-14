import React, { useState, useEffect } from 'react';
import { Item } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface InventoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Item) => void;
  itemToEdit?: Item | null;
}

const emptyItem: Omit<Item, 'id'> = {
  sku: '',
  title: '',
  category: '',
  sizes: [],
  color: '',
  qty: 0,
  rent_price_per_day: 0,
  buy_price: 0,
  condition: 'Good',
  images: ['https://images.unsplash.com/photo-1555529771-835f59fc5efe?q=80&w=800&auto=format&fit=crop'],
  status: 'available',
  description: '',
};

export const InventoryFormModal: React.FC<InventoryFormModalProps> = ({ isOpen, onClose, onSave, itemToEdit }) => {
  const [item, setItem] = useState<Omit<Item, 'id'> & { id?: string }>(emptyItem);

  useEffect(() => {
    if (itemToEdit) {
      setItem(itemToEdit);
    } else {
      setItem(emptyItem);
    }
  }, [itemToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setItem(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setItem(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
  }

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const sizes = e.target.value.split(',').map(s => s.trim());
      setItem(prev => ({...prev, sizes}));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalItem: Item = {
      ...item,
      id: item.id || `itm-${Date.now()}`,
    };
    onSave(finalItem);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={itemToEdit ? 'Edit Item' : 'Add New Item'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label>Title</label>
                <input name="title" value={item.title} onChange={handleChange} className="w-full p-2 border rounded" required />
            </div>
            <div>
                <label>SKU</label>
                <input name="sku" value={item.sku} onChange={handleChange} className="w-full p-2 border rounded" required />
            </div>
            <div>
                <label>Category</label>
                <input name="category" value={item.category} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
             <div>
                <label>Sizes (comma-separated)</label>
                <input name="sizes" value={item.sizes.join(', ')} onChange={handleSizeChange} className="w-full p-2 border rounded" />
            </div>
             <div>
                <label>Buy Price</label>
                <input name="buy_price" type="number" value={item.buy_price} onChange={handleNumberChange} className="w-full p-2 border rounded" />
            </div>
            <div>
                <label>Rent Price/Day</label>
                <input name="rent_price_per_day" type="number" value={item.rent_price_per_day} onChange={handleNumberChange} className="w-full p-2 border rounded" />
            </div>
            <div>
                <label>Quantity</label>
                <input name="qty" type="number" value={item.qty} onChange={handleNumberChange} className="w-full p-2 border rounded" />
            </div>
             <div>
                <label>Condition</label>
                <select name="condition" value={item.condition} onChange={handleChange} className="w-full p-2 border rounded">
                    <option>New</option>
                    <option>Excellent</option>
                    <option>Good</option>
                    <option>Fair</option>
                </select>
            </div>
        </div>
        <div>
            <label>Description</label>
            <textarea name="description" value={item.description} onChange={handleChange} className="w-full p-2 border rounded"></textarea>
        </div>
        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit">Save Item</Button>
        </div>
      </form>
    </Modal>
  );
};