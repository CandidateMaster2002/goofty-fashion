import React, { useState, useRef } from 'react';
import { useAppData } from '../../hooks/useAppData';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Plus, Upload, Download, Edit, Trash2 } from 'lucide-react';
import { Item } from '../../types';
import { InventoryFormModal } from '../../components/admin/InventoryFormModal';
import { generateCSV, downloadCSV, parseCSV } from '../../utils/csv';

export const InventoryPage: React.FC = () => {
  const { data, updateData } = useAppData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<Item | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenModal = (item?: Item) => {
    setItemToEdit(item || null);
    setIsModalOpen(true);
  };

  const handleSaveItem = async (item: Item) => {
    if (!data) return;
    const existingIndex = data.items.findIndex(i => i.id === item.id);
    let newItems: Item[];

    if (existingIndex > -1) {
      newItems = [...data.items];
      newItems[existingIndex] = item;
    } else {
      newItems = [...data.items, item];
    }
    
    await updateData({ ...data, items: newItems });
    setIsModalOpen(false);
  };
  
  const handleExport = () => {
      if (!data?.items) return;
      const columns: (keyof Item)[] = ['id', 'sku', 'title', 'category', 'sizes', 'color', 'qty', 'rent_price_per_day', 'buy_price', 'condition', 'description'];
      const csvString = generateCSV(data.items, columns);
      downloadCSV(csvString, 'inventory.csv');
  }
  
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file || !data) return;
      
      const reader = new FileReader();
      reader.onload = async (e) => {
          const text = e.target?.result as string;
          const parsedItems = parseCSV(text) as unknown as Item[];
          // A real app would have validation here
          const newItems = [...data.items];
          parsedItems.forEach(newItem => {
              const index = newItems.findIndex(i => i.id === newItem.id);
              if (index > -1) {
                  newItems[index] = {...newItems[index], ...newItem};
              } else {
                  newItems.push(newItem);
              }
          });
          await updateData({...data, items: newItems});
          alert(`${parsedItems.length} items imported/updated successfully!`);
      };
      reader.readAsText(file);
  }

  // FIX: Create a handler to trigger the file input click.
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <div className="flex space-x-2">
            <Button onClick={handleExport} variant="secondary">
                <Download size={16} className="mr-2"/> Export CSV
            </Button>
            {/* FIX: Replaced Button with `as="label"` with a standard Button and a hidden file input. */}
            <Button onClick={handleImportClick} variant="secondary">
                <Upload size={16} className="mr-2"/> Import CSV
            </Button>
            <input 
              type="file" 
              ref={fileInputRef} 
              accept=".csv" 
              className="hidden" 
              onChange={handleImport} 
            />
            <Button onClick={() => handleOpenModal()}>
                <Plus size={16} className="mr-2"/> Add New Item
            </Button>
        </div>
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="p-3">SKU</th>
                <th className="p-3">Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Qty</th>
                <th className="p-3">Buy Price</th>
                <th className="p-3">Rent/Day</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.items.map(item => (
                <tr key={item.id} className="border-b hover:bg-stone-50">
                  <td className="p-3">{item.sku}</td>
                  <td className="p-3 font-medium">{item.title}</td>
                  <td className="p-3">{item.category}</td>
                  <td className="p-3">{item.qty}</td>
                  <td className="p-3">₹{item.buy_price}</td>
                  <td className="p-3">₹{item.rent_price_per_day}</td>
                  <td className="p-3">
                      <button onClick={() => handleOpenModal(item)} className="text-teal-600 hover:text-teal-800 p-1">
                          <Edit size={18}/>
                      </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <InventoryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveItem}
        itemToEdit={itemToEdit}
      />
    </div>
  );
};