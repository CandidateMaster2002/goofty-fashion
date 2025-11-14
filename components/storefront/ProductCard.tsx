import React from 'react';
import { Link } from 'react-router-dom';
import { Item } from '../../types';

interface ProductCardProps {
  item: Item;
}

export const ProductCard: React.FC<ProductCardProps> = ({ item }) => {
  return (
    <Link to={`/product/${item.id}`} className="group">
      <div className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden transition-all duration-300 hover:shadow-lg">
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
          <img
            src={item.images[0]}
            alt={item.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            style={{height: '300px'}}
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-stone-800 truncate">{item.title}</h3>
          <p className="text-sm text-stone-500">{item.category}</p>
          <div className="flex justify-between items-center mt-3">
            <p className="text-base font-bold text-teal-700">₹{item.buy_price.toLocaleString('en-IN')}</p>
            <p className="text-sm text-stone-600">Rent from ₹{item.rent_price_per_day}/day</p>
          </div>
        </div>
      </div>
    </Link>
  );
};
