import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { useAppData } from '../../hooks/useAppData';

export const HomePage: React.FC = () => {
  const { openCustomOrderModal } = useAppData();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[70vh] bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1543357485-d567df02c5ee?q=80&w=1600&auto=format&fit=crop')" }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white p-4">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4" style={{textShadow: '2px 2px 8px rgba(0,0,0,0.6)'}}>Goofty Fashions — Dhanbad</h1>
          <p className="text-lg md:text-xl max-w-2xl mb-8" style={{textShadow: '1px 1px 4px rgba(0,0,0,0.5)'}}>Your destination for exquisite rentals and bespoke ethnic wear. Experience tradition with a modern touch.</p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/shop">
              <Button size="lg">Buy/Rent Collection</Button>
            </Link>
            <Button size="lg" variant="secondary" onClick={openCustomOrderModal}>Request a Custom Order</Button>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">Our Collection</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group relative overflow-hidden rounded-xl shadow-lg">
            <img src="https://images.unsplash.com/photo-1594399039349-647617d3d258?q=80&w=600&auto=format&fit=crop" alt="Lehengas" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
              <h3 className="text-white text-3xl font-bold">Lehengas</h3>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-xl shadow-lg">
            <img src="https://images.unsplash.com/photo-1617922001434-c7a42140b389?q=80&w=600&auto=format&fit=crop" alt="Kurtis" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
              <h3 className="text-white text-3xl font-bold">Kurtis</h3>
            </div>
          </div>
           <div className="group relative overflow-hidden rounded-xl shadow-lg">
            <img src="https://images.unsplash.com/photo-1519340241574-2cec6a3d10a3?q=80&w=600&auto=format&fit=crop" alt="Dance Dresses" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
              <h3 className="text-white text-3xl font-bold">Dance Dresses</h3>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};