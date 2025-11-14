
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

export const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[60vh] bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1588117269521-b38435b13e9a?q=80&w=1600&auto=format&fit=crop')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white p-4">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">Goofty Fashions — Dhanbad</h1>
          <p className="text-lg md:text-xl max-w-2xl mb-8 drop-shadow-md">Your destination for exquisite rentals and bespoke ethnic wear. Experience tradition with a modern touch.</p>
          <div className="flex space-x-4">
            <Link to="/shop">
              <Button size="lg">Browse Rentals</Button>
            </Link>
            <Link to="/shop">
              <Button size="lg" variant="secondary">Request Custom Order</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">Our Collection</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group relative overflow-hidden rounded-lg">
            <img src="https://images.unsplash.com/photo-1594399039349-647617d3d258?q=80&w=600&auto=format&fit=crop" alt="Lehengas" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"/>
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end p-6">
              <h3 className="text-white text-2xl font-semibold">Lehengas</h3>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-lg">
            <img src="https://images.unsplash.com/photo-1617922001434-c7a42140b389?q=80&w=600&auto=format&fit=crop" alt="Kurtis" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"/>
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end p-6">
              <h3 className="text-white text-2xl font-semibold">Kurtis</h3>
            </div>
          </div>
           <div className="group relative overflow-hidden rounded-lg">
            <img src="https://images.unsplash.com/photo-1519340241574-2cec6a3d10a3?q=80&w=600&auto=format&fit=crop" alt="Dance Dresses" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"/>
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end p-6">
              <h3 className="text-white text-2xl font-semibold">Dance Dresses</h3>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};