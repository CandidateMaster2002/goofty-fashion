import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { useAppData } from '../../hooks/useAppData';

export const HomePage: React.FC = () => {
  const { openCustomOrderModal } = useAppData();

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      comment: "The lehenga I rented for my sister's wedding was absolutely stunning! Perfect fit and excellent quality.",
      rating: 5
    },
    {
      id: 2,
      name: "Anjali Singh",
      comment: "Custom ordered my wedding dress and it exceeded all expectations. The craftsmanship is exceptional!",
      rating: 5
    },
    {
      id: 3,
      name: "Rohit Kumar",
      comment: "Great collection of dance costumes for our college fest. Affordable and stylish options.",
      rating: 4
    }
  ];

  // Features data
  const features = [
    {
      icon: "🎯",
      title: "Perfect Fit Guarantee",
      description: "Free alterations for all rentals and custom orders"
    },
    {
      icon: "🚚",
      title: "Free Delivery",
      description: "Free pickup and delivery within Dhanbad"
    },
    {
      icon: "⭐",
      title: "Premium Quality",
      description: "Authentic fabrics and traditional craftsmanship"
    },
    {
      icon: "💫",
      title: "Trending Designs",
      description: "Latest fashion trends with traditional elegance"
    }
  ];

  // Stats data
  const stats = [
    { number: "500+", label: "Happy Customers" },
    { number: "1000+", label: "Outfits Delivered" },
    { number: "50+", label: "Designer Collections" },
    { number: "4.9", label: "Customer Rating" }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"}>
        ★
      </span>
    ));
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px]">
        <img
          src="https://plus.unsplash.com/premium_photo-1682097935697-2ed1efce421a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Boutique display - Goofty Fashions"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/20"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white p-6">
          <div className="max-w-4xl">
            <div className="inline-block bg-gradient-to-r from-rose-400 to-orange-300 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-lg">
              🎉 Dhanbad's Premier Fashion Destination
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-rose-100 to-orange-100 bg-clip-text text-transparent">
                Goofty Fashions
              </span>
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mb-8 leading-relaxed font-light">
              Where tradition meets contemporary elegance. Discover exquisite ethnic wear rentals and bespoke creations tailored just for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/shop" className="group">
                <Button size="lg" className="bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-700 hover:to-orange-600 transform hover:scale-105 transition-all duration-300 shadow-xl">
                  <span className="flex items-center gap-2">
                    Explore Collection
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="secondary" 
                onClick={openCustomOrderModal}
                className="border-2 border-white hover:bg-white hover:text-black transition-all duration-300 backdrop-blur-sm"
              >
                Request Custom Order
              </Button>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="animate-bounce">
            <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-br from-rose-50 to-orange-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose Goofty Fashions?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We bring you the perfect blend of traditional craftsmanship and modern fashion trends
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group text-center p-6 rounded-2xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50 border border-gray-100">
                <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 bg-gradient-to-b from-white to-rose-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Featured Collections
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our carefully curated collections for every occasion
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                image: "https://images.unsplash.com/photo-1746372283841-dbb3838f9935?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                title: "Bridal Lehengas",
                description: "Stunning bridal collection for your special day",
                items: "50+ Designs"
              },
              {
                image: "https://images.unsplash.com/photo-1741847639057-b51a25d42892?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                title: "Designer Kurtis",
                description: "Elegant kurtis for everyday wear and special occasions",
                items: "100+ Styles"
              },
              {
                image: "https://images.unsplash.com/photo-1706943262259-ffe65cb2bf70?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                title: "Dance Costumes",
                description: "Vibrant costumes for performances and cultural events",
                items: "30+ Sets"
              }
            ].map((category, index) => (
              <div key={index} className="group relative overflow-hidden rounded-3xl shadow-xl h-80 md:h-96 cursor-pointer">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                  <h3 className="text-white text-2xl font-bold mb-2 transform group-hover:translate-y-0 translate-y-2 transition-transform duration-300">
                    {category.title}
                  </h3>
                  <p className="text-gray-200 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                    {category.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-rose-300 font-semibold">{category.items}</span>
                    <Link 
                      to="/shop" 
                      className="text-white bg-rose-600 hover:bg-rose-700 px-4 py-2 rounded-full text-sm font-medium transform group-hover:scale-105 transition-all duration-300"
                    >
                      Explore
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* View All CTA */}
          <div className="text-center mt-12">
            <Link to="/shop">
              <Button size="lg" className="bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-700 hover:to-orange-600 transform hover:scale-105 transition-all duration-300 shadow-lg">
                View Complete Collection
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join hundreds of satisfied customers who found their perfect outfit with us
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-gradient-to-br from-rose-50 to-orange-50 p-8 rounded-3xl shadow-lg border border-gray-100">
                <div className="flex mb-4">
                  {renderStars(testimonial.rating)}
                </div>
                <p className="text-gray-700 text-lg mb-6 italic">"{testimonial.comment}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-rose-400 to-orange-300 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">Happy Customer</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-rose-600 to-orange-500">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Find Your Perfect Outfit?
          </h2>
          <p className="text-xl text-rose-100 mb-8 max-w-2xl mx-auto">
            Whether you're renting for an event or ordering a custom creation, we're here to make you look fabulous.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop">
              <Button size="lg" className="bg-white text-rose-600 hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-xl">
                Browse Collection
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="secondary" 
              onClick={openCustomOrderModal}
              className="border-2 border-white text-white hover:bg-white hover:text-rose-600 transition-all duration-300"
            >
              Get Custom Quote
            </Button>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Visit Our Store in Dhanbad</h2>
              <p className="text-gray-300 text-lg mb-6">
                Experience the magic of Goofty Fashions in person. Our expert stylists will help you find the perfect outfit for any occasion.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="text-2xl mr-4">📍</span>
                  <div>
                    <h4 className="font-semibold">Address</h4>
                    <p className="text-gray-300">123 Fashion Street, Main Road<br />Dhanbad, Jharkhand - 826001</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl mr-4">⏰</span>
                  <div>
                    <h4 className="font-semibold">Store Hours</h4>
                    <p className="text-gray-300">Monday - Sunday: 10:00 AM - 9:00 PM</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl mr-4">📞</span>
                  <div>
                    <h4 className="font-semibold">Contact</h4>
                    <p className="text-gray-300">+91 98765 43210<br />hello@gooftyfashions.com</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-2xl p-8">
              <div className="aspect-video bg-gradient-to-br from-rose-400 to-orange-300 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <span className="text-6xl mb-4">🏪</span>
                  <p className="text-white font-semibold">Store Map Coming Soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};