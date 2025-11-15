import React, { useState } from 'react';
import { useAppData } from '../../hooks/useAppData';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { CustomOrder, CustomOrderStatus, MeasurementProfile } from '../../types';
import { CheckCircle } from 'lucide-react';

interface CustomOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomOrderModal: React.FC<CustomOrderModalProps> = ({ isOpen, onClose }) => {
  const { data, updateData } = useAppData();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [bust, setBust] = useState('');
  const [waist, setWaist] = useState('');
  const [length, setLength] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data || !title || !description) {
      alert('Please fill in all required fields.');
      return;
    }

    const customer = data.customers[0]; // For demo, assign to first customer
    if (!customer) {
        alert("No customer found to place order for.");
        return;
    }
    
    const measurement_snapshot: MeasurementProfile = {
        bust: bust ? parseFloat(bust) : undefined,
        waist: waist ? parseFloat(waist) : undefined,
        length: length ? parseFloat(length) : undefined,
        units: 'in',
    };

    const newOrder: CustomOrder = {
      id: `co-${Date.now()}`,
      customer_id: customer.id,
      title,
      description,
      material_provided: false,
      measurement_snapshot,
      price_estimate: 15000, // Starting price
      status: CustomOrderStatus.Received,
      due_date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(), // ~25 days from now
      created_at: new Date().toISOString(),
    };

    const updatedData = {
        ...data,
        customOrders: [...data.customOrders, newOrder]
    };

    await updateData(updatedData);

    alert('Custom order request submitted successfully!');
    setTitle('');
    setDescription('');
    setBust('');
    setWaist('');
    setLength('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Request a Custom Order" size="lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-stone-700">Order Title *</label>
            <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Red Wedding Lehenga" required className="mt-1 block w-full p-2 border border-stone-300 rounded-md"/>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-stone-700">Description *</label>
            <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={4} placeholder="Describe your custom outfit in detail..." required className="mt-1 block w-full p-2 border border-stone-300 rounded-md"></textarea>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor="bust" className="block text-sm font-medium text-stone-700">Bust (inches)</label>
              <input type="number" id="bust" value={bust} onChange={e => setBust(e.target.value)} placeholder="e.g., 36" className="mt-1 block w-full p-2 border border-stone-300 rounded-md"/>
            </div>
            <div>
              <label htmlFor="waist" className="block text-sm font-medium text-stone-700">Waist (inches)</label>
              <input type="number" id="waist" value={waist} onChange={e => setWaist(e.target.value)} placeholder="e.g., 28" className="mt-1 block w-full p-2 border border-stone-300 rounded-md"/>
            </div>
             <div>
              <label htmlFor="length" className="block text-sm font-medium text-stone-700">Length (inches)</label>
              <input type="number" id="length" value={length} onChange={e => setLength(e.target.value)} placeholder="e.g., 42" className="mt-1 block w-full p-2 border border-stone-300 rounded-md"/>
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit">Submit Custom Order</Button>
          </div>
        </form>
        <div className="bg-stone-50 p-4 rounded-lg border border-stone-200 text-sm">
            <div className="mb-4">
                <h4 className="font-semibold text-stone-800 flex items-center mb-2"><CheckCircle size={16} className="text-teal-600 mr-2" /> Estimated Timeline:</h4>
                <ul className="list-disc list-inside text-stone-600 space-y-1 pl-2">
                    <li>Design approval: 2-3 days</li>
                    <li>Cutting & stitching: 7-10 days</li>
                    <li>Finishing & embroidery: 5-7 days</li>
                    <li>Final fitting: 2-3 days</li>
                </ul>
            </div>
             <div>
                <h4 className="font-semibold text-stone-800 flex items-center mb-2"><CheckCircle size={16} className="text-teal-600 mr-2" /> Pricing:</h4>
                 <p className="text-stone-600 pl-2">Custom orders start at ₹15,000 and vary based on design complexity.</p>
            </div>
        </div>
      </div>
    </Modal>
  );
};