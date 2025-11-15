import React from 'react';
import { Link } from 'react-router-dom';
import { Item } from '../../types';

interface ProductCardProps {
  item: Item;
}

export const ProductCard: React.FC<ProductCardProps> = ({ item }) => {
  return (
    <Link to={`/product/${item.id}`} className="group block">
      <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
        <div className="overflow-hidden">
          <img
            src={item.images[0]}
            alt={item.title}
            className="w-full h-72 object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-slate-800 truncate">{item.title}</h3>
          <p className="text-sm text-slate-500">{item.category}</p>
          <div className="flex justify-between items-center mt-3">
            <p className="text-lg font-bold text-primary-600">₹{item.buy_price.toLocaleString('en-IN')}</p>
            <p className="text-sm text-slate-600">Rent from ₹{item.rent_price_per_day}/day</p>
          </div>
        </div>
      </div>
    </Link>
  );
};